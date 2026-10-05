import { describe, expect, it } from "vitest";
import { AdministradorMemoria } from "../../src/Memoria/AdministradorMemoria";
import { Proceso } from "../../src/Procesos/Proceso";
import { EstadoProceso } from "../../src/Procesos/EstadoProceso";

describe("AdministradorMemoria", () => {
    it("Se puede crear un bloque que ocupe toda la memoria", () => {
        const administrador = new AdministradorMemoria(1024);
        const bloqueInicial = administrador.bloques.at(0);

        expect(administrador.capacidadTotal).toBe(1024);
        expect(administrador.bloques).toHaveLength(1);
        expect(bloqueInicial?.inicio).toBe(0);
        expect(bloqueInicial?.capacidad).toBe(1024);
        expect(bloqueInicial?.procesoOcupante).toBeUndefined();
        expect(bloqueInicial?.estaLibre()).toBe(true);
    });

    it("Asigna con First Fit y parte el bloque disponible", () => {
        const administrador = new AdministradorMemoria(500);
        const proceso = new Proceso("P1", 300, 3);

        expect(administrador.asignarProceso(proceso)).toBe(true);
        expect(proceso.estado).toBe(EstadoProceso.listo);
        expect(administrador.bloques).toHaveLength(2);
        expect(administrador.bloques.at(0)?.procesoOcupante).toBe("P1");
        expect(administrador.bloques.at(1)?.capacidad).toBe(200);
    });

    it("Deja esperando cuando no hay memoria y coalesce al liberar", () => {
        const administrador = new AdministradorMemoria(500);
        const procesoUno = new Proceso("P1", 300, 3);
        const procesoDos = new Proceso("P2", 200, 2);
        const procesoTres = new Proceso("P3", 100, 4);
        administrador.asignarProceso(procesoUno);
        administrador.asignarProceso(procesoDos);

        expect(administrador.asignarProceso(procesoTres)).toBe(false);
        expect(procesoTres.estado).toBe(EstadoProceso.esperando);

        expect(administrador.liberarProceso("P1")).toBe(true);
        expect(administrador.liberarProceso("P2")).toBe(true);
        expect(administrador.bloques).toHaveLength(1);
        expect(administrador.bloques.at(0)?.capacidad).toBe(500);
        expect(administrador.bloques.at(0)?.estaLibre()).toBe(true);
    });
});
