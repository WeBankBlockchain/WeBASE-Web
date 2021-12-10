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
    <div class="send-wrapper">
        <div class="send-item">
            <span class="send-item-title">{{this.$t('contracts.contractName')}}:</span>
            <span>{{data.contractName}}</span>
        </div>
        <div class="send-item">
            <span class="send-item-title">CNS:</span>
            <span>
                <el-checkbox v-model="isCNS" @change="changeCns"></el-checkbox>
            </span>
        </div>
        <div class="send-item" v-if="isCNS">
            <span class="send-item-title"></span>
            <el-input v-model.trim="cnsName" style="width: 260px;margin-bottom:4px;" :placeholder="$t('dialog.cnsName')">
                <template slot="prepend">
                    <span class="">name</span>
                </template>
            </el-input>
        </div>
        <div class="send-item" v-if="isCNS">
            <span class="send-item-title"></span>
            <el-input v-model.trim="cnsVersion" style="width: 260px;margin-bottom:4px;" :placeholder="$t('dialog.cnsVersion')">
                <template slot="prepend">
                    <span class="">version</span>
                </template>
            </el-input>
        </div>
        <div class="send-item" v-else>
            <span class="send-item-title">{{this.$t('contracts.contractAddress')}}:</span>
            <el-input v-model="contractAddress" style="width: 260px;" :placeholder="$t('contracts.contractAddressInput')"></el-input>
            <el-tooltip class="item" effect="dark" :content="$t('contracts.contractAddressInfo')" placement="top-start">
                <i class="el-icon-info"></i>
            </el-tooltip>
        </div>
        <div class="send-item" v-show="showUser">
            <span class="send-item-title">{{this.$t('contracts.user')}}:</span>
            <el-select v-model="transation.userName" :placeholder="$t('contracts.selectUser')" style="width:260px">
                <el-option :label="item.userName" :value="item.address" :key="item.userId" v-for='(item,index) in userList'>
                    <span>{{item.userName}}</span>
                    <!-- <span class="font-12">{{splitString(item.address)}}...</span> -->
                    <span class="font-12">{{item.address}}</span>
                </el-option>
            </el-select>
            <span v-if="isUserNameShow" class="contract-code-done" @click="$store.dispatch('switch_creat_user_dialog')">
                <span target="_blank" style="cursor:pointer;text-decoration:underline;">{{this.$t("privateKey.addUser")}}</span>
            </span>
        </div>
        <el-dialog :visible.sync="$store.state.creatUserVisible" :title="$t('privateKey.createUser')" width="640px" :append-to-body="true" class="dialog-wrapper" center>
            <v-creatUser @creatUserClose="creatUserClose" :disablePub='true' ref="creatUser"></v-creatUser>
        </el-dialog>	
        <div class="send-item">
            <span class="send-item-title">{{this.$t('contracts.method')}}:</span>
            <el-select v-model="transation.funcType" :placeholder="$t('contracts.methodType')" @change="changeType($event)" style="width:120px">
                <el-option label="function" :value="'function'"></el-option>
            </el-select>
            <el-select v-model="transation.funcName" :placeholder="$t('contracts.methodName')" filterable v-show="funcList.length > 0" @change="changeFunc" style="width:135px">
                <el-option :label="item.name" :key="item.funcId" :value="item.funcId" v-for="item in funcList"></el-option>
            </el-select>
        </div>
        <div class="send-item" v-show="pramasData.length" style="line-height: 25px;">
            <span class="send-item-title" style="position: relative;top: 5px;">{{this.$t("contracts.params")}}:</span>
            <ul style="position: relative;top: -25px;">
                <li v-for="(item,index) in pramasData" style="margin-left:120px;margin-bottom: 5px;">
                    <template v-if="item.type=='string'">
                        <el-input v-model="transation.funcValue[index]" style="width: 260px;" :placeholder="item.type">
                            <template slot="prepend">
                                <span class="">{{item.name}}</span>
                            </template>
                        </el-input>
                    </template>
                    <template v-else>
                        <el-input v-model.trim="transation.funcValue[index]" style="width: 260px;" :placeholder="item.type">
                            <template slot="prepend">
                                <span class="">{{item.name}}</span>
                            </template>
                        </el-input>
                    </template>

                </li>
                <p style="padding: 5px 0 0 28px;"><i class="el-icon-info" style="padding-right: 4px;"></i>{{this.$t("contracts.paramsInfo")}}</p>
            </ul>

        </div>
        <div class="text-right send-btn">
            <el-button @click="close">{{this.$t("text.cancel")}}</el-button>
            <el-button type="primary" @click="submit('transation')" :disabled='buttonClick'>{{this.$t("text.sure")}}</el-button>
        </div>
    </div>
</template>
<script>
import { sendTransation, getUserList, findCnsInfo } from "@/util/api";
import errcode from "@/util/errcode";
import { isJson } from "@/util/util";
import creatUser from "@/views/privateKeyManagement/components/creatUser";

export default {
    components: {
        "v-creatUser": creatUser,
    },
    name: "sendTransation",
    props: ["data", "dialogClose", "abi", 'version', 'address'],
    data: function () {
        return {
            transation: {
                userName: "",
                funcName: "",
                funcValue: [],
                funcType: "function",
                reqVal:[]
            },
            userId: "",
            userList: [],
            abiList: [],
            pramasData: [],
            funcList: [],
            buttonClick: false,
            contractVersion: this.version,
            contractAddress: this.data.contractAddress || "",
            constant: false,
            pramasObj: null,
            stateMutability: '',
            isCNS: false,
            cnsList: [],
            cnsVersion: "",
            cnsName: "",
            isUserNameShow: false,
        };
    },
    computed: {
        showUser() {
            let showUser = true;
            if (this.constant || this.stateMutability === 'view' || this.stateMutability === 'pure') {
                showUser = false
            }
            return showUser
        }
    },
    mounted: function () {
        this.getUserData();
        this.formatAbi();
    },
    methods: {
        submit: function (formName) {
            if (this.isCNS) {
                if (!this.cnsName || !this.cnsVersion) {
                    this.$message({
                        type: "error",
                        message: this.$t('text.cnsNameVersion')
                    })
                    return
                } else {
                    this.send();
                }
            } else {
                this.send();
            }
        },
        close: function (formName) {
            this.$emit("close", false);
        },
        changeType: function (val) {
            this.funcList = [];
            if (val && val === "function") {
                this.abiList.forEach((value, index) => {
                    if (value.type === val) {
                        value.funcId = index
                        this.funcList.push(value);
                    }
                });
            } else if (val && val === "constructor") {
                this.abiList.forEach(value => {
                    if (value.type === val) {
                        this.pramasData = value.inputs;
                        this.pramasObj = value
                    }
                });
            } else {
                this.abiList.forEach((value, index) => {
                    if (value.type === "function") {
                        value.funcId = index
                        this.funcList.push(value);
                    }
                });
            }
            if (this.funcList.length) {
                this.transation.funcName = this.funcList[0].funcId;
            }
        },
        formatAbi: function () {
            let abi = this.abi;
            if (abi) {
                this.abiList = JSON.parse(abi);
                this.changeType();
            }
        },
        changeFunc: function () {
            this.constant = false;
            this.funcList.forEach(value => {
                if (value.funcId === this.transation.funcName) {
                    this.pramasData = value.inputs;
                    this.constant = value.constant;
                    this.pramasObj = value;
                    this.stateMutability = value.stateMutability;
                }
            });
            this.funcList.sort(function (a, b) {
                return (a.name + '').localeCompare(b.name + '')
            })
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
                            this.transation.userName = this.userList[0].address;
                            this.isUserNameShow = false;                            
                        } else {
                            this.isUserNameShow = true;
                            this.placeholderText = this.$t('placeholder.selectedNoUser')
                        }
                        this.changeFunc();
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
        send: function () {
            this.buttonClick = true;
            let pattren = /^\s+|\s+$/g;
            if (this.transation.funcType === "constructor") {
                this.transation.funcName = this.data.contractName;
            }

            if (this.transation.funcValue.length) {
                for (let i = 0; i < this.transation.funcValue.length; i++) {
                    let data = this.transation.funcValue[i].replace(
                        /^\s+|\s+$/g,
                        ""
                    );
                    if (data && isJson(data)) {
                        try {
                            this.transation.reqVal[i] = JSON.parse(data)
                        } catch (error) {
                            console.log(error)
                        }
                    } else if (data === "true" || data === "false") {
            this.transation.reqVal[i] = eval(data.toLowerCase());
          }
                    else {
                        this.transation.reqVal[i] = data;
                    }

                }
            }
            let functionName = "";
            this.funcList.forEach(value => {
                if (value.funcId == this.transation.funcName) {
                    functionName = value.name
                }
            })

            let data = {
                groupId: localStorage.getItem("groupId"),
                user: this.constant || this.stateMutability === 'view' || this.stateMutability === 'pure' ? '' : this.transation.userName,
                contractName: this.data.contractName,
                funcName: functionName || "",
                funcParam: this.transation.reqVal,
                contractId: this.data.contractId,
                contractAbi: [this.pramasObj],
                useCns: this.isCNS,
                cnsName: this.isCNS ? this.cnsName : "",
                version: this.isCNS ? this.cnsVersion : '',

            };
            if (this.contractAddress) {
                data.contractAddress = this.contractAddress
            }
            sendTransation(data)
                .then(res => {
                    this.buttonClick = false;
                    this.close();
                    if (res.data.code === 0) {
                        var resData = res.data.data;
                        let successData = {
                            resData: resData,
                            input: {
                                name: functionName,
                                inputs: this.pramasData
                            },
                            data: this.pramasObj
                        }
                        if (this.contractAddress && !this.data.contractAddress) {
                            successData.contractAddress = this.contractAddress
                        }
                        this.$emit("success", Object.assign({}, successData, {
                            constant: this.constant
                        }));
                        if (this.constant || this.stateMutability === 'view' || this.stateMutability === 'pure') {
                            this.$message({
                                type: "success",
                                message: this.$t("text.selectSuccess")
                            });
                        } else {
                            if (resData.status == '0x0') {
                                this.$message({
                                    type: "success",
                                    message: this.$t("text.transactionSuccess")
                                });
                            } else {
                                this.$message({
                                    type: "success",
                                    message: this.$t("text.transactionFail")
                                });
                            }
                        }
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                        this.close();
                    }
                })
                .catch(err => {
                    this.buttonClick = false;
                    this.close();
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        splitString(val) {
            var str = val;
            return str.substring(0, 8)
        },
        changeCns(val) {
            if (val) {
                this.queryFindCnsInfo()
            }
        },
        queryFindCnsInfo() {
            let param = {
                groupId: localStorage.getItem('groupId'),
                contractAddress: this.data.contractAddress
            }
            findCnsInfo(param)
                .then(res => {
                    if (res.data.code === 0) {
                        if (res.data.data) {
                            this.cnsVersion = res.data.data.version;
                            this.cnsName = res.data.data.cnsName
                        }

                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        });
                    }
                })
        },
        creatUserClose() {
            this.getUserData();
        }
    }
};
</script>

<style scoped>
.send-wrapper {
    padding-left: 30px;
}
.send-item {
    line-height: 40px;
}
.send-item-title {
    display: inline-block;
    width: 116px;
    text-align: right;
}
.send-item-params {
    display: inline-block;
}
.send-item >>> .el-input__inner {
    height: 32px;
    line-height: 32px;
}
.send-btn {
}
.send-btn >>> .el-button {
    padding: 9px 16px;
}
</style>
