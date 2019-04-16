<template>
    <div></div>
</template>
<script>
import router from "@/router"
export default {
    name: "blank",
    data: function(){
        return {

        }
    },
    mounted: function(){
        this.golink();
    },
    methods: {
        golink: function(){
            if(!this.$route.query.path){
                router.push({
                    path: '/home'
                })
            }else{
                router.push({
                    path: this.$route.query.path,
                });
            }
            
        }
    }
}
</script>

