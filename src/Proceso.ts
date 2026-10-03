export class Proceso {
    private _pid: string;
    private memoriaRequerida: number;
    private cpuTotal: number;
    private cpuRestante: number;
    private quantumTotal = 0;
    private quantumConsumido = 0;
    private bloqueoRestante = 0;
    private estado: string = "Nuevo";

    constructor(PID: string, memoriaRequerida: number, cpuTotal: number) {
        this._pid = PID;
        this.memoriaRequerida = memoriaRequerida;
        this.cpuTotal = cpuTotal;
        this.cpuRestante = cpuTotal;
    }
}