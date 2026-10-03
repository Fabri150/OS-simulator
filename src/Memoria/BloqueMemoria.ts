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
}