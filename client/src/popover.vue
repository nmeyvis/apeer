
<script>
    export default {
        name: "popover",
        data() {
            return {
                shouldDisplay: false
            }
        },
        methods: {
            togglePop() {
                this.shouldDisplay = !this.shouldDisplay;
            }
        }
    }
</script>

<template>
    <div class="popover">
        <div @click="togglePop" class="popover-trigger">
            <slot name="trigger"></slot>
            <div class="test"></div>
        </div>
        <div v-if="shouldDisplay" class="panel panel-floating popover-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>


<style scoped>
    .test {
        position: relative;
    }

    .popover-content {

        padding: 20px 30px;
        color: #6b7c93;
        border-radius: 5px;
        min-width: 400px;
    }

    .pop-top {

    }

    .pop-bottom {
        bottom: 0;
    }
</style>