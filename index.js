const isProd = process.argv[2] === "prod";

const fs = require("fs");
const httpProxy = require("http-proxy");

const Rooms = require("./server/src/Rooms.js");
const rooms = new Rooms.Rooms();

const ForceHttpsServer = require("./server/src/servers/ForceHttpsServer.js");
const AppServer = require("./server/src/servers/AppServer.js");
const StaticFilesServer = require("./server/src/servers/StaticFilesServer.js");
const RoomApiServer = require("./server/src/servers/RoomApiServer.js");
const SocketServer = require("./server/src/servers/SocketServer.js");
const Tracker = require("./server/src/servers/TrackerServer.js");

const WebServerFactory = require("./server/src/WebServerFactory.js");

let serverFactory = new WebServerFactory({
    key: fs.readFileSync("./certs/privkey.pem", "utf8"),
    cert: fs.readFileSync("./certs/cert.pem", "utf8"),
    secure: false // change isProd to false
});

let appPort = 8080;

if(isProd) {
    appPort = 80; // change 443 to 80
    // console.log("enabling force http to https");
    // new ForceHttpsServer().listen(8080);
}

let socketServer = new SocketServer(serverFactory, rooms);

new StaticFilesServer(serverFactory, "client/dist").listen(9000);
new AppServer(serverFactory, "../../client/dist", rooms, socketServer.io).listen(appPort);

socketServer.server.listen(4000);

new RoomApiServer(serverFactory, rooms).listen(5000);

new Tracker().listen(8001);

let proxyConfig = {
    target: "ws://localhost:8001",
    ws: true
};

/*if(isProd) {
    proxyConfig.ssl = serverFactory.ssl;
}*/

httpProxy.createProxyServer(proxyConfig).listen(8000);









