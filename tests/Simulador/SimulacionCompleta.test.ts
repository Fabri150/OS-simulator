import { describe, expect, it } from "vitest";
import { EstadoProceso } from "../../src/Procesos/EstadoProceso";
import { SimuladorSO } from "../../src/Simulador/SimuladorSO";

describe("Simulación completa", () => {
    it("Integra espera, fragmentación, rotación Round Robin, E/S y coalescencia", () => {
        const simulador = new SimuladorSO(800, 2);
        const procesoUno = simulador.registrarProceso("P1", 200, 2);
        const procesoDos = simulador.registrarProceso("P2", 300, 1);
        const procesoTres = simulador.registrarProceso("P3", 400, 2);
        const procesoCuatro = simulador.registrarProceso("P4", 200, 3);
        simulador.programarES("P1", 1, 2);
        simulador.programarES("P3", 1, 1);

        // Tick 1: P3 no entra; P1 se bloquea y conserva su bloque de memoria.
        simulador.tick();
        expect(procesoTres.estado).toBe(EstadoProceso.esperando);
        expect(procesoUno.estado).toBe(EstadoProceso.bloqueado);
        expect(simulador.obtenerSnapshot().cambiosDeContexto).toBe(1);
        expect(simulador.obtenerSnapshot().memoriaLibreTotal).toBe(100);
        expect(simulador.obtenerSnapshot().porcentajeOcupacionMemoria).toBe(87.5);

        // Tick 2: P2 termina; quedan huecos de 300 y 100 KB.
        simulador.tick();
        expect(procesoDos.estado).toBe(EstadoProceso.terminado);
        expect(simulador.obtenerSnapshot().memoriaLibreTotal).toBe(400);
        expect(simulador.obtenerSnapshot().mayorHuecoLibre).toBe(300);
        expect(simulador.obtenerSnapshot().fragmentacionExterna).toBe(25);

        // Tick 3: P1 vuelve a listos; P3 sigue esperando un hueco contiguo de 400 KB.
        simulador.tick();
        expect(procesoUno.estado).toBe(EstadoProceso.listo);
        expect(procesoTres.estado).toBe(EstadoProceso.esperando);

        // Tick 4: P4 agota quantum, vuelve al final de la cola y cuenta una rotación.
        simulador.tick();
        expect(procesoCuatro.estado).toBe(EstadoProceso.listo);
        expect(simulador.obtenerSnapshot().colaListos).toEqual(["P1", "P4"]);
        expect(simulador.obtenerSnapshot().cambiosDeContexto).toBe(2);

        // Tick 5: P1 termina; la coalescencia deja un hueco de 500 KB.
        simulador.tick();
        expect(procesoUno.estado).toBe(EstadoProceso.terminado);
        expect(simulador.obtenerSnapshot().mayorHuecoLibre).toBe(500);

        // Tick 6: P3 entra por First Fit y P4 termina; queda un hueco libre de 400 KB.
        simulador.tick();
        expect(procesoTres.estado).toBe(EstadoProceso.listo);
        expect(procesoCuatro.estado).toBe(EstadoProceso.terminado);
        expect(simulador.obtenerSnapshot().bloques).toEqual([
            { inicio: 0, capacidad: 400, procesoOcupante: "P3" },
            { inicio: 400, capacidad: 400, procesoOcupante: undefined }
        ]);

        // Tick 7: P3 se bloquea por E/S. Tick 8: retorna, ejecuta y termina.
        simulador.tick();
        expect(procesoTres.estado).toBe(EstadoProceso.bloqueado);
        expect(simulador.obtenerSnapshot().cambiosDeContexto).toBe(3);
        simulador.tick();

        const snapshot = simulador.obtenerSnapshot();
        expect(procesoUno.estado).toBe(EstadoProceso.terminado);
        expect(procesoDos.estado).toBe(EstadoProceso.terminado);
        expect(procesoTres.estado).toBe(EstadoProceso.terminado);
        expect(procesoCuatro.estado).toBe(EstadoProceso.terminado);
        expect(snapshot.ticksEjecutados).toBe(8);
        expect(snapshot.memoriaLibreTotal).toBe(800);
        expect(snapshot.mayorHuecoLibre).toBe(800);
        expect(snapshot.fragmentacionExterna).toBe(0);
        expect(snapshot.bloques).toHaveLength(1);
        expect(snapshot.cambiosDeContexto).toBe(3);
        expect(snapshot.porcentajeOcupacionMemoria).toBe(0);
        expect(snapshot.porcentajeUtilizacionCpu).toBe(100);
    });
});
