(function () {
    // Configuracion editable de modulos: cambiar tiempos o cantidades aqui.
    const MODULES = [
        { id: 1, name: "Fundamentos Desarrollo Web (js)", type: "Codigo", count: 8, minutes: 19 },
        { id: 2, name: "Programacion con JavaScript", type: "Seleccion Multiple", count: 2, minutes: 15 },
        { id: 3, name: "Programacion Avanzada JavaScript", type: "Seleccion Multiple / Codigo", count: 15, minutes: 20 },
        { id: 4, name: "Fundamentos Bases Datos Relacionales (js)", type: "Seleccion Multiple", count: 14, minutes: 24 },
        { id: 5, name: "Desarrollo Apps Web Node Express", type: "Seleccion Multiple", count: 10, minutes: 13 },
        { id: 6, name: "Acceso a datos Apps Node", type: "Seleccion Multiple", count: 12, minutes: 15 },
        { id: 7, name: "API Backend Node Express", type: "Seleccion Multiple", count: 10, minutes: 13 }
    ];

    // Banco de preguntas realista nivel junior. Se evalua tipo codigo por palabras clave esperadas.
    const BASE_QUESTION_BANK = {
        1: [
            { type: "code", prompt: "Escribe una funcion que reciba un array de numeros y devuelva un nuevo array con cada numero multiplicado por 2, pero solo si es par.", expectedKeywords: ["function", "filter", "map"], explanation: "Se espera separar pares y luego transformarlos (filter + map)." },
            { type: "code", prompt: "Crea una funcion que reciba un string y retorne true si es palindromo (ignorando mayusculas y espacios).", expectedKeywords: ["toLowerCase", "replace", "split", "reverse"], explanation: "Debes normalizar el texto y comparar contra su reverso." },
            { type: "code", prompt: "Crea una funcion que reciba un objeto usuario y devuelva un mensaje: 'Hola, {nombre}'.", expectedKeywords: ["function", "nombre", "return"], explanation: "Debe acceder a propiedad del objeto y devolver texto formateado." },
            { type: "code", prompt: "Escribe una funcion que cuente cuantas vocales tiene un texto.", expectedKeywords: ["for", "includes", "return"], explanation: "Puedes recorrer caracteres y validar si pertenecen al conjunto de vocales." },
            { type: "code", prompt: "Escribe una funcion que reciba dos arrays y devuelva uno nuevo sin duplicados.", expectedKeywords: ["Set", "..."], explanation: "Una solucion comun es usar Set para deduplicar valores." },
            { type: "code", prompt: "Implementa una funcion que ordene un array de objetos por la propiedad precio de menor a mayor.", expectedKeywords: ["sort", "a", "b"], explanation: "Debes usar sort con comparador numerico por precio." },
            { type: "code", prompt: "Escribe una funcion que reciba un numero n y retorne la suma de 1 hasta n.", expectedKeywords: ["for", "sum", "return"], explanation: "La suma acumulada con bucle es suficiente para nivel junior." },
            { type: "code", prompt: "Crea una funcion que valide un email con una expresion regular basica y retorne boolean.", expectedKeywords: ["/", "test", "return"], explanation: "Se evalua uso basico de regex y retorno booleano." }
        ],
        2: [
            { type: "single", prompt: "Que devuelve map en JavaScript?", options: ["Un valor unico", "Un nuevo array transformado", "El mismo array sin cambios", "Un objeto"], answer: 1, explanation: "map siempre retorna un nuevo array con la transformacion aplicada." },
            { type: "single", prompt: "Cual es la mejor forma de declarar una constante que no cambiara?", options: ["var", "let", "const", "define"], answer: 2, explanation: "const evita reasignacion y es recomendada para valores inmutables por referencia." }
        ],
        3: [
            { type: "single", prompt: "Que hace Promise.all cuando una promesa falla?", options: ["Ignora el error", "Resuelve igual", "Rechaza todo el conjunto", "Reintenta automaticamente"], answer: 2, explanation: "Promise.all rechaza tan pronto una promesa falle." },
            { type: "single", prompt: "Cual es la salida de typeof null?", options: ["null", "object", "undefined", "number"], answer: 1, explanation: "Es una particularidad historica de JavaScript." },
            { type: "code", prompt: "Escribe una funcion async que consulte /api/users con fetch y retorne el JSON.", expectedKeywords: ["async", "await", "fetch", "json"], explanation: "Se espera async/await y parseo de respuesta JSON." },
            { type: "single", prompt: "Que metodo convierte un array en un unico valor?", options: ["forEach", "reduce", "find", "flat"], answer: 1, explanation: "reduce acumula resultados en un unico valor." },
            { type: "code", prompt: "Implementa debounce(fn, delay) para limitar llamadas frecuentes.", expectedKeywords: ["setTimeout", "clearTimeout", "return"], explanation: "Debounce cancela llamadas previas y ejecuta al final del intervalo." },
            { type: "single", prompt: "Para copiar un objeto superficialmente se usa comunmente:", options: ["Object.freeze", "JSON.parse", "{...obj}", "Object.defineProperty"], answer: 2, explanation: "El spread operator crea una copia superficial." },
            { type: "code", prompt: "Escribe una funcion que agrupe un array de objetos por categoria usando reduce.", expectedKeywords: ["reduce", "categoria", "acc"], explanation: "Se espera un acumulador con claves dinamicas por categoria." },
            { type: "single", prompt: "Que ventaja tiene usar try/catch con async/await?", options: ["No hay ventaja", "Maneja errores de promesas de forma clara", "Hace el codigo mas lento", "Evita usar fetch"], answer: 1, explanation: "try/catch simplifica captura de errores asincronos." },
            { type: "single", prompt: "Que metodo elimina el ultimo elemento de un array?", options: ["shift", "pop", "splice(0,1)", "slice"], answer: 1, explanation: "pop remueve el ultimo elemento y lo retorna." },
            { type: "code", prompt: "Crea una funcion que reciba un array y retorne el maximo sin usar Math.max(...).", expectedKeywords: ["for", "if", "max"], explanation: "Se evalua logica de comparacion iterativa." },
            { type: "single", prompt: "Que diferencia principal hay entre == y ===?", options: ["Ninguna", "=== compara tipo y valor", "== es mas seguro", "=== convierte tipos"], answer: 1, explanation: "=== evita coercion de tipos." },
            { type: "code", prompt: "Escribe una funcion que detecte si dos arrays son iguales en longitud y contenido.", expectedKeywords: ["length", "for", "return"], explanation: "Compara longitud y luego elemento a elemento." },
            { type: "single", prompt: "Cual estructura permite iterar claves y valores de un objeto?", options: ["Object.entries", "Object.name", "Array.keys", "Map.parse"], answer: 0, explanation: "Object.entries devuelve pares [clave, valor]." },
            { type: "code", prompt: "Implementa una funcion que remueva valores falsy de un array.", expectedKeywords: ["filter", "Boolean"], explanation: "filter(Boolean) es una solucion clasica y valida." },
            { type: "single", prompt: "Que metodo retorna el primer elemento que cumpla una condicion?", options: ["map", "filter", "find", "every"], answer: 2, explanation: "find retorna solo el primer match." }
        ],
        4: [
            { type: "single", prompt: "Que clausula SQL filtra filas?", options: ["ORDER BY", "WHERE", "GROUP BY", "JOIN"], answer: 1, explanation: "WHERE aplica condiciones de filtrado." },
            { type: "single", prompt: "Para unir tablas por relacion se usa:", options: ["MERGE", "MATCH", "JOIN", "UNION"], answer: 2, explanation: "JOIN combina filas entre tablas relacionadas." },
            { type: "single", prompt: "Que comando crea una tabla?", options: ["MAKE TABLE", "CREATE TABLE", "NEW TABLE", "ADD TABLE"], answer: 1, explanation: "CREATE TABLE define estructura en SQL." },
            { type: "single", prompt: "Que hace PRIMARY KEY?", options: ["Permite nulos", "Identifica filas de forma unica", "Ordena tabla", "Crea indice de texto"], answer: 1, explanation: "PRIMARY KEY no admite duplicados ni nulos." },
            { type: "single", prompt: "Que comando inserta datos?", options: ["PUSH", "INSERT INTO", "APPEND", "PUT"], answer: 1, explanation: "INSERT INTO agrega nuevas filas." },
            { type: "single", prompt: "COUNT(*) se usa para:", options: ["Contar columnas", "Contar filas", "Calcular promedio", "Eliminar registros"], answer: 1, explanation: "COUNT(*) devuelve cantidad de filas." },
            { type: "single", prompt: "La normalizacion busca principalmente:", options: ["Duplicar datos", "Reducir redundancia", "Eliminar claves", "Aumentar nulos"], answer: 1, explanation: "Normalizar evita redundancia e inconsistencias." },
            { type: "single", prompt: "Que tipo de JOIN trae todo de izquierda y coincidencias de derecha?", options: ["RIGHT JOIN", "INNER JOIN", "LEFT JOIN", "FULL JOIN"], answer: 2, explanation: "LEFT JOIN conserva todas las filas de la tabla izquierda." },
            { type: "single", prompt: "Para ordenar resultados se usa:", options: ["SORT", "ORDER BY", "GROUP BY", "HAVING"], answer: 1, explanation: "ORDER BY ordena asc o desc." },
            { type: "single", prompt: "HAVING se aplica sobre:", options: ["Filas antes de agrupar", "Grupos agregados", "Tablas", "Indices"], answer: 1, explanation: "HAVING filtra resultados despues de GROUP BY." },
            { type: "single", prompt: "Que restriccion evita emails repetidos?", options: ["DEFAULT", "UNIQUE", "CHECK", "NOT NULL"], answer: 1, explanation: "UNIQUE impide valores duplicados." },
            { type: "single", prompt: "FOREIGN KEY sirve para:", options: ["Definir password", "Relacionar tablas", "Contar filas", "Borrar tabla"], answer: 1, explanation: "FOREIGN KEY garantiza integridad referencial." },
            { type: "single", prompt: "Cual consulta obtiene los 5 productos mas caros?", options: ["SELECT * FROM productos LIMIT 5", "SELECT * FROM productos ORDER BY precio DESC LIMIT 5", "SELECT TOP 5 FROM productos", "SELECT * FROM productos GROUP BY precio"], answer: 1, explanation: "Debes ordenar por precio DESC y limitar a 5." },
            { type: "single", prompt: "Que comando elimina una tabla completa?", options: ["DELETE TABLE", "DROP TABLE", "REMOVE TABLE", "TRUNCATE TABLE"], answer: 1, explanation: "DROP TABLE elimina estructura y datos." }
        ],
        5: [
            { type: "single", prompt: "Que objeto de Express representa la peticion HTTP?", options: ["req", "res", "app", "router"], answer: 0, explanation: "req contiene datos entrantes de la solicitud." },
            { type: "single", prompt: "Que metodo inicia servidor en Express?", options: ["app.run", "app.start", "app.listen", "app.open"], answer: 2, explanation: "app.listen abre puerto para recibir peticiones." },
            { type: "single", prompt: "Para parsear JSON en body se usa:", options: ["express.json()", "express.body()", "app.use(body)", "JSON.parse(req)"], answer: 0, explanation: "Middleware oficial para body JSON." },
            { type: "single", prompt: "Que codigo HTTP corresponde a creado exitoso?", options: ["200", "201", "204", "400"], answer: 1, explanation: "201 Created para alta de recurso." },
            { type: "single", prompt: "En Express, app.use se usa para:", options: ["Solo rutas GET", "Registrar middleware", "Cerrar servidor", "Compilar app"], answer: 1, explanation: "app.use aplica middleware global o por ruta." },
            { type: "single", prompt: "Que devuelve res.json?", options: ["Texto plano", "Respuesta JSON", "Archivo", "Cookie"], answer: 1, explanation: "Serializa objeto a JSON y responde." },
            { type: "single", prompt: "Que paquete se usa para variables de entorno (.env)?", options: ["config", "dotenv", "envify", "node-env"], answer: 1, explanation: "dotenv carga variables desde archivo .env." },
            { type: "single", prompt: "Que status es ideal para error de validacion?", options: ["500", "301", "400", "204"], answer: 2, explanation: "400 Bad Request en datos invalidos." },
            { type: "single", prompt: "Que diferencia hay entre app.get y app.post?", options: ["Ninguna", "Metodo HTTP que atienden", "post solo para archivos", "get solo para admin"], answer: 1, explanation: "Cada uno atiende un verbo HTTP." },
            { type: "single", prompt: "Que middleware ayuda a evitar bloqueos por CORS?", options: ["helmet", "cors", "morgan", "cookie-parser"], answer: 1, explanation: "cors habilita politicas de origen cruzado." }
        ],
        6: [
            { type: "single", prompt: "En Node, por que usar consultas parametrizadas?", options: ["Son mas rapidas siempre", "Evitan inyeccion SQL", "Reducen RAM", "No usan indices"], answer: 1, explanation: "Parametrizar protege contra SQL injection." },
            { type: "single", prompt: "Que practica mejora acceso a datos en capa servicio?", options: ["SQL en cada controlador", "Repositorio o DAO", "Variables globales", "Hardcodear credenciales"], answer: 1, explanation: "DAO/Repositorio separa responsabilidades." },
            { type: "single", prompt: "Que significa ACID en BD transaccional?", options: ["Cuatro propiedades de transacciones", "Un tipo de indice", "Modelo NoSQL", "Un framework"], answer: 0, explanation: "Atomicidad, Consistencia, Aislamiento, Durabilidad." },
            { type: "single", prompt: "Que devuelve normalmente una operacion INSERT?", options: ["id insertado y filas afectadas", "Solo tabla", "Nada", "Siempre error"], answer: 0, explanation: "Muchos drivers devuelven metadatos de insercion." },
            { type: "single", prompt: "Que debes hacer al abrir conexion de BD por request?", options: ["Nunca cerrarla", "Cerrar/liberar al finalizar", "Duplicarla", "Guardar en localStorage"], answer: 1, explanation: "Liberar conexiones evita fuga de recursos." },
            { type: "single", prompt: "Que patron evita repetir try/catch en cada controlador async?", options: ["wrapper asyncHandler", "setTimeout", "forEach", "JSON.parse"], answer: 0, explanation: "asyncHandler centraliza captura de errores." },
            { type: "single", prompt: "Que ventaja ofrece un pool de conexiones?", options: ["No requiere credenciales", "Reutiliza conexiones y mejora rendimiento", "Duplica datos", "Elimina latencia a cero"], answer: 1, explanation: "Pool evita crear conexion nueva en cada consulta." },
            { type: "single", prompt: "Que status usar si registro no existe al buscar por id?", options: ["200", "201", "404", "302"], answer: 2, explanation: "404 Not Found para recurso ausente." },
            { type: "single", prompt: "Que significa ORM?", options: ["Object Relational Mapping", "Open Runtime Module", "Only Read Memory", "Operational Route Map"], answer: 0, explanation: "ORM mapea tablas a objetos." },
            { type: "single", prompt: "Para paginar resultados SQL se usa comunmente:", options: ["LIMIT y OFFSET", "COUNT y AVG", "DROP y CREATE", "MAP y REDUCE"], answer: 0, explanation: "LIMIT/OFFSET controla tamano y salto de pagina." },
            { type: "single", prompt: "Que riesgo hay si concatenas parametros del usuario en SQL?", options: ["Mas ordenado", "Inyeccion SQL", "Ninguno", "Solo warning"], answer: 1, explanation: "Concatenar input en SQL es inseguro." },
            { type: "single", prompt: "Que capa deberia validar reglas de negocio complejas?", options: ["Vista", "Servicio", "CSS", "Router estatico"], answer: 1, explanation: "La capa de servicio centraliza logica de negocio." }
        ],
        7: [
            { type: "single", prompt: "Que verbo HTTP corresponde a actualizar parcialmente un recurso?", options: ["PUT", "PATCH", "POST", "GET"], answer: 1, explanation: "PATCH actualiza parcialmente." },
            { type: "single", prompt: "Que retorna una API REST al crear recurso?", options: ["500", "201 y recurso creado", "302", "204 y body completo"], answer: 1, explanation: "201 con representacion o ubicacion del recurso." },
            { type: "single", prompt: "Que significa idempotencia en HTTP?", options: ["Misma solicitud produce mismo efecto", "Siempre crea datos", "Solo aplica a GET", "No usa codigos"], answer: 0, explanation: "Idempotente = repetir no cambia el resultado final." },
            { type: "single", prompt: "Cual es una buena practica para errores de API?", options: ["Responder texto ambiguo", "Formato JSON consistente de error", "Ocultar status", "Usar siempre 200"], answer: 1, explanation: "Estandarizar errores facilita cliente y debugging." },
            { type: "single", prompt: "En una API, autenticacion JWT suele enviarse en:", options: ["Query string", "Header Authorization", "Nombre de ruta", "Cookie solo obligatoria"], answer: 1, explanation: "Comunmente Authorization: Bearer token." },
            { type: "single", prompt: "Que deberia incluir documentacion minima de endpoint?", options: ["Metodo, ruta, request, response", "Solo nombre", "Solo SQL", "Logo"], answer: 0, explanation: "Contrato minimo para consumir API correctamente." },
            { type: "single", prompt: "Que status usarias en eliminacion exitosa sin contenido?", options: ["200", "201", "204", "404"], answer: 2, explanation: "204 No Content es apropiado para delete exitoso." },
            { type: "single", prompt: "Que metodo HTTP es seguro (no modifica estado)?", options: ["POST", "DELETE", "GET", "PATCH"], answer: 2, explanation: "GET no debe cambiar datos del servidor." },
            { type: "single", prompt: "Que estrategia ayuda a versionar APIs?", options: ["/api/v1/...", "Cambiar puerto en cada release", "Eliminar rutas viejas sin aviso", "Usar status 299"], answer: 0, explanation: "Version en ruta es una estrategia comun y clara." },
            { type: "single", prompt: "Que se recomienda para validar payload de entrada?", options: ["No validar", "Validar con esquema (Joi/Zod o logica propia)", "Solo validar frontend", "Solo longitud de string"], answer: 1, explanation: "Validar en backend evita datos inconsistentes." }
        ]
    };

    // Estado de aplicacion.
    const state = {
        module: null,
        questions: [],
        currentIndex: 0,
        answers: {},
        firstAttemptResult: {},
        timer: {
            totalSeconds: 0,
            remainingSeconds: 0,
            endAt: 0,
            paused: true,
            intervalId: null,
            startedAt: 0
        },
        submitted: false
    };


    globalThis.AppModel = {
        MODULES,
        BASE_QUESTION_BANK,
        state
    };
})();
