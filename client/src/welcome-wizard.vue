<template>
    <div class="wizard">
        <confirmation-window v-show="displayWindow === 0" btn-display="Get Started" v-on:finished="finishWindow">
            <introduction></introduction>
        </confirmation-window>

        <confirmation-window v-show="displayWindow === 1" btn-display="Continue" v-on:finished="finishWindow">
            <nickname-picker></nickname-picker>
        </confirmation-window>
    </div>
</template>

<script>
    const AppState = require("./types/AppState.js");

    export default {
        name: "welcome-wizard",
        data() {
            return {
                displayWindow: 0,
                appState: AppState
            }
        },
        components: {
            "confirmation-window": require("./confirmation-window.vue").default,
            "nickname-picker": require("./nickname-picker.vue").default,
            "introduction": require("./introduction.vue").default
        },
        methods: {
            finishWindow() {
                this.displayWindow++;

                if(this.isAtEnd()) {
                    this.appState.setShouldShowWelcomeWizard(false);
                }
            },
            isAtEnd() {
                return this.numWindows() - 1 === this.displayWindow;
            },
            numWindows() {
                return this.$children.length;
            }
        }
    }
</script>

<style scoped>
    .wizard {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>