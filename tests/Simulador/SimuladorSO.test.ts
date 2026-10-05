import { describe, expect, it } from "vitest";
import { EstadoProceso } from "../../src/Procesos/EstadoProceso";
import { SimuladorSO } from "../../src/Simulador/SimuladorSO";

describe("SimuladorSO", () => {
    it("Registra un proceso nuevo con sus datos iniciales", () => {
        const simulador = new SimuladorSO(500, 2);

        const proceso = simulador.registrarProceso("P1", 300, 3);

        expect(proceso.pid).toBe("P1");
        expect(proceso.estado).toBe(EstadoProceso.nuevo);
        expect(proceso.cpuRestante).toBe(3);
    });

    it("Rechaza PID repetido y procesos mayores a la memoria total", () => {
        const simulador = new SimuladorSO(500, 2);
        simulador.registrarProceso("P1", 300, 3);

        expect(() => simulador.registrarProceso("P1", 100, 2)).toThrow();
        expect(() => simulador.registrarProceso("P2", 600, 2)).toThrow();
    });

    it("Programa una única E/S válida para un proceso registrado", () => {
        const simulador = new SimuladorSO(500, 2);
        simulador.registrarProceso("P1", 300, 3);

        expect(() => simulador.programarES("P1", 2, 1)).not.toThrow();
        expect(() => simulador.programarES("P1", 2, 1)).toThrow();
        expect(() => simulador.programarES("P2", 1, 1)).toThrow();
        expect(() => simulador.programarES("P1", 4, 1)).toThrow();
    });

    it("Ejecuta Round Robin y libera memoria al terminar", () => {
        const simulador = new SimuladorSO(500, 2);
        const procesoUno = simulador.registrarProceso("P1", 300, 3);
        const procesoDos = simulador.registrarProceso("P2", 200, 2);

        simulador.tick();
        simulador.tick();

        expect(procesoUno.estado).toBe(EstadoProceso.listo);
        expect(procesoUno.cpuRestante).toBe(1);

        simulador.tick();
        simulador.tick();

        expect(procesoDos.estado).toBe(EstadoProceso.terminado);

        simulador.tick();

        expect(procesoUno.estado).toBe(EstadoProceso.terminado);
    });

    it("Bloquea por E/S y devuelve el proceso a listos", () => {
        const simulador = new SimuladorSO(500, 2);
        const procesoUno = simulador.registrarProceso("P1", 200, 3);
        const procesoDos = simulador.registrarProceso("P2", 200, 2);
        simulador.programarES("P1", 1, 1);

        simulador.tick();

        expect(procesoUno.estado).toBe(EstadoProceso.bloqueado);

        simulador.tick();

        expect(procesoUno.estado).toBe(EstadoProceso.listo);
        expect(procesoDos.estado).toBe(EstadoProceso.ejecutando);
    });

    it("Expone un snapshot seguro con métricas actuales", () => {
        const simulador = new SimuladorSO(500, 2);
        simulador.registrarProceso("P1", 300, 3);

        simulador.tick();

        const snapshot = simulador.obtenerSnapshot();

        expect(snapshot.ticksEjecutados).toBe(1);
        expect(snapshot.procesoEjecutando).toBe("P1");
        expect(snapshot.memoriaLibreTotal).toBe(200);
        expect(snapshot.mayorHuecoLibre).toBe(200);
        expect(snapshot.fragmentacionExterna).toBe(0);
    });
});
