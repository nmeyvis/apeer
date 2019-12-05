<script>
    const Arrays = require("./utils/Arrays.js");
    const MyFile = require("./types/MyFile.js");
    const Feather = require("feather-icons");

    export default {
        name: "file",
        data() {
            return {
                shouldShowDownloaders: false,
                IconX: Feather.icons["x"].toSvg(),
                room: Peer.room
            }
        },
        props: {
            file: MyFile,
                removable: {
                type: Boolean,
            default: false
            }
        },
        computed: {
            displayName: function() {
                if(this.file.isImage()) {
                    return this.file.name + "." + this.file.extension;
                }

                return this.file.name;
            },

        },
        methods: {
            whosDownloadingMe: function() {
                if(!this.file.hasTorrent()) {
                    return;
                }

                let downloaders = [];

                this.room.peers.forEach((peer) => {
                    let download = Arrays.findFirstWhere(peer.downloadsProgress, (d) => d.infoHash === this.file.torrent.infoHash);
                    if(download != null) {
                        downloaders.push({
                            nickname: peer.nickname,
                            progress: download.progress
                        });
                    }
                });

            return downloaders;
        },
        toggleShowDownloaders: function() {
            if(!this.file.originLocal) {
                return;
            }

            this.shouldShowDownloaders = !this.shouldShowDownloaders;
        },
        previewFile: function() {
            if(this.file.hasTorrent()) {
                previewManager.open(this.file);
            }
        }
    },
    components: {
        "progress-bar": require("./progress-bar.vue").default
    }
}

</script>

<template>
    <div class="file">
        <div class="file-body">
            <div class="remove action action-danger" v-if="removable && !file.originLocal" v-html="IconX" @click="$emit('remove', file)" title="Remove file completely"></div>
            <img v-bind:class="{ 'file-icon': true, clickable: file.isEmbeddable() }" v-bind:src="file.getIconPath()" @click="previewFile">

            <div class="file-details">
                <div v-bind:class="{ 'file-name': true, clickable: file.isEmbeddable() }" @click="previewFile" v-bind:title="file.fullName">{{ file.safeFileName }}</div>
                <div class="file-size" v-bind:title="file.size">{{ file.prettySize() }}</div>
            </div>

            <div v-if="file.shouldWait" class="action">
                <button class="button button-default small" disabled>{{ file.alternativeStatusResolved }}</button>
            </div>

            <div v-else>
                <button v-if="file.originLocal" @click="$emit('remove', file)" class="button button-default small">remove</button>
                <button v-else-if="file.isDownloading" class="button button-default small" title="Download progress" disabled>{{ file.downloadProgress }}</button>
                <button v-else-if="file.isDownloaded" @click="$emit('save', file)" class="button button-success small">save</button>
                <button v-else @click="$emit('download', file)" class="button button-primary small">download</button>
            </div>
        </div>

        <div class="file-footer">
            <div class="file-statuses">
                <div v-if="file.hasTorrent()" title="Number of peers sharing this file" v-bind:class="{ button: file.originLocal, 'button-default': file.originLocal, status: true, pulse: file.isUploading() && !shouldShowDownloaders, selected: shouldShowDownloaders}" @click="toggleShowDownloaders">
                    <div class="status-icon">&diams;</div>
                    <div class="status-value">{{ file.torrent.numPeers }}</div>
                </div>
                <div v-if="file.hasTorrent()" title="Your upload sharing speed" class="status">
                    <div class="status-icon">&uarr;</div>
                    <div class="status-value">{{ file.uploadSpeed }}/s</div>
                </div>
                <div v-if="file.hasTorrent()" title="Your download speed" class="status">
                    <div class="status-icon">&darr;</div>
                    <div class="status-value">{{ file.downloadSpeed }}/s</div>
                </div>
            </div>
        </div>

        <div class="file-downloaders" v-if="shouldShowDownloaders && file.originLocal">
            <div class="tiny-label">Downloaders</div>
            <div v-for="downloader in whosDownloadingMe()" class="file-peers">

                <div class="file-peer">
                    <div class="details">
                        <div class="peer-name">{{ downloader.nickname }}</div>
                        <div class="peer-progress">{{ downloader.progress }}</div>
                    </div>
                    <div class="download-progress"><progress-bar v-bind:progress="downloader.progress"></progress-bar></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

    .file-statuses {
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid lightgray;
        padding-top: 5px;

    }

    .status {
        display: flex;
        background-color: #f3f3f3;
        margin: 0 4px;
        padding: 5px 14px;
        font-size: 0.7em;
        border-radius: 4px;
    }

    .status.button {
        margin: 0;
    }

    .status.selected {
        background-color: #434343;
        color: white;
    }

    .status-icon {
        margin-right: 10px;
    }

    .status-value {
        font-weight: bold;
    }


    .file-name.clickable {
        text-decoration: underline;
        cursor: pointer;
    }

    .file-icon.clickable {
        cursor: pointer;
    }

    .remove {
        margin-right: 10px;
    }

    .file-body {
        display: flex;
        align-items: center;
        padding: 15px 0 5px 0;
    }

    .file-details {
        padding: 0 15px;
        flex-grow: 2;
        overflow: hidden;
    }

    .file-size {
        font-size: 0.8em;
    }

    .file .file-icon {
        width: 50px;
    }

    @media(max-width: 768px) {

    }

</style>