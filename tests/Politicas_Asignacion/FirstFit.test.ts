import { describe, expect, it } from "vitest";
import { BloqueMemoria } from "../../src/Memoria/BloqueMemoria";
import { FirstFit } from "../../src/Politicas_Asignacion/FirstFit";

describe("FirstFit", () => {
    it("Elige el primer bloque libre con capacidad suficiente", () => {
        const bloqueChico = new BloqueMemoria(0, 100);
        const bloqueSuficiente = new BloqueMemoria(100, 300);
        const otroBloqueSuficiente = new BloqueMemoria(400, 500);
        const firstFit = new FirstFit();

        const elegido = firstFit.elegirBloque(
            [bloqueChico, bloqueSuficiente, otroBloqueSuficiente],
            200
        );

        expect(elegido).toBe(bloqueSuficiente);
    });

    it("Ignora bloques ocupados aunque tengan capacidad suficiente", () => {
        const bloqueOcupado = new BloqueMemoria(0, 500);
        const bloqueLibre = new BloqueMemoria(500, 300);
        const firstFit = new FirstFit();

        bloqueOcupado.ocupar("P1");

        const elegido = firstFit.elegirBloque(
            [bloqueOcupado, bloqueLibre],
            200
        );

        expect(elegido).toBe(bloqueLibre);
    });

    it("Devuelve undefined cuando no existe un bloque suficiente", () => {
        const firstFit = new FirstFit();

        const elegido = firstFit.elegirBloque(
            [new BloqueMemoria(0, 100), new BloqueMemoria(100, 200)],
            300
        );

        expect(elegido).toBeUndefined();
    });
});