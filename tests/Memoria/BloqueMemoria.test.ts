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

    it("Puede acomodar la capacidad de un proceso si esta libre y tiene espacio suficiente", () => {
        const bloque = new BloqueMemoria(0, 1024);

        expect(bloque.puedeAcomodar(200)).toBe(true);
        expect(bloque.puedeAcomodar(1024)).toBe(true);
        expect(bloque.puedeAcomodar(1025)).toBe(false);
    });

    it("Se ocupa con un proceso y vuelve a estar libre cuando este se libere", () => {
        const bloque = new BloqueMemoria(0, 1024);

        bloque.ocupar("P1");

        expect(bloque.procesoOcupante).toBe("P1");
        expect(bloque.estaLibre()).toBe(false);
        expect(bloque.puedeAcomodar(200)).toBe(false);

        bloque.liberar();

        expect(bloque.procesoOcupante).toBeUndefined();
        expect(bloque.estaLibre()).toBe(true);
    });
});