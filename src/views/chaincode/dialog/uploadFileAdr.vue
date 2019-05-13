<template>
    <div>
       <el-dialog v-dialogDrag  :title="'加载已部署的合约'" :visible.sync="editorDialog" @close="modelClose" width="450px">
           <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="合约地址" prop="adr">
                    <el-input v-model="ruleForm.adr" maxlength="150"></el-input>
                </el-form-item>
           </el-form>
           <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
            </div>
       </el-dialog> 
    </div>
</template>

<script>
export default {
    name: "uploadAddress",
    props: ['show'],
    data: function(){
        return {
            ruleForm: {
                adr: "",
            },
            editorDialog: this.show,
            rules: {
                adr: [
                    {
                        required: true,
                        message: "请输入合约名称",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[A-Za-z0-9_]+$/,
                        message: "合约名不符合规则",
                        trigger: "blur"
                    }
                ]
            }

        }
    },
    methods: {
        modelClose: function(){
            this.$emit("close")
        },
        submit: function(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit("success",this.ruleForm.adr);
                    this.modelClose()
                } else {
                    return false;
                }
            })
        }
    }
}
</script>

<style>

</style>

