import { Proceso } from "../Procesos/Proceso";

export class EventoES {
    private readonly _pid: string;
    private readonly _tickActivador: number;
    private readonly _duracion: number;
    private _yaOcurrio = false;

    constructor(pid: string, tickActivador: number, duracion: number) {
        this.validarEvento(pid, tickActivador, duracion);
        this._pid = pid;
        this._tickActivador = tickActivador;
        this._duracion = duracion;
    }

    get pid(): string {
        return this._pid;
    }

    get tickActivador(): number {
        return this._tickActivador;
    }

    get duracion(): number {
        return this._duracion;
    }

    get yaOcurrio(): boolean {
        return this._yaOcurrio;
    }

    debeActivarse(proceso: Proceso): boolean {
        const cpuConsumida = proceso.cpuTotal - proceso.cpuRestante;

        return !this.yaOcurrio
            && proceso.pid === this._pid
            && cpuConsumida === this._tickActivador;
    }

    marcarComoOcurrido(): void {
        this._yaOcurrio = true;
    }

    private validarEvento(pid: string, tickActivador: number, duracion: number): void {
        const esValido = pid.trim().length > 0
            && Number.isInteger(tickActivador) && tickActivador > 0
            && Number.isInteger(duracion) && duracion > 0;

        esValido || (() => {
            throw new Error("Los datos del evento de E/S deben ser válidos");
        })();
    }
}
