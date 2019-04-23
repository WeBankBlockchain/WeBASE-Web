<template>
    <div>
        <el-dialog title="新建文件" :visible.sync="dialogVisible" :before-close="modelClose" class="dialog-wrapper" width="433px" :center="true">
            <div>
                <el-form :model="fileFrom" :rules="rules" ref="fileFrom" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="合约名称" prop="contractName" >
                        <el-input v-model="fileFrom.contractName" style="width: 210px;"></el-input>
                    </el-form-item>
                    <el-form-item label="文件目录" >
                        <el-select v-model="fileFrom.contractType" :disabled='disabled' placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.folderName"
                            :label="item.folderName"
                            :value="item.folderName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="modelClose">取 消</el-button>
                <el-button type="primary" @click="submit('fileFrom')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "addFile",
    props: ['fileshow','data','id'],
    data: function(){
        return {
            dialogVisible: this.fileshow,
            fileFrom: {
                contractName: "",
                contractType: ""
            },
            disabled: false,
            folderId: this.id,
            rules: {
               contractName: [
                    {
                        required: true,
                        message: "请输入合约名称",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 32,
                        message: "长度在 1 到 32 个字符",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[A-Za-z0-9_]+$/,
                        message: "合约名不符合规则",
                        trigger: "blur"
                    }
               ] 
            },
            options: [],
        }
    },
    mounted: function(){
        this.changeOptions();
    },
    methods: {
        changeOptions: function(){
            this.disabled = false
            this.options = [{
                folderName: "/",
                folderId: 1,
            }];
            if(localStorage.getItem("folderList")){
                let arry = JSON.parse(localStorage.getItem("folderList"));
                for(let i = 0; i < arry.length; i++){
                    if(arry[i].groupId == localStorage.getItem("groupId")){
                        this.options.push(arry[i])
                    }
                }
            }
            this.fileFrom.contractType = this.options[0].folderName
            if(this.folderId){
                this.options.forEach(value => {
                    if(value.folderId == this.folderId){
                        this.fileFrom.contractType = value.folderName;
                        this.disabled = true
                    }
                })
            }
        },
        submit: function(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = {
                        contractName: this.fileFrom.contractName,
                        contractSource: "",
                        contractPath: this.fileFrom.contractType,
                        contractType: 'file',
                        contractActive: false,
                        contractstatus: 0,
                        contractAbi: "",
                        contractBin: "",
                        contractAddress: "",
                        contractVersion: "",
                        contractNo: (new Date()).getTime()
                    }
                    this.$emit("success",data)
                }else{
                    return false
                }
            })
        },
        modelClose: function(){
            this.$emit("close")
        }
    }
}
</script>

