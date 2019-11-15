<template>
    <div>
        <el-dialog title="告警配置" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
        <div>
            <el-form :model="alarmForm" :rules="rules" ref="alarmForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="告警标题" prop="ruleName">
                    <el-input v-model="alarmForm.ruleName" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item label="告警内容" prop="alertContent">
                    <el-input v-model="alarmForm.alertContent" type="textarea" :rows="2" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item label="接收者邮箱">
                    <el-select v-model="alarmForm.userList" multiple placeholder="请选择" @change='userChange($event)' style="width: 250px;">
                        <el-option
                        v-for="item in accountList"
                        :key="item.account"
                        :label="item.account + '(' + item.email + ')'"
                        :value="item.email">
                        </el-option>
                    </el-select>
                    <el-tooltip class="item" effect="dark" content="仅能选择已添加邮箱的用户" placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="发送间隔时间" prop="alertIntervalSeconds">
                    <el-select v-model="alarmForm.alertIntervalSeconds" placeholder="请选择" style="width: 250px;">
                        <el-option label="5分钟" value="300"></el-option>
                        <el-option label="半小时" value="1800"></el-option>
                        <el-option label="一个小时" value="3600"></el-option>
                        <el-option label="12个小时" value="43200"></el-option>
                        <el-option label="一天" value="86400"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary"  @click="submitForm('alarmForm')">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import { changeAlarm,accountList } from "@/util/api"
import errcode from "@/util/errcode"
import router from "@/router"
export default {
    name: "emailAlarmTypeDetail",
    props: ['show','data'],
    data: function(){
        return {
            dialogVisible: this.show,
            alarmData: this.data,
            alarmForm: {
                ruleName: this.data.ruleName,
                alertContent: this.data.alertContent,
                alertIntervalSeconds: this.data.alertIntervalSeconds,
                userList: []
            },
            rules: {
               ruleName: [
                   {
                        required: true,
                        message: "请输入服务名称",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 32,
                        message: "长度在 1 到 32 个字符",
                        trigger: "blur"
                    }
               ],
               alertContent: [
                    {
                        required: true,
                        message: "请输入服务名称",
                        trigger: "blur"
                    },
               ],
               alertIntervalSeconds: [
                    {
                        required: true,
                        message: "请输入服务名称",
                        trigger: "blur"
                    }, 
               ]
            },
            accountList: [],
            currentPage: 1,
            pageSize: 1000,
        }
    },
    mounted: function(){
        if(this.alarmData.userList){
            this.alarmForm.userList = JSON.parse(this.alarmData.userList)
        }
        this.getAccountList();
    },
    methods: {
        handleClose: function(){
            this.$emit("close")
        },
        submitForm: function(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.modifyAlarm()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        userChange: function(val){
            if(this.alarmForm.userList && this.alarmForm.userList.length){
                if(!this.alarmForm.userList[this.alarmForm.userList.length-1]){
                    this.$message({
                            type: "error",
                            message: "该用户没有邮箱，请在账号管理中添加邮箱！"
                        });
                        this.alarmForm.userList.splice(this.alarmForm.userList.length-1,1)
                }
            }
        },
        getAccountList() {
            let reqData = {
                    pageNumber: this.currentPage,
                    pageSize: this.pageSize
                },
                reqQuery = {
                    account: ''
                };
            accountList(reqData, reqQuery)
                .then(res => {
                    if (res.data.code === 0) {
                        this.accountList = res.data.data || [];
                        // for( let i = 0; i < this.accountList.length; i++){
                        //     if(!this.accountList[i].email){
                        //         this.accountList.splice(i,1)
                        //     }
                        // }
                    } else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: errcode.errCode[err.data.code].cn || "系统错误！"
                    });
                });
        },
        modifyAlarm: function(){
            let data = {
                ruleId: this.alarmData.ruleId,
                alertIntervalSeconds: this.alarmForm.alertIntervalSeconds,
                alertContent: this.alarmForm.alertContent,
                ruleName: this.alarmForm.ruleName,
            }
            if(this.alarmForm.userList && this.alarmForm.userList.length){
                data.userList = JSON.stringify(this.alarmForm.userList)
            }else{
                data.userList = ""
            }
            changeAlarm(data).then(res => {
                if(res.data.code === 0){
                    this.$message({
                        type: "success",
                        message: "修改告警配置成功！"
                    });
                    this.handleClose();
                }else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "系统错误！"
                    });
                });
        }
    }
}
</script>

<style>

</style>