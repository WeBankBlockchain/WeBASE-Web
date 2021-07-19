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
    <div class="chang-wrapper">
        <table class="opt-wrapper">
            <tr>
                <td>{{this.$t('contracts.user')}}：</td>
                <td>
                    <el-select v-model="userName" :placeholder="placeholderText" style="width: 300px" :no-data-text="$t('text.goCreatPrivateKey')">
                        <el-option :label="item.userName" :value="item.address" :key="item.userId" v-for='item in userList'>
                            <span>{{item.userName}}</span>
                            <span class="font-12">{{item.address}}</span>
                        </el-option>
                    </el-select>
                </td>
                <td v-if="isUserNameShow" style="width: 60px;text-align: right;" class="text-td">
                    <span class="contract-code-done"   @click="$store.dispatch('switch_creat_user_dialog')">
                         <span target="_blank" style="cursor:pointer;text-decoration:underline;">{{this.$t("privateKey.addUser")}}</span>
                    </span>
                </td>
            </tr>
            <tr>
                <td  class="text-td"><span>CNS：</span></td>
                <td>
                    <el-checkbox v-model="isCNS" @change="changeCns"></el-checkbox>
                </td>
            </tr>
            <tr v-if="isCNS">
                <td style="width: 100px;text-align: right;" class="text-td"><span style=""></span></td>
                <td>
                    <el-form :model="cnsVersionFrom" :rules="rules" ref="cnsVersionFrom" class="demo-ruleForm">
                        <el-form-item prop="cnsName">
                            <el-input v-model="cnsVersionFrom.cnsName" style="width: 300px">
                                <template slot="prepend">
                                    <span title="name">name</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </td>
            </tr>
            <tr v-if="isCNS">
                <td style="width: 100px;text-align: right;" class="text-td"><span></span></td>
                <td>
                    <el-form :model="cnsVersionFrom" :rules="rules" ref="cnsVersionFrom" class="demo-ruleForm">
                        <el-form-item prop="cnsVersion">
                            <el-input v-model="cnsVersionFrom.cnsVersion" style="width: 300px">
                                <template slot="prepend">
                                    <span title="version">version</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </td>
            </tr>
            <tr v-if='inputs.length'>
                <td style="vertical-align: top;text-align: right;">{{this.$t('contracts.params')}}：</td>
                <td>
                    <div v-for='(item,index) in inputs' :key='item.name' class="params-input">
                        <el-input v-model="parameter[index]" style="margin-bottom:10px;width: 300px" :placeholder="item.type">
                            <template slot="prepend">
                                <span :title="item.name">{{item.name}}</span>
                            </template>
                        </el-input>
                    </div>
                </td>
            </tr>
            <tr v-if='inputs.length'>
                <td></td>
                <td style="width: 300px">
                    <p style="padding: 0px 0 0 0px;"><i class="el-icon-info" style="padding-right: 4px;"></i>{{this.$t('contracts.paramsInfo')}}</p>
                </td>
            </tr>
        </table>
        <div class="text-right send-btn">
            <el-button @click="close">{{this.$t("text.cancel")}}</el-button>
            <el-button type="primary" @click="submit">{{this.$t("text.sure")}}</el-button>
        </div>
         
         <el-dialog :visible.sync="$store.state.creatUserVisible" :title="$t('privateKey.createUser')" width="640px" :append-to-body="true" class="dialog-wrapper" center>
            <v-creatUser @creatUserClose="creatUserClose" :disablePub='true'  ref="creatUser"></v-creatUser>
        </el-dialog>	
    </div>
</template>
<script>
import { sendTransation, getUserList } from "@/util/api";
import errcode from "@/util/errcode";
import { isJson } from "@/util/util";
import creatUser from "@/views/privateKeyManagement/components/creatUser";

export default {
    components: {
        "v-creatUser": creatUser,
    },
    name: "changeUser",
    props: ["abi", "contractName"],
    data: function () {
        return {
            isUserNameShow:false,
            userName: "",
            userList: [],
            userId: null,
            inputs: [],
            parameter: [],
            abifile: JSON.parse(this.abi),
            version: "",
            versionShow: false,
            errorInfo: "",
            placeholderText: this.$t('placeholder.selectedAccountAddress'),
            isCNS: false,
            cnsVersionFrom: {
                cnsVersion: "",
                cnsName: this.contractName
            },
            creatUserVisible: false
        };
    },
    computed: {
        rules() {
            var obj = {
                cnsVersion: [
                    {
                        required: true,
                        message: this.$t('dialog.cnsVersion'),
                        trigger: "blur"
                    },
                    {
                        pattern: /^[A-Za-z0-9.]+$/,
                        message: this.$t('dialog.cnsVersionPattern'),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 10,
                        message: this.$t('dialog.length1_10'),
                        trigger: "blur"
                    },
                ],
                cnsName: [
                    {
                        required: true,
                        message: this.$t('dialog.cnsName'),
                        trigger: "blur"
                    },
                    {
                        pattern: /^[A-Za-z0-9.]+$/,
                        message: this.$t('dialog.cnsVersionPattern'),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 32,
                        message: this.$t('dialog.privateKeyVerifyLength1_32'),
                        trigger: "blur"
                    },
                ],
            }
            return obj
        },

    },
    mounted: function () {
        this.getUserData();
        this.changeConstructor();
    },
    methods: {
        changeConstructor: function () {
            if (this.abifile.length) {
                this.abifile.forEach(value => {
                    if (value.type === "constructor") {
                        this.inputs = value.inputs;
                    }
                });
            }
        },
        close: function () {
            this.$emit("close");
        },
        submit: function () {
            if (this.isCNS) {
                if (!this.cnsVersionFrom.cnsName) return;
                this.$refs['cnsVersionFrom'].validate((valid) => {
                    if (valid) {
                        this.queryDeploy()
                    } else {
                        return false;
                    }
                });
            } else {
                this.queryDeploy()
            }
        },
        queryDeploy() {
            this.versionShow = false;
            this.errorInfo = ''
            var params = []
            for (let i = 0; i < this.parameter.length; i++) {
                if (this.parameter[i] && isJson(this.parameter[i])) {
                    try {
                        params[i] = JSON.parse(this.parameter[i])
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    params[i] = this.parameter[i];
                }
            }
            let data = {
                userId: this.userName,
                params: params
            };
            let cnsObj = {
                version: this.cnsVersionFrom.cnsVersion,
                saveEnabled: this.isCNS,
                cnsName: this.cnsVersionFrom.cnsName
            }
            this.$emit("change", data, cnsObj);
            this.$emit("close");
        },
        getUserData: function () {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: 1,
                pageSize: 1000
            };
            let query = {}
            if (localStorage.getItem('root') === 'developer') {
                query.account = localStorage.getItem("user")
            }
            getUserList(reqData, query)
                .then(res => {
                    if (res.data.code === 0) {
                        if (res.data.data.length == 0) {
                            this.$message({
                                type: "info",
                                message: this.$t("contracts.addPrivateKeyInfo")
                            });
                        }
                        res.data.data.forEach(value => {
                            if (value.hasPk === 1) {
                                this.userList.push(value);
                            }
                        });
                        if (this.userList.length) { 
                            this.userName = this.userList[0].address;
                            this.isUserNameShow = false;
                        } else {
                            this.isUserNameShow = true;
                            this.placeholderText = this.$t('placeholder.selectedNoUser')
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
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        changeCns() {
            this.cnsVersionFrom.cnsVersion = "";
        },
        creatUserClose() {
            this.getUserData();
        },
    }
};
</script>
<style scoped>
.chang-wrapper {
    padding-left: 20px;
    margin-top: 15px;
}

.chang-wrapper >>> .el-input__inner {
    height: 32px;
    line-height: 32px;
}
.chang-wrapper >>> .el-input__icon {
    line-height: 32px;
}
.opt-wrapper tr td {
    padding-top: 0;
    padding-bottom: 10px;
}
.send-btn >>> .el-button {
    padding: 9px 16px;
}
.params-input >>> .el-input-group__prepend {
    max-width: 136px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.demo-ruleForm >>> .el-form-item {
    margin-bottom: 0px;
}
.demo-ruleForm >>> .el-form-item__error {
    padding-top: 0px;
    transform: scale(0.9);
    top: 86%;
}
</style>

