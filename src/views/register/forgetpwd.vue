<template>
    <div style="height: 100%;">
        <content-head :headTitle="'注册'" :disabled="true"></content-head>
        <div class="module">
            <p class="from-title">注册帐号</p>
            <div class="module-content">
                <el-form :model="forgetForm" :rules="rules" ref="registerForm" label-width="150px" class="demo-ruleForm" size="medium">
                    <el-form-item label="邮箱或手机号码" prop="concatInfo">
                        <el-input v-model="forgetForm.concatInfo" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="verCode">
                        <el-input v-model="forgetForm.verCode" style="width: 215px"></el-input>
                        <span class="from-varCode"></span>
                    </el-form-item>
                </el-form>
                <div class="form-button">
                    <el-button type="primary" style="width: 300px" @click="submitForm('ruleForm')">下一步</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead"
export default {
    name: "forgerpwd",
    components: {
        "content-head": contentHead
    },
    data () {
        return {
            forgetForm: {
                concatInfo: "",
                verCode: ""
            },
            rules: {
                concatInfo: [
                    { required: true, message: "请输入邮箱或手机号码", trigger: "blur" }
                ],
                verCode: [
                    { required: true, message: "请输入验证码", trigger: "blur" }
                ],
            }
        }
    }
}
</script>

<style scoped>
.header{
    overflow: hidden;
    height: 60px;
    font-size: 16px;
    padding: 0 20px;
    background-color: #fff;
    line-height: 60px;
    box-sizing: border-box;
}
.hedaer-logo{
    padding-top: 10px;
    display: inline-block;
    /* vertical-align: middle; */
}
.header-right{
    float: right;
    line-height: 60px;
}
.header-button{
    display: inline-block;
    margin-left: 10px;
    vertical-align: top;
}
.from-varCode{
    display: inline-block;
    width: 80px;
    height: 32px;
    border: 1px solid #e8e8e8;
    vertical-align: middle
}
</style>
