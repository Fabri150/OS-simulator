export class BloqueMemoria {
    private readonly _inicio: number;
    private _capacidad: number;
    private _procesoOcupante: string | undefined;

    constructor(inicio: number, capacidad: number) {
        this._inicio = inicio;
        this._capacidad = capacidad;
    }

    get inicio(): number {
        return this._inicio;
    }

    get capacidad(): number {
        return this._capacidad;
    }

    protected setCapacidad(nuevoValor: number): void {
        this._capacidad = nuevoValor;
    }

    get procesoOcupante(): string | undefined {
        return this._procesoOcupante;
    }

    protected setProcesoOcupante(nuevoProceso: string | undefined): void {
        this._procesoOcupante = nuevoProceso;
    }

    estaLibre(): boolean {
        return this._procesoOcupante === undefined;
    }

    puedeAcomodar(capacidadRequerida: number): boolean {
        return this.estaLibre() && this._capacidad >= capacidadRequerida;
    }

    ocupar(pid: string): void {
        this.setProcesoOcupante(pid);
    }

    liberar(): void {
        this.setProcesoOcupante(undefined);
    }
    
/**
 * Reserva una parte del bloque para un proceso.
 * Debe invocarse solo si el bloque está libre y tiene capacidad suficiente.
 * Devuelve un bloque libre sobrante cuando queda memoria disponible.
 */
partirYAsignar(
    pid: string,
    capacidadRequerida: number
): BloqueMemoria[] {
    // Calcula la memoria libre que queda después de la asignación.
    const capacidadSobrante = this.capacidad - capacidadRequerida;

    // El bloque sobrante comienza inmediatamente después de la parte asignada.
    const inicioSobrante = this.inicio + capacidadRequerida;

    // El bloque actual pasa a representar sólo la memoria asignada al proceso.
    this.setCapacidad(capacidadRequerida);
    this.ocupar(pid);

    // Si sobra memoria, crea el nuevo bloque libre; si el ajuste es exacto,
    // devuelve un arreglo vacío y no crea bloques de capacidad cero.
    return [capacidadSobrante]
        .filter(capacidad => capacidad > 0)
        .map(capacidad =>
            new BloqueMemoria(inicioSobrante, capacidad)
        );
}
}