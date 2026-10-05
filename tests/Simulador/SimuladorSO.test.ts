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
});
