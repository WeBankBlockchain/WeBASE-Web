<template>
    <div style="height: 100%">
        <newFront v-if='deployType == 0'></newFront>
        <front v-if='deployType == 1'></front>
    </div>
</template>

<script>
import newFront from "./newFront"
import front from "./front"
export default {
    name: "index",
    components: {
        newFront,
        front
    },
    data: function () {
        return {
            deployType: null
        }
    },
    mounted: function () {
        if(localStorage.getItem("deployType")){
            this.deployType = localStorage.getItem("deployType")
        }else{
            this.deployType = 0
        }
    }
}
</script>

<style>

</style>