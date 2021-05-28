<template>
    <div style="height: 100%">
        <newMain v-if='deployType == 0'></newMain>
        <mains v-if='deployType == 1'></mains>
    </div>
</template>

<script>
import newMain from "./newMain"
import mains from "./main"
export default {
    name: "index",
    components: {
        newMain,
        mains
    },
    data: function () {
        return {
            deployType: null
        }
    },
    created: function () {
        localStorage.removeItem('selectData')
        if (localStorage.getItem("deployType")) {
            this.deployType = localStorage.getItem("deployType")
        } else {
            this.deployType = 0
        }
    }
}
</script>

<style>
</style>