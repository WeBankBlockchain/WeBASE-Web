<template>
    <div>
        <div>
        <el-dialog title="新增节点" :visible.sync="dialogVisible" :before-close="modelClose" 
         class="dialog-wrapper" width="500px" :center="true" :show-close='true'>
            <div>
                <el-form  :model="nodeFrom" :rules='rules'  ref="nodeFrom" label-width="100px" class="demo-ruleForm">
                    <el-form-item  label='IP' prop='ip'>
                        <el-input v-model="nodeFrom.ip" placeholder="请输入IP" style="width: 250px;" maxlength="16" @blur='ipChange'></el-input>
                    </el-form-item>
                    <!-- <el-form-item  label='使用新群组'>
                        <el-radio-group v-model="radio">
                            <el-radio v-model="radio" label="1">是</el-radio>
                            <el-radio v-model="radio" label="2">否</el-radio>
                        </el-radio-group>
                    </el-form-item> -->
                    <!-- <el-form-item  label='新群组'  v-if='radio == 1'>
                        <el-input v-model="nodeFrom.groupId" placeholder="请输入新群组id" style="width: 250px;" maxlength="16"></el-input>
                    </el-form-item> -->
                    <el-form-item  label='选择群组'>
                        <el-select v-model="nodeFrom.groupId" placeholder="请选择活动区域" style="width: 250px;">
                            <el-option :label="item.groupName" :value="item.groupId" v-for='item in groupList'  :key='item.groupId'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label='所属机构' v-if='agencyShow'>
                        <el-input v-model="nodeFrom.agencyName" placeholder="请输入所属机构" style="width: 250px;" maxlength="16"></el-input>
                    </el-form-item>
                    <el-form-item label='节点数量'>
                        <el-input v-model="nodeFrom.num" placeholder="请输入节点数量" style="width: 250px;" maxlength="16"></el-input>
                    </el-form-item>
                </el-form>
                <div class="text-right sure-btn" style="margin-top:10px">
                    <el-button  @click="modelClose">{{this.$t("text.cancel")}}</el-button>
                    <el-button type="primary" :loading="loading" @click="submit('nodeFrom')">{{this.$t("text.sure")}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
    </div>
</template>

<script>
import { addNode ,getGroupsInvalidIncluded} from "@/util/api"
export default {
    name: "newNode",
    props: ['show','data'],
    data: function () {
        return {
            dialogVisible: this.show,
            radio: '2',
            nodeFrom: {
                ip: "",
                agencyName: "",
                num: 1,
                groupId: ""
            },
            rules: {
                ip: [
                    {required: true, message: '请输入IP', trigger: 'blur'},
                    {pattern:/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/, message: 'IP格式不正确', trigger: 'blur'}
                ]
            },
            loading: false,
            groupList: [],
            agencyShow: false,
            nodeList: this.data
        }
    },
    mounted: function () {
       this.getGroupList()
    },
    methods: {
        ipChange: function() {
            let num = 0;
            if(this.nodeList && this.nodeList.length){
                for(let i = 0; i < this.nodeList.length; i++){
                    if(this.nodeList[i].frontIp == this.nodeFrom.ip){
                        num ++;
                    }
                }
            }
            if(num == 0){
                this.agencyShow = true
            }else{
                this.agencyShow = false
            }
        },
        modelClose () {
            this.$emit("close")
        },
        submit: function (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.add()
                } else {
                    return false
                }
            })
        },
        add: function () {
            let reqData = {
                ip: this.nodeFrom.ip,
            }
            if(this.nodeFrom.groupId){
                reqData.groupId = this.nodeFrom.groupId
            }
            if(this.nodeFrom.agencyName){
                reqData.agencyName = this.nodeFrom.agencyName
            }
            if(this.nodeFrom.num){
                reqData.num = this.nodeFrom.num
            }
            addNode(reqData).then(res => {
                if(res.data.code === 0){
                    this.$message({
                        type: "success",
                        message: "新增节点成功"
                    })
                    this.modelClose()
                }else{
                    this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                }
            })
            .catch(err => {
                    this.loading = false;
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                    
                });
        },
        getGroupList: function(){
            getGroupsInvalidIncluded().then(res => {
                if(res.data.code === 0){
                    this.groupList = res.data.data
                }else{
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                   
                }
            }).catch(err => {
                this.$message({
                    message: this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            })
        },
    }
}
</script>

<style>

</style>