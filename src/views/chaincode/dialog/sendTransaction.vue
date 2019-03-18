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
    <div style="text-align:left">
        <div class="send-item">
            <span class="send-item-title">合约名称:</span>
            <span>{{data.contractName}}</span>
        </div>
        <div class="send-item">
            <span class="send-item-title">合约版本:</span>
            <span>{{data.contractVersion}}</span>
        </div>
        <div class="send-item">
            <span class="send-item-title">用户:</span>
            <el-select v-model="transation.userName" placeholder="请选择用户" @change="changeId">
                <el-option :label="item.userName" :value="item.userName" :key="item.userId" v-for='(item,index) in userList'></el-option>
            </el-select>
        </div>
        <div class="send-item">
            <span class="send-item-title">方法:</span>
            <el-select v-model="transation.funcType" placeholder="方法类型" @change="changeType($event)">
                <el-option label="function" :value="'function'"></el-option>
                <!-- <el-option label="constructor" :value="'constructor'"></el-option> -->
            </el-select>
            <el-select v-model="transation.funcName" placeholder="方法名" v-show="funcList.length > 0" @change="changeFunc">
                <el-option :label="item.name" :key="item.name" :value="item.name" v-for="item in funcList"></el-option>
            </el-select>
        </div>
        <div class="send-item" v-show="pramasData.length">
            <span class="send-item-title">参数:</span>
            <div class="send-item-params">
                <div v-for="(item,index) in pramasData">
                    <span class="send-item-title">{{item.type}}</span>
                    <el-input v-model="transation.funcValue[index]" style="width: 200px;"></el-input>
                    <el-tooltip class="item" effect="dark" content="如果参数类型是数组，请用逗号分隔，例如：'arry1,arry2'" placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </div>
            </div>

        </div>
        <div style="text-align:right">
            <el-button type="primary" @click="submit('transation')" :disabled='buttonClick'>确定</el-button>
            <el-button @click="close">取消</el-button>
        </div>
    </div>
</template>
<script>
import { sendTransation, getUserList } from "@/util/api";
import errcode from "@/util/errcode";

export default {
    name: "sendTransation",
    props: ["data", "dialogClose", "abi"],
    data: function() {
        return {
            transation: {
                userName: "",
                funcName: "",
                funcValue: [],
                funcType: "function"
            },
            userId: "",
            userList: [],
            abiList: [],
            pramasData: [],
            funcList: [],
            buttonClick: false
        };
    },
    mounted: function() {
        this.getUserData();
        this.formatAbi();
    },
    methods: {
        submit: function(formName) {
            this.send();
        },
        close: function(formName) {
            this.$emit("close", false);
        },
        changeType: function(val) {
            this.funcList = [];
            if (val && val === "function") {
                this.abiList.forEach(value => {
                    if (value.type === val) {
                        this.funcList.push(value);
                    }
                });
            } else if (val && val === "constructor") {
                this.abiList.forEach(value => {
                    if (value.type === val) {
                        this.pramasData = value.inputs;
                    }
                });
            } else {
                this.abiList.forEach(value => {
                    if (value.type === "function") {
                        this.funcList.push(value);
                    }
                });
            }
            if (this.funcList.length) {
                this.transation.funcName = this.funcList[0].name;
            }
        },
        changeId: function() {
            if (this.transation.userName) {
                this.userList.forEach(value => {
                    if (this.transation.userName === value.userName) {
                        this.userId = value.userId;
                    }
                });
            }
        },
        formatAbi: function() {
            let abi = this.abi;
            if (abi) {
                this.abiList = JSON.parse(abi);
                this.changeType();
            }
        },
        changeFunc: function() {
            this.funcList.forEach(value => {
                if (value.name === this.transation.funcName) {
                    this.pramasData = value.inputs;
                }
            });
        },
        getUserData: function() {
            let reqData = {
                networkId: localStorage.getItem("networkId"),
                pageNumber: 1,
                pageSize: 1000
            };
            getUserList(reqData, {})
                .then(res => {
                    if (res.data.code === 0) {
                        res.data.data.forEach(value => {
                            if (value.hasPk === 1) {
                                this.userList.push(value);
                            }
                        });
                        if (this.userList.length) {
                            this.transation.userName = this.userList[0].userName;
                            this.userId = this.userList[0].userId;
                        }
                        this.changeFunc();
                    } else {
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
        send: function() {
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
                    this.transation.funcValue[i] = data;
                }
            }
            let data = {
                networkId: localStorage.getItem("networkId"),
                userId: this.userId,
                contractName: this.data.contractName,
                version: this.data.contractVersion,
                funcName: this.transation.funcName,
                funcParam: this.transation.funcValue,
                abiInfo: this.abiList
            };
            sendTransation(data)
                .then(res => {
                    this.buttonClick = false;
                    this.close();
                    if (res.data.code === 0) {
                        if (res.data.data) {
                            let resData = JSON.stringify(
                                res.data.data,
                                null,
                                4
                            );
                            this.$alert(
                                `<p style='word-wrap: break-word;word-break:break-all;max-height:200px;overflow:auto'>
                               ${resData}</p>`,
                                "交易结果",
                                {
                                    confirmButtonText: "确定",
                                    dangerouslyUseHTMLString: true
                                }
                            );
                            this.$emit("success", false);
                        } else {
                            this.$message({
                                type: "success",
                                message: "发送交易成功!"
                            });
                        }
                    } else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.buttonClick = false;
                    this.close();
                    this.$message({
                        type: "error",
                        message: "发送交易失败！"
                    });
                });
        }
    }
};
</script>

<style scoped>
.send-item {
    padding-left: 60px;
    line-height: 60px;
}
.send-item-title {
    display: inline-block;
    width: 80px;
}
.send-item-params {
    display: inline-block;
    width: 400px;
    vertical-align: top;
}
</style>
