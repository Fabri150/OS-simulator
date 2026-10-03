import { EstadoProceso } from "./EstadoProceso";

export class Proceso {
    private readonly _pid: string;
    private readonly _memoriaRequerida: number;
    private readonly _cpuTotal: number;
    private _cpuRestante: number;
    private _quantumConsumido = 0;
    private _bloqueoRestante = 0;
    private _estado: EstadoProceso = EstadoProceso.nuevo;

    constructor(pid: string, memoriaRequerida: number, cpuTotal: number) {
        this._pid = pid;
        this._memoriaRequerida = memoriaRequerida;
        this._cpuTotal = cpuTotal;
        this._cpuRestante = cpuTotal;
    }

    get pid(): string {
        return this._pid;
    }

    get memoriaRequerida(): number {
        return this._memoriaRequerida;
    }

    get cpuTotal(): number {
        return this._cpuTotal;
    }

    get cpuRestante(): number {
        return this._cpuRestante;
    }

    protected setCpuRestante(nuevoValor: number): void {
    this._cpuRestante = nuevoValor;
    }

    get quantumConsumido(): number {
        return this._quantumConsumido;
    }

    protected setQuantumConsumido(nuevoValor: number): void {
        this._quantumConsumido = nuevoValor;
    }

    get bloqueoRestante(): number {
        return this._bloqueoRestante;
    }

    protected setBloqueoRestante(nuevoValor: number): void {
        this._bloqueoRestante = nuevoValor;
    }

    get estado(): EstadoProceso {
        return this._estado;
    }

    protected setEstado(nuevoValor: EstadoProceso): void {
        this._estado = nuevoValor;
    }
}