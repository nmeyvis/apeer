<script>
    export default {
        name: "room-speed-dial",
        props: {
            network: Object
        }
    }
</script>

<template>
    <div class="speed-dial" v-if="network.rooms.length > 0">
        <h1>Join a Room</h1>
        <h2>Rooms that are visible to you</h2>
        <div class="dials">
            <a v-bind:href="room.roomUrl" v-for="room in network.rooms" class="button button-primary dial" v-bind:title="room.id" >
                {{ room.truncateRoomId() }}<span v-if="room.wouldTruncateRoomId()">...</span>
                <div class="small">Room</div>
            </a>
        </div>
    </div>
</template>

<style scoped>
    .speed-dial {
        border-top: 1px solid lightgray;
        padding: 14px 13px;

        margin-top: 65px;
        text-align: center;
    }

    .speed-dial h1 {
        font-weight: normal;
        font-size: 1em;
    }

    .speed-dial h2 {
        font-weight: normal;
        font-size: 0.8em;
    }

    .dial {
        margin-top: 25px;
        display: block;
        border: 1px solid;
        background-color: transparent;
        border-radius: 5px;
        padding: 17px 25px;
        color: inherit;
    }

    .dial:hover {
        color: white;
        background-color: #416dea;
        border: 1px solid transparent;
    }


    .small {
        font-size: 0.8em;
        color: #adadad;
    }
</style>