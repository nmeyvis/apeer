const uuid = require("uuid/v1");

class User {
    constructor(socket) {
        this.socket = socket;
        this.clientId = uuid();
        this.ip = socket.handshake.address;
        this._network = null;

        this.networkUpdateHandler = net => this.send("network:update", net);
    }

    set network(network) {
        this._network = network;
        this._network.events.on("update", this.networkUpdateHandler)
    }

    get network() {
        return this._network;
    }

    send(channel, msg) {
        this.socket.emit(channel, msg);
    }

    toJSON() {
        return {
            clientId: this.clientId,
            ip: this.ip,
            network: this.network
        }
    }
}

module.exports = User;