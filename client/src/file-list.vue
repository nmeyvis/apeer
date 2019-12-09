<script>
    const Arrays = require("./utils/Arrays.js");
    const icons = require("feather-icons").icons;
    const JSZip = require("jszip");

    export default {
        name: "file-list",
        data() {
            return {
                saveIcon: icons["save"].toSvg(),
                trashIcon: icons["trash"].toSvg(),
                listIcon: icons["menu"].toSvg()
            }
        },
        props: {
            files: Array,
            label: String,
            noFilesLabel: {
                type: Object,
                default() {
                    return {
                        h1: "No files yet"
                    }
                }
            },
            showControls: {
                type: Array,
                default() {
                    return ["listType"] // other options: removeAll, saveAll
                }
            },
            filesRemovable: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            removeFile(file) {
                console.log("removing file");
                let didRemove = Arrays.removeFirstWhere(this.files, f => f === file);

                if(didRemove) {
                    this.$emit("removed", file);
                    if(file.hasTorrent()) {
                        console.log("removed torrent");
                        Peer.torrentClient.remove(file.magnetURI, () => {
                            file.resetDownload();
                        });
                    }
                }
            },
            removeAllFiles() {
                let copy = this.files.slice(0); // we make a shallow copy because the removeFile operation deletes the file instance from the array while we are still interating, so it ends up only deleting half the files.
                copy.forEach(this.removeFile);
            },
            hasFiles() {
                return this.files.length > 0;
            },
            downloadFile(file) {
                Peer.downloads.add(file);
            },
            saveFile(file) {
                file.saveToDevice();
            },
            changeListType() {
                // TODO implement
                console.log('change the list type');
            },
            shouldDisplayAction(actionName) {
                return this.showControls.includes(actionName);
            },
            zipFiles() {
                let zip = new JSZip();
                let fileCount = this.files.length;
                let currentSaved = 0;

                this.files.forEach(f => {
                    f.torrentFile.getBlob((err, blob) => {
                        zip.file(f.fullName, blob);
                        currentSaved ++;
                        if(fileCount === currentSaved) {
                            zip.generateAsync({type:"blob"})
                                .then(function(content) {
                                    save(content, "zippppered.zip");
                                });
                        }
                    });
                });
            }
        },
        components: {
            "file": require("./file.vue").default
        }
    }

    function save(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(blob, filename);
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }
</script>

<template>
    <div class="files">
        <div class="file-list-header">
            <div class="tiny-label" v-if="hasFiles()">{{ label }}</div>
            <div class="action-list" v-if="hasFiles()">
                <div v-if="shouldDisplayAction('saveAll')" class="action" v-html="saveIcon" title="Save everything as a zip" @click="zipFiles"></div>
                <div v-if="shouldDisplayAction('removeAll')" class="action action-danger" v-html="trashIcon" title="Remove all files completely" @click="removeAllFiles"></div>
                <div v-if="shouldDisplayAction('listType')" class="action" v-html="listIcon" title="Change how the files are displayed" @click="changeListType"></div>
            </div>
        </div>
        <div class="no-files" v-if="!hasFiles()">
            <h1>{{ noFilesLabel.h1 }}</h1>
            <h2>{{ noFilesLabel.h2 }}</h2>
        </div>
        <file v-for="file in files" v-bind:file="file" :key="file.name" v-on:remove="removeFile" v-on:download="downloadFile" v-on:save="saveFile" v-bind:removable="filesRemovable"></file>
    </div>
</template>

<style scoped>

    .files .file {
        margin-top: 10px;
    }

    @media(max-width: 768px) {
        .files .file {
            margin-top: 0;
        }
    }
    .file-list-header {
        display: flex;
        justify-content: space-between;
    }

</style>

