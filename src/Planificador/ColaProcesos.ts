import { IColaProcesos } from "./IColaProcesos";
import { Proceso } from "../Procesos/Proceso";

export class ColaProcesos implements IColaProcesos {
    private _procesos: Proceso[] = [];

    get cantidad(): number {
        return this._procesos.length;
    }

    encolar(proceso: Proceso): void {
        this._procesos.push(proceso);
    }

    desencolar(): Proceso | undefined {
        return this._procesos.shift();
    }

    estaVacia(): boolean {
        return this._procesos.length === 0;
    }

    obtenerCantidad(): number {
        return this.cantidad;
    }

    obtenerProcesos(): readonly Proceso[] {
        return [...this._procesos];
    }
}
