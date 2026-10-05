import { IBloqueMemoria } from "./IBloqueMemoria";

export interface IAdministradorMemoria {
    obtenerCapacidadTotal(): number;
    obtenerBloques(): readonly IBloqueMemoria[];
}
