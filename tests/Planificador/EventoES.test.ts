import { describe, expect, it } from "vitest";
import { EventoES } from "../../src/Planificador/EventoES";
import { Proceso } from "../../src/Procesos/Proceso";

describe("EventoES", () => {
    it("Se activa al alcanzar el tick de CPU configurado una sola vez", () => {
        const proceso = new Proceso("P1", 100, 4);
        const evento = new EventoES("P1", 2, 3);
        proceso.ejecutarTick();
        proceso.ejecutarTick();

        expect(evento.debeActivarse(proceso)).toBe(true);

        evento.marcarComoOcurrido();

        expect(evento.yaOcurrio).toBe(true);
        expect(evento.debeActivarse(proceso)).toBe(false);
    });
});
