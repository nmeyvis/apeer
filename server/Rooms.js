const Arrays = require("../client/src/utils/Arrays.js");
const EventEmitter = require("events");
const Networks = require("./Networks.js");

class Rooms {
    constructor() {
        this.rooms = [];
        this.networks = new Networks();
    }

    join(options) {
        Rooms.assertValidRoomId(options.roomId);

        let room = this._findOrCreate(options.roomId);

        room.secureAdd({
            user: options.user,
            password: options.password,
            success: (room) => {
                options.user.socket.join(options.roomId);
                options.success(room);
            },
            fail: options.fail
        });

        return room;
    }

    leave(id, user) {
        let room = this.getRoom(id);

        if(room != null) {
            user.socket.leave(id);
            room.remove(user);
        }
    }

    getRoom(id) {
        return Arrays.findFirstWhere(this.rooms, r => r.id === id);
    }

    _destroy(room) {
        console.log(`Destroying room: ${ room.id }`);
        this.networks.removeRoom(room);
        Arrays.removeFirstWhere(this.rooms, r => r === room);
    }

    _findOrCreate(id) {
        let room = this.getRoom(id);

        if(room == null) {
            room = new Room(id);

            room.events.on("empty", (room) => this._destroy(room));

            this.rooms.push(room);
        }

        return room;
    }

    static assertValidRoomId(id, exceptionMsg = "cannot create or join an invalid room id of: " + id) {
        if(!Rooms.isValidRoomId(id)) {
            throw exceptionMsg;
        }
    }

    static isValidRoomId(id) {
        return !(/[^a-zA-Z0-9]/.test(id)); // only allow alphanumeric names
    }
}

class Room {
    /**
     * options: {
     *     onEmpty: callback
     * }
     * @param name
     * @param host
     * @param options
     */
    constructor(id) {
        this.id = id;

        this.users = [];
        this.hostClientId = null;

        this.password = null;
        this.isLocked = false;

        this._userMethods = {};
        this._hostMethods = {
            setPassword: (args) => this.setPassword(args.password),
            exposeToNetwork: (args) => this.exposeToNetwork(args.shouldExpose),
            lock: () => this.lock(),
            unlock: () => this.unlock()
        };

        this.events = new EventEmitter();

        this.exposedToHostNetwork = false;
    }

    add(user) {
        this.setHostIfNone(user);
        this.users.push(user);
    }

    /**
     * options: {
     *     user: the user to add
     *     password: optionally password
     *     success: called if successfully join
     *     fail: called if failed, is passed a reason string
     * }
     * @param options
     * @returns {string}
     */
    secureAdd(options) {
        if(this.isLocked) {
            return options.fail("locked");
        }

        if(this.password && this.password !== options.password) {
            return options.fail("bad_password");
        }

        this.add(options.user);
        options.success(this);
    }

    remove(user) {

        if(this.isHost(user) && !this.isEmpty()) {
            let newHost = this.joinedAfter(user);

            if(newHost != null) {
                this.setHost(newHost);
            }
        }

        Arrays.removeFirstWhere(this.users, u => u === user);

        if(this.isEmpty()) {
            this.events.emit("empty", this);
        }
    }

    exposeToNetwork(shouldExpose) {
        let hostNetwork = this.getHost().network;

        if(shouldExpose) {
            hostNetwork.addRoom(this);
            this.exposedToHostNetwork = true;
        } else {
            hostNetwork.removeRoom(this);
            this.exposedToHostNetwork = false;
        }
    }

    lock() {
        this.isLocked = true;
    }

    unlock() {
        this.isLocked = false;
    }

    setPassword(password) {
        if(password === "") { // interpret empty string as no password
            password = null;
        }

        this.password = password;
    }

    isHost(user) {
        if(user == null) {
            throw "user cannot be null";
        }

        if(user.clientId == null) {
            throw "user client id cannot be null";
        }

        return user.clientId === this.hostClientId;
    }

    isMember(clientId) {
        return Arrays.findFirstWhere(this.users, u => u.clientId === clientId) != null;
    }

    setHost(user) {
        this.hostClientId = user.clientId;
        this.events.emit("new-host", this, user);
    }

    setHostIfNone(user) {
        if(!this.hasHost()) {
            this.setHost(user);
        }
    }

    getHost() {
        return Arrays.findFirstWhere(this.users, u => u.clientId === this.hostClientId);
    }

    hasHost() {
        return this.hostClientId != null;
    }

    isEmpty() {
        return this.size() === 0;
    }

    size() {
        return this.users.length;
    }

    hasPassword() {
        return this.password != null;
    }

    joinedAfter(user) {
        let indexOf = this.users.indexOf(user);

        if(indexOf === this.users.length - 1) {
            return null;
        }

        return this.users[indexOf + 1];
    }

    findUserByClientId(clientId) {
        return Arrays.findFirstWhere(this.users, u => u.clientId === clientId);
    }

    update() {
        this.users.forEach(u => u.send("room:update", this));
    }

    methods(clientId) {
        let user = this.findUserByClientId(clientId);

        if(user == null) {
            return {};
        }

        let entitlements = Object.assign({}, this._userMethods); // you must clone otherwise if host, then it would copy host methods into _userMethods - making everyone effectively host

        if(this.isHost(user)) {
            Object.assign(entitlements, this._hostMethods);
        }

        return entitlements;
    }

    isPassword(checkPassword) {
        return this.password === checkPassword;
    }

    toJSON() {
        return {
            id: this.id,
            hostClientId: this.hostClientId,
            isLocked: this.isLocked,
            hasPassword: this.hasPassword(),
            exposedToHostNetwork: this.exposedToHostNetwork
        }
    }
}

module.exports = {
    Rooms,
    Room
};