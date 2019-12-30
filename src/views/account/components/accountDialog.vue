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
    <div>
        <el-form :model="accountForm" :rules="rules" ref="accountForm" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="$t('account.user')" prop="name" style="width: 300px;">
                <el-input v-model="accountForm.name" :placeholder="$t('system.inputUser')" maxlength="12" :disabled="accountForm['disabled']"></el-input>
            </el-form-item>
            <el-form-item :label="$t('login.password')" prop="password" style="width: 300px;" v-if="accountForm['dShow']">
                <el-input v-model="accountForm.password" :placeholder="$t('inputText.password')" minlength="6" maxlength="12" :type="inputType">
                    <i slot="suffix" style="color: #00122C;" :class="[inputType === 'password' ? 'el-icon-view': 'wbs-icon-view-hidden']" @click.stop.prevent="showPassword"></i>
                </el-input>
            </el-form-item>
            <el-form-item v-if='accountForm.emailshow' :label="$t('account.email')" style="width: 300px;">
                <el-input v-model="accountForm.email" :placeholder="$t('account.inputEmail')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('account.roleNameZh')" prop="role" style="width: 300px;" v-if="accountForm['mShow']">
                <el-select v-model="accountForm.role" :placeholder="$t('text.select')" :disabled="accountForm['mDisabled']">
                    <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleNameZh" :value="item.roleId">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="submit('accountForm')" :loading="loading">{{this.$t('text.sure')}}</el-button>
        </div>
    </div>
</template>

<script>
import {
    roleList,
    creatAccountInfo,
    modifyAccountInfo,
    deleteAccountInfo
} from "@/util/api";
const sha256 = require("js-sha256").sha256;
import utils from "@/util/sm_sha"
export default {
    name: "accountDialog",
    props: {
        accountDialogOptions: {
            type: Object
        }
    },
    watch: {
        "accountDialogOptions.type": {
            handler(val) {
                this.type = val;
                switch (val) {
                    case "creat":
                        this.accountForm = {
                            name: "",
                            password: "",
                            role: 100001,
                            disabled: false,
                            mDisabled: false,
                            dShow: true,
                            mShow: true,
                            email: "",
                            emailshow: true
                        };
                        break;
                    case "delete":
                        this.accountForm = {
                            name: this.accountDialogOptions.data["account"],
                            password: "",
                            role: this.accountDialogOptions.data["roleId"],
                            disabled: true,
                            mDisabled: true,
                            dShow: false,
                            emailshow: false
                            // email: "",
                        };
                        break;
                    case "modify":
                        this.accountForm = {
                            name: this.accountDialogOptions.data["account"],
                            password: "",
                            role: this.accountDialogOptions.data["roleId"],
                            disabled: true,
                            mDisabled: false,
                            dShow: true,
                            mShow: false,
                            email: this.accountDialogOptions.data["email"],
                            emailshow: true
                        };
                        break;
                }
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            type: this.accountDialogOptions.type,
            loading: false,
            accountForm: {},
            roleList: [],
            inputType: "password",
        };
    },
    computed: {
        rules() {
            let data = {
                name: [
                    {
                        required: true,
                        message: this.$t('system.inputUser'),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 12,
                        message: this.$t('rule.folderLong'),
                        trigger: "blur"
                    },
                    {
                        pattern: /^[A-Za-z0-9]+$/,
                        message: this.$t('rule.accountRule'),
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: this.$t('inputText.password'),
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 12,
                        message: this.$t('rule.passwordLong'),
                        trigger: "blur"
                    },
                    {
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/,
                        message: this.$t('rule.passwordRule'),
                        trigger: "blur"
                    }
                ]
            }
            return data
        }
    },
    mounted() {
        this.getRoleList();
    },
    methods: {
        modelClose: function () {
            this.$emit("close", false);
        },
        submit: function (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$confirm(this.$t('text.confirmSubmit'), {
                        center: true
                    })
                        .then(() => {
                            this.loading = true;
                            this.getAllAccountInfo();
                        })
                        .catch(() => {
                            this.modelClose();
                        });
                } else {
                    return false;
                }
            });
        },
        getRoleList: function () {
            let groupId = localStorage.getItem("groupId");
            let reqQuery = {};
            reqQuery = {
                groupId: groupId,
                pageNumber: "",
                pageSize: "",
                roleId: "",
                roleName: ""
            };
            roleList({}, reqQuery)
                .then(res => {
                    if (res.data.code === 0) {
                        res.data.data.forEach(item => {
                            switch (item.roleId) {
                                case 100000:
                                    item.roleNameZh = this.$t('text.Administrator')
                                    break;

                                case 100001:
                                    item.roleNameZh = this.$t('text.normalUsers')
                                    break;
                            }
                        })
                        this.roleList = res.data.data;
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
        getAllAccountInfo: function () {
            let type = this.type;
            switch (type) {
                case "creat":
                    this.getCreatAccountInfo();
                    break;
                case "modify":
                    this.getModifyAccountInfo();
                    break;
                case "delete":
                    this.getDeleteAccountInfo();
                    break;
            }
        },
        getCreatAccountInfo: function () {
            let reqData = {
                account: this.accountForm.name,
                accountPwd: sha256(this.accountForm.password),
                roleId: this.accountForm.role,
            };
            // if(localStorage.getItem("encryptionId") == 1){
            //     reqData.accountPwd = "0x" + utils.sha4(this.accountForm.password);
            // }else{
            //     reqData.accountPwd = sha256(this.accountForm.password);
            // }
            if(this.accountForm.email){
                let pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if (!pattern.test(this.accountForm.email)) {
                    this.$message({
                        type: "error",
                        message: this.$t('account.emailTypeError')
                    });
                    return
                } else {
                    reqData.email = this.accountForm.email
                }
            }
            creatAccountInfo(reqData, {})
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: "success",
                            message: this.$t('text.addSuccess')
                        });
                        this.modelClose();
                        this.$emit("success");
                    } else {
                        this.modelClose();
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.modelClose();
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        getModifyAccountInfo: function () {
            let reqData = {
                account: this.accountForm.name,
                accountPwd: sha256(this.accountForm.password),
                roleId: this.accountForm.role,
            };
            // if(localStorage.getItem("encryptionId") == 1){
            //     reqData.accountPwd = "0x" + utils.sha4(this.accountForm.password)
            // }else{
            //     reqData.accountPwd = sha256(this.accountForm.password)
            // }
            if(this.accountForm.email){
                let pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if (!pattern.test(this.accountForm.email)) {
                    this.$message({
                        type: "error",
                        message: this.$t('account.emailTypeError')
                    });
                    return
                } else {
                    reqData.email = this.accountForm.email
                }
            }
            modifyAccountInfo(reqData, {})
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: "success",
                            message: this.$t('text.updateSuccessMsg')
                        });
                        this.modelClose();
                        this.$emit("success");
                    } else {
                        this.modelClose();
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.modelClose();
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        getDeleteAccountInfo: function () {
            deleteAccountInfo(this.accountForm.name, {})
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: "success",
                            message: this.$t('system.deleteSuccess')
                        });
                        this.modelClose();
                        this.$emit("success");
                    } else {
                        this.modelClose();
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.modelClose();
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        showPassword() {
            if (this.inputType === 'password') {
                this.inputType = 'text'
            } else {
                this.inputType = 'password'
            }
        }
    }
};
</script>

<style scoped>
.dialog-footer {
    text-align: right;
    margin-right: -5px;
    padding-bottom: 20px;
    padding-top: 12px;
}
.isNone {
    display: none;
}
.isShow {
    display: block;
}
.demo-ruleForm >>> .el-form-item__error {
    padding-top: 0;
}
</style>
