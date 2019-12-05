<script>
    export default {
        name: "download-manager",
        props: {
            downloads: Array
        },
        components: {
            "file-list": require("./file-list.vue").default
        }
    }
</script>

<template>
    <div>
        <h2>Downloads</h2>
        <file-list v-bind:files="downloads"></file-list>
    </div>
</template>

<style scoped>

</style>