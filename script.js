let turno = 0;
let puntosUser1 = 0; 
let puntosUser2 = 0; 
let juegoIniciado = false;
let temporizador;
let tiempoRestante;
let tiempoTurno = 30;
let modoExtremo = false;

function crearTabla(n) {
    const tabla = document.createElement("table");
    for (let i = 0; i < n; i++) {
        const fila = document.createElement("tr");
        for (let j = 0; j < n; j++) {
            const celda = document.createElement("td");
            celda.dataset.fila = i;
            celda.dataset.columna = j;
            celda.style.backgroundColor = "white";
            celda.addEventListener("click", () => pintarCelda(celda));
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }
    return tabla;
}

function estaRodeada(celda, color, tabla) {
    const fila = celda.fila;
    const col = celda.columna;
    let vecinos = [];
    const todasCeldas = tabla.getElementsByTagName("td");
    for (let c of todasCeldas) {
        if (c.fila === fila && c.columna === col-1) vecinos.push(c); //Izquierda
        if (c.fila === fila && c.columna === col+1) vecinos.push(c); //Derecha
        if (c.fila === fila-1 && c.columna === col) vecinos.push(c); //Arriba
        if (c.fila === fila+1 && c.columna === col) vecinos.push(c); //Abajo
    }
    //Verificar si esta rodea
    const izq = vecinos.find(v => v.columna === col-1);
    const der = vecinos.find(v => v.columna === col+1);
    const arr = vecinos.find(v => v.fila === fila-1);
    const aba = vecinos.find(v => v.fila === fila+1);
    return (izq && der && izq.style.backgroundColor === color && der.style.backgroundColor === color) ||
           (arr && aba && arr.style.backgroundColor === color && aba.style.backgroundColor === color);
}

function pintarCelda(celda) {
    if (!juegoIniciado || celda.style.backgroundColor !== "white") return;
    const colorJugador1 = document.getElementById("colorJugador1").value;
    const colorJugador2 = document.getElementById("colorJugador2").value;
    const tabla = celda.closest("table");

    if (turno % 2 === 0) {
        celda.style.backgroundColor = colorJugador1;
        puntosUser1++;  
        const celdasAzules = tabla.querySelectorAll("td");
        for (let c of celdasAzules) {
            if (c.style.backgroundColor === colorJugador2 && estaRodeada(c, colorJugador1, tabla)) {
                c.style.backgroundColor = colorJugador1;
                puntosUser1++;  
                puntosUser2--;

                if (document.getElementById("sonido").checked) {
                    fxSound.play();
                }
            }
        }
        
        document.getElementById("puntosUser1").textContent = puntosUser1;
    } else {
        celda.style.backgroundColor = colorJugador2;
        puntosUser2++; 
        const celdasRojas = tabla.querySelectorAll("td");
        for (let c of celdasRojas) {
            if (c.style.backgroundColor === colorJugador1 && estaRodeada(c, colorJugador2, tabla)) {
                c.style.backgroundColor = colorJugador2;
                puntosUser2++; 
                puntosUser1--;

                if (document.getElementById("sonido").checked) {
                    fxSound.play();
                }
            }
        }
        
        document.getElementById("puntosUser2").textContent = puntosUser2;
    }
    document.getElementById("puntosUser1").textContent = puntosUser1;
    document.getElementById("puntosUser2").textContent = puntosUser2;
    verificarFinJuego(tabla);
    turno++;
    document.getElementById("turno").textContent = turno;
    clearInterval(temporizador);
    iniciarTemporizador();
}


function verificarFinJuego(tabla) {
    const celdas = tabla.getElementsByTagName("td");
    const celdasBlancas = Array.from(celdas).filter(c => c.style.backgroundColor === "white");
    const mensajeElement = document.querySelector(".mensaje");
    
    if (celdasBlancas.length === 0) {
        clearInterval(temporizador);
        const mensajeTexto = document.getElementById("mensaje-victoria");
        if (puntosUser1 > puntosUser2) {
            mensajeTexto.textContent = `¡${document.getElementById("nombreUsuario1").textContent} gana!`;
        } else if (puntosUser2 > puntosUser1) {
            mensajeTexto.textContent = `¡${document.getElementById("nombreUsuario2").textContent} gana!`;
        } else {
            mensajeTexto.textContent = "¡Empate!";
        }
        mensajeElement.hidden = false;
        juegoIniciado = false;
    }
}

function actualizarTiempoDisplay() {
    if (tiempoTurno <= 0) return;
    document.getElementById("tiempo").textContent = tiempoRestante;
    document.getElementById("tiempo").style.color = tiempoRestante <= 5 ? "red" : "black";
}

function pasarTurno() {
    if (tiempoTurno <= 0) return;
    turno++;
    document.getElementById("turno").textContent = turno;
    iniciarTemporizador();
}

function iniciarTemporizador() {
    clearInterval(temporizador);
    if (tiempoTurno <= 0) return;

    tiempoRestante = tiempoTurno;
    actualizarTiempoDisplay();

    temporizador = setInterval(() => {
        tiempoRestante--;
        actualizarTiempoDisplay();

        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            pasarTurno();
        }
    }, 1000);
}

//Sonido Captura
const fxSound = new Audio('./sound/FXSound.mp3');

//Musica
const backgroundMusic = new Audio('./sound/Musica.mp3');
backgroundMusic.loop = true;


document.addEventListener("DOMContentLoaded", () => {

    const $contenedorTabla = document.getElementById("contenedor-tabla");
    $tamañoLado = document.getElementById("lado")
    const $tabla = crearTabla($tamañoLado.value);
    $contenedorTabla.insertAdjacentElement("afterbegin", $tabla)
    document.getElementById("turno").textContent = turno;   
    $tamañoLado.addEventListener("change", (event) => {
        const tabla = crearTabla(event.target.value);
        //Para borrar la tabla anterior
        $contenedorTabla.innerHTML = "";
        $contenedorTabla.prepend(tabla);
    });
    
    //Cambiar nombre
    document.getElementById("usuario1").addEventListener("input", (event) => {
        document.getElementById("nombreUsuario1").textContent = event.target.value || "Jugador 1";
    });
    
    document.getElementById("usuario2").addEventListener("input", (event) => {
        document.getElementById("nombreUsuario2").textContent = event.target.value || "Jugador 2";
    });

    //Musica
    const musicCheckbox = document.getElementById("musica");
    musicCheckbox.addEventListener("change", (event) => {
        if (event.target.checked) {
            backgroundMusic.play();
        } else {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
     });

    //Cambiar color del tablero
    document.getElementById("color").addEventListener("input", (event) => {
        const color = event.target.value || "#ffffff";
        document.getElementById("contenedor-tabla").style.backgroundColor = color;
    });

    //Cambiar color Nombre Jugador 1
    document.getElementById("colorJugador1").addEventListener("input", (event) => {
        const color = event.target.value || "#ff0000";
        document.getElementById("nombreUsuario1").style.color = color;
    });

    //Cambiar color Nombre Jugador 2
    document.getElementById("colorJugador2").addEventListener("input", (event) => {
        const color = event.target.value || "#0000ff";
        document.getElementById("nombreUsuario2").style.color = color;
    });

    //Apartado Instruciones
    document.querySelector(".fa-circle-info").addEventListener("click", () => {
        const instrucciones = document.querySelector(".instrucciones");
        instrucciones.style.display = instrucciones.style.display === "none" ? "block" : "none";
    });
    
    //Apartado Configuración
    document.querySelector(".fa-gear").addEventListener("click", () => {
        const configuracion = document.querySelector(".configuración");
        configuracion.style.display = configuracion.style.display === "none" ? "flex" : "none";
    });

    //Botón Iniciar
    document.querySelector("input[value='Iniciar']").addEventListener("click", () => {
        juegoIniciado = true;
        tiempoTurno = parseInt(document.getElementById("tiempo-config").value);
        document.getElementById("tiempo").textContent = tiempoTurno;
        if (tiempoTurno > 0) iniciarTemporizador();
        document.querySelector(".configuración").style.display = "none";
        document.querySelector("input[value='Iniciar']").style.display = "none";
        document.querySelector(".fa-gear").style.display = "none";
        document.querySelectorAll("#colorJugador1, #colorJugador2, label[for='colorJugador1'], label[for='colorJugador2']").forEach(elemento => elemento.style.display = "none");
    });

    //Botón Reiniciar 
    document.querySelector("input[value='Reiniciar']").addEventListener("click", () => {
        clearInterval(temporizador);
        document.getElementById("tiempo").textContent = "30";
        document.querySelectorAll(".configuración input, .configuración select").forEach(element => {
            element.disabled = false;
        });
        location.reload();
    });

    //Reiniciar mensaje victoria
    document.getElementById("reiniciar-mensaje").addEventListener("click", () => {
        document.querySelector(".fondo-oscuro")?.remove();
        document.querySelector(".mensaje").hidden = true;
        location.reload();
    });

    //Cambiar tiempo al turno
    document.getElementById("tiempo-config").addEventListener("change", (e) => {
        if (!juegoIniciado) {
            document.getElementById("tiempo").textContent = e.target.value;
        }
    }); 

    document.getElementById("modoNormal").addEventListener("click", () => modoExtremo = false);
    document.getElementById("modoExtremo").addEventListener("click", () => modoExtremo = true);

});

/*Jonathan Valladares Hernández*/