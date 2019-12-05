<script>
    export default {
        name: "introduction"
    }
</script>

<template>
    <div>
        <h1>Welcome to my app!</h1>
        <div class="features">
            <div class="feature">
                <h2>Private Rooms</h2>
                <ul>
                    <li>Share files with up to 12 people per room</li>
                    <li>Only those with the room link can join</li>
                </ul>
            </div>
            <div class="feature">
                <h2>Peer to Peer</h2>
                <p>Serverless file transfer</p>
                <ul>
                    <li>Files are never transmitted or stored on a server</li>
                    <li>Quicked fast speeds over LAN</li>
                </ul>
            </div>
            <div class="feature">
                <h2>It just works</h2>
                <ul>
                    <li>No account registration</li>
                    <li>Works on all platforms, including mobile</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .features {
        display: flex;
        justify-content: space-between;
    }

    .feature {
        padding: 50px;
    }
</style>