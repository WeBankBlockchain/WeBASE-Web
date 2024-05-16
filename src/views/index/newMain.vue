/*
 * Copyright 2014-2020 the original author or authors.
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
    <div class="main-wrapper" :class="{'content2': isMicroApp}">
        <div id="shade" v-if="accountStatus === '1'"></div>
        <div id="reset-password" v-if="accountStatus === '1'">
            <div class="reset-password-title">
                {{$t('main.changePassword')}}
            </div>
            <el-form :model="rulePasswordForm" status-icon :rules="rules2" ref="rulePasswordForm" label-width="148px" class="demo-ruleForm">
                <el-form-item :label="$t('main.oldPassword')" prop="oldPass">
                    <el-input type="password" v-model="rulePasswordForm.oldPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label="$t('main.newPassword')" prop="pass">
                    <el-input type="password" v-model="rulePasswordForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label="$t('main.confirmPassword')" prop="checkPass">
                    <el-input type="password" v-model="rulePasswordForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('rulePasswordForm')" :loading="loading">{{$t('main.submit')}}</el-button>
                    <el-button @click="resetForm('rulePasswordForm')">{{$t('main.reset')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-if='!isMicroApp' class="menu-wrapper header" :class="{'menu-show': menuShow,'menu-hide': menuHide}">
            <v-menu @sidebarChange="change($event)" :minMenu="show" ref='menu'></v-menu>
        </div>
        <div class="view-wrapper" :class="{'view-show': menuShow,'view-hide': menuHide, 'micro-app': isMicroApp}">
            <router-view class="bg-f7f7f7" @versionChange='versionChange'></router-view>
        </div>
        <set-front :show='frontShow' v-if='frontShow' @close='closeFront'></set-front>
        <v-guide :show='guideShow' v-if='guideShow' @close='closeGuide'></v-guide>
    </div>
</template>

<script>
import sidebar from "./sidebar";
import setFront from "./dialog/setFront"
import guide from "./dialog/guide"
import { resetPassword, addnodes, getGroups, encryption, getGroupsInvalidIncluded, getFronts, getVersion, refreshFront } from "@/util/api";
import router from "@/router";
const sha256 = require("js-sha256").sha256;
import utils from "@/util/sm_sha"
import Bus from "@/bus"
export default {
    name: "newMain",
    components: {
        "v-menu": sidebar,
        "set-front": setFront,
        'v-guide': guide
    },
    data: function () {
        return {
            isMicroApp: window.__POWERED_BY_QIANKUN__ ? true : false,
            version: "",
            guideShow: false,
            frontShow: false,
            menuShow: true,
            menuHide: false,
            loading: false,
            accountStatus: 0,
            account: localStorage.getItem("user"),
            frontData: [],
            rulePasswordForm: {
                oldPass: "",
                pass: "",
                checkPass: ""
            },
            groupId:localStorage.getItem('groupId') ? localStorage.getItem('groupId') : '',

        };
    },
    computed: {

        show: function () {
            return this.menuShow;
        },
        rules2() {
            var validatePass = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error(this.$t('main.inputPassword')));
                } else {
                    if (this.rulePasswordForm.checkPass !== "") {
                        this.$refs.rulePasswordForm.validateField("checkPass");
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error(this.$t('main.againPassword')));
                } else if (value !== this.rulePasswordForm.pass) {
                    callback(new Error(this.$t('main.passwordError')));
                } else {
                    callback();
                }
            };
            let data = {
                oldPass: [
                    {
                        required: true,
                        message: this.$t('main.inputOldPassword'),
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 12,
                        message: this.$t('main.longPassword'),
                        trigger: "blur"
                    }
                ],
                pass: [
                    {
                        required: true,
                        validator: validatePass,
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 12,
                        message: this.$t('main.longPassword'),
                        trigger: "blur"
                    },
                    {
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/,
                        message: this.$t('main.passwordPattern'),
                        trigger: "blur"
                    }
                ],
                checkPass: [
                    {
                        required: true,
                        validator: validatePass2,
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 12,
                        message: this.$t('main.longPassword'),
                        trigger: "blur"
                    }
                ]
            }
            return data
        }
    },
    mounted() {
        this.getRefreshFront()
       // this.getEncryption();
        this.getGroupList();
        this.getFrontTable();
        // this.getVersionList()
    },
    methods: {
        getRefreshFront() {
            refreshFront().then(res => {
                console.log(res)
            }).catch(err => {
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            })
        },
        getVersionList() {
            getVersion().then(res => {
                if (res.status == 200) {
                    this.version = res.data;
                    this.$store.dispatch('set_mgr_version_action', this.version)
                }
            }).catch(err => {
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            })
        },
        versionChange: function () {
            if (this.$refs.menu) {
                this.$refs.menu.changeRouter();
            }
        },
        change: function (val) {
            console.log(!val)
            this.menuShow = !val;
            this.menuHide = val;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.getResetPassword();
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        getResetPassword() {
            let reqData;
            reqData = {
                oldAccountPwd: sha256(this.rulePasswordForm.oldPass),
                newAccountPwd: sha256(this.rulePasswordForm.pass)
            };
            resetPassword(reqData, {})
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: "success",
                            message: this.$t('main.updatePsdSuccess')
                        });
                        this.accountStatus = "2";
                        sessionStorage.setItem(
                            "accountStatus",
                            this.accountStatus
                        );
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
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });

                });
        },
        getGroupList: function () {
            getGroupsInvalidIncluded().then(res => {
                if (res.data.code === 0) {
                    if (res.data.data && res.data.data.length) {
                        if (!localStorage.getItem("groupId")) {
                            localStorage.setItem("groupId", res.data.data[0].groupId)
                            localStorage.setItem("chainId", res.data.data[0].chainId)
                            localStorage.setItem("chainName", res.data.data[0].chainName)
                        }
                        if (!localStorage.getItem("groupName")) {
                            localStorage.setItem("groupName", res.data.data[0].groupName);
                        }
                        this.accountStatus = sessionStorage.getItem("accountStatus");
                        if (this.$route.path && this.$route.path !== "/main") {
                            router.push(this.$route.path)
                        } else if (this.$route.path == "/main") {
                            router.push("/home")
                        } else {
                            router.push("/home")
                        }
                    } else {
                        this.guideShow = true
                    }
                } else {
                    this.guideShow = true
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                    // router.push("/login");
                }
            }).catch(err => {
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
                // router.push("/login");
            })
        },
        getFrontTable() {
            let reqData = {}
            getFronts(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        let versionKey;
                        this.frontData = res.data.data;
                        let num = 0;
                        for (let i = 0; i < res.data.data.length; i++) {
                            if (res.data.data[i].clientVersion || res.data.data[i].supportVersion) {
                                this.$store.dispatch('set_version_action', res.data.data[i].clientVersion);
                                this.$store.dispatch('set_support_version_action', res.data.data[i].supportVersion);
                                if (res.data.data[i].supportVersion) {
                                    versionKey = res.data.data[i].supportVersion.substring(2, 3)
                                    if (versionKey > 4) {
                                        num++
                                    }
                                }
                            }
                        }
                        if (num > 0) {
                            localStorage.setItem("nodeVersionChange", 1)
                        } else {
                            localStorage.setItem("nodeVersionChange", "")
                        }
                        this.getVersionList();
                        if (localStorage.getItem("nodeVersionChange")) {
                            this.versionChange();
                        }
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });

                    }
                })
                .catch(err => {
                    console.log(err)
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });

                });
        },
        getEncryption: function () {
            this.groupId=localStorage.getItem('groupId')
            encryption(this.groupId).then(res => {
                if (res.data.code === 0) {
                    if (res.data.data != localStorage.getItem("encryptionId")) {
                        localStorage.removeItem('solcName')
                        localStorage.removeItem('versionId');
                    }
                    localStorage.setItem("encryptionId", res.data.data)
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
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        closeFront: function () {
            this.frontShow = false;
            this.getGroupList();
            this.getFrontTable();
        },
        closeGuide: function () {
            this.guideShow = false
            this.frontShow = true;
        }
    }
};
</script>
<style scoped>
.header .el-menu {
    height: 100%;
}
.main-wrapper {
    width: 100%;
    background: #f7f7f7;
    height: 100%;
}
.main-wrapper::after {
    display: block;
    content: "";
    clear: both;
}
.menu-wrapper {
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 99999;
}
.view-wrapper {
    height: 100%;
    padding-left: 200px;
}
.menu-show {
    width: 200px;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
}
.menu-hide {
    /* width: 56px; */
    width: 56px;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 2s;
}
.view-show {
    /* padding-left: 200px; */
    width: calc(100% - 200px);
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
}
.view-hide {
    padding-left: 56px;
    /* width: calc(100% - 56px); */
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 2s;
}
#shade {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.3;
    /*兼容IE8及以下版本浏览器*/
    filter: alpha(opacity=30);
}

#reset-password {
    position: absolute;
    z-index: 3;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 470px;
    height: 273px;
    margin: auto;
    background-color: #fff;
    padding-top: 15px;
    /* padding-right: 25px; */
}
.reset-password-title {
    margin-bottom: 5px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
}
#add-nodes {
    position: absolute;
    z-index: 3;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 470px;
    height: 140px;
    margin: auto;
    background-color: #fff;
    padding-top: 15px;
}
.add-nodes-title {
    margin-bottom: 5px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
}
.demo-ruleForm {
    padding-right: 25px;
}
 .content2 {
   height: calc(100vh - 1px);
   padding-top: 0px;
 }
.micro-app {
  width: 100%;
  padding-left: 0px;
}
</style>
