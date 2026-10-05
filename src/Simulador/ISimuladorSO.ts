import { Proceso } from "../Procesos/Proceso";

export interface ISimuladorSO {
    registrarProceso(pid: string, memoriaRequerida: number, cpuTotal: number): Proceso;
    programarES(pid: string, tickActivador: number, duracion: number): void;
}
