/*
 * Copyright 2014-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
<template>
    <div class="login-bg" :style="{backgroundImage: 'url(' + bgLogin +')'}">
        <div class="login-lang">
            <lang-select class="right-menu-item hover-effect"></lang-select>
        </div>
        <!-- <div class="login-encrypt">
            <el-radio-group v-model="encryption" @change="handleEncryption" size="mini">
                <el-radio-button label="hash">{{$t('login.hash')}}</el-radio-button>
                <el-radio-button label="guomi">{{$t('login.guomi')}}</el-radio-button>
            </el-radio-group>
        </div> -->
        <div class="login">
            <div>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#wbs-icon-WeBASE"></use>
                </svg>
                <p class="logo-content">WeBank Blockchain Application Software Extension</p>
                <!-- <i class="wbs-icon-WeBASE"></i> -->
                <!-- <h2 class="login-title">WeBASE</h2> -->
            </div>
            <div class="msg-wrapper">
                <div class="msg-error" v-show="msgError || timeout">
                    <i class="el-icon-remove"></i>
                    <span v-if="msgError">{{msgErrorContent || this.$t('text.loginFail')}}</span>
                    <span v-else-if="timeout">{{this.$t('text.reqOvertime')}}</span>
                </div>
            </div>
            <div class="login-content">
                <template>
                    <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form">
                        <el-form-item :label="$t('login.user')" prop="user">
                            <el-input v-model="loginForm.user" :placeholder="$t('inputText.user')">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('login.password')" prop="password">
                            <el-input v-model="loginForm.password" :placeholder="$t('inputText.password')" type="password">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('login.verificationCode')" prop="vercode">
                            <div style="width: 100%;">
                                <el-input style="width: 240px;" v-model="loginForm.vercode" :placeholder="$t('inputText.verificationCode')" @keyup.enter.native="submit('loginForm')">
                                </el-input>
                                <span class="codeUrlImg">
                                    <img style="width: 100%;height: 100%" :src="codeUrl" alt="" @click="changeCode()">
                                </span>
                            </div>
                        </el-form-item>
                    </el-form>
                </template>
            </div>
            <div>
                <el-button @click="submit('loginForm')" type="primary" class="login-submit" :loading="logining">{{this.$t('login.login')}}</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { login, networkList, haveNode, getPictureCheckCode,encryption } from "@/util/api";
import url from "@/util/url"
import router from "@/router";
import bg from "@/../static/image/banner.png";
import logo from "@/../static/image/logo-2 copy@1.5x.jpg";
import { delCookie } from '@/util/util'
import errcode from "@/util/errcode";
const sha256 = require("js-sha256").sha256;
const gm = require("@/util/SM2Sign");
import utils from "@/util/sm_sha"
import langSelect from "@/components/langSelect"
export default {
    name: "login",
    components: {
        "lang-select": langSelect
    },
    data: function () {
        return {
            bgLogin: bg,
            logoPng: logo,
            logining: false,
            msgError: false,
            msgErrorContent: "",
            timeout: false,
            codeUrl: url.codeUrl,
            loginForm: {
                user: "",
                password: "",
                vercode: "",
            },
            authToken: null,
            encryption: "hash"
            // newUserRules: {
            //     user: [
            //         { required: true, message: this.$t('inputText.user'), trigger: "blur" },
            //         {
            //             min: 1,
            //             max: 32,
            //             message: this.$t('rule.textLong'),
            //             trigger: "blur"
            //         }
            //     ],
            //     password: [
            //         { required: true, message: this.$t('inputText.password'), trigger: "blur" },
            //         {
            //             min: 5,
            //             max: 5,
            //             message: this.$t('rule.passwordError'),
            //             trigger: "blur"
            //         },
            //         {
            //             pattern: /admin/,
            //             message: this.$t('rule.loginPasswordType'),
            //             trigger: "blur"
            //         }
            //     ]
            // }
        };
    },
    computed: {
        rules() {
            var obj = {
                user: [{ required: true, message: this.$t('inputText.user'), trigger: "blur" }],
                password: [
                    { required: true, message: this.$t('inputText.password'), trigger: "blur" }
                ],
                vercode: [
                    { required: true, message: this.$t('inputText.verificationCode'), trigger: "blur" }
                ]
            }
            return obj
        }
    },
    mounted: function () {
        this.changeCode();
        this.getEncryption()
        // console.log(utils.sha4("Abcd1234"))
        // console.log(gm.sm3Digest("Abcd1234"))
    },
    methods: {
        handleEncryption: function(){
            if(this.encryption == 'guomi'){
                localStorage.setItem('encryptionId',1)
            }else {
                localStorage.setItem('encryptionId',0)
            }
        },
        submit: function (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.logining = true;
                    this.userLogin();
                } else {
                    return false;
                }
            });
        },
        changeCode: function () {
            this.codeUrl = "";
            this.authToken = ""
            getPictureCheckCode().then(res => {
                if (res.data.code === 0) {
                    this.codeUrl = `data:image/png;base64,${res.data.data.base64Image}`
                    this.authToken = res.data.data.token
                } else {
                    this.codeUrl = "";
                    this.authToken = ""
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.codeUrl = "";
                this.authToken = ""
                this.$message({
                    message: this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            })
        },
        userLogin: function (callback) {
            delCookie('JSESSIONID')
            delCookie('NODE_MGR_ACCOUNT_C')
            let reqData = {
                account: this.loginForm.user,
                accountPwd: sha256(this.loginForm.password)
            };
            // if(localStorage.getItem("encryptionId") == 1){
            //     reqData.accountPwd = "0x" + utils.sha4(this.loginForm.password)
            // }else{
            //     reqData.accountPwd = sha256(this.loginForm.password)
            // }
            let checkCode = this.loginForm.vercode
            login(reqData, checkCode, this.authToken)
                .then(res => {
                    if (res.data.code === 0) {
                        localStorage.setItem("groupName", "");
                        localStorage.setItem("groupId", "");
                        localStorage.setItem("folderList", "")
                        localStorage.setItem("user", res.data.data.account);
                        localStorage.setItem("root", res.data.data.roleName);
                        localStorage.setItem("token", res.data.data.token);
                        sessionStorage.setItem("accountStatus", res.data.data.accountStatus);
                        sessionStorage.setItem("reload", 1);
                        router.push("/main")
                    } else {
                        this.changeCode()
                        this.msgErrorContent = this.$chooseLang(res.data.code)
                        this.msgError = true;
                        this.loginForm.password = "";
                        this.logining = false;
                    }
                })
                .catch(err => {
                    this.changeCode()
                    this.timeout = true;
                    this.loginForm.password = "";
                    this.logining = false;
                });
        },
        getEncryption: function(){
            encryption().then(res => {
                if(res.data.code === 0){
                    if(res.data.data == 1){
                        this.encryption = 'guomi'
                    }else{
                        this.encryption = 'hash'
                    }
                    localStorage.setItem("encryptionId",res.data.data)
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
};
</script>
<style>
.login-label.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: "" !important;
}
.login-bg {
    position: relative;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.login {
    position: absolute;
    width: 430px;
    /* height: 460px; */
    top: 52%;
    left: 70%;
    margin-top: -280px;
    margin-left: -201px;
    padding: 0 50px 40px 50px;
    background-color: #fff;
    border-radius: 16px;
    text-align: center;
    box-sizing: border-box;
}
.logo-content {
    position: absolute;
    width: 100%;
    top: 90px;
    left: 0;
    text-align: center;
    font-size: 12px;
    color: #979faa;
    letter-spacing: 0.02px;
}
.msg-wrapper {
    min-height: 20px;
    height: auto;
    /* margin: 5px 0; */
}
.msg-error {
    color: #e4393c;
}
.codeUrlImg {
    display: inline-block;
    height: 38px;
    width: 84px;
    line-height: 38px;
    /* padding-left: 16px; */
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    vertical-align: middle;
    cursor: pointer;
    text-align: center
    /* background-color: #e4393c */
}
.logo {
    width: 120px;
    padding-top: 80px;
}
.login-title {
    padding: 16px 0 0px 0;
    font-size: 20px;
    color: #2e2e2e;
    letter-spacing: 0.04px;
}
.login-label {
    position: relative;
    padding: 0 60px;
}
.login-label input {
    height: 54px;
    padding-left: 60px;
}
/* .login-content .login-label .el-form-item__label {
    position: absolute !important;
    left: 52px !important;
    top: 12px !important;
    z-index: 999 !important;
    border-right: 1px solid #cfdae9 !important;
    height: 30px !important;
    line-height: 30px !important;
} */
.login-submit {
    width: 100%;
    height: 45px;
    margin-top: 10px;
    font-size: 14px;
}
.icon {
    width: 142px;
    height: 142px;
    /* vertical-align: -0.15em; */
    fill: currentColor;
    overflow: hidden;
}
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: "";
}
.login-form .el-form-item__label {
    display: block;
    line-height: 32px;
    float: none;
    text-align: left;
}
.login-lang{
    position: absolute;
    right: 10px;
    top: 20px;
    min-width: 160px;
}
.login-encrypt{
    position: absolute;
    right: 10px;
    top: 60px;
    min-width: 160px;
}
.login-encrypt .el-radio-button__inner{
    display: inline-block;
    width: 80px;
}
</style>
