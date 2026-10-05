import { describe, expect, it } from "vitest";
import { ColaProcesos } from "../../src/Planificador/ColaProcesos";
import { Proceso } from "../../src/Procesos/Proceso";

describe("ColaProcesos", () => {
    it("La cola respeta el orden FIFO", () => {
        const cola = new ColaProcesos();
        const p1 = new Proceso("P1", 100, 2);
        const p2 = new Proceso("P2", 100, 2);

        cola.encolar(p1);
        cola.encolar(p2);

        expect(cola.obtenerCantidad()).toBe(2);
        expect(cola.desencolar()?.pid).toBe("P1");
        expect(cola.desencolar()?.pid).toBe("P2");
        expect(cola.estaVacia()).toBe(true);
    });
});
