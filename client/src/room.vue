<script>
    const Room = require("./types/Room.js");

    export default {
        data() {
            return {
                localPeer: Peer,
                peers: this.room.peers,
                roomInvite: window.location.href,
                noFilesLabels: {
                    "offeredFiles": {
                        h1: (this.isMobile()) ? "You're not sharing anything" : "No Files",
                        h2: (this.isMobile()) ? "" : "Drag and drop files onto window"
                    },
                    "downloads": {
                        h1: "Nothing downloaded",
                        h2: ""
                    }
                },
                tabView: (this.isMobile()) ? "room" : "offeredFiles"
            }
        },
        props: {
            room: Room
        },
        watch: {
            "localPeer.offeredFiles": {
                handler: function(neww, old) {
                    console.log("local peer updated");
                    this.room.emitSelfUpdate();
                },
                deep: false
            }
        },
        methods: {
            setTabView(tabView) {
                this.tabView = tabView;
            },
            isTabAt(tabView) {
                return this.tabView === tabView;
            },
            addOfferedFiles(event) {
                let files = event.target.files;
                this.localPeer.addOfferedFiles(files);
                this.setTabView("offeredFiles");

                // stores some reference to the file selected, if you dont clear it:
                // you won't be able to select the file with this use case: select file -> remove file -> select same file
                event.target.value = null;
            },
            isMobile: window.isMobile
        },
        components: {
            "peers": require("./peers.vue").default,
            "peer-folder": require("./peer-folder.vue").default,
            "room-control": require("./room-control.vue").default
        }
    }
</script>

<template>
    <div class="room-container">
        <div class="local-user panel panel-floating">
            <peer-folder v-if="tabView === 'offeredFiles' || tabView === 'downloads'" v-bind:peer="localPeer" :noFilesLabel="noFilesLabels[tabView]" :collectionType="tabView" :showHeader="tabView !== 'downloads'">
                <div v-if="tabView === 'offeredFiles'" class="file-selector">
                    <label class="button button-primary" for="user-files">
                        Share files
                    </label>
                    <input type="file" id="user-files" multiple @change="addOfferedFiles" />
                </div>
            </peer-folder>

            <div v-if="isMobile() && tabView === 'room'" class="room">
                <div class="room-header">
                </div>
                <div class="room-body">
                    <peers :peers="peers" :network="localPeer.network"></peers>
                </div>
                <div class="room-footer">
                    <room-control :roomInvite="roomInvite" :room="room"></room-control>
                </div>
            </div>

            <div class="nav">
                <div @click="setTabView('offeredFiles')" :class="{ tab: true, selected: isTabAt('offeredFiles') }">Share files <span class="badge">{{ localPeer.offeredFiles.length }}</span></div>
                <div v-if="isMobile()" @click="setTabView('room')" :class="{ tab: true, selected: isTabAt('room') }">Peers <span class="badge">{{ localPeer.room.peers.length }}</span></div>
                <div @click="setTabView('downloads')" :class="{ tab: true, selected: isTabAt('downloads') }">Downloads <span class="badge">{{ localPeer.downloads.length }}</span></div>
            </div>
        </div>

        <div v-if="!isMobile()" class="room">
            <div class="room-header">
            </div>
            <div class="room-body">
                <peers :peers="peers" :network="localPeer.network"></peers>
            </div>
            <div class="room-footer">
                <room-control :roomInvite="roomInvite" :room="room"></room-control>
            </div>
        </div>
    </div>
</template>

<style>
    .room {

        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;
    }

    .room-body {
        flex: 1;
        overflow: auto;
    }

    .room-footer {
        width: 100%;
        padding: 20px 30px;
        box-sizing: border-box;
    }


    .room-container {
        display: flex;
        width: 100%;
        height: 100%;
    }

    .tab.selected .badge {
        background-color: #b9b9b9;
    }

    .badge {
        background-color: #b9b9b9;
        padding: 1px 7px;
        margin: 0 4px;
        border-radius: 3px;
        color: white;
    }

    .file-selector {
        font-size: 1.2em;
        margin-top: 5%;
    }

    .file-selector > input[type="file"] {
        display: none;
    }

    .file-selector .button {
        margin: 10px;
    }

    .nav {
        display: flex;
        height: 12%;
    }

    @media(max-width: 768px) {
        .local-user {
            width: 100%;
        }

        .room {
            height: 85%;
            flex-direction: column-reverse;
        }

        .room-footer {
            padding: 0;
            top: 0;
        }

        .badge {
            margin-top: 6px;
            font-size: 0.8em;
        }

        .file-selector .button {
            margin: 0 0 10px;
        }
    }

</style>