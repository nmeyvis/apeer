<script>
    const icons = require("feather-icons").icons;
    const ToggleButton = require("../node_modules/vue-js-toggle-button/src/Button.vue").default;

    const iconsStyle = { width: 24, height: 24, "stroke-width": 1 };

    export default {
        data() {
            return {
                shieldIcon: icons["shield"].toSvg({ width: 34, height: 34 }),
            }
        },
        props: {
            room: Object
        },
        computed: {
            accessOverview() {
                if(this.room.isLocked) {
                    return "Room is locked. No one can join.";
                }

                let passwordPart = (this.room.hasPassword) ? " and a password" : "";
                return `Room requires link${ passwordPart } to join`;
            },
            visibilityOverview() {
                if(this.room.isLocked) {
                    return "";
                }

                if(this.room.exposedToHostNetwork) {
                    return "It's also visible to anyone on your network without the link";
                }

                return "";
            },
            passwordPlaceholderText() {
                return (this.room.hasPassword) ? "******" : "not set"
            }
        },
        components: {
            ToggleButton: ToggleButton
        }
    }
</script>

<template>
    <div>
        <div class="settings">
            <div class="settings-header">
                <span v-html="shieldIcon"></span> Room Security
            </div>

            <div class="setting">
                <div class="setting-input">
                    <div>Password</div>
                    <div><input type="password" @change="room.setPassword($event.target.value)" :placeholder="passwordPlaceholderText"></div>
                </div>
                <div class="setting-desc">Require a password to join. Recommended if you are exposing to Network.</div>
            </div>

            <div class="setting">
                <div class="setting-input">
                    <div>Expose to Network</div>
                    <div><ToggleButton :sync="true" v-model="room.exposedToHostNetwork" @change="(e) => room.exposeToNetwork(e.value)"></ToggleButton></div>
                </div>
                <div class="setting-desc">Make your room visible to those on your local Network. Other security settings still apply.</div>
            </div>

            <div class="setting">
                <div class="setting-input">
                    <div>Lock Room</div>
                    <div><ToggleButton :sync="true" v-model="room.isLocked" @change="(e) => room.lock(e.value)"></ToggleButton></div>
                </div>
                <div class="setting-desc">Prevent further joins by locking the room.</div>
            </div>
        </div>

        <div v-bind:class="{ 'security-overview': true, warn: room.isLocked }">
            <div class="tiny-label">Security Summary</div>
            <ol>
                <li>
                    {{ accessOverview }}
                </li>

                <li>
                    {{ visibilityOverview }}
                </li>
            </ol>
        </div>
    </div>
</template>

<style scoped>

    ol {
        list-style: none;
    }

    ol > li {
        padding-top: 8px;
    }

    .settings {
        padding: 20px;
    }

    .settings-header {
        display: flex;
        align-items: center;
        font-size: 1.5em;
        font-weight: 400;
        margin-bottom: 35px;
    }

    .settings-header > span {
        width: 34px;
        height: 34px;
        margin-right: 6px;
    }

    .setting {
        margin-top: 25px;
    }

    .setting-input {
        display: flex;
        justify-content: space-between;
    }

    .setting-desc {
        margin-top: 10px;
        font-size: 0.8em;
        color: #8b95a2;
    }

    .security-overview {
        margin-top: 15px;
        padding: 20px;
        background-color: #f3f3f3;
        text-align: center;
        font-size: 0.8em;
        border-radius: 3px;
    }

    .security-overview.warn {
        background-color: #ffd523;
        color: #2f2f2f;
    }

    @media(max-width: 768px) {
        .security-overview {
            background-color: transparent;
        }
    }
</style>