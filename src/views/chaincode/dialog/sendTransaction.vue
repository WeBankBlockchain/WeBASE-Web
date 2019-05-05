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
    <div class="send-wrapper">
        <div class="send-item">
            <span class="send-item-title">合约名称:</span>
            <span>{{data.contractName}}</span>
        </div>
        <!-- <div class="send-item">
            <span class="send-item-title">合约版本:</span>
            <span>{{contractVersion}}</span>
        </div> -->
        <div class="send-item">
            <span class="send-item-title">用户:</span>
            <el-select v-model="transation.userName" placeholder="请选择用户" @change="changeId" style="width:240px">
                <el-option :label="item.userName" :value="item.userName" :key="item.userId" v-for='(item,index) in userList'></el-option>
            </el-select>
        </div>
        <div class="send-item">
            <span class="send-item-title">方法:</span>
            <el-select v-model="transation.funcType" placeholder="方法类型" @change="changeType($event)" style="width:110px">
                <el-option label="function" :value="'function'"></el-option>
            </el-select>
            <el-select v-model="transation.funcName" placeholder="方法名" v-show="funcList.length > 0" @change="changeFunc" style="width:125px">
                <el-option :label="item.name" :key="item.funcId" :value="item.funcId" v-for="item in funcList"></el-option>
            </el-select>
        </div>
        <div class="send-item" v-show="pramasData.length" style="line-height: 25px;">
            <span class="send-item-title" style="position: relative;top: 5px;">参数:</span>
                <ul  style="position: relative;top: -25px;">
                    <li v-for="(item,index) in pramasData" style="margin-left:63px;">
                    <el-input v-model="transation.funcValue[index]" style="width: 240px;" :placeholder="item.type">
                        <template slot="prepend">
                            <span class="">{{item.name}}</span>
                        </template>
                    </el-input>
                    <!-- <el-tooltip class="item" effect="dark" content="如果参数类型是数组，请用逗号分隔，不需要加上引号，例如：arry1,arry2。string等其他类型也不用加上引号" placement="top-start">
                        <i class="el-icon-info" style="position: relative;top: 8px;"></i>
                    </el-tooltip> -->
                    </li>
                     <p style="padding: 5px 0 0 28px;"><i class="el-icon-info" style="padding-right: 4px;"></i>如果参数类型是数组，请用逗号分隔，不需要加上引号，例如：arry1,arry2。string等其他类型也不用加上引号。</p>
                </ul>
        </div>
        <div class="text-right send-btn">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="submit('transation')" :disabled='buttonClick'>确定</el-button>
        </div>
    </div>
</template>
<script>
import { sendTransation, getUserList } from "@/util/api";
import errcode from "@/util/errcode";

export default {
    name: "sendTransation",
    props: ["data", "dialogClose", "abi",'version'],
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
            buttonClick: false,
            contractVersion: this.version
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
                this.abiList.forEach((value,index) => {
                    if (value.type === val) {
                        value.funcId = index
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
                this.abiList.forEach((value,index) => {
                    if (value.type === "function") {
                        value.funcId = index
                        this.funcList.push(value);
                    }
                });
                console.log(this.funcList)
            }
            if (this.funcList.length) {
                this.transation.funcName = this.funcList[0].funcId;
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
                if (value.funcId === this.transation.funcName) {
                    this.pramasData = value.inputs;
                }
            });
        },
        getUserData: function() {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
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
            let functionName = "";
            this.funcList.forEach(value => {
                if(value.funcId == this.transation.funcName){
                    functionName = value.name
                }
            })
            let data = {
                groupId: localStorage.getItem("groupId"),
                userId: this.userId,
                contractName: this.data.contractName,
                version: this.contractVersion,
                funcName: functionName || "",
                funcParam: this.transation.funcValue,
                abiInfo: this.abiList,
                contractId: this.data.contractId
            };
            sendTransation(data)
                .then(res => {
                    this.buttonClick = false;
                    this.close();
                    if (res.data.code === 0) {
                        if (res.data.data) {
                            let resData = res.data.data ;
                            this.$emit("success", resData);
                        } else {
                            this.$message({
                                type: "success",
                                message: "发送交易成功!"
                            });
                            this.$emit("success", false);
                        }
                    } else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                        this.close();
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
.send-wrapper {
    padding-left: 30px;
}
.send-item {
    line-height: 40px;
}
.send-item-title {
    display: inline-block;
    width: 60px;
    text-align: right;
}
.send-item-params {
    display: inline-block;
}
.send-item /deep/.el-input__inner {
    height: 32px;
    line-height: 32px;
}
.send-btn {

}
.send-btn /deep/ .el-button {
    padding: 9px 16px;
}
</style>
