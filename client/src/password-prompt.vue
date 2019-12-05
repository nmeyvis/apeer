<script>
    export default {
        name: "password-prompt",
        data() {
            return {
                password: null
            }
        },
        methods: {
            finish() {
                this.$emit("finished", this.password);
            }
        }
    }
</script>

<template>
    <div class="window">
        <div class="window-body panel panel-spacious">
            <form @submit="finish">
                <label for="room-password">Enter the password for the room</label>
                <input v-model="password" id="room-password" type="password" required>
                <button type="submit" class="button button-primary">Continue</button>
            </form>
        </div>
    </div>
</template>

<style scoped>
    button[type='submit'] {
        width: 100%;
        padding: 14px;
        font-size: 1.25em;
        margin: 0;
        margin-top: 35px;
    }

</style>