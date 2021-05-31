<template>
    <div style="height: 100%">
        <newFront v-show='deployType == 0'></newFront>
        <deployFront v-if='deployType == 1'></deployFront>
    </div>
</template>

<script>
import deployFront from "./deployFront"
import newFront from "./newFront"
export default {
    name: "index",
    components: {
        deployFront,
        newFront
    },
    data: function () {
        return {
            deployType: null
        }
    },
    created() {
        console.log(localStorage.getItem("deployType"))
        if (localStorage.getItem("deployType")) {
            this.deployType = localStorage.getItem("deployType")
        } else {
            this.deployType = 0
        }
    },
}
</script>

<style>
</style>