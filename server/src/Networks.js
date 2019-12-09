const EventEmitter = require("events");

class Networks {
    constructor() {
        this.networks = {};
    }

    add(ip, room) {
        let network = this.getNetworkOrCreate(ip);
        network.addRoom(room);
    }

    removeRoom(room) {
        Object.values(this.networks).forEach(net => net.removeRoom(room));
    }

    removeNetwork(network) {
        delete this.networks[network.ip];
    }

    getNetwork(ip) {
        return this.networks[ip];
    }

    getNetworkOrCreate(ip) {
        if(ip == null) {
            throw "ip cannot be null";
        }

        let network = this.getNetwork(ip);

        if(network == null) {
            network = new Network(ip);
            this.networks[ip] = network;
        }

        return network;
    }

    remove(room, ip) {
        let network = this.getNetwork(ip);

        if(network != null) {
            network.removeRoom(room);

            if(network.isEmpty()) {
                this.removeNetwork(network);
            }
        }
    }
}

class Network {
    constructor(ip) {
        this.ip = ip;
        this.rooms = new Set();

        this.events = new EventEmitter();
    }

    addRoom(room) {
        this.rooms.add(room);

        this.events.emit("update", this);
    }

    removeRoom(room) {
        this.rooms.delete(room);
        this.events.emit("update", this);
    }

    isEmpty() {
        return this.size() === 0;
    }

    size() {
        return this.rooms.size;
    }

    toJSON() {
        return {
            ip: this.ip,
            rooms: Array.from(this.rooms) // convert to array bc javascript returns an empty object when serializing a set, they obviously didnt think to override toJSON, thanks javascript
        }
    }
}

module.exports = Networks;