<template>
    <div>
        <v-content-head :headTitle="'告警配置'" :headSubTitle="'邮件告警配置'" @changGroup="changGroup" :headTooltip="`系统配置管理说明：系统配置可以配置系统属性值（目前支持tx_count_limit和tx_gas_limit属性的设置）。`"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 20px 29px;">
            <el-form :model="emailForm" :rules="rules" ref="emailForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="协议类型" prop="serverType" style="width: 420px;display: inline-block">
                    <el-input v-model="emailForm.serverType" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address" style="width: 420px;display: inline-block">
                    <el-input v-model="emailForm.address" style="width: 250px;"></el-input>
                </el-form-item><br>
                <el-form-item label="端口" style="width: 420px;display: inline-block">
                    <el-input v-model="emailForm.port" style="width: 250px;"></el-input>
                </el-form-item><br>
                <el-form-item label="邮箱" prop="email" style="width: 420px;display: inline-block">
                    <el-input v-model="emailForm.email" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" style="width: 420px;display: inline-block">
                    <el-input type='password' v-model="emailForm.password" style="width: 250px;" show-password9></el-input>
                </el-form-item><br>
                <el-form-item label="Authentication" style="width: 420px;display: inline-block">
                    <el-switch
                        v-model="emailForm.authentication"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="1"
                        :inactive-value="0">
                    </el-switch>
                    <el-tooltip class="item" effect="dark" content="默认使用username/password进行验证，通过SSL/TLS连接邮箱服务" placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item><br>
                <el-form-item label="Status" style="width: 420px;display: inline-block">
                    <el-switch
                        v-model="emailForm.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="1"
                        :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <hr style="margin-bottom: 30px;color: red;">
                <el-form-item>
                    <el-button type="primary" @click="submitForm('emailForm')">保存</el-button>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="请输入测试邮箱" v-model="testEmail" class="input-with-select" style="width: 300px;">
                        <el-button slot="append" @click="sendEmail">测试</el-button>
                    </el-input>
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
                status: 0,
            },
            emailData: null,
            rules: {
                serverType: [
                    {
                        required: true,
                        message: "请输入服务类型",
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
                        message: "不符合规则",
                        trigger: "blur"
                    }
                ],
                address: [
                    {
                        required: true,
                        message: "请输入地址",
                        trigger: "blur"
                    },
                    {
                        pattern: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
                        message: "不符合规则",
                        trigger: "blur"
                    }
                ],
                email: [
                    {
                        required: true,
                        message: "请输入邮箱",
                        trigger: "blur"
                    },
                    {
                        pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
                        message: "不符合规则",
                        trigger: "blur"
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入邮箱密码",
                        trigger: "blur"
                    },
                ],
                format: [
                     {
                        required: true,
                        message: "请输入编码格式",
                        trigger: "blur"
                    },
                ],
            },
            testEmail: "",
        }
    },
    mounted: function(){
        this.getEmailConfig();
    },
    methods: {
        changGroup: function(){

        },
        sendEmail: function(){
            let inputPattern = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
            if(inputPattern.test(this.testEmail)){
                this.testEamilData(this.testEmail)
            }else{
                this.$message({
                        type: 'error',
                        message: '邮箱格式不正确'
                    }); 
                this.testEmail = ""
            }
        },
        testEamilData: function(val){
            testEmail(val).then(res => {
                if(res.data.code === 0){
                    this.$message({
                            type: "success",
                            message: "邮件发送成功！"
                        });
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
                        this.emailForm.status = res.data.data[0].status;
                        this.emailData = res.data.data[0];
                    }
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
                status: this.emailForm.status,
            }
            changeEmailConfig(data).then(res => {
                if(res.data && res.data.code === 0){
                    this.$message({
                        type: "success",
                        message: "修改告警邮箱配置成功！"
                    });
                    this.getEmailConfig();
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