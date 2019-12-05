const express = require("express");
const socketio = require("socket.io");

const Jwt = require("../Jwt.js");
const User = require("../User.js");

module.exports = function(serverFactory, rooms) {
    let app = express();
    let server = serverFactory.createServer(app);
    let io = socketio(server);

    io.on("connection", (socket) => {
        let roomId = socket.handshake.query.roomId;
        let password = socket.handshake.query.password;
        let user = new User(socket);
        let clientId = user.clientId;

        user.network = rooms.networks.getNetworkOrCreate(user.ip);

        rooms.join({
            roomId,
            user,
            password,
            success: (room) => {

                socket.emit("self.join:success", {
                    roomId: roomId,
                    clientId: clientId,
                    secret: Jwt.sign({ clientId }),
                    network: user.network
                });

                socket.on("room.peer", peer => {
                    peer.ip = socket.handshake.address;
                    peer.clientId = clientId;

                    socket.to(roomId).emit("room.peer", peer);
                });

                socket.on("disconnect", (reason) => {
                    rooms.leave(roomId, user);

                    io.to(roomId).emit("room.peer:leave", { clientId });
                    io.to(roomId).emit("room", room);
                });

                socket.emit("room", room);
            },
            fail: (reason) => {
                socket.emit("self.join:failure", {
                    reason
                });

                socket.disconnect(true);
            }
        });
    });

    return {
        server,
        io
    };
};
