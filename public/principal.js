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
    var BRAID_CorriendoDer = new Image();
    BRAID_CorriendoDer.src = "img/braid_corriendoDer.png";
    var BRAID_CorriendoIzq = new Image();
    BRAID_CorriendoIzq.src = "img/braid_corriendoIzq.png";
    var BRAID_ParadoDer = new Image();
    BRAID_ParadoDer.src = "img/braid_paradoDer.png";
    var BRAID_subir = new Image();
    BRAID_subir.src = "img/braid_subir.png";
    var Bala_explocion = new Image();
    Bala_explocion.src = "img/fireball.gif";

    var Bala_Misil = new Image();
    Bala_Misil.src = 'img/misil.png'

    SOCKET.on('crear_player', player => {
        console.log('entrando en CrearPlayer' + player.guerrero.id);
        MIPLAYER = player.guerrero;
    });
    SOCKET.on('draw_player', data => {
        JUGADORES = data.enemigos;
    });
    SOCKET.on('enemigo_creado', data => {
        //JUGADORES.push(data.enemigo);
        console.log('enemigo creado + ' + data.enemigo.id);
    });
    function inicializar() {
    }
    function dibujar() {
        // fondo
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 800, 600);
        controladorEstados.dibujar();
    }

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
            this.guerrero = new Player(MIPLAYER.id, MIPLAYER.x, MIPLAYER.y , MIPLAYER.dx , MIPLAYER.dy, MIPLAYER.ancho, MIPLAYER.alto);
            this.otrosJugadores = []; 
        }
        actualizar(delta) {
            JUGADORES.forEach(elem =>{

            })
            this.guerrero.actualizar(delta);

        }
        dibujar() {
            ctx.fillStyle = 'Red';
            ctx.font = 'italic 60pt Calibri';
            JUGADORES.forEach(elem => {
               if(elem.id != MIPLAYER.id){
                    ctx.fillRect(elem.x,elem.y,elem.ancho,elem.alto);
                }
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
                this.guerrero.dispararFuego();
            }
            if (TECLA_C === e.keyCode) {
                this.guerrero.dispararMisil();
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

        constructor(x, y, dx, dy, ancho, alto) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
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

        constructor(id, x, y,dx,dy ,ancho,alto) {
            super(x, y, dx, dy, ancho, alto);
            this.PARADO = 0
            this.CORRIENDO_DER = 1
            this.CORRIENDO_IZQ = 2
            this.SUBIENDO = 3
            this.BAJANDO = 4
            this.estadoAnimacion = this.PARADO;
            this.balas = [];
            this.id = id;
            this.estado = 'vivo';
            this.nroBalas = 0;
            this.anchoSprite = BRAID_ParadoDer.width / 9;
            this.altoSprite = BRAID_ParadoDer.height / 3;
            this.spritesPlayer = {
                paradoDer: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }
                    , { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 }
                    , { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
                corriendoDer: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }
                    , { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 }
                    , { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }],
                subir: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }]
            };

            this.animacion = new Animacion();
            this.animacion.setFrames(this.spritesPlayer.paradoDer);
            this.animacion.setDelay(10);
            this.braid = {
                img: BRAID_ParadoDer,
                x: this.animacion.getFrame.x * this.anchoSprite,
                y: this.animacion.getFrame.y * this.altoSprite,
                ancho: this.anchoSprite,
                alto: this.altoSprite
            };

        }
        getId() {
            return this.id;
        }

        dispararFuego() {
            var bolaFuego = 0;
            var bala = new Bala(this.x + this.ancho, this.y + (this.alto / 2), bolaFuego);
            this.balas.push(bala);
        }
        dispararMisil() {
            var misil = 1;
            var bala = new Bala(this.x + this.ancho, this.y + (this.alto / 2), misil);
            this.balas.push(bala);
        }
        dibujar() {
            this.balas.forEach(bala => {
                bala.dibujar();
            });
            this.braid.x = this.animacion.getFrame.x * this.anchoSprite
            this.braid.y = this.animacion.getFrame.y * this.altoSprite
            this.braid.ancho = this.anchoSprite
            this.braid.alto = this.altoSprite


            ctx.fillStyle = 'Red';
            ctx.drawImage(this.braid.img, this.braid.x, this.braid.y, this.braid.ancho, this.braid.alto, this.x, this.y, this.ancho, this.alto)
            //ctx.fillRect(this.x, this.y, this.ancho, this.alto);
        }

        actualizarPocision() {

            if (this.derecha) {
                this.dx = 1;
            }
            else if (this.izquierda) {
                this.dx = -1;
            }
            else if (this.subir) {
                this.dy = -1;
            }
            else if (this.bajar) {
                this.dy = 1;
            } else {
                this.dx = 0, this.dy = 0

            }
        }

        actualizar(delta) {

            this.actualizarPocision();

            if (this.derecha) {
                this.x = this.x + this.dx;

                if (this.estadoAnimacion != this.CORRIENDO_DER) {
                    this.estadoAnimacion = this.CORRIENDO_DER
                    this.ancho = 130;
                    this.altoSprite = BRAID_CorriendoDer.height / 3
                    this.anchoSprite = BRAID_CorriendoDer.width / 9
                    this.braid.img = BRAID_CorriendoDer
                    this.animacion.setFrames(this.spritesPlayer.corriendoDer);
                    this.animacion.setDelay(10);
                }
            }
            else if (this.izquierda) {
                this.x = this.x + this.dx;

                if (this.estadoAnimacion != this.CORRIENDO_IZQ) {
                    this.estadoAnimacion = this.CORRIENDO_IZQ
                    this.ancho = 130;
                    this.altoSprite = BRAID_CorriendoDer.height / 3
                    this.anchoSprite = BRAID_CorriendoDer.width / 9
                    this.braid.img = BRAID_CorriendoDer
                    this.animacion.setFrames(this.spritesPlayer.corriendoDer);
                    this.animacion.setDelay(10);
                }
            }
            else if (this.subir) {
                this.y = this.y + this.dy;

                if (this.estadoAnimacion != this.SUBIENDO) {
                    this.estadoAnimacion = this.SUBIENDO
                    this.ancho = 100;
                    this.altoSprite = BRAID_subir.height / 1
                    this.anchoSprite = BRAID_subir.width / 8
                    this.braid.img = BRAID_subir
                    this.animacion.setFrames(this.spritesPlayer.subir);
                    this.animacion.setDelay(100);
                }
            }
            else if (this.bajar) {
                this.y = this.y + this.dy;
                if (this.estadoAnimacion != this.BAJANDO) {
                    this.estadoAnimacion = this.BAJANDO
                    this.ancho = 100;
                    this.altoSprite = BRAID_subir.height / 1
                    this.anchoSprite = BRAID_subir.width / 8
                    this.braid.img = BRAID_subir
                    this.animacion.setFrames(this.spritesPlayer.subir);
                    this.animacion.setDelay(100);
                }
            } else {
                if (this.estadoAnimacion != this.PARADO) {
                    this.estadoAnimacion = this.PARADO
                    this.ancho = 95;
                    this.altoSprite = BRAID_ParadoDer.height / 3
                    this.anchoSprite = BRAID_ParadoDer.width / 9
                    this.braid.img = BRAID_ParadoDer
                    this.animacion.setFrames(this.spritesPlayer.paradoDer);
                    this.animacion.setDelay(10);
                }
            }
            console.log("balas : " + this.balas.length);
            this.balas.forEach((bala, i) => {
                bala.actualizar();
                if (bala.getX() > ANCHO) {
                    this.balas.splice(i, 1);
                    return;
                }
            });
            this.animacion.actualizar();
            SOCKET.emit('draw_player', { id: this.id, x: this.x, y: this.y ,dx : this.dx , dy : this.dy, ancho: this.ancho , alto : this.alto });

        }

    }
    class Bala extends ObjetoMapa {

        constructor(x, y, tipo) {
            super(x, y, 0, 0, 50, 50);
            this.derecha = true;
            this.BOLA_FUEGO = 0;
            this.MISIL = 1;
            this.bala = {};

            this.spritesBala = {
                bolaFuego: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }
                    //,{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1}
                ],
                misil: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
                { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }]
            }
            this.animacion = new Animacion();
            if (tipo == this.BOLA_FUEGO) {
                this.animacion.setFrames(this.spritesBala.bolaFuego)
                this.bala.img = Bala_explocion;
                this.anchoSprite = Bala_explocion.width / 4;
                this.altoSprite = Bala_explocion.height / 2;
            } else {
                this.animacion.setFrames(this.spritesBala.misil)
                this.bala.img = Bala_Misil;
                this.anchoSprite = Bala_Misil.width / 4;
                this.altoSprite = Bala_Misil.height / 2;
                this.ancho = 100;
            }
            this.animacion.setDelay(10);

        }
        getId() {
            return this.id;
        }

        actualizar(delta) {
            if (this.derecha) {
                this.x += 5;
            }
            this.bala.x = this.animacion.getFrame.x * this.anchoSprite
            this.bala.y = this.animacion.getFrame.y * this.altoSprite
            this.bala.ancho = this.anchoSprite
            this.bala.alto = this.altoSprite

            this.animacion.actualizar();
        }

        dibujar() {
            ctx.fillStyle = 'BLue';
            // ctx.fillRect(this.x, this.y, this.ancho, this.alto);

            ctx.drawImage(this.bala.img, this.bala.x, this.bala.y, this.bala.ancho, this.bala.alto, this.x, this.y, this.ancho, this.alto)
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
        setFrames(framesNuevos) {
            this.frames = framesNuevos;
            this.contadorFrame = 0;
            this.startTime = Date.now();
            this.playedOnce = false;
        }
        setDelay(d) { this.delay = d; }
        setFrame(i) { currentFrame = i; }
        actualizar() {
            if (this.delay == -1) { return };

            var lapso = (Date.now() - this.startTime);


            if (lapso > this.delay) {
                this.contadorFrame++;
                this.startTime = Date.now();

            }
            if (this.contadorFrame == this.frames.length) {
                this.contadorFrame = 0;
                this.playedOnce = true;
            }

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


