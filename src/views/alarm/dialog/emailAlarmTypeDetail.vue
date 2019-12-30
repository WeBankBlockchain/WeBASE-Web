<template>
    <div>
        <el-dialog :title="$t('alarm.alarmCofig')" :visible.sync="dialogVisible" width="500px" :before-close="handleClose" :center="true">
        <div>
            <el-form :model="alarmForm" :rules="rules" ref="alarmForm" label-width="120px" class="demo-ruleForm">
                <el-form-item :label="$t('alarm.alarmEmailTile')" prop="ruleName">
                    <el-input v-model="alarmForm.ruleName" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item :label="$t('alarm.alarmContent')" prop="alertContent">
                    <el-input v-model="alarmForm.alertContent" type="textarea" :rows="2" style="width: 250px;"></el-input>
                    <el-tooltip class="item" effect="dark" :content="$t('alarm.alarmContentTip')" placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item :label="$t('alarm.recipientEmail')">
                    <el-select v-model="alarmForm.userList" multiple :placeholder="$t('alarm.pleaseSlect')" @change='userChange($event)' style="width: 250px;">
                        <el-option
                        v-for="item in accountList"
                        :key="item.account"
                        :label="item.account + '(' + item.email + ')'"
                        :value="item.email">
                        </el-option>
                    </el-select>
                    <el-tooltip class="item" effect="dark" :content="$t('alarm.recipientEmailTip')" placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item :label="$t('alarm.sendTime')" prop="alertIntervalSeconds">
                    <el-select v-model="alarmForm.alertIntervalSeconds" :placeholder="$t('alarm.pleaseSlect')" style="width: 250px;">
                        <el-option :label="item.lable" :value="item.value" v-for='item in alertIntervalSecondsList' :key='item.value'></el-option>
                    </el-select>
                    <el-tooltip class="item" effect="dark" :content="$t('alarm.alertIntervalSecondsTip')" placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
            </el-form>
        </div>
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="handleClose">{{$t('alarm.cancel')}}</el-button>
            <el-button type="primary"  @click="submitForm('alarmForm')">{{$t('alarm.sure')}}</el-button>
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
            accountList: [],
            currentPage: 1,
            pageSize: 1000,
        }
    },
    computed: {
        alertIntervalSecondsList() {
            let data = [
                {
                    lable: "5" + this.$t('alarm.minute'),
                    value: 300
                },
                {
                    lable: this.$t('alarm.halfHour'),
                    value: 1800
                },
                {
                    lable: "1" + this.$t('alarm.hours'),
                    value: 3600
                },
                {
                    lable: "12" + this.$t('alarm.hours'),
                    value: 43200
                },
                {
                    lable: "1" + this.$t('alarm.date'),
                    value: 86400
                },
            ]
            return data
        },
        rules() {
            let data = {
               ruleName: [
                   {
                        required: true,
                        message: this.$t('alarm.inputEmailTitle'),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 32,
                        message: this.$t('alarm.longSize'),
                        trigger: "blur"
                    }
               ],
               alertContent: [
                    {
                        required: true,
                        message: this.$t('alarm.inputalarmContent'),
                        trigger: "blur"
                    },
               ],
               alertIntervalSeconds: [
                    {
                        required: true,
                        message: this.$t('alarm.selectIntervalSeconds'),
                        trigger: "blur"
                    }, 
               ]
            };
            return data 
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
                            message: this.$t('alarm.noEmail')
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
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
                        message: this.$t('alarm.updateAlarmSuccess')
                    });
                    this.handleClose();
                }else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        }
    }
}
</script>

<style>

</style>