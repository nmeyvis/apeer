const express = require("express");
const Jwt = require("../Jwt.js");
const crypto = require("crypto");

const bodyParser = require("body-parser");

module.exports = function(serverFactory, CLIENT_DIST, rooms, io) {
    let app = express();
    app.use(bodyParser.json());

    app.get("/", (req, resp) => {
        resp.redirect("/" + newRoomId());
    });

    app.get("/:id", (req, resp) => {
        sendStatic(resp, "app.html");
    });

    app.post("/:id/:method", (req, resp) => {
        console.log("got request for: " + req.originalUrl);

        let roomId = req.params.id;
        let methodName = req.params.method;
        let token = req.header("Authorization");

        let clientId;

        try {
            clientId = Jwt.verify(token).clientId;
        } catch(e) {
            resp.status(401).end();
            return;
        }

        console.log("from clientId " + clientId);
        let room = rooms.getRoom(roomId);

        if(room == null) {
            resp.end("no room found");
            return;
        }

        let method = room.methods(clientId)[methodName];

        if(method == null) {
            resp.end("You don't have access to that method");
            return;
        }

        method(req.body);

        io.to(roomId).emit("room", room);

        resp.end();
    });

    function sendStatic(resp, filename) {
        resp.sendFile(filename, { root : __dirname + "/" + CLIENT_DIST});
    }

    return serverFactory.createServer(app);
};

function newRoomId() {
    return crypto.randomBytes(32).toString("hex");
}