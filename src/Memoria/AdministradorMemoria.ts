import { BloqueMemoria } from "./BloqueMemoria";
import { IAdministradorMemoria } from "./IAdministradorMemoria";

export class AdministradorMemoria implements IAdministradorMemoria {
    private readonly _capacidadTotal: number;
    private _bloques: BloqueMemoria[] = [];

    constructor(capacidadTotal: number) {
        this._capacidadTotal = capacidadTotal;
        this._bloques.push(new BloqueMemoria(0, capacidadTotal));
    }

    get capacidadTotal(): number {
        return this._capacidadTotal;
    }

    get bloques(): readonly BloqueMemoria[] {
        return [...this._bloques];
    }

    obtenerCapacidadTotal(): number {
        return this.capacidadTotal;
    }

    obtenerBloques(): readonly BloqueMemoria[] {
        return this.bloques;
    }
}
