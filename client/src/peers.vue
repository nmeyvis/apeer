<script>
    export default {
        name: "peers",
        props:{
            peers: Array,
            network: Object
        },
        components: {
            "peer": require("./peer.vue").default,
            "room-speed-dial": require("./room-speed-dial.vue").default
        }
    }
</script>

<template>
    <div class="peers-container">
        <div class="alone" v-if="peers.length === 0">
            <h1>You're alone here</h1>
            <div>Send people your link</div>
            <room-speed-dial :network="network"></room-speed-dial>
        </div>
        <div class="peers">
            <peer v-for="peer in peers" v-bind:peer="peer"></peer>
        </div>
    </div>
</template>

<style scoped>
    .peers-container {
        height: 100%;
    }

    .alone {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>