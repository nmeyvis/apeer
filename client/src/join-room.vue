<script>
    const icons = require("feather-icons").icons;

    export default {
        name: "join-roon",
        data() {
            return {
                network: Peer.network,
                notFound: null,
                userRoomIdInput: null,
                room: null,
                arrowRightIcon: icons["arrow-right"].toSvg()
            }
        },
        computed: {
            roomURL() {
                let id = (this.room) ? this.room.id : this.userRoomIdInput;
                return `/${ id }`;
            }
        },
        methods: {
            pluralWord(word, quantity) {
                return word + ((quantity) > 1 ? "s" : "");
            },
            fetchRoomData(roomId) {
                fetch(`${HOSTS.api}/api/rooms/${roomId}`).then((resp) => {
                    if(resp.status === 404) {
                        this.notFound = true;
                    } else {
                        resp.json().then(room => {
                            this.room = room;
                            this.join(room);
                        });
                    }
                });
            },
            join(room) {
                if(room.isLocked) {
                    return;
                }

                console.log(room);
                window.location.href = this.roomURL;
            },
            resolveRoomId(roomIdOrUrl) {
                let fromURL = this.extractRoomIdFromURL(roomIdOrUrl);

                if(fromURL == null) {
                    return roomIdOrUrl;
                }

                return fromURL;
            },
            extractRoomIdFromURL(url) {
                try {
                    url = new URL(url);
                } catch(e) {
                    return null; // not a url
                }

                let pathParts = url.pathname.split("/");

                if(pathParts.length !== 3) { // not a url with an acceptable path
                    return null;
                }

                return pathParts[2]; // room is the third part of the path (/rooms/<id>)
            },
            submitForm(e) {
                this.$refs.submitBtn.click();
            },
            handleFormSubmit(e) {
                console.log('submitted');
                e.preventDefault();
                this.fetchRoomData(this.resolveRoomId(this.userRoomIdInput))
            },
            resetRoomResults(e) {
                console.log(e);
                if(e.code === "Enter" || e.code === "NumpadEnter" || e.code === "Tab") {
                    return;
                }

                this.notFound = null;
                this.room = null;
            }
        },
        components: {
            "confirmation-window": require("./confirmation-window.vue").default,
            "room-speed-dial": require("./room-speed-dial.vue").default
        }
    }
</script>

<template>
    <div class="join-room">
        <form ref="form" class="direct-join" autocomplete="off" @submit="handleFormSubmit">
            <h1>Join a Room</h1>

                <div class="input-group">
                    <label for="room">Enter a room name or URL</label>
                    <div class="input-container">

                        <input id="room" type="text" v-model="userRoomIdInput" @keydown="resetRoomResults" autocapitalize="off" required autofocus>
                        <div class="input-continue" v-html="arrowRightIcon" @click="submitForm"></div>

                    </div>
                    <div class="search-result" v-if="notFound">Room <b>{{ userRoomIdInput }}</b> doesn't exist, <a v-bind:href="roomURL">create it</a>?</div>
                    <div class="search-result" v-if="room != null && room.isLocked">Room is locked.</div>
                </div>

            <button ref="submitBtn" type="submit" class="hide"></button>

        </form>

        <div class="visible-rooms">
            <room-speed-dial :network="network"></room-speed-dial>
        </div>
    </div>
</template>

<style scoped>

    .join-room {

        color: #6b7c93;
        padding: 20px;
    }

    .direct-join button {
        margin-top: 15px;
    }

    hr {
        border: 0;
        height: 2px;
        width: 100%;
        margin: 35px 0;
        background-color: lightgrey;
    }

    .direct-join {
        display: flex;
        flex-direction: column;
    }

    .input-group {

        margin-top: 15px;
        text-align: left;
    }

    .input-group label {
        font-size: 0.8em;
        color: #757575;
    }

    .input-group input {
        width: 100%;
        position: relative;
    }

    .input-container {
        position: relative;
    }

    .input-group .input-continue {
        height: 100%;
        position: absolute;
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 3px 6px;
        top: 0;
        right: 0;
        box-sizing: border-box;
    }

    .search-result {
        overflow-wrap: break-word;
        text-align: center;
        margin-top: 15px;
        background-color: #f0e09b;
        padding: 10px 20px;
        border-radius: 4px;
    }

    .search-result a {
        color: #416dea;
        text-decoration: none;
    }

    .search-result a:hover {
        cursor: pointer;
    }

    .search-result a:focus, .search-result a:hover {
        color: #2b4286;
        text-decoration: underline;
        transition: all 150ms linear;
    }

    .visible-rooms {
        margin-top: 35px;
    }

    .join-room h1, .join-room h2, join-room h3 {
        font-weight: normal;
        color: #6b7c93;
    }

    .no-rooms span {
        font-size: 1.35em;
    }

    .no-rooms p {
        font-size: 0.85em;
        margin-top: 9px;
        padding: 10px 71px;
    }

    @media(max-width: 768px) {
        .join-room {
            min-width: 0;
            max-width: none;
        }
    }
</style>