import { Proceso } from "../Procesos/Proceso";

export interface IColaProcesos {
    encolar(proceso: Proceso): void;
    desencolar(): Proceso | undefined;
    estaVacia(): boolean;
    obtenerCantidad(): number;
    obtenerProcesos(): readonly Proceso[];
}
