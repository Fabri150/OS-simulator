import { Proceso } from "../Procesos/Proceso";
import { IRoundRobin } from "./IRoundRobin";

export class RoundRobin implements IRoundRobin {
    private readonly _quantum: number;

    constructor(quantum: number) {
        this.validarQuantum(quantum);
        this._quantum = quantum;
    }

    obtenerQuantum(): number {
        return this._quantum;
    }

    debeRotar(proceso: Proceso, hayOtrosListos: boolean): boolean {
        return proceso.quantumConsumido >= this._quantum && hayOtrosListos;
    }

    private validarQuantum(quantum: number): void {
        const esValido = Number.isInteger(quantum) && quantum > 0;

        esValido || (() => {
            throw new Error("El quantum debe ser un entero positivo");
        })();
    }
}
