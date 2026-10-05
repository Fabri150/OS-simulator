import { EstadoProceso } from "../Procesos/EstadoProceso";

/** Copia segura del estado actual del simulador para tests e informe. */
export type SnapshotSimulador = {
    readonly ticksEjecutados: number;
    readonly cambiosDeContexto: number;
    readonly procesoEjecutando: string | undefined;
    readonly procesos: ReadonlyArray<{
        readonly pid: string;
        readonly estado: EstadoProceso;
        readonly cpuRestante: number;
        readonly quantumConsumido: number;
        readonly bloqueoRestante: number;
    }>;
    readonly colaListos: readonly string[];
    readonly bloques: ReadonlyArray<{
        readonly inicio: number;
        readonly capacidad: number;
        readonly procesoOcupante: string | undefined;
    }>;
    readonly memoriaLibreTotal: number;
    readonly mayorHuecoLibre: number;
    readonly fragmentacionExterna: number;
};
