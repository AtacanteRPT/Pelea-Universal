document.addEventListener("DOMContentLoaded", function () {
    var c = document.getElementById("miCanvas");
    var ctx = c.getContext("2d");
    var SOCKET = io();
    var TECLA_ARRIBA = 38,
        TECLA_ABAJO = 40,
        TECLA_DERECHA = 39,
        TECLA_IZQUIERDA = 37,
        TECLA_F = 70,
        TECLA_C = 67,
        TECLA_ENTER = 13;
    window.addEventListener("keydown", tecladoPulsado, false);
    // window.addEventListener("keypress", teclado, false);
    window.addEventListener("keyup", tecladoSoltado, false);

    var ANCHO = 800;
    var ALTO = 600;

    var MIPLAYER;
    var JUGADORES = [];
    var BRAID_Corriendo = new Image();
    BRAID_Corriendo.src = "img/braid_corriendo.png";
    var BRAID_Parado = new Image();
    BRAID_Parado.src = "img/braid_parado.png";
    var BRAID_subir = new Image();
    BRAID_subir.src = "img/braid_subir.png";

    SOCKET.on('crear_player', player => {
        console.log('entrando en CrearPlayer' + player.id);
        MIPLAYER = player.guerrero;
    });

    function inicializar() {
    }
    function dibujar() {
        // fondo
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 800, 600);
        controladorEstados.dibujar();
    }

    SOCKET.on('draw_player', data => {

        JUGADORES = data.enemigos;
    });
    function actualizar(delta) {
        controladorEstados.actualizar(delta);
    }
    function tecladoPulsado(e) {
        controladorEstados.tecladoPulsado(e);
    }
    function tecladoSoltado(e) {
        controladorEstados.tecladoSoltado(e);
    }

    // Controlador de Estados
    class ControladorEstados {
        constructor() {
            this.MENU = 0;
            this.LEVEL1 = 1;
            this.GAMEOVER = 2;
            this.estadoActual = 0;
            this.estados = [];
            this.menu = new Menu(this);
            this.estados.push(this.menu);
        }

        destruirEstado(estado) {
            this.estados.shift();
        }

        cambiarEstado(nuevoEstado) {
            this.destruirEstado(this.estadoActual);
            this.cargarEstado(nuevoEstado);
        }

        cargarEstado(nuevoEstado) {
            if (nuevoEstado === this.MENU) {
                this.estados[0] = new Menu(this);
            }
            if (nuevoEstado === this.LEVEL1) {
                this.estados[0] = new Level1(this);
            }
            if (nuevoEstado === 2) {
                this.estados[0] = new Otro(this);
            }
        }
        actualizar(delta) {
            //this.menu.actualizar(delta);
            this.estados[this.estadoActual].actualizar(delta);
        }
        dibujar() {
            this.estados[this.estadoActual].dibujar();
            //this.menu.dibujar();
        }
        tecladoPulsado(e) {
            this.estados[this.estadoActual].tecladoPulsado(e);
        }
        tecladoSoltado(e) {
            this.estados[this.estadoActual].tecladoSoltado(e);
        }
    }
    class Menu {

        constructor(controladorEstado) {
            this.ce = controladorEstado;
        }

        mostrar() {

            console.log(estados)
        }

        actualizar(delta) {

        }

        dibujar() {
            ctx.fillStyle = 'Yellow';
            ctx.font = 'italic 60pt Calibri';
            ctx.fillText("Presiona Enter para jugar ", 150, 200);
        }

        tecladoPulsado(e) {
            if (TECLA_ARRIBA === e.keyCode) {
                console.log("Tecla presionada");
            }
            if (TECLA_ENTER == e.keyCode) {
                this.ce.cargarEstado(1);
            }
        }

        tecladoSoltado(e) {
            if (TECLA_ARRIBA === e.keyCode) {
                console.log("Tecla Soltado");
            }
        }
    }
    class Level1 {
        constructor(controladorEstado) {
            this.ce = controladorEstado;
            this.guerrero = new Player(MIPLAYER.id, MIPLAYER.x, MIPLAYER.y);
            this.otrosJugadores = [];

        }

        actualizar(delta) {
            this.guerrero.actualizar(delta);
            SOCKET.emit('draw_player', { id: this.guerrero.getId(), x: this.guerrero.getX(), y: this.guerrero.getY() });
        }
        dibujar() {
            ctx.fillStyle = 'Red';
            ctx.font = 'italic 60pt Calibri';
            JUGADORES.forEach(elem => {
                ctx.fillRect(elem.x, elem.y, 80, 100);
            });
            //  ctx.fillText("Juego Iniciado", 150, 200);
            // dibujar guerrero
            this.guerrero.dibujar();
            this.otrosJugadores = [];
        }

        tecladoPulsado(e) {
            if (TECLA_DERECHA === e.keyCode) {
                this.guerrero.setDerecha = true;
            }
            if (TECLA_IZQUIERDA === e.keyCode) {
                this.guerrero.setIzquierda = true;
            }
            if (TECLA_ARRIBA === e.keyCode) {
                this.guerrero.setSubir = true;
            }
            if (TECLA_ABAJO === e.keyCode) {
                this.guerrero.setBajar = true;
            }
            if (TECLA_F === e.keyCode) {
                this.guerrero.disparar();
            }
        }

        tecladoSoltado(e) {
            if (TECLA_DERECHA === e.keyCode) {
                this.guerrero.setDerecha = false;
            }
            if (TECLA_IZQUIERDA === e.keyCode) {
                this.guerrero.setIzquierda = false;
            }
            if (TECLA_ARRIBA === e.keyCode) {
                this.guerrero.setSubir = false;
            }
            if (TECLA_ABAJO === e.keyCode) {
                this.guerrero.setBajar = false;
            }
        }
    }
    class ObjetoMapa {

        constructor(x, y, ancho, alto) {
            this.x = x;
            this.y = y;
            this.ancho = ancho;
            this.alto = alto;

            this.derecha = false;
            this.izquierda = false;
            this.subir = false;
            this.bajar = false;
        }

        getX() {
            return this.x;
        }

        getY() {
            return this.y;
        }

        set setDerecha(action) {
            this.derecha = action;
        }

        set setIzquierda(action) {
            this.izquierda = action;
        }

        set setSubir(action) {
            this.subir = action;
        }

        set setBajar(action) {
            this.bajar = action;
        }
    }
    class Player extends ObjetoMapa {

        constructor(id, x, y) {
            super(x, y, 80, 100);
            this.PARADO = 0;
            this.CORRIENDO = 1;
            this.SUBIENDO = 2;

            this.balas = [];
            this.id = id;
            this.estado = 'vivo';
            this.nroBalas = 0;


            this.anchoSprite = BRAID_Corriendo.width / 9;
            this.altoSprite = BRAID_Corriendo.height / 3;
            this.spritesPlayer = {
                parado: {

                },
                corriendo: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }
                    , { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 }
                    , { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }]
            };
            this.animacion = new Animacion();
            this.animacion.setFrames(this.spritesPlayer.corriendo);
            this.animacion.setDelay(10);
            this.imgBraid = BRAID_Corriendo


        }
        getId() {
            return this.id;
        }

        disparar() {
            var bala = new Bala(this.x + this.ancho, this.y + (this.alto / 2));
            this.balas.push(bala);
        }
        dibujar() {
            this.balas.forEach(bala => {
                bala.dibujar();
            });
            this.braid = {
                img: this.imgBraid,
                x: this.animacion.getFrame.x * this.anchoSprite,
                y: this.animacion.getFrame.y * this.altoSprite,
                ancho: this.anchoSprite,
                alto: this.altoSprite
            };

            ctx.fillStyle = 'Red';
            ctx.drawImage(this.braid.img, this.braid.x, this.braid.y, this.braid.ancho, this.braid.alto, this.x, this.y, this.ancho, this.alto)
            //ctx.fillRect(this.x, this.y, this.ancho, this.alto);
        }

        actualizar(delta) {
            if (this.derecha) {
                this.x++;
            }
            if (this.izquierda) {
                this.x--;
            }
            if (this.subir) {
                this.y--;
            }
            if (this.bajar) {
                this.y++;
            }

            this.balas.forEach(bala => {
                bala.actualizar();
            });
            this.animacion.actualizar();

        }
    }
    class Bala extends ObjetoMapa {

        constructor(x, y) {
            super(x, y, 20, 20);
            this.derecha = true;
        }
        getId() {
            return this.id;
        }

        actualizar(delta) {
            if (this.derecha) {
                this.x += 5;

            }
        }

        dibujar() {
            ctx.fillStyle = 'BLue';
            ctx.fillRect(this.x, this.y, this.ancho, this.alto);
        }
    }

    class Animacion {

        constructor() {
            this.frames = [];
            this.contadorFrame = 0;
            this.startTime = 0;
            this.delay = 0;
            this.playedOnce = false;
        }
        setFrames(frames) {
            this.frames = frames;
            this.currentFrame = 0;
            this.startTime = Date.now();
            console.log('Date.now : ' + this.startTime)
            this.playedOnce = false;
        }
        setDelay(d) { this.delay = d; }
        setFrame(i) { currentFrame = i; }
        actualizar() {
            if (this.delay == -1) { return };

            var lapso = (Date.now() - this.startTime);
            console.log('lapso :  ' + lapso);

            if (lapso > this.delay) {
                 console.log('contador de frames ' + this.contadorFrame);
                console.log('Frame X :' + this.frames[this.contadorFrame].x);
                console.log('Frame Y :' + this.frames[this.contadorFrame].y);
                this.contadorFrame++;
                this.startTime = Date.now();
               
            }
            if (this.contadorFrame == this.frames.length) {
                this.contadorFrame = 0;
                this.playedOnce = true;
            }
            console.log("entrando en animacion");

        }
        get getFrame() { return this.frames[this.contadorFrame]; }
        hasPlayedOnce() { return this.playedOnce; }
    }
    var main = function () {
        var now = Date.now();
        var delta = now - then;

        actualizar(delta / 1000);
        dibujar();

        then = now;
    };
    var controladorEstados = new ControladorEstados();
    var then = Date.now();
    setInterval(main, 30);


});

