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
    <div>
        <el-form :model="rulePasswordForm" status-icon :rules="rules2" ref="rulePasswordForm" label-width="80px" class="demo-ruleForm">
            <el-form-item :label="$t('main.oldPassword')" prop="oldPass">
                <el-input type="password" v-model="rulePasswordForm.oldPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('main.newPassword')" prop="pass">
                <el-input type="password" v-model="rulePasswordForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('main.confirmPassword')" prop="checkPass">
                <el-input type="password" v-model="rulePasswordForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            
        </el-form>
        <div class="text-right send-btn">
      <el-button type="primary" @click="submitForm('rulePasswordForm')">{{$t('main.submit')}}</el-button>
                <el-button @click="resetForm('rulePasswordForm')">{{$t('main.reset')}}</el-button>
    </div>
    </div>
</template>

<script>
const sha256 = require("js-sha256").sha256;
import { resetPassword } from "@/util/api";
export default {
    name: "changePasswordDialog",
    props: {},
    data() {
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
        return {
            rulePasswordForm: {
                oldPass: "",
                pass: "",
                checkPass: ""
            },
            rules2: {
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
            },
            account: localStorage.getItem("user")
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
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
            let reqData = {
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
                        this.rulePasswordForm = {
                            oldPass: "",
                            pass: "",
                            checkPass: ""
                        }
                        this.$emit('success', true)
                        this.accountStatus = "2";
                        sessionStorage.setItem("accountStatus", "2");
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError'),
                    });
                });
        }
    }
};
</script>

<style>
</style>
