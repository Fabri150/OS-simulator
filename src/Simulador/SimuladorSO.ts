import { AdministradorMemoria } from "../Memoria/AdministradorMemoria";
import { ColaProcesos } from "../Planificador/ColaProcesos";
import { EventoES } from "../Planificador/EventoES";
import { RoundRobin } from "../Planificador/RoundRobin";
import { EstadoProceso } from "../Procesos/EstadoProceso";
import { Proceso } from "../Procesos/Proceso";
import { ISimuladorSO } from "./ISimuladorSO";
import { SnapshotSimulador } from "./SnapshotSimulador";

export class SimuladorSO implements ISimuladorSO {
    private readonly _administradorMemoria: AdministradorMemoria;
    private readonly _roundRobin: RoundRobin;
    private readonly _colaListos = new ColaProcesos();
    private readonly _procesos: Proceso[] = [];
    private readonly _eventosES: EventoES[] = [];
    private _procesoEjecutando: Proceso | undefined;
    private _ticksEjecutados = 0;
    private _cambiosDeContexto = 0;

    constructor(memoriaTotal: number, quantum: number) {
        this.validarMemoriaTotal(memoriaTotal);
        this._administradorMemoria = new AdministradorMemoria(memoriaTotal);
        this._roundRobin = new RoundRobin(quantum);
    }

    registrarProceso(pid: string, memoriaRequerida: number, cpuTotal: number): Proceso {
        this.validarRegistro(pid, memoriaRequerida, cpuTotal);

        const proceso = new Proceso(pid, memoriaRequerida, cpuTotal);
        this._procesos.push(proceso);

        return proceso;
    }

    programarES(pid: string, tickActivador: number, duracion: number): void {
        this.validarProgramacionES(pid, tickActivador);
        this._eventosES.push(new EventoES(pid, tickActivador, duracion));
    }

    tick(): void {
        this.admitirProcesosEnMemoria();
        this.actualizarBloqueados();
        this.despacharProceso();
        this.ejecutarProceso();
        this._ticksEjecutados++;
    }

    obtenerSnapshot(): SnapshotSimulador {
        return {
            ticksEjecutados: this._ticksEjecutados,
            cambiosDeContexto: this._cambiosDeContexto,
            procesoEjecutando: this._procesoEjecutando?.pid,
            procesos: this._procesos.map(proceso => ({
                pid: proceso.pid,
                estado: proceso.estado,
                cpuRestante: proceso.cpuRestante,
                quantumConsumido: proceso.quantumConsumido,
                bloqueoRestante: proceso.bloqueoRestante
            })),
            colaListos: this._colaListos
                .obtenerProcesos()
                .map(proceso => proceso.pid),
            bloques: this._administradorMemoria
                .obtenerBloques()
                .map(bloque => ({
                    inicio: bloque.inicio,
                    capacidad: bloque.capacidad,
                    procesoOcupante: bloque.procesoOcupante
                })),
            memoriaLibreTotal: this._administradorMemoria.obtenerMemoriaLibreTotal(),
            mayorHuecoLibre: this._administradorMemoria.obtenerMayorHuecoLibre(),
            fragmentacionExterna: this._administradorMemoria.obtenerFragmentacionExterna()
        };
    }

    private validarMemoriaTotal(memoriaTotal: number): void {
        const esValida = Number.isInteger(memoriaTotal) && memoriaTotal > 0;

        esValida || (() => {
            throw new Error("La memoria total debe ser un entero positivo");
        })();
    }

    private validarRegistro(pid: string, memoriaRequerida: number, cpuTotal: number): void {
        const pidDisponible = !this._procesos.some(proceso => proceso.pid === pid);
        const valoresPositivos = pid.trim().length > 0
            && Number.isInteger(memoriaRequerida) && memoriaRequerida > 0
            && Number.isInteger(cpuTotal) && cpuTotal > 0;
        const entraEnMemoriaTotal = memoriaRequerida <= this._administradorMemoria.obtenerCapacidadTotal();
        const esValido = pidDisponible && valoresPositivos && entraEnMemoriaTotal;

        esValido || (() => {
            throw new Error("Los datos del proceso no son válidos para este sistema");
        })();
    }

    private validarProgramacionES(pid: string, tickActivador: number): void {
        const proceso = this._procesos.find(procesoActual => procesoActual.pid === pid);
        const yaTieneEvento = this._eventosES.some(evento => evento.pid === pid);
        const tickValido = tickActivador > 0 && tickActivador <= (proceso?.cpuTotal ?? 0);
        const esValida = proceso !== undefined && !yaTieneEvento && tickValido;

        esValida || (() => {
            throw new Error("La programación de E/S no es válida");
        })();
    }

    private admitirProcesosEnMemoria(): void {
        this._procesos
            .filter(proceso => proceso.estado === EstadoProceso.nuevo
                || proceso.estado === EstadoProceso.esperando)
            .forEach(proceso => {
                const fueAsignado = this._administradorMemoria.asignarProceso(proceso);
                fueAsignado && this._colaListos.encolar(proceso);
            });
    }

    private actualizarBloqueados(): void {
        this._procesos
            .filter(proceso => proceso.estado === EstadoProceso.bloqueado)
            .forEach(proceso => {
                proceso.avanzarBloqueo();

                const terminoBloqueo = proceso.bloqueoRestante === 0;
                terminoBloqueo && proceso.cambiarEstado(EstadoProceso.listo);
                terminoBloqueo && this._colaListos.encolar(proceso);
            });
    }

    private despacharProceso(): void {
        const proceso = this._procesoEjecutando ?? this._colaListos.desencolar();

        this._procesoEjecutando = proceso;
        proceso?.cambiarEstado(EstadoProceso.ejecutando);
    }

    private ejecutarProceso(): void {
        const proceso = this._procesoEjecutando;

        proceso?.ejecutarTick();
        proceso && this.resolverResultadoDeEjecucion(proceso);
    }

    private resolverResultadoDeEjecucion(proceso: Proceso): void {
        const evento = this._eventosES.find(eventoActual => eventoActual.debeActivarse(proceso));
        const termino = proceso.cpuRestante === 0;
        const debeBloquearse = evento !== undefined;
        const debeRotar = this._roundRobin.debeRotar(
            proceso,
            !this._colaListos.estaVacia()
        );
        const debeRenovarQuantum = proceso.quantumConsumido >= this._roundRobin.obtenerQuantum()
            && this._colaListos.estaVacia();

        termino
            ? this.finalizarProceso(proceso)
            : debeBloquearse
                ? this.bloquearProceso(proceso, evento)
                : debeRotar
                    ? this.rotarProceso(proceso)
                    : debeRenovarQuantum
                        ? proceso.reiniciarQuantum()
                        : undefined;
    }

    private finalizarProceso(proceso: Proceso): void {
        proceso.cambiarEstado(EstadoProceso.terminado);
        this._administradorMemoria.liberarProceso(proceso.pid);
        this._procesoEjecutando = undefined;
    }

    private bloquearProceso(proceso: Proceso, evento: EventoES): void {
        proceso.bloquear(evento.duracion);
        evento.marcarComoOcurrido();
        this._procesoEjecutando = undefined;
    }

    private rotarProceso(proceso: Proceso): void {
        proceso.cambiarEstado(EstadoProceso.listo);
        proceso.reiniciarQuantum();
        this._colaListos.encolar(proceso);
        this._procesoEjecutando = undefined;
        this._cambiosDeContexto++;
    }
}
