<script>
    const FileAltStatus = require("./types/FileAltStatus.js");
    const MyFile = require('./types/MyFile.js');
    window.AppState = new (require("./types/AppState.js"))();

    const Downloads = require("./types/Downloads.js");
    const Numbers = require("./utils/Numbers.js");
    const WebTorrent = require("webtorrent");

    let torrentClient = new WebTorrent({ dht: false, tracker: { announce: [HOSTS.tracker] } });

    window.Peer = {
        nickname: "peer" + Numbers.getRandomMaxInt(100),
        offeredFiles: [],
        torrentClient,
        downloads: new Downloads(torrentClient),
        isLocal: true,
        network: { rooms: [] },
        addOfferedFiles: function(files) {
            console.log("adding files");
            files = _fileListToArray(files);

            files.forEach(f => {
                if(this.isOffering(f)) {
                    alert("already offering file: " + f.fullName);
                    return;
                }
                f.originLocal = true;
                f.addOriginLocalUpdateListener(["shouldWait"], Peer.room.emitSelfUpdate);
                this.startNewSeed(f)
            });
        },
        startNewSeed: function(file) {
            file.wait(FileAltStatus.seeding);

            this.offeredFiles.push(file);

            this.torrentClient.seed(file.w3cFile, {
                announceList: [
                    [HOSTS.tracker],
                ]
            }, torrent => {
                console.log("new torrent created");
                file.torrent = torrent;
                file.release();
            });
        },
        isOffering(file) {
            return this.offeredFiles.find(f => f.weakEquals(file)) != null;
        }
    };

    const Runners = require("./utils/Runners.js");

    Peer.downloads.onNewDownload(file => {
        file.addUpdateListener(["downloadProgress"], (file) => Runners.chanceExecute(Peer.room.emitSelfUpdate, 25, file.downloadProgress === "100.00"));
    });

    export default {
        data() {
            return {
                localPeer: Peer,
                appState: AppState
            }
        },
        methods: {
            handleDrop(e) {
                e.preventDefault();
                console.log("dropped");

                if(e.dataTransfer.files) {
                    this.localPeer.addOfferedFiles(e.dataTransfer.files)
                }
            },
            handlePaste(e) {
                e.preventDefault();
                console.log(e);
            }
        },
        components: {
            "app-header": require("./app-header.vue").default,
            "file-previewer": require("./file-previewer.vue").default,
            "room-joiner": require("./room-joiner.vue").default,
            "onboarding": require("./onboarding.vue").default
        }
    }

    function _fileListToArray(fileList) {
        let array = [];
        for(let i = 0; i < fileList.length; i++) {
            array[i] = MyFile.fromW3CFile(fileList[i]);
        }

        return array;
    }
</script>

<template>
    <div class="app" v-on:drop="handleDrop" ondragenter="event.preventDefault()" ondragover="event.preventDefault()"> <!-- you must cancel ondragenter and ondragover for the drop event to trigger -->
        <app-header></app-header>
        <room-joiner v-bind:network="localPeer.network"></room-joiner>
        <file-previewer></file-previewer>
        <onboarding v-if="appState.shouldShowOnboarding"></onboarding>
    </div>
</template>

<style scoped>

</style>