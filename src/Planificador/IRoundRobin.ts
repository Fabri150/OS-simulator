import { Proceso } from "../Procesos/Proceso";

export interface IRoundRobin {
    obtenerQuantum(): number;
    debeRotar(proceso: Proceso, hayOtrosListos: boolean): boolean;
}
