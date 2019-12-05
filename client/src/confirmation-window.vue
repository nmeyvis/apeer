<script>
    const icons = require("feather-icons").icons;

    export default {
        name: "confirmation-window",
        data() {
            return {
                xIcon: icons["x"].toSvg({ width: 42, height: 42, "stroke-width": 1 })
            }
        },
        props: {
            "btn-display": {
                type: String,
                default: null
            },
            "show-close": {
                type: Boolean,
                default: false
            }
        },
        methods: {
            finish(e) {
                this.$emit("finished");
            }
        }
    }
</script>

<template>
    <div class="window">
        <div class="window-body panel">
            <div v-if="showClose" class="window-header">
                <div class="close" v-html="xIcon" @click="finish"></div>
            </div>

            <div class="window-content">
                <slot @finish="finish"></slot>
                <button v-if="btnDisplay != null" type="submit" class="button button-primary" @click="finish">{{ btnDisplay }}</button>
            </div>

        </div>
    </div>
</template>

<style scoped>

    .window-content {
        width: 100%;
        height: 100%;
    }

    button[type='submit'] {
        width: 100%;
        padding: 14px;
        font-size: 1.45em;
        margin: 0;
        margin-top: 35px;
    }

    .window-body {
        width: 85%;
        height: 85%;
    }

    @media(min-width: 1920px) {
        .window-body {
            width: 65%;
            height: 70%;
        }
    }

    @media(max-width: 768px) {
        .window-body {
            justify-content: flex-start;
            width: 100%;
            height: 100%;
        }
    }
</style>