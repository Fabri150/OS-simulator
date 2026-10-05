import { describe, expect, it } from "vitest";
import { EstadoProceso } from "../../src/Procesos/EstadoProceso";
import { SimuladorSO } from "../../src/Simulador/SimuladorSO";

describe("Simulación completa", () => {
    it("Ejecuta memoria, Round Robin, E/S y finalización", () => {
        const simulador = new SimuladorSO(500, 2);
        const procesoUno = simulador.registrarProceso("P1", 300, 3);
        const procesoDos = simulador.registrarProceso("P2", 200, 2);
        const procesoTres = simulador.registrarProceso("P3", 100, 4);
        simulador.programarES("P1", 1, 2);

        Array.from({ length: 9 }).forEach(() => simulador.tick());

        const snapshot = simulador.obtenerSnapshot();

        expect(procesoUno.estado).toBe(EstadoProceso.terminado);
        expect(procesoDos.estado).toBe(EstadoProceso.terminado);
        expect(procesoTres.estado).toBe(EstadoProceso.terminado);
        expect(snapshot.ticksEjecutados).toBe(9);
        expect(snapshot.memoriaLibreTotal).toBe(500);
        expect(snapshot.mayorHuecoLibre).toBe(500);
        expect(snapshot.fragmentacionExterna).toBe(0);
    });
});
