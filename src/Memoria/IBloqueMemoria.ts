export interface IBloqueMemoria {
    estaLibre(): boolean;
    puedeAcomodar(capacidadRequerida: number): boolean;
    ocupar(pid: string): void;
    liberar(): void;
    partirYAsignar(pid: string, capacidadRequerida: number): IBloqueMemoria[];
}
