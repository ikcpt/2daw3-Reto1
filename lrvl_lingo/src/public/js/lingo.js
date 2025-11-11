const fila = 5, columna = 5;

const [contenedor, teclado, textoFinal, textoVictoriaDerrota, Temporizador, temporizadorGeneral] = ["tabla", "teclado", "textoFinal", "textoW/L", "temporizador-fila", "contador-general"].map(id => document.getElementById(id));
let i1 = 0, j1 = 0, juegoTerminado = false, secreta = "";
let tiempoInicio = 0, contadorFila = null, contadorGeneral = null, segundosRestantes = 0, contadorVisual = null;
const LIMITE_TIEMPO_MS = 30000;
const teclas = [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"], ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"], ["Z", "X", "C", "V", "B", "N", "M"]];
const celdasHTML = Array.from({ length: fila }, (_, i) => Array.from({ length: columna }, (_, j) => `<div class="Celda" id="celda${i}${j}" onclick="seleccionarCelda(${i},${j})"></div>`).join("")).join("");
contenedor.innerHTML = `<div class="main-content"><div class="tablero">${celdasHTML}</div></div>`;
const tecladoHTML = teclas.map((filaTeclas, i) => {
    const teclasHTML = filaTeclas.map((letra, j) => `<div id="Letra${i}${j}" class="tecla tecla-letra" onclick="cambiarPosicion(${i}, ${j})">${letra}</div>`).join("");
    if (i === teclas.length - 1) return `<div class="teclado-fila fila-${i}"><div></div>${teclasHTML}<div></div></div>`;
    return `<div class="teclado-fila fila-${i}">${teclasHTML}</div>`;
}).join("");
teclado.innerHTML = tecladoHTML;
function formatearTiempo(segundos) {
  const m = Math.floor(segundos / 60).toString().padStart(2, "0");
  const s = (segundos % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function empezarContadorTiempo() {
  tiempoInicio = Date.now();
  temporizadorGeneral.innerHTML = "00:00";
  clearInterval(contadorGeneral);
  contadorGeneral = setInterval(() => {
    const totalSegundos = Math.floor((Date.now() - tiempoInicio) / 1000);
    temporizadorGeneral.innerHTML = formatearTiempo(totalSegundos);
  }, 1000);
}
function tiempoFinalUsuario() {
  if (tiempoInicio === 0) return 0;
  const duracionMilisegundos = Date.now() - tiempoInicio;
  tiempoInicio = 0;
  return duracionMilisegundos / 1000;
}
function empezarTempFila() {
  clearTimeout(contadorFila);
  clearInterval(contadorVisual);
  segundosRestantes = LIMITE_TIEMPO_MS / 1000;
  Temporizador.innerHTML = segundosRestantes;
  Temporizador.style.color = "white";
  contadorFila = setTimeout(tiempoDeIntentoAgotado, LIMITE_TIEMPO_MS);
  contadorVisual = setInterval(() => {
    segundosRestantes--;
    Temporizador.innerHTML = segundosRestantes;
    if (segundosRestantes <= 10) Temporizador.style.color = "red";
  }, 1000);
}
function tiempoDeIntentoAgotado() {
  clearInterval(contadorVisual);
  if (juegoTerminado) return;
  mostrarAviso("Se agotó el tiempo.", 1000, () => {
    if (i1 === fila - 1) finDelJuego(false);
    else { i1++; j1 = 0; empezarTempFila(); }
  });
}
function cambiarPosicion(i, j) {
  if (juegoTerminado || j1 >= columna) return;
  añadirLetra(document.getElementById(`Letra${i}${j}`).innerHTML);
}
function tecladoFisico(event) {
  if (juegoTerminado) return;
  if (event.key === "Backspace") return borrarLetra();
  if (/^[a-zA-ZñÑ]$/.test(event.key)) return añadirLetra(event.key.toUpperCase());
}
function seleccionarCelda(i, j) {
  if (juegoTerminado) return;
  if (i !== i1) return window.alert("Solo puedes editar la fila actual.");
  document.getElementById(`celda${i}${j}`).innerHTML = "";
  j1 = j;
}
function añadirLetra(letra) {
  if (juegoTerminado || j1 >= columna) return;
  document.getElementById(`celda${i1}${j1}`).innerHTML = letra.toUpperCase();
  j1++;
  if (j1 === columna) {
    clearTimeout(contadorFila);
    clearInterval(contadorVisual);
    juegoTerminado = true;
    setTimeout(comprobarFila, 100);
  }
}
function borrarLetra() {
  if (juegoTerminado || j1 <= 0) return;
  j1--;
  document.getElementById(`celda${i1}${j1}`).innerHTML = "";
}
async function comprobarFila() {
  let palabraUsuario = "";
  for (let j = 0; j < columna; j++) palabraUsuario += document.getElementById(`celda${i1}${j}`).innerHTML;
  const esValida = await verificarPalabra(palabraUsuario);
  if (!esValida) {
    mostrarAviso("Palabra no válida. Pierdes el turno.", 2000, () => {
      if (i1 === fila - 1) finDelJuego(false);
      else { i1++; j1 = 0; juegoTerminado = false; empezarTempFila(); }
    });
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
    setTimeout(() => document.getElementById(`celda${i1}${j}`).classList.add(estados[j]), j * 300);
    actualizarTeclado(palabraUsuario[j], estados[j]);
  }
  const duracionTotalAnimacion = (columna - 1) * 300 + 500;
  setTimeout(() => {
    if (palabraUsuario === secreta) return gestionarVictoria();
    if (i1 === fila - 1) return finDelJuego(false);
    i1++; j1 = 0; juegoTerminado = false; empezarTempFila();
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
  const classes = teclaElement.classList;
  if (estado === "acierto") {
    classes.remove("malColocada", "fallo");
    classes.add("acierto");
  } else if (estado === "malColocada" && !classes.contains("acierto")) {
    classes.remove("fallo");
    classes.add("malColocada");
  } else if (estado === "fallo" && !classes.contains("acierto") && !classes.contains("malColocada")) {
    classes.add("fallo");
  }
}
function finDelJuego(esVictoria) {
  juegoTerminado = true;
  clearTimeout(contadorFila);
  clearInterval(contadorVisual);
  clearInterval(contadorGeneral);
  teclado.classList.add("deshabilitado");
  textoFinal.classList.remove("aviso");
  if (esVictoria) {
    textoVictoriaDerrota.innerHTML = "Has ganado, Felicidades!!";
    tiempoFinalUsuario();
  } else {
    textoVictoriaDerrota.innerHTML = `Has perdido, vuelve a intentarlo. La palabra secreta era ${secreta}`;
  }
}
function mostrarAviso(mensaje, duracion, callback) {
  textoFinal.classList.add("aviso");
  textoFinal.innerHTML = mensaje;
  setTimeout(() => {
    textoFinal.innerHTML = "";
    textoFinal.classList.remove("aviso");
    if (callback) callback();
  }, duracion);
}
function gestionarVictoria() {
  const tiempoEnSegundos = tiempoFinalUsuario();
  const puntuacionBase = 1000 - tiempoEnSegundos * 10;
  const puntuacionFinal = Math.max(100, Math.floor(puntuacionBase));
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
  fetch("/actualizar-puntuacion", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
    body: JSON.stringify({ score: puntuacionFinal }),
  })
  .then(respuesta => { if (!respuesta.ok) console.error("Error al guardar la puntuación."); })
  .catch(error => console.error("Error de red:", error));
  finDelJuego(true);
}
async function obtenerPalabraSecreta() {
  try {
    const respuesta = await fetch("/palabrasRandom/1");
    const contenido = await respuesta.json();
    secreta = contenido[0].toUpperCase();
  } catch (error) {
    console.error("Error al obtener la palabra: ", error);
    secreta = "ERROR";
  }
}
async function verificarPalabra(palabra) {
  palabra = palabra.toUpperCase();
  if (window.DICCIONARIO && window.DICCIONARIO.includes(palabra)) return true;
  try {
    const palabraCodificada = encodeURIComponent(palabra.toLowerCase());
    const respuesta = await fetch(`/verificarPalabra/${palabraCodificada}`);
    const data = await respuesta.json();
    return !!(data.existe || data.exists || data.found);
  } catch (error) {
    return false;
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  await obtenerPalabraSecreta();
  empezarContadorTiempo();
  empezarTempFila();
  document.addEventListener("keydown", tecladoFisico);
});