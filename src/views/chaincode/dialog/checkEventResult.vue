<template>
    <div>
        <json-viewer :value="checkEventResult" :expand-depth=4 copyable sort boxed></json-viewer>
    </div>
</template>

<script>
export default {
    name: 'eventResult',

    components: {
    },

    props: ['checkEventResult'],

    data() {
        return {
            
        }
    },

    computed: {
    },

    watch: {
    },

    created() {
    },

    mounted() {
    },

    methods: {
    }
}
</script>

<style scoped>
</style>
