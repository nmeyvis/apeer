const Room = require("./Room.js");

const Arrays = require("../utils/Arrays.js");
const MyFile = require("./MyFile.js");

class LocalRoom extends Room {
    constructor(socket, localPeer, options) {
        super(options);
        this.socket = socket;
        this.peers = [];

        this.localClientId = options.clientId;
        this.mySecret = options.secret;

        this.localPeer = localPeer;
        this.localPeer.room = this;

        this.socket.on("room.peer", (peer) => {
            let existingPeer = this.findPeerByClientId(peer.clientId);

            console.log("got peer update: " + JSON.stringify(peer));
            console.log("isExistingPeer: " + (existingPeer != null));

            if(existingPeer == null) {

                peer.offeredFiles = peer.offeredFiles.map(f => new MyFile(f));
                peer.isLocal = false;
                this.peers.push(peer);

                this.emitSelfUpdate(); // let the new peer know about us (also everyone else too, this can be improved)

            } else {

                let results = peer.offeredFiles.map(neww => {
                    let old = existingPeer.offeredFiles.find(old => old.magnetURI === neww.magnetURI);
                    return (old) ? Object.assign(old, neww) : new MyFile(neww);
                });

                Object.assign(existingPeer, peer); // merge new peer with existing. override any existing props

                existingPeer.offeredFiles = results;
            }

        });

        this.socket.on("room.peer:leave", (msg) => {
            console.log("peer left");
            this.removePeerByClientId(msg.clientId);
        });

        this.socket.on("room", (msg) => {
            console.log(JSON.stringify(msg));
            Object.assign(this, msg); // update this room with new props from server
        });

        this.emitSelfUpdate = this.emitSelfUpdate.bind(this);
    }

    findPeerByClientId(clientId) {
        return Arrays.findFirstWhere(this.peers, p => p.clientId === clientId);
    }

    removePeerByClientId(clientId) {
        console.log("removing peer: " + clientId);
        Arrays.removeFirstWhere(this.peers, p => p.clientId === clientId);
    }

    emit(event, message) {
        this.socket.emit(event, message);
    }

    numPeers() {
        return this.peers.length;
    }

    isEmpty() {
        return this.numPeers() === 0;
    }

    lock(shouldLock) {
        let method = (shouldLock) ? "lock" : "unlock";
        this.remote(method).then(() => {
            console.log("results!");
        });

        console.log("toggled lock");
    }

    exposeToNetwork(shouldExpose) {
        this.remote("exposeToNetwork", { shouldExpose }).then(() => {
            console.log("results! from expose");
        });
    }

    setPassword(password) {
        this.remote("setPassword", { password }).then(() => {
            console.log("password set");
        });
    }

    emitSelfUpdate() { // send an update to all other peers in the room about us
        console.log("emitting self update");
        let downloadsProgress = this.localPeer.downloads.downloadsInProgress().map(f => {
            return {
                infoHash: f.torrent.infoHash,
                progress: f.downloadProgress
            }
        });

        this.emit("room.peer", { // for security reasons, explicitly describe the peer's properties to share
            nickname: this.localPeer.nickname,
            offeredFiles: this.localPeer.offeredFiles,
            downloadsProgress
        });
    }

    remote(method, args) {
        return fetch(window.location.href + "/" + method, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.mySecret
            },
            body: JSON.stringify(args)
        });
    }
}

module.exports = LocalRoom;