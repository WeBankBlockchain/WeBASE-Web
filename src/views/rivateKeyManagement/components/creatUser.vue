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
    <div class="key-dialog">
        <div class="text-center">
            <span class="wbs-icon-radio radio-key riv-key" :style="{'color': rivKey ? '#4b8fe5':''}" @click="changeKey('RIV')">
                <span class="base-span-key" :style="{'color': rivKey ? '#2956a3':''}">私钥用户</span>
            </span>
            <span class="wbs-icon-radio radio-key pub-key" :style="{'color': pubKey ? '#4b8fe5':''}" @click="changeKey('PUB')">
                <span class="base-span-key" :style="{'color': pubKey ? '#2956a3':''}">公钥用户</span>
            </span>
        </div>
        <div class="divide-line"></div>
        <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名称" prop="name" style="width: 546px;">
                <el-input v-model="userForm.name" placeholder="请输入用户名称" maxlength="12"></el-input>
            </el-form-item>
            <el-form-item label="公钥信息" prop="publicKey" style="width: 546px;" v-if="pubKey">
                <el-input v-model="userForm.publicKey" placeholder="请输入公钥信息或公钥地址"></el-input>
            </el-form-item>
            <el-form-item label="备注" style="width: 546px">
                <el-input type="textarea" v-model="userForm.explain" maxlength="120" placeholder="120个字符以内"></el-input>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="modelClose">取 消</el-button>
            <el-button type="primary" @click="submit('userForm')" :loading="loading">确 定</el-button>
        </div>
    </div>
</template>

<script>
import { getAddUser, bindUser } from "@/util/api";
import errcode from "@/util/errcode";

export default {
    name: "AddUser",
    data: function() {
        return {
            loading: false,
            pubKey: false,
            rivKey: true,
            userForm: {
                name: "",
                explain: "",
                publicKey: ""
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入用户名称",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 12,
                        message: "长度在 1 到 12 个字符",
                        trigger: "blur"
                    }
                ],
                publicKey: [
                    {
                        required: true,
                        message: "请输入公钥信息",
                        trigger: "blur"
                    }
                ]
            },
            networkId: localStorage.getItem("networkId")
        };
    },
    methods: {
        changeKey: function(type) {
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
        },
        modelClose: function() {
            this.userForm = Object.assign({
                name: "",
                publicKey: "",
                explain: ""
            });
            this.pubKey = true;
            this.loading = false;
            this.$store.state.creatUserVisible = false;
        },
        submit: function(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$confirm("确认提交？", {
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
        addUser: function() {
            let reqData = {
                networkId: this.networkId,
                userName: this.userForm.name,
                description: this.userForm.explain || ""
            };
            getAddUser(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$emit("success");
                        this.$message({
                            type: "success",
                            message: "添加用户成功"
                        });
                        this.$emit("creatUserClose");
                        this.modelClose();
                    } else {
                        this.modelClose();
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "添加用户失败！"
                    });
                    this.modelClose();
                });
        },
        getBindUser() {
            let reqData = {
                userName: this.userForm.name,
                publicKey: this.userForm.publicKey,
                networkId: this.networkId,
                description: this.userForm.explain || ""
            };
            bindUser(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code == 0) {
                        this.$message({
                            type: "success",
                            message: "添加用户成功"
                        });
                        this.$emit("bindUserClose");
                        this.modelClose();
                    } else {
                        this.modelClose();
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.modelClose();
                    this.$message({
                        type: "error",
                        message: "添加用户失败！"
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
