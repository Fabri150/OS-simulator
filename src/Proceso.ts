import { EstadoProceso } from "./EstadoProceso";

export class Proceso {
    private _pid: string;
    private _memoriaRequerida: number;
    private _cpuTotal: number;
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
}