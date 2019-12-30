<template>
    <div>
        <v-content-head :headTitle="$t('alarm.alarmCofig')" :headSubTitle="$t('alarm.emailAlarmConfig')" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 20px 29px;">
            <el-form :model="emailForm" :rules="rules" ref="emailForm" label-width="150px" class="demo-ruleForm">
                <el-form-item :label="$t('alarm.agreementType')" prop="serverType" style="width: 420px;display: inline-block">
                    <el-input v-model="emailForm.serverType" style="width: 250px;" @change='dataChange'></el-input>
                </el-form-item><br>
                <el-form-item :label="$t('alarm.address')" prop="address" style="width: 420px;display: inline-block">
                    <el-input v-model="emailForm.address" style="width: 250px;" @change='dataChange'></el-input>
                </el-form-item>
                <el-form-item :label="$t('alarm.port')" style="width: 420px;display: inline-block">
                    <el-input v-model="emailForm.port" style="width: 250px;" @change='dataChange'></el-input>
                </el-form-item><br>
                <hr style="margin-bottom: 30px;color: red;">
                <el-form-item :label="$t('alarm.authentication')" style="width: 420px;display: inline-block">
                    <el-switch
                        v-model="emailForm.authentication"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="1"
                        :inactive-value="0"
                        @change='authChange'>
                    </el-switch>
                    <el-tooltip class="item" effect="dark" :content="$t('alarm.authenticationTips')" placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item><br>
                <el-form-item :label="$t('alarm.user')" prop="email" style="width: 420px;display: inline-block">
                    <el-input v-model="emailForm.email" style="width: 250px;" :disabled="authDisabled" @change='dataChange'></el-input>
                </el-form-item>
                <el-form-item :label="$t('alarm.password')" prop="password" style="width: 420px;display: inline-block">
                    <el-input type='password' v-model="emailForm.password" style="width: 250px;" show-password9 :disabled="authDisabled" @change='dataChange'></el-input>
                </el-form-item><br>
                
                <!-- <el-form-item label="Status" style="width: 420px;display: inline-block">
                    <el-switch
                        v-model="emailForm.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="1"
                        :inactive-value="0">
                    </el-switch>
                </el-form-item> -->
                <hr style="margin-bottom: 30px;color: red;">
                <el-form-item>
                    <el-button type="primary" @click="submitForm('emailForm')">{{$t('alarm.save')}}</el-button>
                    <el-button  @click="sendEmail">{{$t('alarm.test')}}</el-button><br>
                    <span v-if='tipShow' style="color: #f00">{{$t('alarm.saveTips')}}</span>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { getEmailList,changeEmailConfig,testEmail } from "@/util/api"
import errcode from "@/util/errcode"
import contentHead from "@/components/contentHead";
export default {
    name: "emailAlarm",
    components: {
        "v-content-head": contentHead,
    },
    data: function(){
        return {
            emailForm: {
                serverType: "",
                address: "",
                port: "",
                email: "",
                password: "",
                format: "",
                authentication: 0,
                // status: 0,
            },
            emailData: null,
            // testEmail: "",
            authDisabled: false,
            tipShow: false
        }
    },
    computed: {
        rules() {
            let data = {
                serverType: [
                    {
                        required: true,
                        message: this.$t("alarm.serverTypeTips"),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 32,
                        message: this.$t("alarm.longSize"),
                        trigger: "blur"
                    },
                    {
                        pattern: /^[A-Za-z0-9_]+$/,
                        message: this.$t("alarm.notRule"),
                        trigger: "blur"
                    }
                ],
                address: [
                    {
                        required: true,
                        message: this.$t("alarm.enterAddress"),
                        trigger: "blur"
                    },
                    {
                        pattern: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
                        message: this.$t("alarm.notRule"),
                        trigger: "blur"
                    }
                ],
                email: [
                    {
                        required: true,
                        message: this.$t("alarm.enterEmail"),
                        trigger: "blur"
                    },
                    {
                        pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
                        message: this.$t("alarm.notRule"),
                        trigger: "blur"
                    },
                ],
                password: [
                    {
                        required: true,
                        message: this.$t("alarm.enterEmailPsd"),
                        trigger: "blur"
                    },
                ],
                format: [
                     {
                        required: true,
                        message: this.$t("alarm.enterFormat"),
                        trigger: "blur"
                    },
                ],
            }
            return data
        }
    },
    mounted: function(){
        this.getEmailConfig();
    },
    methods: {
        changGroup: function(){

        },
        dataChange: function(){
            if(this.emailForm.serverType == this.emailData.protocol && this.emailForm.address == this.emailData.host &&
            this.emailForm.port == this.emailData.port && this.emailForm.email == this.emailData.username &&
            this.emailForm.password == this.emailData.password && this.emailForm.authentication == this.emailData.authentication){
                this.tipShow = false
            }else{
                this.tipShow = true
            }
        },
        authChange: function(val){
            this.dataChange()
            if(!val){
                this.authDisabled = true
            }else{
                this.authDisabled = false
            }
        },
        sendEmail: function(){
            this.$prompt(this.$t("alarm.enterEmail"), this.$t("alarm.tip"), {
                confirmButtonText: this.$t("alarm.send"),
                cancelButtonText: this.$t("alarm.cancel"),
                inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                inputErrorMessage: this.$t("alarm.emailTypeErr"),
                }).then(({ value }) => {
                    this.testEamilData(value)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t("alarm.cancelEnter"),
                    });       
                });
        },
        testEamilData: function(val){
            let data = {
                serverId: this.emailData.serverId,
                host: this.emailForm.address,
                port: this.emailForm.port,
                username: this.emailForm.email,
                password: this.emailForm.password,
                protocol: this.emailForm.serverType,
                defaultEncoding: this.emailForm.format,
                authentication: this.emailForm.authentication,
            };
            testEmail(val,data).then(res => {
                if(res.data.code === 0){
                    this.$message({
                            type: "success",
                            message: this.$t("alarm.sendEmailSuccess"),
                        });
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
        },
        getEmailConfig: function(){
            getEmailList().then(res => {
                if(res.data && res.data.code === 0){
                    if(res.data.data.length) {
                        this.emailForm.serverType = res.data.data[0].protocol;
                        this.emailForm.address = res.data.data[0].host;
                        this.emailForm.port = res.data.data[0].port;
                        this.emailForm.email = res.data.data[0].username;
                        this.emailForm.password = res.data.data[0].password;
                        this.emailForm.format = res.data.data[0].defaultEncoding;
                        this.emailForm.authentication = res.data.data[0].authentication;
                        // this.emailForm.status = res.data.data[0].status;
                        this.emailData = res.data.data[0];
                        if(!res.data.data[0].authentication){
                            this.authDisabled = true
                        }
                    }
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
        },
        submitForm: function(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.modifyEmail()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        modifyEmail: function(){
            let data = {
                serverId: this.emailData.serverId,
                host: this.emailForm.address,
                port: this.emailForm.port,
                username: this.emailForm.email,
                password: this.emailForm.password,
                protocol: this.emailForm.serverType,
                defaultEncoding: this.emailForm.format,
                authentication: this.emailForm.authentication,
                // status: this.emailForm.status,
            }
            changeEmailConfig(data).then(res => {
                this.tipShow = false
                if(res.data && res.data.code === 0){
                    this.$message({
                        type: "success",
                        message: this.$t("alarm.updateEmailAlarmConfigSuccess")
                    });
                    this.getEmailConfig();
                }else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.tipShow = false
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        }
    },
    beforeRouteLeave: function(to,from,next){
        if(this.tipShow){
            this.$message({
                type: "error",
                message: this.$t("alarm.enterSaveInfo")
            });
        }else{
            next()
        }  
    }
}
</script>

<style>

</style>