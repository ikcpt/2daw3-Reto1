// -----------------------------------------------------------------
// --- VARIABLES GLOBALES ---
// -----------------------------------------------------------------

// --- Dimensiones del tablero ---
let fila = 5;
let columna = 5;

// --- Elementos del DOM ---
const contenedor = document.getElementById("tabla");
const teclado = document.getElementById("teclado");
let textoFinal = document.getElementById("textoFinal"); // Lo muevo aquí desde finDelJuego para que sea global
let textoVictoriaDerrota = document.getElementById("textoW/L");
// --- Estado del juego ---
let i1 = 0; // Fila actual
let j1 = 0; // Columna actual
let juegoTerminado = false;
let secreta = "";

// --- Variables para temporizadores ---
const Temporizador = document.getElementById("temporizador-fila");
const temporizadorGeneral = document.getElementById("contador-general");
let tiempoInicio = 0; // Para el contador total de la partida
let contadorFila = null; // Para el contador de cada intento
let contadorGeneral = null;
const LIMITE_TIEMPO_MS = 30000; // Límite de 30 segundos
let segundosRestantes = 0;
let contadorVisual = null;

// --- Teclas del teclado en pantalla ---
let teclas = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

// -----------------------------------------------------------------
// --- INICIALIZACIÓN DE LA INTERFAZ (UI) ---
// -----------------------------------------------------------------

// --- Imprimir tabla en pantalla ---
let dHTML = `<div class="main-content">`;
dHTML += `<div class="tablero">`;
for (let i = 0; i < fila; i++) {
  for (let j = 0; j < columna; j++) {
    dHTML += `<div class="Celda" id="celda${i}${j}" onclick="seleccionarCelda(${i},${j})"></div>`;
  }
}
dHTML += `</div>`;
dHTML += `</div>`;
contenedor.innerHTML = dHTML;

// --- Imprimir teclado ---
let pHTML = ``;
for (let i = 0; i < teclas.length - 1; i++) {
  pHTML += `<div class="teclado-fila fila-${i}">`;
  for (let j = 0; j < teclas[i].length; j++) {
    const letra = teclas[i][j];
    pHTML += `<div id="Letra${i}${j}" class="tecla tecla-letra" onclick="cambiarPosicion(${i}, ${j})">${letra}</div>`;
  }
  pHTML += `</div>`;
}
const ultimaFilaLetras = teclas[teclas.length - 1];
const i = teclas.length - 1;
pHTML += `<div class="teclado-fila fila-2">`;
pHTML += `<div></div>`;
for (let j = 0; j < ultimaFilaLetras.length; j++) {
  const letra = ultimaFilaLetras[j];
  pHTML += `<div id="Letra${i}${j}" class="tecla tecla-letra" onclick="cambiarPosicion(${i}, ${j})">${letra}</div>`;
}
pHTML += `<div></div>`;
pHTML += `</div>`;
teclado.innerHTML = pHTML;

// -----------------------------------------------------------------
// --- FUNCIONES DE TEMPORIZADORES ---
// -----------------------------------------------------------------

function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const seg = segundos % 60;
  const minutosStr = minutos.toString().padStart(2, "0");
  const segStr = seg.toString().padStart(2, "0");
  return `${minutosStr}:${segStr}`;
}
/**
 * Inicia el contador de tiempo total de la partida.
 */
function empezarContadorTiempo() {
  tiempoInicio = Date.now();
  temporizadorGeneral.innerHTML = "00:00";
  clearInterval(contadorGeneral);
  contadorGeneral = setInterval(() => {
    const segundosPasados = Date.now() - tiempoInicio;
    const totalSegundos = Math.floor(segundosPasados / 1000);
    temporizadorGeneral.innerHTML = formatearTiempo(totalSegundos);
  }, 1000);
}

/**
 * Calcula y muestra el tiempo total que ha tardado el jugador.
 * Se llama al ganar la partida.
 */
function tiempoFinalUsuario() {
  if (tiempoInicio === 0) {
    return 0;
  }

  const tiempoFin = Date.now();
  const duracionMilisegundos = tiempoFin - tiempoInicio;
  const duracionSegundos = duracionMilisegundos / 1000;

  console.log(
    `El jugador ha tardado ${duracionSegundos} segundos en acertar la palabra.`
  );
  tiempoInicio = 0;

  return duracionSegundos;
}

/**
 * Inicia (o reinicia) el temporizador para el intento/fila actual.
 */
function empezarTempFila() {
  clearTimeout(contadorFila); // Limpia cualquier temporizador anterior
  clearInterval(contadorVisual);

  segundosRestantes = LIMITE_TIEMPO_MS / 1000;
  Temporizador.innerHTML = segundosRestantes;

  contadorFila = setTimeout(() => {
    tiempoDeIntentoAgotado(); // Llama a esta función si se acaba el tiempo
  }, LIMITE_TIEMPO_MS);
  Temporizador.style.color = "white";
  contadorVisual = setInterval(() => {
    segundosRestantes--;
    Temporizador.innerHTML = segundosRestantes;

    if (segundosRestantes <= 10) {
      Temporizador.style.color = "red";
    }
  }, 1000);
}

/**
 * Se ejecuta si el temporizador del intento llega a cero.
 */
function tiempoDeIntentoAgotado() {
  clearInterval(contadorVisual);
  if (juegoTerminado) return; // Si el juego ya acabó, no hacer nada
  textoFinal.classList.add("aviso");
  textoFinal.innerHTML = "Se agotó el tiempo.";

  setTimeout(() => {
    textoFinal.innerHTML = "";
    textoFinal.classList.remove("aviso");
  }, 1000);
  //Si no es el ultimo intento que le queda, pasa a la siguiente fila
  if (i1 === fila - 1) {
    finDelJuego(false);
    return;
  }

  // Pasa a la siguiente fila
  i1++;
  j1 = 0;
  empezarTempFila(); // Reinicia el temporizador para la nueva fila
}

// -----------------------------------------------------------------
// --- FUNCIONES DE MANEJO DEL TABLERO Y JUEGO ---
// -----------------------------------------------------------------

/**
 * Se llama al pulsar una tecla del teclado en pantalla.
 * Añade la letra a la celda actual.
 */
function cambiarPosicion(i, j) {
  if (juegoTerminado) return; // No hacer nada si el juego terminó

  if (j1 >= columna) {
    // Si la fila ya está llena, no añadir más letras
    return;
  }

  let teclaPulsada = document.getElementById(`Letra${i}${j}`);
  let letra = teclaPulsada.innerHTML;
  añadirLetra(letra);
}

function tecladoFisico(event) {
  if (juegoTerminado) return;
  const tecla = event.key;

  if (tecla === "Backspace") {
    borrarLetra();
    return;
  }

  if (/^[a-zA-ZñÑ]$/.test(tecla)) {
    añadirLetra(tecla.toUpperCase());
    return;
  }
}

function seleccionarCelda(i, j) {
  if (juegoTerminado) {
    return;
  }
  // Solo permite editar la fila actual (i1)
  if (i !== i1) {
    window.alert("Solo puedes editar la fila actual.");
    return;
  }

  let celda = document.getElementById(`celda${i}${j}`);
  celda.innerHTML = ""; // Borra la letra

  j1 = j; // Mueve el cursor (j1) a la columna seleccionada
}

function añadirLetra(letra) {
  if (juegoTerminado) return;
  if (j1 >= columna) {
    return;
  }

  let celdaObjetivo = document.getElementById(`celda${i1}${j1}`);
  celdaObjetivo.innerHTML = letra.toUpperCase();
  j1++;
  if (j1 === columna) {
    clearTimeout(contadorFila);
    clearInterval(contadorVisual);
    juegoTerminado = true;
    setTimeout(() => {
      comprobarFila();
    }, 100);
  }
}

function borrarLetra() {
  if (juegoTerminado) return;
  if (j1 <= 0) return;

  j1--;
  let celdaObjetivo = document.getElementById(`celda${i1}${j1}`);
  celdaObjetivo.innerHTML = "";
}

/**
 * Comprueba la palabra introducida por el usuario contra la palabra secreta.
 */
function comprobarFila() {
  let palabraUsuario = "";
  for (let j = 0; j < columna; j++) {
    const celda = document.getElementById(`celda${i1}${j}`);
    palabraUsuario += celda.innerHTML;
  }

  let secretaArray = secreta.split("");
  let estados = new Array(columna).fill("fallo"); // "fallo", "acierto", "malColocada"

  // 1ª pasada: Buscar aciertos (verde)
  for (let j = 0; j < columna; j++) {
    if (palabraUsuario[j] === secretaArray[j]) {
      estados[j] = "acierto";
      secretaArray[j] = null; // Marcar para no usarla en la 2ª pasada
    }
  }

  // 2ª pasada: Buscar mal colocadas (amarillo)
  for (let j = 0; j < columna; j++) {
    if (estados[j] !== "acierto") {
      let posEnSecreta = secretaArray.indexOf(palabraUsuario[j]);
      if (posEnSecreta !== -1) {
        estados[j] = "malColocada";
        secretaArray[posEnSecreta] = null; // Marcar para no usarla más
      }
    }
  }

  // Aplicar estilos con animación
  for (let j = 0; j < columna; j++) {
    const celda = document.getElementById(`celda${i1}${j}`);
    const letra = palabraUsuario[j];
    const estado = estados[j];

    setTimeout(() => {
      celda.classList.add(estado);
    }, j * 300);

    // Actualizamos el teclado (esto se hace al instante)
    actualizarTeclado(letra, estado);
  }

  const duracionTotalAnimacion = (columna - 1) * 300 + 500; // Espera a que termine la animación

  setTimeout(() => {
    // Comprobar si ha ganado
    if (palabraUsuario === secreta) {
      finDelJuego(true);
      return;
    }

    // Comprobar si ha perdido (última fila)
    if (i1 === fila - 1) {
      finDelJuego(false);
      return;
    }

    // Pasar a la siguiente fila
    i1++;
    j1 = 0;
    juegoTerminado = false; // Desbloquea el teclado para la siguiente fila
    empezarTempFila(); // Inicia el temporizador para la nueva fila
  }, duracionTotalAnimacion);
}

function actualizarTeclado(letra, estado) {
  let teclaElement = null;
  for (let i = 0; i < teclas.length; i++) {
    for (let j = 0; j < teclas[i].length; j++) {
      if (teclas[i][j] === letra.toUpperCase()) {
        teclaElement = document.getElementById(`Letra${i}${j}`);
        break;
      }
    }
    if (teclaElement) break;
  }

  if (!teclaElement) return;

  if (estado === "acierto") {
    teclaElement.classList.remove("malColocada");
    teclaElement.classList.remove("fallo");
    teclaElement.classList.add("acierto");
  } else if (estado === "malColocada") {
    if (!teclaElement.classList.contains("acierto")) {
      teclaElement.classList.remove("fallo");
      teclaElement.classList.add("malColocada");
    }
  } else if (estado === "fallo") {
    if (
      !teclaElement.classList.contains("acierto") &&
      !teclaElement.classList.contains("malColocada")
    ) {
      teclaElement.classList.add("fallo");
    }
  }
}

function finDelJuego(esVictoria) {
  juegoTerminado = true;
  clearTimeout(contadorFila); // Detiene el temporizador de la fila (por si acaso)
  clearInterval(contadorVisual);
  clearInterval(contadorGeneral);
  const teclado = document.getElementById("teclado");
  teclado.classList.add("deshabilitado"); // Deshabilita el teclado visual

  textoFinal.classList.remove("aviso");
  if (esVictoria) {
    textoVictoriaDerrota.innerHTML = "Has ganado, Felicidades!!";
    tiempoFinalUsuario(); // Calcula el tiempo total
  } else {
    textoVictoriaDerrota.innerHTML = `Has perdido, vuelve a intentarlo. La palabra secreta era ${secreta}`;
  }
}

// -----------------------------------------------------------------
// --- FUNCIONES DE API ---
// -----------------------------------------------------------------

/**
 * Obtiene la palabra secreta desde la API.
 */
async function obtenerPalabraSecreta() {
  try {
    const palabra = await fetch("http://185.60.43.155:3000/api/word/1");
    const contenido = await palabra.json();
    secreta = contenido.word.toUpperCase();
    console.log("La palabra secreta es: ", secreta);
  } catch (error) {
    console.error("Error al obtener la palabra: ", error);
  }
}

// -----------------------------------------------------------------
// --- INICIAR CUANDO CARGUE LA PÁGINA ---
// -----------------------------------------------------------------

/**
 * Se ejecuta cuando el DOM se ha cargado completamente.
 */
document.addEventListener("DOMContentLoaded", () => {
  //Iniciamos la funcion para obtener la palabra secreta
  obtenerPalabraSecreta();
  //Iniciamos el contador para saber cuando tarda el usuario en adivinar la palabra
  empezarContadorTiempo();
  //Iniciamos el contador de la primera fila
  empezarTempFila();
  //Iniciar teclado fisico
  document.addEventListener("keydown", tecladoFisico);
});
