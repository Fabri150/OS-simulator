import { Proceso } from "../Procesos/Proceso";
import { SnapshotSimulador } from "./SnapshotSimulador";

export interface ISimuladorSO {
    registrarProceso(pid: string, memoriaRequerida: number, cpuTotal: number): Proceso;
    programarES(pid: string, tickActivador: number, duracion: number): void;
    tick(): void;
    obtenerSnapshot(): SnapshotSimulador;
}
