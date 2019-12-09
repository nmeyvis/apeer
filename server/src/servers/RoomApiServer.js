const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

module.exports = function(serverFactory, rooms) {
    let app = express();
    app.use(cors());

    app.use(bodyParser.json());

    app.get("/api/rooms", (req, resp) => {
        resp.json(rooms.rooms).end();
    });

    app.get("/api/rooms/:id", (req, resp) => {
        let roomId = req.params.id;

        if(roomId == null) {
            resp.status(400).end();
            return;
        }

        let room = rooms.getRoom(roomId);

        if(room == null) {
            resp.status(404).end();
            return
        }

        resp.json(room).end();
    });

    app.post("/api/rooms/:id/verifyPassword", (req, resp) => {
        let room = findRoomFromRequest(req, resp);

        if(room == null) {
            return;
        }

        resp.json({
            matches: room.isPassword(req.body.password)
        }).end();
    });

    function findRoomFromRequest(req, resp) {
        let roomId = req.params.id;

        if(roomId == null) {
            resp.status(400).end();
            return null;
        }

        let room = rooms.getRoom(roomId);

        if(room == null) {
            resp.status(404).end();
            return null;
        }

        return room;
    }

    return serverFactory.createServer(app);
};




