<template>
    <div class="panel-spacious">
        <label>Pick a nickname</label>
        <p>A name seen by others in the room - this is saved for future rooms, but you can change it later.</p>
        <input type="text" v-model="nickname" placeholder="first name, nickname, device name" @focus="$event.target.select()" required pattern=".{2,26}" title="2 to 26 characters">
    </div>
</template>

<script>
    export default {
        name: "nickname-picker",
        data() {
            return {
                nickname: "peer123"
            }
        },
        watch: {
            nickname() {
                Peer.nickname = this.nickname;
            }
        }
    }
</script>

<style scoped>
    label {
        font-size: 1.76em;
    }

    input {
        background-color: transparent;
        outline: 0;
        border: 1px solid lightgray;
        padding: 20px 30px;
        font-size: 1.4em;
        margin-top: 30px;
        width: 100%;
        box-sizing: border-box;
        color: black;
        cursor: pointer;
        border-radius: 3px;
    }

    input:focus {
        border: 1px solid #2c5eaf;
    }

    p {
        font-size: 0.85em;
    }
</style>