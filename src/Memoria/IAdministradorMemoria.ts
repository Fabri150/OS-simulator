import { IBloqueMemoria } from "./IBloqueMemoria";
import { Proceso } from "../Procesos/Proceso";

export interface IAdministradorMemoria {
    obtenerCapacidadTotal(): number;
    obtenerBloques(): readonly IBloqueMemoria[];
    asignarProceso(proceso: Proceso): boolean;
    liberarProceso(pid: string): boolean;
}
