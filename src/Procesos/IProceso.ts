import { EstadoProceso } from "./EstadoProceso";

export interface IProceso {
    ejecutarTick(): void;
    cambiarEstado(nuevoEstado: EstadoProceso): void;
    reiniciarQuantum(): void;
    bloquear(duracion: number): void;
    avanzarBloqueo(): void;
}
