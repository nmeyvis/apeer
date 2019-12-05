<script>
    const icons = require("feather-icons").icons;

    export default {
        name: "peer-folder",
        data() {
            return {
                shouldShowNicknameChangeWindow: false,
                showControlsMap: {
                    local: {
                        downloads: ["removeAll", "saveAll", "listType"],
                        offeredFiles: ["removeAll", "listType"]
                    },
                    remote: ["listType"]
                },

                userIcon: icons["user"].toSvg()
            };
        },
        props: {
            peer: Object,
            noFilesLabel: Object,
            collectionType: {
                type: String,
                default: "offeredFiles" // can be downloads
            },
            showHeader: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            files() {
                return (this.collectionType === "offeredFiles") ? this.peer.offeredFiles : this.peer.downloads.files;
            },
            filesRemovable() {
                return this.peer.isLocal;
            },
            showControls() {
                return (this.peer.isLocal) ? this.showControlsMap["local"][this.collectionType] :  this.showControlsMap["remote"];
            }
        },
        methods: {
            toggleNicknameChangeWindow() {
                if(this.peer.isLocal) {
                    this.shouldShowNicknameChangeWindow = !this.shouldShowNicknameChangeWindow;
                }
            }
        },
        components: {
            "file-list": require("./file-list.vue").default,
            "confirmation-window": require("./confirmation-window.vue").default,
            "nickname-picker": require("./nickname-picker.vue").default
        }
    }
</script>

<template>
    <div class="folder">
        <div v-if="showHeader" class="folder-header">
            <div v-bind:class="{ 'peer-details': true, clickable: peer.isLocal }">
                <div class="peer-icon" v-html="userIcon"></div>
                <div class="peer-username" @click="toggleNicknameChangeWindow">{{ peer.nickname }}</div>
            </div>
        </div>

        <slot></slot>

        <file-list v-bind:files="files" label="Files" v-bind:noFilesLabel="noFilesLabel" v-bind:filesRemovable="filesRemovable" v-bind:showControls="showControls"></file-list>

        <confirmation-window v-if="shouldShowNicknameChangeWindow" btn-display="Done" v-on:finished="toggleNicknameChangeWindow">
            <nickname-picker></nickname-picker>
        </confirmation-window>
    </div>
</template>

<style>

    .folder {
        display: flex;
        flex-direction: column;
        width: 500px;
        border-radius: 5px;
        padding: 15px 20px;
        box-sizing: border-box;
    }

    .folder > .files {
        padding: 30px 15px;
        overflow: auto;
    }

    .folder-header {

    }

    .peer-details {
        display: flex;
    }

    .peer-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        margin-right: 10px;

        border: 1px solid gray;
        border-radius: 400px;
    }

    .peer-username {
        flex: 1 0 0;
        width: 100%;
        padding: 8px 14px;

        font-size: 0.9em;
        background-color: #f3f3f3;
        border-radius: 300px;
        line-height: 1.5;
    }

    .peer-details.clickable {
        cursor: pointer;
    }

    .peer-details.clickable:hover {

    }

    @media(max-width: 768px) {
        .folder {
            width: auto;
        }

        .folder > .files {
            padding: 15px 0;
        }
    }


</style>