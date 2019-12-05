<script>
    export default {
        name: "peer",
        props: {
            peer: Object
        },
        components: {
            "peer-folder": require("./peer-folder.vue").default
        }
    }
</script>

<template>
    <peer-folder v-bind:peer="peer"></peer-folder>
</template>

<style scoped>

</style>