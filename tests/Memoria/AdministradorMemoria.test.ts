import { describe, expect, it } from "vitest";
import { AdministradorMemoria } from "../../src/Memoria/AdministradorMemoria";

describe("AdministradorMemoria", () => {
    it("Se puede crear un bloque que ocupe toda la memoria", () => {
        const administrador = new AdministradorMemoria(1024);
        const bloqueInicial = administrador.bloques.at(0);

        expect(administrador.capacidadTotal).toBe(1024);
        expect(administrador.bloques).toHaveLength(1);
        expect(bloqueInicial?.inicio).toBe(0);
        expect(bloqueInicial?.capacidad).toBe(1024);
        expect(bloqueInicial?.procesoOcupante).toBeUndefined();
        expect(bloqueInicial?.estaLibre()).toBe(true);
    });
});