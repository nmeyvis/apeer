<script>
    const icons = require("feather-icons").icons;
    const iconsStyle = { width: 17, height: 17, "stroke-width": 1 };

    export default {
        name: "app-header",
        data() {
            return {
                slidersIcon: icons["sliders"].toSvg(iconsStyle),
                loginIcon: icons["log-in"].toSvg(iconsStyle),
                showJoinRoomPopup: false,
                appName: BRANDING.appName
            }
        },
        methods: {
            toggleJoinRoomPopup() {
                this.showJoinRoomPopup = !this.showJoinRoomPopup;
            },
            isMobile: window.isMobile
        },
        components: {
            "join-room": require("./join-room.vue").default,
            "popper": require("vue-popperjs"),
            "confirmation-window": require("./confirmation-window.vue").default
        }
    }
</script>

<template>
    <div class="header">
        <div class="">{{ appName }}</div>
        <div class="options">
            <div v-if="isMobile()" slot="reference" class="option" @click="toggleJoinRoomPopup"><label v-html="loginIcon"></label><span>Join Room</span></div>

            <popper v-else trigger="click" :visible-arrow="false" :options="{ placement: 'bottom', modifiers: { preventOverflow: { boundariesElement: 'viewport' } } }">
                <div class="popper popover">
                    <div class="panel panel-floating">
                        <join-room></join-room>
                    </div>
                </div>
                <div slot="reference" class="option"><label v-html="loginIcon"></label><span>Join Room</span></div>
            </popper>

            <!--<div class="option"><label v-html="slidersIcon"></label><span>Settings</span></div>-->
        </div>

        <confirmation-window v-if="showJoinRoomPopup" v-on:finished="toggleJoinRoomPopup" v-bind:show-close="true">
            <join-room></join-room>
        </confirmation-window>
    </div>
</template>

<style scoped>

    .popover {
        min-width: 450px;
        max-width: 25%;
    }

    .header {
        display: flex;
        justify-content: space-between;
        background-color: #3f3f3f;
        padding: 8px 10px;
        color: #f0f0f0;
    }

    .header > .options {
        display: flex;
    }

    .option svg {
        width: 17px;
    }

    .option {
        display: flex;
        padding: 0 10px;
        cursor: pointer;
    }

    .option label {
        margin-right: 10px;
        display: flex;
        align-items: center;
    }
</style>