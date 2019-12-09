const isProd = process.argv[2] === "prod";

const fs = require("fs");
const httpProxy = require("http-proxy");

const Rooms = require("./server/src/Rooms.js");
const rooms = new Rooms.Rooms();

const RoomApiServer = require("./server/src/servers/RoomApiServer.js");
const StaticFilesServer = require("./server/src/servers/StaticFilesServer.js");
const PublicRoomsApiServer = require("./server/src/servers/PublicRoomsApiServer.js");
const SocketServer = require("./server/src/servers/SocketServer.js");
const Tracker = require("./server/src/servers/TrackerServer.js");

const WebServerFactory = require("./server/src/WebServerFactory.js");

let serverFactory = new WebServerFactory({
    key: fs.readFileSync("./certs/privkey.pem", "utf8"),
    cert: fs.readFileSync("./certs/cert.pem", "utf8"),
    secure: false
});

let appPort = 8080;

if(isProd) {
    appPort = 80;
}

let socketServer = new SocketServer(serverFactory, rooms);

new StaticFilesServer(serverFactory, "client/dist").listen(9000);
new RoomApiServer(serverFactory, "../../client/dist", rooms, socketServer.io).listen(appPort);

socketServer.server.listen(4000);

new PublicRoomsApiServer(serverFactory, rooms).listen(5000);

new Tracker().listen(8001);

let proxyConfig = {
    target: "ws://localhost:8001",
    ws: true
};

httpProxy.createProxyServer(proxyConfig).listen(8000);









