import { describe, expect, it } from "vitest";
import { EstadoProceso } from "../src/EstadoProceso";
import { Proceso } from "../src/Proceso";

describe("Proceso", () => {
    it("Se puede crear un proceso nuevo con datos iniciales correctos", () => {
        const proceso = new Proceso("P1", 200, 4);

        expect(proceso.pid).toBe("P1");
        expect(proceso.memoriaRequerida).toBe(200);
        expect(proceso.cpuTotal).toBe(4);
        expect(proceso.cpuRestante).toBe(4);
        expect(proceso.quantumConsumido).toBe(0);
        expect(proceso.bloqueoRestante).toBe(0);
        expect(proceso.estado).toBe(EstadoProceso.nuevo);
    });
});