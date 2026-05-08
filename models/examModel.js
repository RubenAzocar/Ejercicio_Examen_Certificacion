(function () {
    // Configuracion editable de modulos.
    const MODULES = [
        { id: 1, name: "Fundamentos Desarrollo Web (HTML, CSS, Git)", type: "Mixto", count: 10, minutes: 20 },
        { id: 2, name: "Programacion con JavaScript (Basico)", type: "Mixto", count: 5, minutes: 15 },
        { id: 3, name: "Programacion Avanzada JavaScript (ES6, Async, POO, DOM)", type: "Mixto", count: 15, minutes: 25 },
        { id: 4, name: "Fundamentos Bases Datos Relacionales (SQL, ER)", type: "Mixto", count: 15, minutes: 30 },
        { id: 5, name: "Desarrollo Apps Web Node Express (MVC)", type: "Seleccion Multiple", count: 10, minutes: 15 },
        { id: 6, name: "Acceso a datos Apps Node (Sequelize, Transacciones)", type: "Seleccion Multiple", count: 12, minutes: 20 },
        { id: 7, name: "API Backend Node Express (REST, JWT, Seguridad)", type: "Seleccion Multiple", count: 10, minutes: 15 }
    ];

    // Banco de preguntas expandido
    const BASE_QUESTION_BANK = {
        1: [
            { 
                type: "single", 
                prompt: "¿Cuál de las siguientes técnicas es fundamental para adaptar el contenido de un sitio web a diferentes tamaños de pantalla?", 
                options: ["Aplicar únicamente etiquetas <meta> sin ajustes en CSS", "Uso exclusivo de imágenes PNG", "Utilizar position: fixed en todos los elementos", "Uso de @media queries para ajustar estilos según el viewport"], 
                answer: 3, 
                explanation: "Las Media Queries son la base del Responsive Web Design.",
                kidExplanation: "Imagina que tu página web es como plastilina mágica: con las 'media queries' le das instrucciones para que sepa cómo cambiar de forma. Si detecta un teléfono pequeño, se estira de una forma; si es una tele gigante, se acomoda de otra. \n\n**¿Cómo lo haces?** Escribes `@media` y pones la condición (como el ancho máximo) para que los estilos solo funcionen en ese tamaño."
            },
            { 
                type: "single", 
                prompt: "¿Cuál de las siguientes unidades de medida es más adecuada para establecer el tamaño de fuente en diseños responsivos?", 
                options: ["Porcentaje (%)", "Centímetros (cm)", "rem", "em", "Píxeles (px)"], 
                answer: 2, 
                explanation: "rem es ideal ya que escala respecto al tamaño de fuente raíz.",
                kidExplanation: "El 'rem' es como una regla maestra. En lugar de decir 'mide 20 píxeles', dices 'mide 2 veces el tamaño base'. Si cambias el tamaño base, ¡todo el diseño se ajusta mágicamente a la vez!"
            },
            {
                type: "single",
                prompt: "¿Qué etiqueta HTML se usa para definir el contenido principal de un documento?",
                options: ["<header>", "<main>", "<section>", "<div>"],
                answer: 1,
                explanation: "<main> indica el contenido central y único de la página.",
                kidExplanation: "La etiqueta <main> es como el plato principal de tu cena: es lo más importante y lo que todos vinieron a ver."
            },
            {
                type: "single",
                prompt: "¿Qué propiedad CSS se utiliza para cambiar el color de fondo?",
                options: ["color", "background-color", "bgcolor", "fill"],
                answer: 1,
                explanation: "background-color define el color del lienzo detrás del contenido.",
                kidExplanation: "Es como elegir el color de la pared de tu cuarto antes de empezar a colgar posters."
            },
            {
                type: "code",
                prompt: "Crea una regla CSS que use una Media Query para dispositivos de menos de 600px y cambie el color de fondo a rojo.",
                expectedKeywords: ["@media", "max-width", "600px", "background-color", "red"],
                explanation: "Las media queries permiten diseño adaptativo.",
                kidExplanation: "Vamos a decirle a la computadora: '¡Oye! Si la pantalla es más pequeña que un cuaderno, pinta el fondo de color rojo'.",
                solutionCode: "@media (max-width: 600px) {\n  body {\n    background-color: red;\n  }\n}"
            }
        ],
        2: [
            { 
                type: "single", 
                prompt: "¿Qué devuelve typeof [] en JavaScript?", 
                options: ["array", "object", "list", "undefined"], 
                answer: 1, 
                explanation: "En JS, los arrays son técnicamente objetos.",
                kidExplanation: "En JavaScript, una lista de cosas es como una caja de juguetes. Si le preguntas qué es, te dirá que es un 'objeto' (una caja). \n\n**¿Por qué importa?** Porque al ser objetos, tienen trucos especiales (métodos) para buscar, sacar o meter cosas dentro de la caja."
            },
            {
                type: "single",
                prompt: "¿Cuál es el resultado de 2 + '2' en JavaScript?",
                options: ["4", "22", "NaN", "Error"],
                answer: 1,
                explanation: "JS concatena cuando uno de los operandos es un string.",
                kidExplanation: "Si tratas de sumar el número 2 con el dibujo del número 2, JavaScript los pega como si fueran calcomanías y sale '22'."
            },
            {
                type: "code",
                prompt: "Escribe una función llamada 'saludar' que reciba un nombre y devuelva 'Hola ' + nombre.",
                expectedKeywords: ["function", "saludar", "return", "Hola"],
                explanation: "Definición básica de funciones y retorno de strings.",
                kidExplanation: "Crea un robot llamado 'saludar' que tenga un botón de 'nombre'. Cuando alguien presione el botón y le de un nombre, el robot debe construir una frase que diga 'Hola' seguido de ese nombre y entregársela al usuario con `return`.",
                solutionCode: "function saludar(nombre) {\n  return 'Hola ' + nombre;\n}"
            }
        ],
        4: [
            {
                type: "single",
                prompt: "¿Qué comando SQL se usa para extraer datos de una base de datos?",
                options: ["EXTRACT", "GET", "SELECT", "OPEN"],
                answer: 2,
                explanation: "SELECT es la instrucción base para consultas.",
                kidExplanation: "Es como ir a una biblioteca mágica y decirle al bibliotecario: '¡SELECT todos los libros de dinosaurios!'. \n\n**Paso a paso:** Usas `SELECT` para decir qué quieres ver, `FROM` para decir en qué estante buscar, y `WHERE` si quieres filtrar solo los que tienen dibujos."
            },
            {
                type: "single",
                prompt: "¿Cuál es la función de una Clave Primaria (Primary Key)?",
                options: ["Ordenar la tabla", "Identificar de forma única cada fila", "Permitir valores nulos", "Vincular dos tablas"],
                answer: 1,
                explanation: "La PK garantiza unicidad por registro.",
                kidExplanation: "La Clave Primaria es como tu número de identidad o tu huella digital: no hay nadie más en el mundo que tenga la misma."
            }
        ],
        5: [
            {
                type: "single",
                prompt: "En Express, ¿qué objeto se usa para enviar una respuesta al cliente?",
                options: ["request", "res", "send", "client"],
                answer: 1,
                explanation: "res (response) maneja la salida del servidor.",
                kidExplanation: "Imagina que el servidor es un camarero. El objeto 'res' es la bandeja donde te trae la comida que pediste."
            },
            {
                type: "single",
                prompt: "¿Qué hace el middleware body-parser?",
                options: ["Limpia la base de datos", "Analiza el cuerpo de las peticiones entrantes", "Compila el código JS", "Envía archivos HTML"],
                answer: 1,
                explanation: "Permite leer los datos enviados en un POST.",
                kidExplanation: "Es como alguien que recibe una carta, abre el sobre y te lee el mensaje para que no tengas que hacerlo tú."
            }
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
