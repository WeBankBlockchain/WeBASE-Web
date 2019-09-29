<template>
    <div>
        <v-content-head :headTitle="'告警配置'" :headSubTitle="'邮件告警配置'" @changGroup="changGroup"></v-content-head>
        <div>
            
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
export default {
    name: 'MailboxAlarmManagement',

    components: {
        "v-content-head": contentHead,
    },

    props: {
    },

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
        changGroup() {

        }
    }
}
</script>

<style scoped>
</style>
