<template>
    <div>
        <el-dialog title="新建文件" :visible.sync="dialogVisible" :before-close="modelClose" class="dialog-wrapper" width="600px">
            <div >
                <json-viewer
                    :value="blcokContent"
                    :expand-depth=5
                    copyable
                    sort
                    boxed></json-viewer>
                    <div style="text-align: center" v-if="noData">暂无数据</div>
                </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "abiDialog",
    props: ["data","show"],
    data: function(){
        return {
            dialogVisible: this.show,
            noData: false,
            blcokContent: null
        }
    },
    mounted: function(){
        let data = {
            list: JSON.parse(this.data)
        }
        this.blcokContent = JSON.parse(this.data)
        this.$nextTick(function () {
            if(this.blcokContent){
                this.noData = false
            }else{
                this.noData = true
            }
        })
    },
    methods: {
        modelClose: function(){
            this.$emit("close")
        }
    }
}
</script>

