export class BloqueMemoria {
    private readonly _inicio: number;
    private _capacidad: number;
    private _procesoOcupante: string | undefined;

    constructor(inicio: number, capacidad: number) {
        this._inicio = inicio;
        this._capacidad = capacidad;
    }
}