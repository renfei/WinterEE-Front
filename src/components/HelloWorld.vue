<template>
    <v-container class="fill-height" fluid>
        <v-row
                align="center"
                justify="center"
        >
            <v-img
                    :src="require('../assets/dashboard.svg')"
                    class="my-3"
                    contain
                    height="200"
            />
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: 'HelloWorld',

        data: () => ({})
    }
</script>
