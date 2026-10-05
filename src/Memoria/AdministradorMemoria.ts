import { BloqueMemoria } from "./BloqueMemoria";
import { IAdministradorMemoria } from "./IAdministradorMemoria";
import { Proceso } from "../Procesos/Proceso";
import { EstadoProceso } from "../Procesos/EstadoProceso";
import { FirstFit } from "../Politicas_Asignacion/FirstFit";

export class AdministradorMemoria implements IAdministradorMemoria {
    private readonly _capacidadTotal: number;
    private _bloques: BloqueMemoria[] = [];

    constructor(capacidadTotal: number) {
        this._capacidadTotal = capacidadTotal;
        this._bloques.push(new BloqueMemoria(0, capacidadTotal));
    }

    get capacidadTotal(): number {
        return this._capacidadTotal;
    }

    get bloques(): readonly BloqueMemoria[] {
        return [...this._bloques];
    }

    obtenerCapacidadTotal(): number {
        return this.capacidadTotal;
    }

    obtenerBloques(): readonly BloqueMemoria[] {
        return this.bloques;
    }

    obtenerMemoriaLibreTotal(): number {
        return this._bloques
            .filter(bloque => bloque.estaLibre())
            .reduce((total, bloque) => total + bloque.capacidad, 0);
    }

    obtenerMayorHuecoLibre(): number {
        return this._bloques
            .filter(bloque => bloque.estaLibre())
            .reduce((mayor, bloque) => Math.max(mayor, bloque.capacidad), 0);
    }

    obtenerFragmentacionExterna(): number {
        const memoriaLibreTotal = this.obtenerMemoriaLibreTotal();
        const mayorHuecoLibre = this.obtenerMayorHuecoLibre();

        return memoriaLibreTotal === 0
            ? 0
            : ((memoriaLibreTotal - mayorHuecoLibre) / memoriaLibreTotal) * 100;
    }

    asignarProceso(proceso: Proceso): boolean {
        const bloque = new FirstFit().elegirBloque(
            this._bloques,
            proceso.memoriaRequerida
        );

        return bloque === undefined
            ? this.dejarEsperando(proceso)
            : this.asignarEnBloque(bloque, proceso);
    }

    liberarProceso(pid: string): boolean {
        const bloquesDelProceso = this._bloques.filter(
            bloque => bloque.procesoOcupante === pid
        );

        bloquesDelProceso.forEach(bloque => bloque.liberar());
        this._bloques = this.unirBloquesLibres(this._bloques);

        return bloquesDelProceso.length > 0;
    }

    private asignarEnBloque(bloque: BloqueMemoria, proceso: Proceso): true {
        const sobrantes = bloque.partirYAsignar(
            proceso.pid,
            proceso.memoriaRequerida
        );
        const posicion = this._bloques.indexOf(bloque);

        this._bloques.splice(posicion + 1, 0, ...sobrantes);
        proceso.cambiarEstado(EstadoProceso.listo);

        return true;
    }

    private dejarEsperando(proceso: Proceso): false {
        proceso.cambiarEstado(EstadoProceso.esperando);

        return false;
    }

    private unirBloquesLibres(bloques: readonly BloqueMemoria[]): BloqueMemoria[] {
        return bloques.reduce<BloqueMemoria[]>((bloquesUnidos, bloque) => {
            const anterior = bloquesUnidos.at(-1);
            const sonLibresYContiguos = anterior !== undefined
                && anterior.estaLibre()
                && bloque.estaLibre()
                && anterior.inicio + anterior.capacidad === bloque.inicio;

            return sonLibresYContiguos
                ? [
                    ...bloquesUnidos.slice(0, -1),
                    new BloqueMemoria(
                        anterior.inicio,
                        anterior.capacidad + bloque.capacidad
                    )
                ]
                : [...bloquesUnidos, bloque];
        }, []);
    }
}
