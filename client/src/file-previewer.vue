<script>
    export default {
        name: "file-previewer",
        data() {
            return {
                manager: previewManager,
                file: null,
                url: null
            }
        },
        watch: {
            "manager.file": function() {
                this.file = this.manager.file;
                this.file.url().then(url => {
                    console.log(url);
                    this.url = url
                });
            }
        },
        methods: {
            hide() {
                this.file = null;
            }
        },
        directives: {
            "click-outside": {
                bind: function (el, binding, vnode) {
                    el.clickOutsideEvent = function (event) {
                        // here I check that click was outside the el and his childrens
                        if (!(el == event.target || el.contains(event.target))) {
                            // and if it did, call method provided in attribute values
                            vnode.context[binding.expression](event);
                        }
                    };
                    document.body.addEventListener('click', el.clickOutsideEvent)
                },
                unbind: function (el) {
                    document.body.removeEventListener('click', el.clickOutsideEvent)
                }
            }
        }
    }
</script>

<template>
    <div v-bind:class="{ hide: file == null, 'window': true}">
        <div v-if="file != null" v-bind:class="{ 'window-body': true, 'not-image': !file.isImage() }"  id="preview-target">
            <img v-if="file.isImage()" v-bind:src="url" v-click-outside="hide">
            <object v-else v-bind:type="file.mimeType" v-bind:data="url" v-click-outside="hide"></object>
        </div>
    </div>
</template>

<style scoped>

    #preview-target > *{
        border-radius: 4px;
    }

    #preview-target > img {
        max-width: 85%;
        max-height: 85%;
    }

    #preview-target > object {
        width: 100%;
        height: 100%;
    }

    #preview-target object[type="text/plain"] {
        background-color: white;
    }
</style>