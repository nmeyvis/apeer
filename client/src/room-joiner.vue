<script>
    const Room = require("./types/Room.js");
    const LocalRoom = require("./types/LocalRoom.js");
    const icons = require("feather-icons").icons;
    const Arrays = require("./utils/Arrays.js");

    const io = require("socket.io-client");

    export default {
        name: "room-joiner",
        data() {
            return {
                localPeer: Peer,
                promptForPassword: false,
                badPassword: false,
                passwordAttempt: 0,
                roomLocked: false,
                socket: null,
                room: null,
                password: "",

                slashIcon: icons["slash"].toSvg({ width: 82, height: 82, "stroke-width": 1})
            }
        },
        props: {
            roomId: {
                type: String,
                default: getRoomIdFromPath()
            }
        },
        created() {
            this.join();
        },
        methods: {
            join() {
                this.socket = io.connect(HOSTS.socket, { query: { roomId: this.roomId, password: this.password} });

                this.socket.on("self.join:failure", result => {
                    console.log(result);
                    if(result.reason === "locked") {
                        this.roomLocked = true;
                    } else if(result.reason === "bad_password") {
                        this.promptForPassword = true;
                        this.badPassword = true;
                        this.passwordAttempt++;
                    }
                });

                this.socket.on("self.join:success", (msg) => {
                    this.promptForPassword = false;
                    this.password = null; // clear the password for security reasons

                    this.room = new LocalRoom(this.socket, Peer, msg);
                    Object.assign(this.localPeer.network, patchNetworkRooms(msg.network));
                    this.room.emitSelfUpdate(); // let everyone know we joined.
                });

                this.socket.on("network:update", (msg) => {
                    Object.assign(this.localPeer.network, patchNetworkRooms(msg));
                    console.log("network update");
                    console.log(msg);
                });
            },
            handlePasswordInput(e) {
                if(e.code === "Enter" || e.code === "NumpadEnter" || e.code === "Tab") {
                    return;
                }

                this.badPassword = false;
            }
        },
        components: {
            roomer: require("./room.vue").default
        }
    }

    function getRoomIdFromPath() {
        let path = window.location.pathname;
        let parts = path.split("/");
        /*if(parts[1] !== "rooms") {
            throw "first part of the path is expected to be 'rooms'";
        }*/

        return parts[1];
    }

    function patchNetworkRooms(network) {
        Arrays.removeFirstWhere(network.rooms, r => r.id === Peer.room.id); // remove our self from the network because that's not useful
        network.rooms = network.rooms.map(r => new Room(r));
        return network;
    }
</script>

<template>
    <div class="stage">
        <h1 v-if="roomLocked">Room is locked</h1>
        <div v-else-if="promptForPassword">
            <div class="panel panel-floating">
                <div class="password-prompt">
                    <div v-html="slashIcon"></div>
                    <h1>Room requires a password to join</h1>
                    <form @submit="$event.preventDefault(); join()">
                        <div class="input">
                            <label for="password">Enter the room password</label>
                            <input id="password" type="password" v-model="password" @keydown="handlePasswordInput" autofocus>
                            <div class="input-error"><span v-if="badPassword && passwordAttempt > 1">Bad password</span></div>
                        </div>
                        <div class="footer">
                            <button type="submit" class="button button-primary">Join</button> <!-- Button is a decoy, clicking off the password field anywhere will trigger the change event -->
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <roomer v-else-if="room != null" v-bind:room="room"></roomer>
    </div>
</template>

<style scoped>
    .password-prompt {
        min-width: 450px;
        padding: 40px 25px;
        text-align: center;
    }

    .password-prompt h1 {
        font-size: 1.4em;
        margin-top: 15px;
    }

    .password-prompt input {
        width: 100%;
    }

    .footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 30px;
    }

    .input {
        margin-top: 50px;
        text-align: left;
    }

    .input label {
        font-size: 0.8em;
    }

    .input input {
        position: relative;
    }

    .input-error {
        text-align: right;
        height: 0.8em;
        font-size: 0.8em;
        color: #e1183e;
        width: 100%;
    }
</style>