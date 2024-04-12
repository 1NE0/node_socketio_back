const express = require('express');
const { createServer, get } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Player = require('./models/Player');
const GameGeneral = require('./models/Game');


const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS
app.use(cors());
app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
    res.setHeader("Access-Control-Max-Age", 7200);
  
    next();
  });

app.get('/', (req, res) => res.send('Hello World!'));

// Inicialización de Socket.IO
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


const gm = new GameGeneral();



io.on('connection', (socket) => {
    console.log('a user connected socket: ', socket.id);
    const newPlayer = new Player(socket.id, null , null , null);
    gm.addUser(newPlayer);
    socket.emit('put ID', {id: newPlayer.id , users: gm.getUsersJson()});

    
    socket.on('chat message', ({message, playerId}) => {

        console.log(message, playerId);
        socket.broadcast.emit('message recept', {message, playerId});
    });

    socket.on('user joined', (msg) => {
        //console.log("mensaje llegó al servidor : " + msg);
        const newPlayer = new Player(socket.id, msg["nombre"] , msg["pos_x"] , msg["pos_y"]);
        gm.addUser(newPlayer);
        
        console.log(gm.getUsers());
        //io.emit('response server', msg);
        socket.broadcast.emit("user joined recept", newPlayer);
    });

    socket.on('user moved', ({ playerId, pos, dir }) => {
        const player = gm.getUser(playerId);
        player.pos_x = pos.x;
        player.pos_y = pos.y;
        player.dir = dir;
        // Difundir información de movimiento a todos los demás usuarios conectados
        socket.broadcast.emit('user moved recept', { playerId, pos, dir });
    })

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        // Eliminar jugador del estado del juego al desconectarse
        gm.removeUser(socket.id);
        // Difundir a todos los clientes que un jugador se desconectó
        io.emit('playerDisconnected', socket.id);
      });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});