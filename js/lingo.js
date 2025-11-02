const secreta = "LINGO";
let fila = 5;
let columna = 5;
let contador = 0;
const contenedor = document.getElementById("tabla");
//Imprimir tabla en pantalla
let dHTML = `<div class="main-content">`;
dHTML += `<div class="tablero">`
for (let i = 0; i < fila; i++) {
  for (let j = 0; j < columna; j++){
    dHTML += `<div class="Celda" id="celda${i}${j}"></div>`;
    contador++;
  }
}
dHTML += `</div>`;
dHTML += `</div>`;
contenedor.innerHTML = dHTML;

let teclas = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];
const BTN_ENTER = "ENTER";
const BTN_DEL = "DEL";
let filasT = 3;
let columnasT = 10;
let i1 = 0;
let j1 = 0;
const teclado = document.getElementById("teclado");

let pHTML = ``; // Empezamos el string vacío

// Bucle para las filas 0 y 1 (Q... y A...)
for (let i = 0; i < teclas.length - 1; i++) {
  // CAMBIO 1: Faltaba el ">" para cerrar la etiqueta div
  pHTML += `<div class="teclado-fila fila-${i}">`; 
  
  // CAMBIO 2: El bucle interno debe ser sobre la longitud de la fila actual (teclas[i].length)
  for (let j = 0; j < teclas[i].length; j++) { 
    const letra = teclas[i][j];
    
    // CAMBIO 3: La función onclick debe pasar los índices (i, j), no la letra.
    pHTML +=`<div id="Letra${i}${j}" class="tecla tecla-letra" onclick="cambiarPosicion(${i}, ${j})">${letra}</div>`;
  }
  pHTML += `</div>`; // Cerrar el div de la fila
}

// --- Fila especial (ENTER, Z-M, DEL) ---
const ultimaFilaLetras = teclas[teclas.length - 1];
const i = teclas.length - 1; // El índice de la última fila (será 2)

pHTML += `<div class="teclado-fila fila-2">`;

// CAMBIO 4: Has usado <td> para ENTER, debe ser <div>
pHTML += `<div id="EnterBtn" class="tecla tecla-especial tecla-enter" onclick="accionEnter()">${BTN_ENTER}</div>`;

// Bucle para las letras de la última fila (Z-M)
for (let j = 0; j < ultimaFilaLetras.length; j++){
  const letra = ultimaFilaLetras[j];
  
  // CAMBIO 5: Estandarizar el ID y el onclick para que coincida con la función cambiarPosicion
  pHTML += `<div id="Letra${i}${j}" class="tecla tecla-letra" onclick="cambiarPosicion(${i}, ${j})">${letra}</div>`;
}

pHTML += `<div id="DelBtn" class="tecla tecla-especial tecla-del" onclick="accionDel()">${BTN_DEL}</div>`;
pHTML += `</div>`; // Cerrar el div de la última fila

teclado.innerHTML = pHTML



function cambiarPosicion(i, j) {
    
    // 1. Primero, comprobamos si la fila actual ya está llena
    // Si j1 es 5 o más, no escribimos más (el usuario debe borrar o pulsar ENTER)
    if (j1 >= columna) {
        console.log("Fila llena. Pulsa ENTER o DEL.");
        return; // Salimos de la función
    }
    
    // 2. Obtenemos el elemento 'div' de la tecla que se pulsó
    let teclaPulsada = document.getElementById(`Letra${i}${j}`);
    
    // 3. Obtenemos la letra (el texto) de dentro de esa tecla
    let letra = teclaPulsada.innerHTML; // Ej: "Q", "A", "Z"
    
    // 4. Obtenemos la celda del tablero donde queremos escribir
    // Usamos i1 (fila actual) y j1 (columna actual)
    let celdaObjetivo = document.getElementById(`celda${i1}${j1}`);
    
    // 5. ¡AQUÍ LA MAGIA! Ponemos la letra dentro de la celda
    // Usamos .innerHTML para asignar el texto
    celdaObjetivo.innerHTML = letra;
    
    // 6. Avanzamos el cursor a la siguiente columna
    j1++; // Ahora j1 valdrá 1, luego 2, etc.
}

function botonDEL() {
  if (j1 > 0){
      j1--;
      let celdaObjetivo = document.getElementById(`celda${i}${j}`);
      celdaObjetivo.innerHTML = "";
  }
}
function finDelJuego() {
  teclado.classList.add = "deshabilitado";
}
function botonEnter() {
  let acertada = false;
  let texto = document.getElementById("textoFinal");
  if (acertada == false) {
      i1++;
      j1 = 0;
      if (i1 >= fila) {
        texto.innerHTML = "Has perdido. Vuelve a intentarlo."
          finDelJuego();
      }
  }
}