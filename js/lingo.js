const secreta = "LINGO";
let fila = 5;
let columna = 5;
const contenedor = document.getElementById("tabla");
//Imprimir tabla en pantalla
let sHTML = `<table class="tablero">`;
for (i = 0; i < fila; i++) {
  sHTML += `<tr>`;
  for (j = 0; j < columna; j++) {
    sHTML += `
                    <td>
                        <img id="Num${i}${j}" 
                             src="/img/Numeros/n0.gif">
                    </td>
                    `;
  }
  sHTML += `</tr>`;
}
//Imprimir teclado en pantalla
sHTML += `</table>`;
contenedor.innerHTML = sHTML;

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

let tHTML = `<table>`;
for (let i = 0; i < teclas.length - 1; i++) {
  tHTML += `<tr>`;
  for (let j = 0; j < teclas[i].length; j++) {
    const letra = teclas[i][j];
    tHTML += `<td id="Letra${i}${j}" class="tecla-letra" onclick="cambiarPosicion('${letra}')">${letra} </td>`;
  }
  tHTML += "</tr>";
}

const ultimaFilaLetras = teclas[teclas.length - 1];
tHTML += `<tr class=fila-botones>`;
tHTML += `<td id="EnterBtn" class="tecla-especial tecla-enter" onclick="accionEnter()">${BTN_ENTER}</td>`;

for (let j = 0; j < ultimaFilaLetras.length; j++) {
  const letra = ultimaFilaLetras[j];
  tHTML += `<td id="LetraUltima${j}" class="tecla-letra" onclick="cambiarPosicion('${letra}')">${letra}</td>`;
}
tHTML += `<td id="DelBtn" class="tecla-especial tecla-del" onclick="accionDel()">${BTN_DEL}</td>`;
tHTML += `</tr>`;
tHTML += `</table>`;
teclado.innerHTML = tHTML;

function cambiarPosicion(i, j) {
  let posicionCambio = document.getElementById(`Num${i1}${j1}`);
  let letra = document.getElementById(`Letra${i}${j}`);
  if (posicionCambio.src == "http://127.0.0.1:5500/Numeros/n0.gif") {
    posicionCambio.src = letra.src;
    j1 += 1;
    if (j1 >= columna) {
      i1 += 1;
      j1 = 0;
    }
  } else {
    posicionCambio = document.getElementById(`Num${i1}${j1}`);
    posicionCambio.src = letra.src;
    j1 += 1;
  }

  console.log(posicionCambio.src);
}
