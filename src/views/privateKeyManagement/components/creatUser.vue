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
    <div class="key-dialog">
        <div class="text-center">
            <el-radio-group v-model="timeGranularity" @change='changeKey'>
                <el-radio :label="'RIV'" v-if='!address'>{{this.$t("privateKey.privateKeyUser")}}</el-radio>
                <el-radio :label="'PUB'" :disabled="disablePub" >{{this.$t('privateKey.publicKeyUser')}}</el-radio>
            </el-radio-group>
        </div>
        <div class="divide-line"></div>
        <el-form :model="userForm" :rules="rules" ref="userForm" label-width="142px" class="demo-ruleForm">
            <el-form-item :label="$t('privateKey.userName')" prop="name" style="width: 546px;">
                <el-input v-model="userForm.name" :placeholder="$t('privateKey.inputUserName')" maxlength="12"></el-input>
            </el-form-item>
            <el-form-item :label="$t('privateKey.publicKeyInfo')" prop="publicKey" style="width: 546px;" v-if="pubKey">
                <el-input v-model="userForm.publicKey" :placeholder="$t('privateKey.inputPublicInfo')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('privateKey.description')" style="width: 546px">
                <el-input type="textarea" v-model="userForm.explain" maxlength="120" :placeholder="$t('privateKey.userLong')"></el-input>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="submit('userForm')" :loading="loading">{{this.$t('text.sure')}}</el-button>
        </div>
    </div>
</template>

<script>
import { getAddUser, bindUser } from "@/util/api";
import errcode from "@/util/errcode";

export default {
    name: "AddUser",
    props: {
        address: {
            type: String,
            default: null
        },   
        disablePub: {
            type: Boolean,
            require: true,
            default: false
        },     
    },
        
    data: function () {
        return {
            loading: false,
            pubKey: false,
            rivKey: true,
            userForm: {
                name: "",
                explain: "",
                publicKey: ""
            },
            timeGranularity: "RIV",
            groupId: localStorage.getItem("groupId"),
        };
    },
    computed: {
        rules() {
            let data = {
                name: [
                    {
                        required: true,
                        message: this.$t('privateKey.inputUserName'),
                        trigger: "blur"
                    },
                    {
                        pattern: /^[A-za-z0-9]+$/,
                        message: this.$t('rule.privateKeyNameRule'),
                        trigger: "blur",

                    },
                    {
                        min: 1,
                        max: 12,
                        message: this.$t('rule.folderLong'),
                        trigger: "blur"
                    }
                ],
                publicKey: [
                    {
                        required: true,
                        message: this.$t('privateKey.inputPublic'),
                        trigger: "blur"
                    }
                ]
            };
            return data
        }
    },
    mounted() {
        if (this.address) {
            this.timeGranularity = 'PUB'
            this.changeKey();
            this.userForm.publicKey = this.address;
        }
        
    },
    methods: {
        changeKey: function () {
            let type = this.timeGranularity
            this.userForm = {
                name: "",
                explain: "",
                publicKey: ""
            };
            switch (type) {
                case "PUB":
                    this.pubKey = true;
                    this.rivKey = false;
                    break;

                case "RIV":
                    this.pubKey = false;
                    this.rivKey = true;
                    break;
            }
            this.$refs['userForm'].clearValidate();
        },
        modelClose: function () {
            this.userForm = Object.assign({
                name: "",
                publicKey: "",
                explain: ""
            });
            this.pubKey = false;
            this.loading = false;
            this.$store.state.creatUserVisible = false;
        },
        submit: function (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$confirm(this.$t('text.confirmSubmit'), {
                        center: true
                    })
                        .then(() => {
                            this.loading = true;
                            if (this.pubKey) {
                                this.getBindUser();
                            } else {
                                this.addUser();
                            }
                        })
                        .catch(() => {
                            this.modelClose();
                        });
                } else {
                    return false;
                }
            });
        },
        addUser() {
            let reqData = {
                groupId: this.groupId,
                userName: this.userForm.name,
                description: this.userForm.explain || "",
                account: localStorage.getItem("user")
            };
            getAddUser(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$emit("success");
                        this.$emit("creatUserClose");
                        this.$message({
                            type: "success",
                            message: this.$t("privateKey.addUserSuccess")
                        });
                        this.modelClose();
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
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                    this.modelClose();
                });
        },
        getBindUser() {
            let reqData = {
                userName: this.userForm.name,
                publicKey: this.userForm.publicKey,
                groupId: this.groupId,
                description: this.userForm.explain || "",
                account: localStorage.getItem("user")
            };
            bindUser(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code == 0) {
                        this.$emit("bindUserClose");
                        this.$message({
                            type: "success",
                            message: this.$t("privateKey.addUserSuccess")
                        });
                        this.modelClose();
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
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        }
    }
};
</script>
<style scoped>
.key-dialog {
    margin-top: 10px;
}
.dialog-footer {
    text-align: right;
    margin-right: -5px;
    padding-bottom: 20px;
}
.radio-key {
    cursor: context-menu;
    font-size: 14px;
}
.base-span-key {
    margin-left: 8px;
    color: #00122c;
}
.pub-key {
    margin-left: 30px;
}
.riv-key {
    margin-left: 50px;
}

.divide-line {
    border: 1px solid #e7ebf0;
    margin-left: 30px;
    width: 514px;
    margin-top: 15px;
    margin-bottom: 25px;
}
</style>
