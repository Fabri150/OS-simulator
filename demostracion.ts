import { EstadoProceso } from "./src/Procesos/EstadoProceso";
import { SimuladorSO } from "./src/Simulador/SimuladorSO";

const simulador = new SimuladorSO(800, 2);

simulador.registrarProceso("P1", 200, 3);
simulador.registrarProceso("P2", 300, 2);
simulador.registrarProceso("P3", 400, 4);
simulador.registrarProceso("P4", 200, 3);
simulador.programarES("P1", 1, 2);
simulador.programarES("P3", 2, 1);

const configuracionProcesos = new Map([
    ["P1", { cpuTotal: 3, tickActivadorES: 1 }],
    ["P2", { cpuTotal: 2, tickActivadorES: undefined }],
    ["P3", { cpuTotal: 4, tickActivadorES: 2 }],
    ["P4", { cpuTotal: 3, tickActivadorES: undefined }]
]);

const mostrarTabla = (encabezados: string[], filas: string[][]): void => {
    const anchos = encabezados.map((encabezado, indice) => Math.max(
        encabezado.length,
        ...filas.map(fila => (fila.at(indice) ?? "").length)
    ));
    const separador = `+-${anchos.map(ancho => "-".repeat(ancho)).join("-+-")}-+`;
    const crearFila = (valores: string[]): string => `| ${valores
        .map((valor, indice) => valor.padEnd(anchos.at(indice) ?? 0))
        .join(" | ")} |`;

    console.log(separador);
    console.log(crearFila(encabezados));
    console.log(separador);
    filas.forEach(fila => console.log(crearFila(fila)));
    console.log(separador);
};

const mostrarEstado = (titulo: string): void => {
    const snapshot = simulador.obtenerSnapshot();
    const cpu = snapshot.procesoEjecutando ?? "CPU libre";
    const cola = snapshot.colaListos.join(" → ") || "vacía";

    console.log(`\n${"=".repeat(65)}`);
    console.log(titulo);
    console.log(`${"=".repeat(65)}`);
    console.log(`CPU: ${cpu}`);
    console.log(`Cola de listos: ${cola}`);
    console.log(`Cambios de contexto: ${snapshot.cambiosDeContexto}`);
    console.log(
        `Memoria libre: ${snapshot.memoriaLibreTotal} KB | `
        + `Mayor hueco: ${snapshot.mayorHuecoLibre} KB | `
        + `Fragmentación: ${snapshot.fragmentacionExterna}%`
    );

    console.log("\nProcesos:");
    mostrarTabla(
        ["PID", "Estado", "CPU restante", "Quantum", "Bloqueo", "Falta para E/S"],
        snapshot.procesos.map(proceso => {
            const configuracion = configuracionProcesos.get(proceso.pid);
            const tickActivadorES = configuracion?.tickActivadorES;
            const cpuConsumida = (configuracion?.cpuTotal ?? 0) - proceso.cpuRestante;
            const ticksFaltantesES = Math.max(0, (tickActivadorES ?? 0) - cpuConsumida);
            const estadoES = tickActivadorES === undefined
                ? "sin E/S"
                : ticksFaltantesES === 0
                    ? "activada"
                    : `${ticksFaltantesES} tick(s)`;

            return [
                proceso.pid,
                EstadoProceso[proceso.estado],
                String(proceso.cpuRestante),
                String(proceso.quantumConsumido),
                String(proceso.bloqueoRestante),
                estadoES
            ];
        })
    );

    console.log("Memoria:");
    mostrarTabla(
        ["Inicio", "Capacidad (KB)", "Ocupante"],
        snapshot.bloques.map(bloque => [
            String(bloque.inicio),
            String(bloque.capacidad),
            bloque.procesoOcupante ?? "libre"
        ])
    );
};

mostrarEstado("Estado inicial");

Array.from({ length: 12 }).forEach((_, indice) => {
    simulador.tick();
    mostrarEstado(`Estado luego del tick ${indice + 1}`);
});
