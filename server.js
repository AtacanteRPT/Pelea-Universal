var express = require('express'),
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');
var server = http.createServer(app);
var io = socketIo.listen(server);
server.listen(process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
console.log("Server running on http://127.0.0.1:3000");

var player_history = [];
var contId = 0;

io.on('connection', function (socket) {
    var player = {
        id: contId,
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        derecha: false,
        izquierda: false,
        subir: false,
        bajar: false,
        balas: [],
        alto: 150,
        ancho: 95
    }
    player_history.push(player);
    socket.emit('crear_player', { guerrero: player });
    io.emit('enemigo_creado', { enemigos: player_history });
    contId++;

    console.log('player Creado' + player.id);
    // for (var i in player_history) {
    //     socket.emit('otros_player', { enemigos: player_history[i] });
    // }

    socket.on('draw_player', function (data) {
        player_history[data.id] = data;
        io.emit('draw_player', { enemigos: player_history });
    });
});


