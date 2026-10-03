import { describe, expect, it } from "vitest";
import { BloqueMemoria } from "../../src/Memoria/BloqueMemoria";

describe("BloqueMemoria", () => {
    it("Se puede crear un bloque de memoria nuevo con datos iniciales correctos", () => {
        const bloque = new BloqueMemoria(0, 1024);

        expect(bloque.inicio).toBe(0);
        expect(bloque.capacidad).toBe(1024);
        expect(bloque.procesoOcupante).toBeUndefined();
        expect(bloque.estaLibre()).toBe(true);
    });
});