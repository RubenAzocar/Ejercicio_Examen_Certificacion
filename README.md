# Simulador de Certificación Full Stack JavaScript Junior

> **Sitio estático** — No requiere servidor, base de datos ni proceso de instalación. Funciona directamente en el navegador abriendo el archivo `simulador_certificacion_fullstack_2026.html`.

---

## Descripción

Simulador interactivo de preparación para la certificación Full Stack JavaScript Junior. Cubre los 7 módulos del programa oficial con un total de 119 minutos de evaluación. Cada módulo se trabaja de forma independiente, con su propio banco de preguntas, temporizador y retroalimentación pedagógica.

Está diseñado para que el estudiante no solo prepare respuestas correctas, sino que **interiorice por qué cada solución es válida**, desarrollando criterio técnico genuino.

---

## Módulos disponibles

| # | Módulo | Tipo | Preguntas | Tiempo |
| --- | --- | --- | --- | --- |
| 1 | Fundamentos Desarrollo Web | Código | 8 | 19 min |
| 2 | Programación con JavaScript | Selección Múltiple | 2 | 15 min |
| 3 | Programación Avanzada JavaScript | Mixto | 15 | 20 min |
| 4 | Fundamentos Bases de Datos Relacionales | Mixto (SQL) | 14+ | 24 min |
| 5 | Desarrollo de Apps Web Node Express | Selección Múltiple | 10 | 13 min |
| 6 | Acceso a Datos en Apps Node | Selección Múltiple | 12 | 15 min |
| 7 | API Backend Node Express | Selección Múltiple | 10 | 13 min |

---

## Funcionalidades

### Examen por módulo

- Selección individual de módulo desde tabla descriptiva o menú desplegable.
- Banco de preguntas con aleatorización en cada sesión: el orden de preguntas y opciones cambia en cada inicio.
- Para los módulos con ejercicios de código, se generan adicionalmente retos aleatorios de HTML/CSS en cada recarga.
- Navegación libre entre preguntas con botones Anterior / Siguiente o atajos de teclado.

### Temporizador independiente

- Cada módulo corre su propio cronómetro regresivo.
- El tiempo se recalcula por marca temporal real, evitando desvíos por pestañas inactivas.
- Indicador visual en rojo al quedar 60 segundos o menos.
- Control de pausa y reanudación sin pérdida de tiempo.
- Envío automático al agotarse el tiempo.

### Tipos de pregunta

**Selección múltiple:**

- Opciones presentadas con orden mezclado en cada intento.
- Retroalimentación inmediata en la barra lateral al seleccionar.
- La pista o explicación abierta no se cierra al cambiar la selección.

**Código libre:**

- Campo de texto editable para escribir la solución completa.
- Evaluación automática por palabras clave esperadas según enunciado.
- La respuesta se guarda automáticamente al navegar entre preguntas.
- En SQL: ejercicios prácticos de SELECT, INSERT, UPDATE, DELETE con validación de Keywords.
- En HTML/CSS: retos aleatorios de componentes responsive.

### Guía pedagógica (barra lateral)

- **Paso a paso sugerido**: secuencia contextual para abordar la pregunta actual.
- **Concepto clave**: síntesis conceptual del módulo en uso.
- **Retroalimentación ad hoc**: mensaje dinámico que cambia según la respuesta seleccionada, indicando si es correcta e incorporando la explicación técnica.
- **Guía línea a línea**: en preguntas de código, despliega una plantilla de estructura detallada que avanza progresivamente a medida que el usuario escribe. Cada línea incluye descripción de qué hace (`Qué`) y por qué es necesaria (`Por qué`).
- **Métricas de aprendizaje**: contador de preguntas respondidas y aciertos obtenidos en el primer intento.

### Niveles de ayuda configurables

Disponibles en la barra lateral, cambian el nivel de detalle de la guía en tiempo real:

- **Básico**: dos pasos de orientación, con menor cantidad de líneas en la guía de código.
- **Intermedio** *(por defecto)*: cuatro pasos balanceados con guía de código moderada.
- **Guiado**: pasos completos más indicaciones adicionales de validación, con guía de código extendida.

### Coach de código en tiempo real

En preguntas de código, mientras el usuario escribe aparece un panel que indica:

- Porcentaje de cobertura estimada de la solución.
- Elementos ya detectados en el código escrito.
- Elementos aún pendientes de incluir.

### Sistema de pista y explicación

- **Mostrar pista** (`H`): despliega la pista de la pregunta, u orientación general si no tiene pista específica.
- **Explicar pregunta** (`E`): reemplaza el contenido de la pista con una explicación completa adaptada al nivel de ayuda activo. En preguntas de código incluye la secuencia recomendada de resolución en 5 pasos.

### Resultados y retroalimentación

Al finalizar un módulo (manual o por tiempo):

- Puntaje obtenido sobre el total con porcentaje.
- Tiempo utilizado versus tiempo disponible.
- Retroalimentación pregunta a pregunta: indicación de correcto/incorrecto con la explicación conceptual de cada ítem.

### Atajos de teclado

| Tecla | Acción |
| --- | --- |
| `←` | Pregunta anterior |
| `→` | Pregunta siguiente |
| `H` | Mostrar / ocultar pista |
| `E` | Explicar pregunta |

> Los atajos están desactivados cuando el foco está en el área de texto o en un campo de entrada, para no interferir con la escritura.

---

## Cómo usar

1. Abre el archivo `simulador_certificacion_fullstack_2026.html` directamente en un navegador moderno.
2. Revisa la tabla de módulos para elegir por cuál comenzar.
3. Selecciona el módulo en el menú desplegable y presiona **Iniciar módulo**.
4. Responde cada pregunta navegando con los botones o con las teclas de flecha.
5. Usa la barra lateral derecha como guía de estudio activa durante el examen.
6. Al terminar, presiona **Finalizar módulo** para ver el resultado y la retroalimentación completa.
7. Puedes repetir cualquier módulo cuantas veces quieras; el banco de preguntas se reorganiza en cada intento.

---

## Estructura de archivos

```plaintext
Ejercicio_Examen_Certificacion/
├── simulador_certificacion_fullstack_2026.html   ← Punto de entrada
├── models/
│   └── examModel.js        ← Datos de módulos, banco de preguntas y estado
├── views/
│   ├── styles.css          ← Estilos globales y diseño responsive
│   └── examView.js         ← Referencias al DOM
└── controllers/
    └── examController.js   ← Lógica de examen, guía pedagógica y eventos
```

---

## Tipo de aplicación

**Sitio estático**. No requiere conexión a internet, servidor, ni proceso de instalación. Solo es necesario abrir el archivo HTML en cualquier navegador moderno actualizado. Todo el procesamiento ocurre en el lado del cliente.
