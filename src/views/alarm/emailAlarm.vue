<template>
    <div>
        <v-content-head :headTitle="'告警配置'" :headSubTitle="'邮件告警配置'" @changGroup="changGroup" :headTooltip="`系统配置管理说明：系统配置可以配置系统属性值（目前支持tx_count_limit和tx_gas_limit属性的设置）。`"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 20px 29px;">
            <el-form :model="emailForm" :rules="rules" ref="emailForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="协议类型" prop="serverType" style="width: 420px;display: inline-block">
                    <el-input v-model="emailForm.serverType" style="width: 250px;" @change='dataChange'></el-input>
                </el-form-item><br>
                <el-form-item label="地址" prop="address" style="width: 420px;display: inline-block">
                    <el-input v-model="emailForm.address" style="width: 250px;" @change='dataChange'></el-input>
                </el-form-item>
                <el-form-item label="端口" style="width: 420px;display: inline-block">
                    <el-input v-model="emailForm.port" style="width: 250px;" @change='dataChange'></el-input>
                </el-form-item><br>
                <hr style="margin-bottom: 30px;color: red;">
                <el-form-item label="鉴权" style="width: 420px;display: inline-block">
                    <el-switch
                        v-model="emailForm.authentication"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="1"
                        :inactive-value="0"
                        @change='authChange($event)'>
                    </el-switch>
                    <el-tooltip class="item" effect="dark" content="默认使用username/password进行验证，通过SSL/TLS连接邮箱服务" placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item><br>
                <el-form-item label="用户" prop="email" style="width: 420px;display: inline-block">
                    <el-input v-model="emailForm.email" style="width: 250px;" :disabled="authDisabled" @change='dataChange'></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" style="width: 420px;display: inline-block">
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
                    <el-button type="primary" @click="submitForm('emailForm')">保存</el-button>
                    <el-button  @click="sendEmail">测试</el-button><br>
                    <span v-if='tipShow' style="color: #f00">邮箱配置已修改，未保存，请点击保存按钮保存修改项。</span>
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
            // testEmail: "",
            authDisabled: false,
            tipShow: false
        }
    },
    mounted: function(){
        this.getEmailConfig();
    },
    methods: {
        changGroup: function(){

        },
        dataChange: function(){
            this.tipShow = true
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
            this.$prompt('请输入邮箱', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                inputErrorMessage: '邮箱格式不正确'
                }).then(({ value }) => {
                    this.testEamilData(value)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
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
                        // this.emailForm.status = res.data.data[0].status;
                        this.emailData = res.data.data[0];
                        if(!res.data.data[0].authentication){
                            this.authDisabled = true
                        }
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
                // status: this.emailForm.status,
            }
            changeEmailConfig(data).then(res => {
                this.tipShow = false
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
                    this.tipShow = false
                    this.$message({
                        type: "error",
                        message: "系统错误！"
                    });
                });
        }
    },
    beforeRouteLeave: function(to,from,next){
        if(this.tipShow){
            this.$message({
                type: "error",
                message: "请保存修改的配置信息！"
            });
        }else{
            next()
        }  
    }
}
</script>

<style>

</style>