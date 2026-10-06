# Simulador de procesos y memoria

Proyecto académico en TypeScript que simula, de forma discreta y por ticks, la interacción entre procesos, memoria principal y una CPU.

## Funcionalidades implementadas

- Registro de procesos con PID, memoria requerida y tiempo total de CPU.
- Estados de proceso: `nuevo`, `esperando`, `listo`, `ejecutando`, `bloqueado` y `terminado`.
- Asignación de memoria contigua con política **First Fit**.
- Partición de bloques al asignar un proceso y coalescencia de bloques libres contiguos al liberar memoria.
- Planificación de CPU **Round Robin** con quantum configurable y cola FIFO de listos.
- Evento de entrada/salida programable por proceso, con duración en ticks.
- Métricas de memoria: memoria libre total, mayor hueco libre y fragmentación externa.
- Snapshot de consulta para observar procesos, CPU, cola de listos, bloques y métricas sin exponer las colecciones internas.

## Estructura

```text
src/
├── Procesos/               # Proceso, estados e interfaz
├── Memoria/                # Bloques, administrador e interfaces
├── Planificador/           # Cola FIFO, Round Robin y eventos de E/S
├── Politicas_Asignacion/   # Política First Fit
└── Simulador/              # Coordinación de ticks y snapshot

tests/                      # Pruebas con Vitest
demostracion.ts             # Escenario de demostración por consola
```

## Requisitos

- Node.js.
- Dependencias del proyecto instaladas con `npm install`.

## Comandos

```bash
npm test
```

Ejecuta la suite de pruebas automatizadas con Vitest.

```bash
npm run test:coverage
```

Genera la cobertura de las pruebas cuando el entorno de Vitest se encuentre disponible.

## Flujo de un tick

Cada llamada a `simulador.tick()` ejecuta estas fases, en este orden:

1. Intenta admitir procesos nuevos o en espera, asignándoles memoria.
2. Actualiza los procesos bloqueados por E/S y devuelve a listos los que terminaron su bloqueo.
3. Despacha un proceso de la cola de listos si la CPU está libre.
4. Ejecuta un tick de CPU y resuelve, por prioridad, finalización, bloqueo por E/S, rotación de Round Robin o renovación del quantum.

## Ejemplo mínimo de uso

```ts
import { SimuladorSO } from "./src/Simulador/SimuladorSO";

const simulador = new SimuladorSO(800, 2);
simulador.registrarProceso("P1", 200, 3);
simulador.registrarProceso("P2", 300, 2);
simulador.programarES("P1", 1, 2);

simulador.tick();
const estado = simulador.obtenerSnapshot();
```

El archivo `demostracion.ts` contiene un escenario más amplio, con cuatro procesos, espera de memoria, E/S, liberación y coalescencia.

## Alcance

El proyecto modela mecanismos de un sistema operativo; no crea hilos reales, no realiza llamadas al sistema ni administra memoria física del equipo. La simulación es determinista y se ejecuta en un único hilo de JavaScript.
