import { describe, expect, it } from "vitest";
import { Proceso } from "../../src/Procesos/Proceso";
import { RoundRobin } from "../../src/Planificador/RoundRobin";

describe("RoundRobin", () => {
    it("Rota al proceso cuando agota su quantum y hay otros listos", () => {
        const roundRobin = new RoundRobin(2);
        const proceso = new Proceso("P1", 100, 3);
        proceso.ejecutarTick();
        proceso.ejecutarTick();

        expect(roundRobin.debeRotar(proceso, true)).toBe(true);
    });

    it("No rota al proceso cuando está solo", () => {
        const roundRobin = new RoundRobin(2);
        const proceso = new Proceso("P1", 100, 3);
        proceso.ejecutarTick();
        proceso.ejecutarTick();

        expect(roundRobin.debeRotar(proceso, false)).toBe(false);
    });
});
