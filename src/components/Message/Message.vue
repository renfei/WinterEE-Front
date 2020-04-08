<template>
    <div>
        <v-snackbar
                v-model="snackbar"
                :color="color"
                :timeout="timeout"
                :top="true"
                :vertical="true"
        >
            {{ text }}
            <v-btn
                    dark
                    text
                    @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'message',
        data(){
            return {
                text: "",
                snackbar: false,
                timeout: 6000,
                color: "info"
            }
        }
    }
</script>