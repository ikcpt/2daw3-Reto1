let fila = 5, columna = 5;
const contenedor = document.getElementById("tabla"),
      teclado = document.getElementById("teclado"),
      Temporizador = document.getElementById("temporizador-fila"),
      temporizadorGeneral = document.getElementById("contador-general");
let textoFinal = document.getElementById("textoFinal"),
    textoVictoriaDerrota = document.getElementById("textoW/L");
let i1 = 0, j1 = 0, juegoTerminado = false, secreta = "";
let tiempoInicio = 0, contadorFila = null, contadorGeneral = null;
const LIMITE_TIEMPO_MS = 30000;
let segundosRestantes = 0, contadorVisual = null;
let teclas = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["Z", "X", "C", "V", "B", "N", "M"],
];

let dHTML = `<div class="main-content"><div class="tablero">`;
for (let i = 0; i < fila; i++) {
    for (let j = 0; j < columna; j++) {
        dHTML += `<div class="Celda" id="celda${i}${j}" onclick="seleccionarCelda(${i},${j})"></div>`;
    }
}
dHTML += `</div></div>`;
contenedor.innerHTML = dHTML;

let pHTML = ``;
teclas.forEach((filaTeclas, i) => {
    pHTML += `<div class="teclado-fila fila-${i}">`;
    if (i === teclas.length - 1) pHTML += `<div></div>`;
    filaTeclas.forEach((letra, j) => {
        pHTML += `<div id="Letra${i}${j}" class="tecla tecla-letra" onclick="cambiarPosicion(${i}, ${j})">${letra}</div>`;
    });
    if (i === teclas.length - 1) pHTML += `<div></div>`;
    pHTML += `</div>`;
});
teclado.innerHTML = pHTML;

function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${seg.toString().padStart(2, "0")}`;
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
    if (tiempoInicio === 0) return 0;
    const duracionMilisegundos = Date.now() - tiempoInicio;
    const duracionSegundos = duracionMilisegundos / 1000;
    console.log(`El jugador ha tardado ${duracionSegundos} segundos.`);
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
    if (juegoTerminado || j1 >= columna) return;
    let teclaPulsada = document.getElementById(`Letra${i}${j}`);
    añadirLetra(teclaPulsada.innerHTML);
}

function tecladoFisico(event) {
    if (juegoTerminado) return;
    const tecla = event.key;
    if (tecla === "Backspace") return borrarLetra();
    if (/^[a-zA-ZñÑ]$/.test(tecla)) return añadirLetra(tecla.toUpperCase());
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
    for (let j = 0; j < columna; j++) {
        palabraUsuario += document.getElementById(`celda${i1}${j}`).innerHTML;
    }
    const esValida = await verificarPalabraEnDB(palabraUsuario);
    if (!esValida) {
        textoFinal.classList.add("aviso");
        textoFinal.innerHTML = "Esa palabra no está en el diccionario.";
        setTimeout(() => {
            textoFinal.innerHTML = "";
            textoFinal.classList.remove("aviso");
        }, 2000);
        juegoTerminado = false;
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
        const estado = estados[j];
        setTimeout(() => celda.classList.add(estado), j * 300);
        actualizarTeclado(palabraUsuario[j], estado);
    }
    const duracionTotalAnimacion = (columna - 1) * 300 + 500;
    setTimeout(() => {
        if (palabraUsuario === secreta) {
            finDelJuego(true);
            const puntuacion = Math.max(100, Math.floor(1000 - tiempoFinalUsuario() * 10));
            fetch('/actualizar-puntuacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ score: puntuacion })
            });
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
        teclaElement.classList.remove("malColocada", "fallo");
        teclaElement.classList.add("acierto");
    } else if (estado === "malColocada" && !teclaElement.classList.contains("acierto")) {
        teclaElement.classList.remove("fallo");
        teclaElement.classList.add("malColocada");
    } else if (estado === "fallo" && !teclaElement.classList.contains("acierto") && !teclaElement.classList.contains("malColocada")) {
        teclaElement.classList.add("fallo");
    }
}

function finDelJuego(esVictoria) {
    juegoTerminado = true;
    clearTimeout(contadorFila);
    clearInterval(contadorVisual);
    clearInterval(contadorGeneral);
    document.getElementById("teclado").classList.add("deshabilitado");
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
        const contenido = await respuesta.json();
        secreta = contenido[0].toUpperCase();
        console.log("La palabra secreta es: ", secreta);
    } catch (error) {
        console.error("Error al obtener la palabra: ", error);
    }
}

async function verificarPalabraEnDB(palabra) {
    try {
        const respuesta = await fetch(`/verificarPalabra/${palabra}`);
        if (respuesta.status === 401) {
            console.error("Error de autenticación.");
            return false;
        }
        const data = await respuesta.json();
        return data.existe;
    } catch (error) {
        console.error("Error al verificar la palabra:", error);
        return false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    obtenerPalabraSecreta();
    empezarContadorTiempo();
    empezarTempFila();
    document.addEventListener("keydown", tecladoFisico);
});