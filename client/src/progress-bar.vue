<script>
    export default {
        name: "progress-bar",
        props: {
            progress: String
        },
        computed: {
            percentDone: function() {
                return this.progress + "%";
            }
        }
    }
</script>

<template>
    <div class="progress-bar">
        <div class="progress" v-bind:style="{ width: percentDone }"></div>
    </div>
</template>

<style scoped>

</style>