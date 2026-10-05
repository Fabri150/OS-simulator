import { AdministradorMemoria } from "../Memoria/AdministradorMemoria";
import { ColaProcesos } from "../Planificador/ColaProcesos";
import { EventoES } from "../Planificador/EventoES";
import { RoundRobin } from "../Planificador/RoundRobin";
import { Proceso } from "../Procesos/Proceso";
import { ISimuladorSO } from "./ISimuladorSO";

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

    /** Programa una única E/S para un proceso registrado. */
    programarES(pid: string, tickActivador: number, duracion: number): void {
        this.validarProgramacionES(pid, tickActivador);
        this._eventosES.push(new EventoES(pid, tickActivador, duracion));
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
}
