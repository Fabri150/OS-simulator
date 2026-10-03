import { BloqueMemoria } from "../Memoria/BloqueMemoria";

export class FirstFit {
    elegirBloque(
        bloques: readonly BloqueMemoria[],
        capacidadRequerida: number
    ): BloqueMemoria | undefined {
        return bloques.find(
            bloque => bloque.puedeAcomodar(capacidadRequerida)
        );
    }
}