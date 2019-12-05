<script>
    const popper = require("vue-popperjs");
    const icons = require("feather-icons").icons;

    const iconsStyle = { width: 24, height: 24, "stroke-width": 1 };

    export default {
        data() {
            return {
                lockIcon: icons["lock"].toSvg(iconsStyle),
                unlockIcon: icons["unlock"].toSvg(iconsStyle),
                slidersIcon: icons["sliders"].toSvg(iconsStyle),
                showRoomSettingsPopup: false
            }
        },
        props: {
            roomInvite: String,
            room: Object
        },
        computed: {
            lockActionIcon() {
                return (this.room.isLocked || this.room.hasPassword) ? this.lockIcon : this.unlockIcon
            },
            lockActionName() {
                return this.room.isLocked ? "Unlock" : "Lock";
            },
            restrictionStatus() {
                if(this.room.isLocked) {
                    return "Room locked";
                }

                if(this.room.hasPassword) {
                    return "Password required";
                }

                return "Open to anyone with link";

            },
            amIHost() {
                return this.room.localClientId === this.room.hostClientId;
            }
        },
        methods: {
            toggleRoomSettingsPopup() {
                this.showRoomSettingsPopup = !this.showRoomSettingsPopup;
            },
            isMobile: window.isMobile
        },
        components: {
            "popover": require("./popover.vue").default,
            "popper": popper,
            "room-settings": require("./room-settings.vue").default,
            "confirmation-window": require("./confirmation-window.vue").default
        }
    }
</script>

<template>
    <div class="invite panel panel-floating">
        <label class="tiny-label">Invite people by sharing link</label>
        <div class="invite-details">
            <input type="text" class="select-all" v-model="roomInvite" onClick="this.select();">
        </div>
        <div v-if="amIHost" class="action-list">
            <div v-if="isMobile()" @click="toggleRoomSettingsPopup" class="action" v-html="slidersIcon"></div>

            <popper v-else trigger="click" :options="{ placement: 'top', modifiers: { offset: { offset: '0, 35' }, preventOverflow: { boundariesElement: 'viewport' } } }">
                <div class="panel panel-floating popover">
                    <room-settings :room="room"></room-settings>
                </div>

                <div slot="reference" class="action" v-html="slidersIcon"></div>
            </popper>

        </div>

        <confirmation-window v-if="showRoomSettingsPopup" @finished="toggleRoomSettingsPopup" :show-close="true">
            <room-settings :room="room"></room-settings>
        </confirmation-window>
    </div>

</template>

<style scoped>
    .popover {
        min-width: 400px;
        max-width: 25%;
    }

    .invite {
        display: flex;
        align-items: center;
        padding: 15px 30px;
        border-radius: 5px;
    }

    .invite-details {
        display: flex;
        width: 30%;
        margin: 0 15px;
    }

    .invite-details > input {
        width: 100%;
        padding: 5px 10px;
    }

    .action {
        height: 24px;
        margin: 0;
    }

    @media(max-width: 768px) {
        .invite {
            justify-content: space-around;
        }
    }
</style>