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

    it("Divide un bloque y asigna la capacidad solicitada", () => {
        const bloque = new BloqueMemoria(0, 1024);

        const bloquesSobrantes = bloque.partirYAsignar("P1", 200);
        const sobrante = bloquesSobrantes.at(0);

        expect(bloque.inicio).toBe(0);
        expect(bloque.capacidad).toBe(200);
        expect(bloque.procesoOcupante).toBe("P1");
        expect(bloque.estaLibre()).toBe(false);
        expect(bloquesSobrantes).toHaveLength(1);
        expect(sobrante?.inicio).toBe(200);
        expect(sobrante?.capacidad).toBe(824);
        expect(sobrante?.procesoOcupante).toBeUndefined();
        expect(sobrante?.estaLibre()).toBe(true);
    });

    it("No crea un bloque sobrante cuando el ajuste es exacto", () => {
        const bloque = new BloqueMemoria(0, 200);

        const bloquesSobrantes = bloque.partirYAsignar("P1", 200);

        expect(bloque.capacidad).toBe(200);
        expect(bloque.procesoOcupante).toBe("P1");
        expect(bloquesSobrantes).toHaveLength(0);
    });
});