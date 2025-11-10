let fila = 5;
let columna = 5;
const contenedor = document.getElementById("tabla");
const teclado = document.getElementById("teclado");
let textoFinal = document.getElementById("textoFinal");
let textoVictoriaDerrota = document.getElementById("textoW/L");
let i1 = 0;
let j1 = 0;
let juegoTerminado = false;
let secreta = "";
const Temporizador = document.getElementById("temporizador-fila");
const temporizadorGeneral = document.getElementById("contador-general");
let tiempoInicio = 0;
let contadorFila = null;
let contadorGeneral = null;
const LIMITE_TIEMPO_MS = 30000;
let segundosRestantes = 0;
let contadorVisual = null;
let diccionario = new Set();
let teclas = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];
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
function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const seg = segundos % 60;
  const minutosStr = minutos.toString().padStart(2, "0");
  const segStr = seg.toString().padStart(2, "0");
  return `${minutosStr}:${segStr}`;
}
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
function empezarTempFila() {
  clearTimeout(contadorFila);
  clearInterval(contadorVisual);
  segundosRestantes = LIMITE_TIEMPO_MS / 1000;
  Temporizador.innerHTML = segundosRestantes;
  contadorFila = setTimeout(() => {
    tiempoDeIntentoAgotado();
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
function tiempoDeIntentoAgotado() {
  clearInterval(contadorVisual);
  if (juegoTerminado) return;
  textoFinal.classList.add("aviso");
  textoFinal.innerHTML = "Se agotó el tiempo.";
  setTimeout(() => {
    textoFinal.innerHTML = "";
    textoFinal.classList.remove("aviso");
  }, 1000);
  if (i1 === fila - 1) {
    finDelJuego(false);
    return;
  }
  i1++;
  j1 = 0;
  empezarTempFila();
}
function cambiarPosicion(i, j) {
  if (juegoTerminado) return;
  if (j1 >= columna) {
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
  if (i !== i1) {
    window.alert("Solo puedes editar la fila actual.");
    return;
  }
  let celda = document.getElementById(`celda${i}${j}`);
  celda.innerHTML = "";
  j1 = j;
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
async function comprobarFila() {
  let palabraUsuario = "";
  for (let j = 0; j < columna; j++) {
    const celda = document.getElementById(`celda${i1}${j}`);
    palabraUsuario += celda.innerHTML;
  }
  const esValida = await verificarPalabra(palabraUsuario);

  if (!esValida) {
    textoFinal.classList.add("aviso");
    textoFinal.innerHTML = "Palabra no válida. Pierdes el turno.";
    
    setTimeout(() => {
      textoFinal.innerHTML = "";
      textoFinal.classList.remove("aviso");
      
      if (i1 === fila - 1) {
        finDelJuego(false);
        return;
      }

      i1++;
      j1 = 0;
      juegoTerminado = false;
      
      // --- ¡¡ARREGLO!! ---
      // Esta es la línea que faltaba para reiniciar el timer
      empezarTempFila(); 
      
    }, 2000);

    return; 
  }

  clearTimeout(contadorFila);
  clearInterval(contadorVisual);
  let secretaArray = secreta.split("");
  let estados = new Array(columna).fill("fallo");
  for (let j = 0; j < columna; j++) {
    if (palabraUsuario[j] === secretaArray[j]) {
      estados[j] = "acierto";
      secretaArray[j] = null;
    }
  }
  for (let j = 0; j < columna; j++) {
    if (estados[j] !== "acierto") {
      let posEnSecreta = secretaArray.indexOf(palabraUsuario[j]);
      if (posEnSecreta !== -1) {
        estados[j] = "malColocada";
        secretaArray[posEnSecreta] = null;
      }
    }
  }
  for (let j = 0; j < columna; j++) {
    const celda = document.getElementById(`celda${i1}${j}`);
    const letra = palabraUsuario[j];
    const estado = estados[j];
    setTimeout(() => {
      celda.classList.add(estado);
    }, j * 300);
    actualizarTeclado(letra, estado);
  }
  const duracionTotalAnimacion = (columna - 1) * 300 + 500;
  setTimeout(() => {
    if (palabraUsuario === secreta) {
      const tiempoEnSegundos = tiempoFinalUsuario();
      const puntuacionBase = 1000 - (tiempoEnSegundos * 10);
      const puntuacionFinal = Math.max(100, Math.floor(puntuacionBase));
      console.log(`Puntuación a enviar: ${puntuacionFinal}`);
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      fetch('/actualizar-puntuacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({ score: puntuacionFinal })
      })
      .then(respuesta => {
        if (respuesta.ok) {
          console.log('Puntuación guardada en la base de datos.');
        } else {
          console.error('Error al guardar la puntuación.');
        }
      })
      .catch(error => console.error('Error de red:', error));
      finDelJuego(true);
      return;
    }
    if (i1 === fila - 1) {
      finDelJuego(false);
      return;
    }
    i1++;
    j1 = 0;
    juegoTerminado = false;
    empezarTempFila();
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
  clearTimeout(contadorFila);
  clearInterval(contadorVisual);
  clearInterval(contadorGeneral);
  const teclado = document.getElementById("teclado");
  teclado.classList.add("deshabilitado");
  textoFinal.classList.remove("aviso");
  if (esVictoria) {
    textoVictoriaDerrota.innerHTML = "Has ganado, Felicidades!!";
    tiempoFinalUsuario();
  } else {
    textoVictoriaDerrota.innerHTML = `Has perdido, vuelve a intentarlo. La palabra secreta era ${secreta}`;
  }
}
async function obtenerPalabraSecreta() {
  try {
    const respuesta = await fetch("/palabrasRandom/1");
    const textoRespuesta = await respuesta.text();
    console.log("Respuesta del servidor (antes de JSON):", textoRespuesta);
    const contenido = JSON.parse(textoRespuesta);
    secreta = contenido[0].toUpperCase();
    console.log("La palabra secreta es: ", secreta);
  } catch (error) {
    console.error("Error al obtener la palabra: ", error);
  }
}
async function verificarPalabra(palabra) {
  palabra.toUpperCase();
  if (window.DICCIONARIO.includes(palabra)) {
    return true;
  }
    try {
    const palabraCodificada = encodeURIComponent(palabra.toLowerCase());
    const respuesta = await fetch(`/verificarPalabra/${palabraCodificada}`);
    const data = await respuesta.json();
    return !!(data.existe || data.exists || data.found);
  } catch (error) {
    console.error("Error al verificar en el backend:", error);
    return false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  obtenerPalabraSecreta();
  empezarContadorTiempo();
  empezarTempFila();
  document.addEventListener("keydown", tecladoFisico);
});