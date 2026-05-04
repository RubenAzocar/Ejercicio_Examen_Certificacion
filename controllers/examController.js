(function () {
    const { MODULES, BASE_QUESTION_BANK, state } = globalThis.AppModel;
    const {
        modulesTableBody,
        moduleSelect,
        startBtn,
        examSection,
        resultSection,
        moduleBadge,
        progressBadge,
        timerLabel,
        questionType,
        questionTitle,
        questionBody,
        prevBtn,
        nextBtn,
        pauseBtn,
        resumeBtn,
        finishBtn,
        runBtn,
        runResultBox,
        hintBtn,
        explainBtn,
        hintText,
        checklistBox,
        codeCoachBox,
        lineByLineBox,
        scoreLine,
        timeLine,
        feedbackList,
        sideModule,
        sideQuestionType,
        sideSteps,
        sideConcept,
        sideAdhoc,
        sideLineByLine,
        helpLevelSelect,
        sideMetrics,
        solutionBtn,
        solutionBox
    } = globalThis.AppView;

    let codeEditor = null;

    function destroyEditor() {
        if (codeEditor) {
            codeEditor.toTextArea();
            codeEditor = null;
        }
    }

    const MODULE_CONCEPTS = {
        1: "Domina estructura semantica HTML, estilos CSS base y logica JavaScript simple para construir interfaces limpias.",
        2: "Enfocate en sintaxis, tipos de variables y metodos de arrays como map/filter/reduce.",
        3: "Prioriza asincronia, funciones de orden superior y patrones comunes como debounce y manejo de errores.",
        4: "Relaciona SELECT, WHERE, JOIN, GROUP BY y restricciones para modelar datos consistentes.",
        5: "Comprende flujo request/response en Express, middlewares y codigos HTTP mas usados.",
        6: "Practica acceso seguro a datos: consultas parametrizadas, capas de servicio y reutilizacion de conexiones.",
        7: "Consolida criterios REST: verbos HTTP, codigos de estado, validaciones y contrato de endpoints."
    };

    function setSidebarSteps(items) {
        sideSteps.innerHTML = "";
        items.forEach((step) => {
            const li = document.createElement("li");
            li.textContent = step;
            sideSteps.appendChild(li);
        });
    }

    function getHelpLevel() {
        return helpLevelSelect.value || "intermedio";
    }

    function getGuideLineLimit(level, zone) {
        if (zone === "sidebar") {
            if (level === "basico") return 6;
            if (level === "intermedio") return 10;
            return 20;
        }

        if (level === "basico") return 8;
        if (level === "intermedio") return 12;
        return 20;
    }

    function adaptStepsByHelpLevel(steps) {
        const level = getHelpLevel();
        if (level === "basico") return steps.slice(0, 2);
        if (level === "guiado") {
            return steps.concat([
                "Haz una mini validacion final antes de avanzar.",
                "Si dudas, justifica tu respuesta en voz alta en una frase."
            ]);
        }
        return steps;
    }

    function updateLearningMetrics() {
        const answeredCount = Object.keys(state.answers).filter((k) => state.answers[k] !== undefined && state.answers[k] !== "").length;
        const initialHits = Object.values(state.firstAttemptResult).filter(Boolean).length;
        sideMetrics.textContent = "Respondidas: " + answeredCount + " | Aciertos iniciales: " + initialHits;
    }

    function escapeHtml(text) {
        return String(text)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll("\"", "&quot;")
            .replaceAll("'", "&#039;");
    }

    function buildCodeLineGuide(q) {
        const prompt = (q.prompt || "").toLowerCase();

        if (prompt.includes("select") || prompt.includes("insert") || prompt.includes("update") || prompt.includes("delete")) {
            return {
                title: "Plantilla guiada: Consulta SQL paso a paso",
                lines: [
                    { code: "SELECT", what: "Que: especificas columnas a recuperar o * para todas.", why: "Por que: defines exactamente que datos necesitas de la consulta." },
                    { code: "FROM tabla_nombre", what: "Que: indicas tabla principal de origen.", why: "Por que: SQL necesita saber de donde extraer los datos." },
                    { code: "WHERE condicion", what: "Que: aplicas filtro con condicion booleana.", why: "Por que: reduce resultados solo a filas relevantes, mejora performance." },
                    { code: "JOIN tabla2 ON tabla1.id = tabla2.id", what: "Que: relacionas dos tablas por clave.", why: "Por que: combina datos de multiples tablas de forma eficiente." },
                    { code: "GROUP BY columna", what: "Que: agrupas filas que comparten valor.", why: "Por que: preparas datos para agregaciones como COUNT, SUM, AVG." },
                    { code: "HAVING count(*) > 1", what: "Que: filtras grupos desde la agregacion.", why: "Por que: WHERE no puede filtrar resultados agregados; HAVING si." },
                    { code: "ORDER BY columna ASC|DESC", what: "Que: ordenas resultado ascendente o descendente.", why: "Por que: organiza datos de forma legible para el usuario." },
                    { code: "LIMIT 10 OFFSET 0", what: "Que: limitas filas devueltas y saltas iniciales.", why: "Por que: implementa paginacion sin enviar millones de registros." }
                ]
            };
        }

        if (prompt.includes("html + css")) {
            return {
                title: "Plantilla guiada: HTML + CSS + JS integrado",
                lines: [
                    { code: "<!doctype html>", what: "Que: declaras el tipo de documento HTML5.", why: "Por que: asegura que el navegador interprete el layout en modo estandar." },
                    { code: "<html lang=\"es\">", what: "Que: abres el nodo raiz e indicas idioma.", why: "Por que: mejora accesibilidad, lectores de pantalla y SEO." },
                    { code: "<head>", what: "Que: inicias cabecera de configuracion.", why: "Por que: aqui va metadata, titulo y estilos globales." },
                    { code: "  <meta charset=\"UTF-8\">", what: "Que: defines codificacion de caracteres.", why: "Por que: evita errores con tildes, eñes y simbolos." },
                    { code: "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">", what: "Que: configuras viewport responsive.", why: "Por que: en movil evita zoom raro y ajusta el ancho al dispositivo." },
                    { code: "  <title>Componente UI</title>", what: "Que: agregas titulo del documento.", why: "Por que: identifica la pestaña y mejora navegacion del usuario." },
                    { code: "  <style>", what: "Que: abres bloque CSS embebido.", why: "Por que: defines estilo local sin archivo externo." },
                    { code: "    :root { --fondo: #f8fafc; --acento: #0f766e; }", what: "Que: declaras variables CSS.", why: "Por que: facilitan consistencia de color y mantenimiento." },
                    { code: "    .bloque { padding: 16px; border-radius: 10px; background: var(--fondo); }", what: "Que: creas clase base del contenedor.", why: "Por que: separa estructura (HTML) de apariencia (CSS)." },
                    { code: "    .boton { background: var(--acento); color: #fff; }", what: "Que: estilizas elemento interactivo.", why: "Por que: el CTA debe tener jerarquia visual clara." },
                    { code: "  </style>", what: "Que: cierras bloque CSS.", why: "Por que: delimitas correctamente estilos del documento." },
                    { code: "</head>", what: "Que: cierras cabecera.", why: "Por que: separas configuracion de contenido visible." },
                    { code: "<body>", what: "Que: inicias el cuerpo visible de la pagina.", why: "Por que: todo lo que ve el usuario vive en body." },
                    { code: "  <section class=\"bloque\">", what: "Que: abres una seccion semantica.", why: "Por que: section comunica que el contenido pertenece a un bloque tematico." },
                    { code: "    <h2>Titulo del bloque</h2>", what: "Que: agregas encabezado del bloque.", why: "Por que: aporta jerarquia semantica y escaneabilidad." },
                    { code: "    <p>Descripcion breve</p>", what: "Que: agregas texto explicativo.", why: "Por que: da contexto al usuario antes de actuar." },
                    { code: "    <button class=\"boton\" id=\"accionBtn\">Accion</button>", what: "Que: defines control interactivo.", why: "Por que: conecta estructura HTML con logica JS por id/clase." },
                    { code: "  </section>", what: "Que: cierras seccion.", why: "Por que: mantienes arbol DOM limpio y predecible." },
                    { code: "  <script>", what: "Que: abres JavaScript embebido.", why: "Por que: agregas comportamiento sin archivo externo." },
                    { code: "    const btn = document.getElementById(\"accionBtn\");", what: "Que: capturas referencia del boton.", why: "Por que: necesitas el nodo para escuchar eventos." },
                    { code: "    btn.addEventListener(\"click\", () => alert(\"Accion ejecutada\"));", what: "Que: registras evento click.", why: "Por que: conviertes HTML estatico en experiencia interactiva." },
                    { code: "  </" + "script>", what: "Que: cierras JavaScript.", why: "Por que: finaliza el bloque de logica del documento." },
                    { code: "</body></html>", what: "Que: cierras body y html.", why: "Por que: completas la estructura valida del documento." }
                ]
            };
        }

        return {
            title: "Plantilla guiada: Funcion JavaScript paso a paso",
            lines: [
                { code: "function resolverProblema(entrada) {", what: "Que: declaras funcion principal con parametro de entrada.", why: "Por que: explicita el contrato de datos que recibes." },
                { code: "  // validar entrada", what: "Que: documentas la etapa de validacion.", why: "Por que: ayuda a dividir el algoritmo en bloques mentales." },
                { code: "  if (!Array.isArray(entrada)) return [];", what: "Que: validas tipo de dato esperado.", why: "Por que: evita errores de ejecucion por entrada invalida." },
                { code: "  const resultado = [];", what: "Que: inicializas estructura de salida.", why: "Por que: separa claramente datos originales de datos procesados." },
                { code: "  for (let i = 0; i < entrada.length; i += 1) {", what: "Que: recorres cada elemento del array.", why: "Por que: permite aplicar la regla de negocio item por item." },
                { code: "    const item = entrada[i];", what: "Que: guardas el elemento actual.", why: "Por que: mejora legibilidad y evita repetir expresiones." },
                { code: "    const cumple = condicion(item);", what: "Que: evalúas la condicion del enunciado.", why: "Por que: desacoplas validacion de la transformacion." },
                { code: "    if (cumple) {", what: "Que: abres bloque condicional.", why: "Por que: procesas solo los elementos que aplican." },
                { code: "      const nuevo = transformar(item);", what: "Que: transformas el dato.", why: "Por que: materializas la regla pedida por la pregunta." },
                { code: "      resultado.push(nuevo);", what: "Que: agregas el resultado parcial.", why: "Por que: construyes la salida final de forma incremental." },
                { code: "    }", what: "Que: cierras condicional.", why: "Por que: delimitas el alcance de la regla de negocio." },
                { code: "  }", what: "Que: cierras bucle principal.", why: "Por que: finaliza recorrido de todos los elementos." },
                { code: "  return resultado;", what: "Que: devuelves la salida.", why: "Por que: toda funcion debe retornar el formato pedido por enunciado." },
                { code: "}", what: "Que: cierras la funcion.", why: "Por que: completa la estructura sintactica del lenguaje." }
            ]
        };
    }

    function getGuideProgressIndex(answer, q, guide, maxLines) {
        const safeGuideLen = Math.max(1, Math.min(guide.lines.length, maxLines));
        if (!answer || typeof answer !== "string") return 0;

        const nonEmptyLines = answer
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0).length;

        const normalized = answer.toLowerCase();
        const expected = q.expectedKeywords || [];
        const matched = expected.filter((kw) => normalized.includes(String(kw).toLowerCase())).length;
        const keywordRatio = expected.length > 0 ? matched / expected.length : 0;

        const byLines = Math.max(0, nonEmptyLines - 1);
        const byKeywords = Math.floor(keywordRatio * safeGuideLen);
        const progress = Math.max(byLines, byKeywords);

        return Math.min(safeGuideLen - 1, progress);
    }

    function renderProgressiveLineGuide(container, guide, maxLines, currentIndex) {
        container.innerHTML = "";

        const title = document.createElement("strong");
        title.textContent = guide.title;
        container.appendChild(title);

        const total = Math.max(1, Math.min(guide.lines.length, maxLines));
        const status = document.createElement("p");
        status.className = "sidebar-note";
        status.textContent = "Paso actual: " + (currentIndex + 1) + " / " + total;
        container.appendChild(status);

        const line = guide.lines[currentIndex];
        if (!line) return;

        const row = document.createElement("div");
        row.className = "line-guide-item";

        const code = document.createElement("code");
        code.innerHTML = escapeHtml(line.code);

        const detail = document.createElement("p");
        if (line.what || line.why) {
            detail.innerHTML = "<strong>" + escapeHtml(line.what || "") + "</strong><br>" + escapeHtml(line.why || "");
        } else {
            detail.textContent = line.explain;
        }

        row.appendChild(code);
        row.appendChild(detail);
        container.appendChild(row);
    }

    function updateProgressiveGuides(answer, q) {
        if (q?.type !== "code") return;

        const level = getHelpLevel();
        const mainMaxLines = getGuideLineLimit(level, "main");
        const sideMaxLines = getGuideLineLimit(level, "sidebar");
        const guide = buildCodeLineGuide(q);

        const mainIndex = getGuideProgressIndex(answer, q, guide, mainMaxLines);
        const sideIndex = getGuideProgressIndex(answer, q, guide, sideMaxLines);

        renderProgressiveLineGuide(lineByLineBox, guide, mainMaxLines, mainIndex);
        renderProgressiveLineGuide(sideLineByLine, guide, sideMaxLines, sideIndex);

        lineByLineBox.classList.remove("hidden");
    }

    function getCodeGuidance(q) {
        const prompt = (q.prompt || "").toLowerCase();

        if (prompt.includes("select") || prompt.includes("insert") || prompt.includes("update") || prompt.includes("delete")) {
            return {
                steps: [
                    "Lee el enunciado y subraya tablas, columnas y condiciones pedidas.",
                    "Esboza en terminos simples: ¿de donde traes datos? ¿que filtros? ¿como agrupas?",
                    "Escribe SELECT columnas FROM tabla, luego agrega WHERE, JOIN o GROUP BY paso a paso.",
                    "Valida: ¿claves foraneas correctas? ¿es seguro? ¿es legible?"
                ],
                adhoc: "En SQL junior se valora claridad: nombres exactos, filtros precisos y uso correcto de JOIN/GROUP BY. Evita subconsultas complejas."
            };
        }

        if (prompt.includes("html + css")) {
            return {
                steps: [
                    "Identifica la estructura minima: contenedor, contenido y accion.",
                    "Escribe primero el HTML semantico y luego aplica CSS progresivo.",
                    "Añade responsive basico con ancho flexible o media query.",
                    "Revisa accesibilidad minima: alt, labels o contraste suficiente."
                ],
                adhoc: "Para retos HTML/CSS, primero estructura y despues apariencia. Evita empezar por detalles visuales avanzados."
            };
        }

        return {
            steps: [
                "Subraya entrada, proceso y salida que pide el enunciado.",
                "Define una funcion con nombre claro y parametros adecuados.",
                "Resuelve en pequeño: prueba mental con un caso simple.",
                "Valida borde minimo (array vacio, null o valor no esperado)."
            ],
            adhoc: "En codigo JS junior se evalua claridad y logica correcta mas que optimizaciones complejas."
        };
    }

    function getSingleGuidance(answered, isCorrect, q) {
        const base = {
            steps: [
                "Detecta la palabra clave tecnica de la pregunta.",
                "Descarta opciones evidentemente falsas primero.",
                "Compara dos finalistas con una regla concreta.",
                "Elige la opcion y justificala en una frase corta."
            ],
            adhoc: "Tip: no memorices solo respuestas; memoriza por que una opcion es correcta en contexto real."
        };

        if (!answered) return base;

        if (isCorrect) {
            return {
                ...base,
                adhoc: "Correcto. Tu seleccion coincide con el concepto clave: " + q.explanation
            };
        }

        return {
            ...base,
            adhoc: "Respuesta no valida. Revisa la diferencia conceptual entre opciones: " + q.explanation
        };
    }

    function updateSidebarForQuestion() {
        if (!state.module || !state.questions.length) {
            sideModule.textContent = "Modulo: General";
            sideQuestionType.textContent = "Selecciona un modulo para comenzar.";
            sideConcept.textContent = "Se mostrara una explicacion breve y practica del tema actual.";
            sideAdhoc.textContent = "Cuando respondas, aqui veras retroalimentacion contextual para afianzar conceptos.";
            setSidebarSteps(adaptStepsByHelpLevel([
                "Selecciona el modulo que quieres practicar.",
                "Lee el enunciado completo antes de responder.",
                "Usa pistas y checklist para guiar tu solucion.",
                "Finaliza y analiza la retroalimentacion del sistema."
            ]));
            updateLearningMetrics();
            return;
        }

        const q = state.questions[state.currentIndex];
        sideModule.textContent = "Modulo " + state.module.id + ": " + state.module.name;
        sideQuestionType.textContent = "Pregunta " + (state.currentIndex + 1) + " de " + state.questions.length + " | Tipo: " + (q.type === "code" ? "Codigo" : "Seleccion multiple");
        sideConcept.textContent = MODULE_CONCEPTS[state.module.id] || "Aplica fundamentos de logica, sintaxis y buenas practicas.";

        if (q.type === "code") {
            const guidance = getCodeGuidance(q);
            setSidebarSteps(adaptStepsByHelpLevel(guidance.steps));
            sideAdhoc.textContent = guidance.adhoc + " Estructura recomendada: define, valida, procesa y retorna/representa resultado con claridad.";

            updateProgressiveGuides(state.answers[state.currentIndex] || "", q);

            updateLearningMetrics();
            return;
        }

        const answered = typeof state.answers[state.currentIndex] === "number";
        const isCorrect = answered && state.answers[state.currentIndex] === q.answer;
        const guidance = getSingleGuidance(answered, isCorrect, q);
        setSidebarSteps(adaptStepsByHelpLevel(guidance.steps));
        sideAdhoc.textContent = guidance.adhoc;
        sideLineByLine.innerHTML = "<p class='sidebar-note'>Esta pregunta no requiere codigo linea a linea. Enfocate en concepto, descarte de distractores y justificacion tecnica.</p>";
        updateLearningMetrics();
    }

    function renderCodeCoach(inputText, q) {
        if (q.type !== "code") {
            codeCoachBox.classList.add("hidden");
            codeCoachBox.innerHTML = "";
            return;
        }

        const text = (inputText || "").toLowerCase();
        const expected = q.expectedKeywords || [];
        const matched = expected.filter((kw) => text.includes(String(kw).toLowerCase()));
        const ratio = expected.length ? Math.round((matched.length / expected.length) * 100) : 0;
        const missing = expected.filter((kw) => !matched.includes(kw));

        codeCoachBox.innerHTML = "";

        const title = document.createElement("strong");
        title.textContent = "Coach de codigo en tiempo real";

        const progress = document.createElement("p");
        progress.textContent = "Progreso estimado de cobertura: " + ratio + "%";

        const list = document.createElement("ul");
        matched.slice(0, 6).forEach((m) => {
            const li = document.createElement("li");
            li.className = "coach-good";
            li.textContent = "Bien: detectado " + m;
            list.appendChild(li);
        });

        missing.slice(0, 6).forEach((m) => {
            const li = document.createElement("li");
            li.className = "coach-miss";
            li.textContent = "Falta reforzar: " + m;
            list.appendChild(li);
        });

        codeCoachBox.appendChild(title);
        codeCoachBox.appendChild(progress);
        codeCoachBox.appendChild(list);
        codeCoachBox.classList.remove("hidden");
    }

    function buildQuestionExplanation(q) {
        const level = getHelpLevel();
        let base = "Explicacion: " + q.explanation;
        if (q.type === "single" && q.options) {
            base += " Opcion correcta: " + q.options[q.answer] + ".";
        }

        if (q.type === "code") {
            base += " Secuencia detallada: 1) define estructura base, 2) valida entradas, 3) implementa logica principal, 4) prueba con caso feliz y caso borde, 5) refactoriza nombres y formato.";
        }

        if (level === "basico") return base;
        if (level === "guiado") {
            return base + " Enfoque guiado detallado: escribe una version minima funcional por bloques pequeños, integra CSS/JS en HTML solo despues de validar la estructura semantica, y comprueba cada linea critica antes de continuar.";
        }
        return base + " Enfoque recomendado: conecta la respuesta con un caso real de desarrollo junior, explica por que tu solucion cumple el enunciado y por que descartas alternativas.";
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    function generateRandomHtmlCssChallenge() {
        const components = [
            {
                name: "tarjeta de producto",
                htmlKeywords: ["<article", "<h3", "<p", "<button"],
                cssKeywords: ["border-radius", "padding", "box-shadow"],
                hint: "Usa article para el contenedor, un titulo h3, descripcion y un boton de accion."
            },
            {
                name: "barra de navegacion",
                htmlKeywords: ["<nav", "<ul", "<li", "<a"],
                cssKeywords: ["display", "justify-content", "gap"],
                hint: "Crea una estructura nav > ul > li > a y usa flex para distribuir enlaces."
            },
            {
                name: "formulario de registro",
                htmlKeywords: ["<form", "<label", "<input", "<button"],
                cssKeywords: ["display", "flex-direction", "margin"],
                hint: "Relaciona label e input con for/id y apila campos con flex en columna."
            },
            {
                name: "contenedor centrado",
                htmlKeywords: ["div", "h1", "Bienvenidos"],
                cssKeywords: ["display", "flex", "justify-content", "align-items", "height"],
                hint: "Usa flexbox con justify-content y align-items para centrar el h1 en el div."
            },
            {
                name: "boton con tooltip",
                htmlKeywords: ["button", "title", "enviar"],
                cssKeywords: ["border-radius", "transition", "hover"],
                hint: "Usa el atributo title para el tooltip y :hover en CSS para el cambio de color."
            },
            {
                name: "seccion hero",
                htmlKeywords: ["<section", "<h1", "<p", "<a"],
                cssKeywords: ["background", "padding", "text-align"],
                hint: "Incluye titulo, texto de apoyo y enlace CTA con estilos de espaciado."
            }
        ];

        const colorThemes = ["azul y gris", "verde y blanco", "naranja y oscuro", "cian y negro"];
        const c = components[Math.floor(Math.random() * components.length)];
        const theme = colorThemes[Math.floor(Math.random() * colorThemes.length)];

        return {
            type: "code",
            prompt: "Utilizando HTML y estilos, cree un bloque para una " + c.name + " responsive de nivel junior. Usa una paleta " + theme + " y aplica buenas practicas semanticas. Cumpla las siguientes condiciones:\n- " + c.hint,
            expectedKeywords: ["<", "</", "{"].concat(c.htmlKeywords).concat(c.cssKeywords),
            explanation: "Se evalua estructura HTML semantica, estilos CSS basicos y legibilidad del codigo.",
            hint: c.hint,
            checklist: [
                "Usa etiquetas HTML semanticas apropiadas.",
                "Aplica al menos 3 reglas CSS de layout/espaciado.",
                "Incluye un elemento interactivo (boton o enlace).",
                "Hazlo legible en movil (ancho flexible o media query)."
            ]
        };
    }

    function generateRandomSqlChallenge() {
        const challenges = [
            {
                task: "Con lenguaje SQL, escribe una consulta que devuelva los 5 productos mas caros disponibles (con stock > 0), mostrando nombre y precio ordenado por precio descendente.\n\nTabla disponible:\nproductos:\n- id (INT)\n- nombre (VARCHAR)\n- precio (DECIMAL)\n- stock (INT)",
                expectedKeywords: ["SELECT", "FROM", "WHERE", "ORDER BY", "DESC", "LIMIT"]
            },
            {
                task: "Con lenguaje SQL, crea una consulta que cuente cuantos usuarios hay por pais, devolviendo pais y cantidad, ordenado por cantidad descendente.\n\nTabla disponible:\nusuarios:\n- id (INT)\n- nombre (VARCHAR)\n- pais (VARCHAR)",
                expectedKeywords: ["SELECT", "COUNT", "FROM", "GROUP BY", "ORDER BY", "DESC"]
            },
            {
                task: "Con lenguaje SQL, escribe una consulta que encuentre usuarios (mostrando id y nombre) que hayan hecho mas de 3 ordenes. Une la tabla usuarios con ordenes.\n\nTablas disponibles:\nusuarios:\n- id (INT)\n- nombre (VARCHAR)\n\nordenes:\n- id (INT)\n- id_usuario (INT)\n- fecha (DATE)",
                expectedKeywords: ["SELECT", "FROM", "JOIN", "GROUP BY", "HAVING", "COUNT"]
            },
            {
                task: "Con lenguaje SQL, obtén el promedio de calificacion por producto (mostrando id del producto y promedio), solo para productos con al menos 5 comentarios.\n\nTabla disponible:\ncomentarios:\n- id (INT)\n- id_producto (INT)\n- calificacion (DECIMAL)\n- texto (VARCHAR)",
                expectedKeywords: ["SELECT", "FROM", "GROUP BY", "HAVING", "COUNT", "AVG"]
            },
            {
                task: "Con lenguaje SQL, escribe una consulta INSERT que agregue un nuevo usuario a la tabla con nombre, email y pais especificados. Usa VALUES.\n\nTabla disponible:\nusuarios:\n- id (INT)\n- nombre (VARCHAR)\n- email (VARCHAR)\n- pais (VARCHAR)",
                expectedKeywords: ["INSERT", "INTO", "VALUES"]
            },
            {
                task: "Con lenguaje SQL, crea un UPDATE que cambie el precio de un producto especifico (por id). Asegura que solo modifique ese producto.\n\nTabla disponible:\nproductos:\n- id (INT)\n- nombre (VARCHAR)\n- precio (DECIMAL)",
                expectedKeywords: ["UPDATE", "SET", "WHERE"]
            },
            {
                task: "Queremos conocer qué productos tienen un volumen de ventas destacado.\nEscribe una consulta SQL que devuelva el nombre del producto y el total de unidades vendidas, filtrando los que superen 500 unidades. Usa un CTE (WITH).\n\nTablas disponibles:\nproductos:\n- id (INT)\n- nombre (VARCHAR)\n\nventas:\n- id (INT)\n- id_producto (INT)\n- unidades (INT)",
                expectedKeywords: ["WITH", "AS", "SELECT", "SUM", "GROUP BY", "HAVING"]
            },
            {
                task: "¿Como eliminarias todos los registros de la tabla Pedidos realizados antes del 1 de enero de 2023?\n\nTabla disponible:\nPedidos:\n- id_pedido (INT)\n- fecha (DATE)",
                expectedKeywords: ["DELETE", "FROM", "WHERE", "<", "2023-01-01"]
            }
        ];

        const challenge = challenges[Math.floor(Math.random() * challenges.length)];

        return {
            type: "code",
            prompt: challenge.task,
            expectedKeywords: challenge.expectedKeywords,
            explanation: "Se evalua uso correcto de SELECT, FROM, WHERE, JOIN, agregaciones (COUNT, AVG), GROUP BY, HAVING, ORDER BY y operaciones de insercion/actualizacion. Estructura clara y legibilidad.",
            hint: "Recuerda: 1) SELECT define columnas. 2) FROM indica tabla(s). 3) WHERE filtra filas. 4) JOIN relaciona tablas. 5) GROUP BY agrupa. 6) HAVING filtra grupos. 7) ORDER BY ordena. 8) LIMIT limita resultados.",
            checklist: [
                "SELECT con columnas especificas o COUNT/AVG segun corresponda.",
                "FROM con tabla(s) principal(es) sin ambigüedad.",
                "WHERE o HAVING aplicados correctamente segun el filtro.",
                "Si usas JOIN, verifica que las claves foráneas sean correctas.",
                "ORDER BY y LIMIT si el enunciado lo requiere."
            ]
        };
    }

    function generateRandomJsLogicChallenge() {
        const scenarios = [
            {
                task: "Para resolver este ejercicio deberás utilizar JavaScript.\nTu equipo está desarrollando un sistema y necesita una función que reciba un array de ventas y retorne el total acumulado usando reduce.\nNo modifiques el nombre de la función ni la lógica que la evalúa.",
                expectedKeywords: ["function", "reduce", "acc", "return"]
            },
            {
                task: "Para resolver este ejercicio, deberás utilizar JavaScript.\nTu equipo está desarrollando un sistema asíncrono. Crea una función async que espere un segundo (setTimeout con Promise) y luego retorne 'Listo'.\nNo modifiques la sintaxis base que se provee en el editor.",
                expectedKeywords: ["async", "Promise", "setTimeout", "await"]
            },
            {
                task: "Para resolver este ejercicio, deberás utilizar JavaScript.\nTu equipo está desarrollando un filtro de base de datos. Implementa una función que filtre un array de usuarios por una propiedad 'activo: true'.\nAsegúrate de retornar el array filtrado.",
                expectedKeywords: ["filter", "activo", "true", "return"]
            }
        ];
        const s = scenarios[Math.floor(Math.random() * scenarios.length)];
        return {
            type: "code",
            prompt: s.task,
            expectedKeywords: s.expectedKeywords,
            explanation: "Se evalua uso de metodos de array, asincronia y logica basica de JavaScript.",
            hint: "Usa metodos modernos como filter, map o reduce para un codigo mas limpio."
        };
    }

    function randomizeSingleChoiceQuestion(q) {
        const optionsWithIndex = q.options.map((text, idx) => ({ text, originalIdx: idx }));
        shuffleArray(optionsWithIndex);
        return {
            ...q,
            options: optionsWithIndex.map((o) => o.text),
            answer: optionsWithIndex.findIndex((o) => o.originalIdx === q.answer)
        };
    }

    function buildQuestionsForModule(moduleId) {
        const moduleCfg = MODULES.find((m) => m.id === moduleId);
        if (!moduleCfg) return [];

        const basePool = structuredClone(BASE_QUESTION_BANK[moduleId] || []);

        // Modulos con codigo reciben retos dinamicos adicionales en cada recarga.
        const generated = [];
        if (moduleId === 1) {
            generated.push(generateRandomHtmlCssChallenge(), generateRandomHtmlCssChallenge(), generateRandomHtmlCssChallenge());
        }
        if (moduleId === 2) {
            generated.push(generateRandomJsLogicChallenge(), generateRandomJsLogicChallenge());
        }
        if (moduleId === 3) {
            generated.push(generateRandomHtmlCssChallenge(), generateRandomJsLogicChallenge(), generateRandomJsLogicChallenge());
        }
        if (moduleId === 4) {
            generated.push(generateRandomSqlChallenge(), generateRandomSqlChallenge(), generateRandomSqlChallenge());
        }

        const pool = shuffleArray(basePool.concat(generated));
        const selected = pool.slice(0, moduleCfg.count).map((q) => {
            if (q.type === "single") return randomizeSingleChoiceQuestion(q);
            return q;
        });

        return selected;
    }

    function buildModulesView() {
        modulesTableBody.innerHTML = "";
        moduleSelect.innerHTML = "";

        MODULES.forEach((m) => {
            const tr = document.createElement("tr");
            tr.innerHTML = ""
                + "<td>" + m.id + "</td>"
                + "<td>" + m.name + "</td>"
                + "<td>" + m.type + "</td>"
                + "<td>" + m.count + "</td>"
                + "<td>" + m.minutes + " min</td>";
            modulesTableBody.appendChild(tr);

            const opt = document.createElement("option");
            opt.value = String(m.id);
            opt.textContent = m.id + " - " + m.name;
            moduleSelect.appendChild(opt);
        });
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.max(0, seconds % 60);
        return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    }

    function startModule(moduleId) {
        const selected = MODULES.find((m) => m.id === moduleId);
        if (!selected) return;

        state.module = selected;
        state.questions = buildQuestionsForModule(moduleId);
        state.currentIndex = 0;
        state.answers = {};
        state.firstAttemptResult = {};
        state.submitted = false;

        state.timer.totalSeconds = selected.minutes * 60;
        state.timer.remainingSeconds = selected.minutes * 60;
        state.timer.startedAt = Date.now();
        state.timer.paused = false;
        state.timer.endAt = Date.now() + state.timer.remainingSeconds * 1000;

        examSection.classList.remove("hidden");
        resultSection.classList.add("hidden");

        moduleBadge.textContent = "Modulo " + selected.id + ": " + selected.name;

        clearInterval(state.timer.intervalId);
        state.timer.intervalId = setInterval(tick, 250);

        renderQuestion();
        updateTimerUI();
        updateSidebarForQuestion();
        pauseBtn.disabled = false;
        resumeBtn.disabled = true;
    }

    // Inicialización de eventos globales (solo una vez)
    solutionBtn.addEventListener("click", toggleSolution);
    document.addEventListener("keydown", handleGlobalKeys);

    function handleGlobalKeys(e) {
        if (state.submitted) return;
        
        // Evitar disparar atajos si el usuario está interactuando con inputs o el editor
        const tag = document.activeElement?.tagName || "";
        if (tag === "TEXTAREA" || tag === "INPUT") return;
        if (codeEditor && codeEditor.hasFocus()) return;

        if (e.key.toLowerCase() === "h") toggleHint();
        if (e.key.toLowerCase() === "e") explainCurrentQuestion();
        if (e.key.toLowerCase() === "s") toggleSolution();
        
        if (e.key === "ArrowRight" && !nextBtn.disabled) {
            nextBtn.click();
        }
        if (e.key === "ArrowLeft" && !prevBtn.disabled) {
            prevBtn.click();
        }
    }

    function tick() {
        if (state.timer.paused || state.submitted) return;

        const now = Date.now();
        const diffMs = state.timer.endAt - now;
        state.timer.remainingSeconds = Math.max(0, Math.ceil(diffMs / 1000));
        updateTimerUI();

        if (state.timer.remainingSeconds <= 0) {
            finalizeModule(true);
        }
    }

    function updateTimerUI() {
        timerLabel.textContent = formatTime(state.timer.remainingSeconds);
        timerLabel.classList.toggle("low", state.timer.remainingSeconds <= 60);
    }

    function renderQuestion() {
        destroyEditor(); // Limpiar instancia anterior primero para evitar errores de DOM

        const q = state.questions[state.currentIndex];
        if (!q) return;

        progressBadge.textContent = "Pregunta " + (state.currentIndex + 1) + "/" + state.questions.length;
        questionType.textContent = "Tipo: " + (q.type === "code" ? "Codigo" : "Seleccion multiple");
        questionTitle.textContent = q.prompt;
        hintText.classList.add("hidden");
        hintText.textContent = q.hint || q.explanation || "Piensa en los conceptos base del modulo y responde paso a paso.";
        hintBtn.textContent = "Mostrar pista";
        solutionBox.classList.add("hidden");
        solutionBox.innerHTML = "";
        solutionBtn.textContent = "Ver solución";
        runResultBox.classList.add("hidden");
        runResultBox.innerHTML = "";

        questionBody.innerHTML = "";
        checklistBox.innerHTML = "";
        checklistBox.classList.add("hidden");
        codeCoachBox.classList.add("hidden");
        codeCoachBox.innerHTML = "";
        lineByLineBox.classList.add("hidden");
        lineByLineBox.innerHTML = "";

        if (q.type === "code") {
            runBtn.classList.remove("hidden");
            const list = q.checklist || [
                "Declara una solucion completa y legible.",
                "Usa sintaxis correcta de JavaScript/HTML/CSS.",
                "Incluye retorno o salida verificable segun el enunciado."
            ];

            const ckTitle = document.createElement("strong");
            ckTitle.textContent = "Checklist de evaluacion:";
            const ul = document.createElement("ul");
            list.forEach((item) => {
                const li = document.createElement("li");
                li.textContent = item;
                ul.appendChild(li);
            });
            checklistBox.appendChild(ckTitle);
            checklistBox.appendChild(ul);
            checklistBox.classList.remove("hidden");

            const area = document.createElement("textarea");
            area.id = "code-editor-area";
            questionBody.appendChild(area);

            const promptText = (q.prompt || "").toLowerCase();
            const moduleId = state.module ? state.module.id : 0;
            let mode = "javascript";
            
            // Detección mejorada del lenguaje para el resaltado
            if (moduleId === 4 || promptText.includes("sql") || promptText.includes("consulta") || promptText.includes("select") || promptText.includes("update") || promptText.includes("insert") || promptText.includes("delete")) {
                mode = "text/x-sql";
            } else if (moduleId === 1 || promptText.includes("html") || promptText.includes("css") || promptText.includes("div") || promptText.includes("<") || promptText.includes("clase")) {
                mode = "htmlmixed";
            }

            try {
                codeEditor = CodeMirror.fromTextArea(area, {
                    mode: mode,
                    theme: "dracula",
                    lineNumbers: true,
                    autoCloseBrackets: true,
                    matchBrackets: true,
                    tabSize: 2,
                    extraKeys: { 
                        "Ctrl-Space": "autocomplete",
                        "Tab": "emmetExpandAbbreviation"
                    },
                    emmet: true
                });

                // Forzar inicialización de Emmet si el plugin lo requiere
                if (typeof emmetCodeMirror === "function") {
                    emmetCodeMirror(codeEditor);
                }
            } catch (err) {
                console.error("Error al inicializar CodeMirror:", err);
                // Fallback: usar el textarea normal si CodeMirror falla
                area.style.display = "block";
                area.classList.add("fallback-editor");
            }

            codeEditor.setValue(state.answers[state.currentIndex] || "");

            renderCodeCoach(codeEditor.getValue(), q);
            updateProgressiveGuides(codeEditor.getValue(), q);

            codeEditor.on("change", (instance) => {
                const val = instance.getValue();
                state.answers[state.currentIndex] = val;
                renderCodeCoach(val, q);
                updateProgressiveGuides(val, q);
                updateLearningMetrics();
            });

            // Ghost Recommendations (Autocomplete as you type)
            codeEditor.on("inputRead", (cm, change) => {
                if (change.origin === "+input") {
                    cm.showHint({ completeSingle: false });
                }
            });
        } else {
            runBtn.classList.add("hidden");
            const wrap = document.createElement("div");
            wrap.className = "options";

            const selected = state.answers[state.currentIndex];

            q.options.forEach((optText, idx) => {
                const label = document.createElement("label");
                label.className = "opt" + (selected === idx ? " selected" : "");

                const input = document.createElement("input");
                input.type = "radio";
                input.name = "q_" + state.currentIndex;
                input.checked = selected === idx;
                input.addEventListener("change", () => {
                    state.answers[state.currentIndex] = idx;
                    if (state.firstAttemptResult[state.currentIndex] === undefined) {
                        state.firstAttemptResult[state.currentIndex] = idx === q.answer;
                    }
                    // Actualiza visual de opciones sin re-renderizar la pregunta completa
                    // (evita cerrar la pista o explicacion que el usuario tenga abierta)
                    for (const el of wrap.querySelectorAll(".opt")) { el.classList.remove("selected"); }
                    label.classList.add("selected");
                    updateSidebarForQuestion();
                    updateLearningMetrics();
                });

                const span = document.createElement("span");
                span.textContent = optText;

                label.appendChild(input);
                label.appendChild(span);
                wrap.appendChild(label);
            });

            questionBody.appendChild(wrap);
        }

        prevBtn.disabled = state.currentIndex === 0;
        nextBtn.disabled = state.currentIndex === state.questions.length - 1;
        updateSidebarForQuestion();
    }

    function toggleHint() {
        hintText.classList.toggle("hidden");
        hintBtn.textContent = hintText.classList.contains("hidden") ? "Mostrar pista" : "Ocultar pista";
        if (!hintText.classList.contains("hidden")) solutionBox.classList.add("hidden");
    }

    function toggleSolution() {
        const q = state.questions[state.currentIndex];
        if (!q) return;

        if (!solutionBox.classList.contains("hidden")) {
            solutionBox.classList.add("hidden");
            solutionBtn.textContent = "Ver solución";
            return;
        }

        solutionBox.innerHTML = "";
        const title = document.createElement("h4");
        title.textContent = "Solución Sugerida";
        
        const explanation = document.createElement("p");
        explanation.innerHTML = "<strong>Explicación:</strong> " + (q.explanation || "No hay explicación disponible.");

        solutionBox.appendChild(title);

        if (q.type === "code") {
            const codeBlock = document.createElement("code");
            codeBlock.className = "solution-code";
            // Si no hay solutionCode, usamos keywords como referencia o un mensaje
            codeBlock.textContent = q.solutionCode || "/* Ejemplo de estructura esperada */\n" + (q.expectedKeywords ? q.expectedKeywords.join(" ") : "// Revisa los conceptos del módulo");
            solutionBox.appendChild(codeBlock);
        } else {
            const correctOpt = document.createElement("p");
            correctOpt.innerHTML = "<strong>Respuesta correcta:</strong> " + q.options[q.answer];
            solutionBox.appendChild(correctOpt);
        }

        solutionBox.appendChild(explanation);
        solutionBox.classList.remove("hidden");
        hintText.classList.add("hidden");
        solutionBtn.textContent = "Ocultar solución";
    }

    function explainCurrentQuestion() {
        const q = state.questions[state.currentIndex];
        if (!q) return;
        hintText.textContent = buildQuestionExplanation(q);
        hintText.classList.remove("hidden");
        hintBtn.textContent = "Ocultar pista";
        sideAdhoc.textContent = "Modo explicacion activa: revisa la logica y vuelve a intentar sin memorizar la opcion.";
    }

    function pauseTimer() {
        if (state.timer.paused || state.submitted) return;
        state.timer.paused = true;
        clearInterval(state.timer.intervalId);
        pauseBtn.disabled = true;
        resumeBtn.disabled = false;
    }

    function resumeTimer() {
        if (!state.timer.paused || state.submitted) return;
        state.timer.paused = false;
        state.timer.endAt = Date.now() + state.timer.remainingSeconds * 1000;
        state.timer.intervalId = setInterval(tick, 250);
        pauseBtn.disabled = false;
        resumeBtn.disabled = true;
    }

    function evaluateQuestion(q, answer) {
        if (q.type === "code") {
            if (!answer || typeof answer !== "string") {
                return { ok: false, msg: "Sin respuesta de código." };
            }

            const normalized = answer.toLowerCase();
            const keywords = q.expectedKeywords || [];
            const hasAll = keywords.length === 0 || keywords.every((kw) => normalized.includes(String(kw).toLowerCase()));

            let syntaxOk = true;
            let syntaxMsg = "";
            const promptText = (q.prompt || "").toLowerCase();
            const moduleId = state.module ? state.module.id : 0;
            const isSQL = moduleId === 4 || promptText.includes("sql") || promptText.includes("select") || promptText.includes("update") || promptText.includes("delete") || promptText.includes("insert");
            const isHTML = moduleId === 1 || promptText.includes("html") || promptText.includes("css") || promptText.includes("div");

            if (isSQL) {
                if (!answer.trim().endsWith(";")) {
                    syntaxOk = false;
                    syntaxMsg = "Falta el punto y coma (;) al final.";
                } else if (!/^(SELECT|UPDATE|INSERT|DELETE|WITH|ALTER)\b/i.test(answer.trim())) {
                    syntaxOk = false;
                    syntaxMsg = "Comando DML/DDL inválido.";
                }
            } else if (isHTML) {
                const openTags = (answer.match(/</g) || []).length;
                const closeTags = (answer.match(/>/g) || []).length;
                if (openTags !== closeTags) {
                    syntaxOk = false;
                    syntaxMsg = "Etiquetas HTML desbalanceadas (< >).";
                }
            } else {
                try {
                    new Function(answer);
                } catch(e) {
                    syntaxOk = false;
                    syntaxMsg = "Error de sintaxis JS: " + e.message;
                }
            }

            if (!syntaxOk) {
                return { 
                    ok: false, 
                    msg: "Error sintáctico: " + syntaxMsg + (hasAll ? " Aunque usaste los elementos correctos, la sintaxis falla." : "")
                };
            }

            return {
                ok: hasAll,
                msg: hasAll
                    ? "Respuesta válida. Sintaxis y lógica correctas (Emulación Alkemy)."
                    : "Sintaxis correcta, pero faltan palabras clave requeridas en la lógica de solución."
            };
        }

        const ok = answer === q.answer;
        return {
            ok,
            msg: ok ? "Opcion correcta." : "Opcion incorrecta."
        };
    }

    function finalizeModule(auto = false) {
        if (state.submitted) return;
        state.submitted = true;

        clearInterval(state.timer.intervalId);
        pauseBtn.disabled = true;
        resumeBtn.disabled = true;

        let correct = 0;
        feedbackList.innerHTML = "";

        state.questions.forEach((q, idx) => {
            const res = evaluateQuestion(q, state.answers[idx]);
            if (res.ok) correct += 1;

            const div = document.createElement("div");
            div.className = "feedback-item " + (res.ok ? "ok" : "bad");
            div.innerHTML = ""
                + "<strong>Pregunta " + (idx + 1) + ": " + (res.ok ? "Correcto" : "Incorrecto") + "</strong>"
                + "<p>" + res.msg + "</p>"
                + "<p class='small'><strong>Explicacion:</strong> " + q.explanation + "</p>";

            feedbackList.appendChild(div);
        });

        const total = state.questions.length;
        const pct = Math.round((correct / total) * 100);
        const usedSeconds = state.timer.totalSeconds - state.timer.remainingSeconds;

        scoreLine.textContent = "Puntaje obtenido: " + correct + "/" + total + " (" + pct + "%)." + (auto ? " Envio automatico por tiempo agotado." : "");
        timeLine.textContent = "Tiempo usado vs total: " + formatTime(usedSeconds) + " / " + formatTime(state.timer.totalSeconds) + ".";

        resultSection.classList.remove("hidden");
        resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    startBtn.addEventListener("click", () => {
        const moduleId = Number(moduleSelect.value);
        startModule(moduleId);
    });

    prevBtn.addEventListener("click", () => {
        state.currentIndex = Math.max(0, state.currentIndex - 1);
        renderQuestion();
    });

    nextBtn.addEventListener("click", () => {
        state.currentIndex = Math.min(state.questions.length - 1, state.currentIndex + 1);
        renderQuestion();
    });

    function executeCode() {
        const q = state.questions[state.currentIndex];
        if (!q || q.type !== "code") return;
        
        const answer = state.answers[state.currentIndex] || "";
        runResultBox.innerHTML = "";
        runResultBox.classList.remove("hidden");
        
        const promptText = (q.prompt || "").toLowerCase();
        const moduleId = state.module ? state.module.id : 0;
        const isSQL = moduleId === 4 || promptText.includes("sql") || promptText.includes("select") || promptText.includes("update") || promptText.includes("delete") || promptText.includes("insert");
        const isHTML = moduleId === 1 || promptText.includes("html") || promptText.includes("css") || promptText.includes("div");

        if (isSQL) {
            try {
                const trimmed = answer.trim().toUpperCase();
                if (!trimmed.match(/^(SELECT|UPDATE|INSERT|DELETE|WITH|ALTER)/)) {
                    throw new Error("Syntax error: SQL debe iniciar con un comando DML/DDL válido.");
                }
                if (!answer.trim().endsWith(";")) {
                    throw new Error("Syntax error: Las consultas SQL deben terminar con punto y coma (;).");
                }
                runResultBox.innerHTML = "<strong>[Entorno SQL Simulado]</strong><br>Query analizada correctamente.<br>Filas afectadas/devueltas: ~" + Math.floor(Math.random() * 5 + 1) + "<br><span style='color: #34d399;'>Ejecución exitosa.</span>";
            } catch (e) {
                runResultBox.innerHTML = "<span style='color: #ef4444;'>Error SQL: " + escapeHtml(e.message) + "</span>";
            }
        } else if (isHTML) {
            const iframe = document.createElement("iframe");
            iframe.style.width = "100%";
            iframe.style.height = "250px";
            iframe.style.background = "white";
            iframe.style.border = "none";
            iframe.style.borderRadius = "8px";
            runResultBox.appendChild(iframe);
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(answer);
            doc.close();
        } else {
            let output = [];
            const originalConsoleLog = console.log;
            console.log = function(...args) {
                output.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(" "));
                originalConsoleLog.apply(console, args);
            };
            try {
                const func = new Function(answer);
                func();
                if (output.length === 0) {
                    output.push("<span style='color: #34d399;'>Ejecución completada sin errores. (Sin salida de consola)</span>");
                }
                runResultBox.innerHTML = "<strong>[Consola JS]</strong><br>" + output.join("<br>");
            } catch (e) {
                runResultBox.innerHTML = "<span style='color: #ef4444;'>Error JS: " + escapeHtml(e.message) + "</span>";
            } finally {
                console.log = originalConsoleLog;
            }
        }
    }

    runBtn.addEventListener("click", executeCode);
    pauseBtn.addEventListener("click", pauseTimer);
    resumeBtn.addEventListener("click", resumeTimer);
    finishBtn.addEventListener("click", () => finalizeModule(false));
    hintBtn.addEventListener("click", toggleHint);
    explainBtn.addEventListener("click", explainCurrentQuestion);
    helpLevelSelect.addEventListener("change", () => {
        if (state.module && state.questions.length) {
            renderQuestion();
        } else {
            updateSidebarForQuestion();
        }
    });

    // Recalculo por timestamp para evitar drift por pestaña inactiva.
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && !state.timer.paused && !state.submitted) {
            tick();
        }
    });

    buildModulesView();
    updateSidebarForQuestion();
})();

