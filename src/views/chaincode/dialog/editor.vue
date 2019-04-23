<template>
    <div>
        <el-dialog  :title="'交易内容'" :visible.sync="editorDialog" @close="modelClose" width="600px">
            <div >
                <json-viewer
                    :value="transationData"
                    :expand-depth='5'
                    copyable
                    sort></json-viewer>
                </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'editor',
    props: ['data','show'],
    data: function(){
        return {
            editorShow: true,
            aceEditor: null,
            transationData: this.data || "", 
            modePath: 'ace/mode/solidity',
            editorDialog: this.show || false,
        }
    },
    methods: {
        modelClose: function(){
            this.$emit('close')
        }
    }
}
</script>

