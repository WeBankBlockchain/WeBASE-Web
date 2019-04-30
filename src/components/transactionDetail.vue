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
    <div style="padding: 0">
        <el-tabs type="border-card" @tab-click="handleClick" class="Tx-table-content">
            <el-tab-pane label="input">
                <div>
                    <div class="item">
                        <span class="label">Block Height:</span>
                        <span>{{transactionData.blockNumber}}</span>
                    </div>
                    <div class="item">
                        <span class="label">From:</span>
                        <span class="input-data-from">
                            <span>{{transactionData.from}}</span>
                            <span v-show="transactionData && transactionData.user">=></span>
                            <span @click='link(transactionData.user)' class="link">{{transactionData.user}}</span>
                        </span>
                    </div>
                    <div class="item">
                        <span class="label">
                            <el-tooltip class="item" effect="dark" content="部署合约，to字段为空。" placement="top-start">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                            <span>To:</span>
                        </span>
                        <span>{{transactionData.to || 'null'}}</span>
                    </div>
                    <div class="item">
                        <span class="label">Timestamp:</span>
                        <span>{{createTime}}</span>
                    </div>
                    <div class="item" style="font-size: 0">
                        <span class="label">Input:</span>
                        <div class="detail-input-content">
                            <span v-if="showDecode" class="input-data">{{transactionData.input}}</span><br v-if="showDecode">
                            <div v-if="!showDecode" class="input-data">
                                <div class="input-label">
                                    <span class="label">function</span>
                                    <span>{{funcData + "(" + abiType + ")"}}</span>
                                </div>
                                <div class="input-label">
                                    <span class="label">methodId</span>
                                    <span>{{methodId}}</span>
                                </div>
                                <div class="input-label">
                                    <span class="label">data</span>
                                    <el-table :data="inputData" v-if="inputData.length" style="display:inline-block;width:400px">
                                        <el-table-column prop="name" label="name" align="left" v-if="inputData[0].name"></el-table-column>
                                        <el-table-column prop="type" label="type" align="left"></el-table-column>
                                        <el-table-column prop="data" label="data" align="left" :show-overflow-tooltip="true">
                                            <template slot-scope="scope">
                                                <i class="wbs-icon-baocun font-12 copy-public-key" @click="copyPubilcKey(scope.row.data)" title="复制"></i>
                                                <span>{{scope.row.data}}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </div>
                        <div class="item" v-show="inputButtonShow">
                            <span class="label"></span>
                            <el-button @click="decode" type="primary">{{buttonTitle}}</el-button>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="event" v-if="eventLog.length > 0" @click="decodeEventClick">
                <div v-for="item in eventLog" v-if="eventSHow">
                    <div class="item">
                        <span class="label">Address :</span>
                        <span>{{item.address}}</span>
                    </div>
                    <div class="item">
                        <span class="label">Name :</span>
                        <span>{{item.eventName}}</span>
                    </div>
                    <div class="item">
                        <span class="label">Topics :</span>
                        <div style="display: inline-block;width:800px;">
                            <div v-for="(val,index) in item.topics ">[{{index}}] {{val}}</div>
                        </div>
                    </div>
                    <div class="item">
                        <span class="label">Data :</span>
                        <div class="detail-input-content">
                            <span v-if="!item.eventDataShow" class="input-data">{{item.data}}</span>
                            <el-table class="input-data" :data="item.eventLgData" v-show="item.eventDataShow" style="display:inline-block;width:100%;">
                                <el-table-column prop="name" width="150" label="name" align="left"></el-table-column>
                                <el-table-column prop="data" label="data" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <i class="wbs-icon-baocun font-12 copy-public-key" @click="copyPubilcKey(scope.row.data)" title="复制"></i>
                                        <span>{{scope.row.data}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div class="item" v-show='item.eventButtonShow'>
                        <span class="label"></span>
                        <el-button @click="decode" type="primary">{{eventTitle}}</el-button>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>
<script>
import {
    getContractList,
    getByteCode,
    getTransactionReceipt,
    hashTransactionInfo,
    getBlockDetail,
    getUserList
} from "@/util/api";
import { getDate, isNumber } from "@/util/util";
import errcode from "@/util/errcode";
import router from "@/router";

export default {
    name: "transactionDetail",
    props: {
        transHash: {
            type: String
        }
    },
    data: function() {
        return {
            detail: null,
            transactionData: {},
            contractList: [],
            decodeData: {},
            funcData: "",
            showDecode: false,
            buttonTitle: "还原",
            eventTitle: "还原",
            abiType: [],
            methodId: "",
            inputData: [],
            eventLog: [],
            buttonSHow: false,
            eventSHow: false,
            transactionTo: null,
            bin: "",
            createTime: null,
            eventDataShow: true,
            inputButtonShow: true,
            eventButtonShow: true,
            userList: []
        };
    },
    mounted: function() {
        this.getContacts(this.getHashTransactionInfo);
        this.getUser();
    },
    destroyed: function() {
        localStorage.setItem("transaction", "");
    },
    methods: {
        link: function(val) {
            router.push({
                path: "/rivateKeyManagement",
                query: {
                    userName: val
                }
            });
        },
        copyPubilcKey: function(val) {
            if (!val) {
                this.$message({
                    type: "fail",
                    showClose: true,
                    message: "key为空，不复制。",
                    duration: 2000
                });
            } else {
                this.$copyText(val).then(e => {
                    this.$message({
                        type: "success",
                        showClose: true,
                        message: "复制成功",
                        duration: 2000
                    });
                });
            }
        },
        getHashTransactionInfo() {
            let reqdata = {
                networkId: localStorage.getItem("networkId"),
                transHash: this.transHash
            };
            hashTransactionInfo(reqdata, {})
                .then(res => {
                    if (res.data.code === 0) {
                        this.transactionData = res.data.data;
                        if (res.data.data) {
                            this.getCreatTime(res.data.data.blockNumber);
                            this.getAdderss();
                        } else {
                            this.$message({
                                type: "error",
                                message: "无法查询到交易信息"
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
                    this.$message({
                        type: "error",
                        message: "系统错误!"
                    });
                });
        },
        getUser: function() {
            let reqData = {
                networkId: localStorage.getItem("networkId"),
                pageNumber: 1,
                pageSize: 1000
            };
            getUserList(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.userList = res.data.data;
                    } else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[response.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "系统错误!"
                    });
                });
        },
        getCreatTime: function(number) {
            let data = {
                networkId: localStorage.getItem("networkId"),
                blockNumber: number
            };
            getBlockDetail(data)
                .then(res => {
                    if (res.data.code === 0) {
                        this.createTime = getDate(res.data.data.timestamp);
                    } else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[response.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "系统错误!"
                    });
                });
        },
        handleClick(tab, event) {
            if (tab.label == "event") {
                this.decodeEventClick();
            }
        },
        decode: function() {
            if (this.showDecode) {
                this.buttonTitle = "还原";
                this.showDecode = false;
            } else {
                this.buttonTitle = "解码";
                this.showDecode = true;
            }
            if (this.eventDataShow) {
                this.buttonTitle = "解码";
                this.eventDataShow = false;
            } else {
                this.buttonTitle = "还原";
                this.eventDataShow = true;
            }
        },
        getBin: function(adr, blockHeight, callback) {
            let data = {
                networkId: localStorage.getItem("networkId"),
                address: adr,
                blockNumber: blockHeight
            };
            getByteCode(data, {})
                .then(response => {
                    if (response.data.code === 0) {
                        this.bin = response.data.data.code;
                        callback();
                    } else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[response.data.code].cn
                        });
                        return;
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "系统错误!"
                    });
                    return;
                });
        },
        getEventBin: function(adr, blockHeight, callback, list, index) {
            let data = {
                networkId: localStorage.getItem("networkId"),
                address: adr,
                blockNumber: blockHeight
            };
            getByteCode(data, {})
                .then(response => {
                    if (response.data.code === 0) {
                        this.bin = response.data.data.code;
                        callback(response.data.data.code, list, index);
                    } else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[response.data.code].cn
                        });
                        return;
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "系统错误!"
                    });
                    return;
                });
        },
        getContacts: function(callback) {
            let reqdata = {
                networkId: localStorage.getItem("networkId"),
                pageSize: 1,
                pageNumber: 1000
            };
            getContractList(reqdata)
                .then(res => {
                    if (res.data.code === 0) {
                        this.contractList = res.data.data || [];
                        callback();
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
                        message: "系统错误!"
                    });
                });
        },
        decodeAbi: function(val, list) {
            this.inputButtonShow = true;
            let input = this.transactionData.input;
            this.transactionTo = this.transactionData.to;
            if (this.userList.length) {
                this.userList.forEach(value => {
                    if (value.address == this.transactionData.from) {
                        this.transactionData.user = value.userName;
                    }
                });
            }
            if (this.transactionTo) {
                this.decodefun(input, this.transactionTo);
            } else {
                this.methodId = input.substring(0, 10);
                this.decodeDeloy(this.bin);
            }
        },
        getAdderss: function() {
            let data = {
                networkId: localStorage.getItem("networkId"),
                transHash: this.transHash
            };

            getTransactionReceipt(data, {})
                .then(res => {
                    if (res.data.code === 0) {
                        this.eventLog = res.data.data.logs;
                        if (this.transactionData.to) {
                            this.getBin(
                                this.transactionData.to,
                                res.data.data.blockNumber,
                                this.decodeAbi
                            );
                        } else {
                            this.getBin(
                                res.data.data.contractAddress,
                                res.data.data.blockNumber,
                                this.decodeAbi
                            );
                        }
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
        //decodeEvent
        decodeEventClick: function() {
            if (this.eventLog.length) {
                this.eventSHow = true;
                for (let i = 0; i < this.eventLog.length; i++) {
                    this.getEventBin(
                        this.eventLog[i].address,
                        this.eventLog[i].blockNumber,
                        this.decodeEvent,
                        this.eventLog[i],
                        i
                    );
                }
            } else {
                this.eventSHow = false;
            }
        },
        //decodeEventLog
        decodeEvent: function(item, data, index) {
            let web3 = new Web3(Web3.givenProvider);
            let abi = "";
            let list = data;
            item = item.substring(2);
            for (let i = 0; i < this.eventLog.length; i++) {
                let num = 0;
                this.contractList.forEach(val => {
                    if (val.contractBin === item) {
                        if (val.contractAbi) {
                            list.abi = JSON.parse(val.contractAbi);
                        } else {
                            list.abi = [];
                        }
                    } else {
                        num++;
                    }
                });
                list.eventDataShow = true;
                list.eventButtonShow = true;
                if (num == this.contractList.length) {
                    list.eventDataShow = false;
                    list.eventButtonShow = false;
                }
            }
            if (list.abi && list.abi.length) {
                list.abi.forEach(value => {
                    if (value.type == "event") {
                        list.eventName = value.name + "(";
                        for (let i = 0; i < value.inputs.length; i++) {
                            if (i == value.inputs.length - 1) {
                                list.eventName =
                                    list.eventName +
                                    value.inputs[i].type +
                                    " " +
                                    value.inputs[i].name;
                            } else {
                                list.eventName =
                                    list.eventName +
                                    value.inputs[i].type +
                                    " " +
                                    value.inputs[i].name +
                                    ",";
                            }
                        }
                        list.eventName = list.eventName + ")";
                        let eventData = web3.eth.abi.decodeLog(
                            value.inputs,
                            list.data,
                            list.topics
                        );
                        list.outData = {};
                        list.eventLgData = [];
                        for (const key in eventData) {
                            if (+key || +key == 0) {
                                list.outData[key] = eventData[key];
                            }
                        }
                        if (
                            value.inputs.length &&
                            JSON.stringify(list.outData) != "{}"
                        ) {
                            for (const key in list.outData) {
                                value.inputs.forEach((items, index) => {
                                    if (index == key) {
                                        list.eventLgData[index] = {};
                                        list.eventLgData[index].name =
                                            items.name;
                                        list.eventLgData[index].data =
                                            list.outData[key];
                                    }
                                });
                            }
                        }
                    }
                });
            }
            this.$set(this.eventLog, index, list);
        },

        //transactionDecode
        decodefun: function(input, adr) {
            let web3 = new Web3(Web3.givenProvider);
            let data = input.substring(0, 10);
            this.methodId = data;
            let inputDatas = "0x" + input.substring(10);
            let abi = "";
            let abiData = {};
            this.bin = this.bin.substring(2);
            let num = 0;
            if (this.contractList.length) {
                this.contractList.forEach(value => {
                    if (value.contractBin === this.bin) {
                        abi = value.contractAbi;
                        this.buttonSHow = true;
                    } else {
                        num++;
                    }
                });
                if (num == this.contractList.length) {
                    this.showDecode = true;
                    this.inputButtonShow = false;
                }
            }
            if (abi) {
                abiData = JSON.parse(abi);
                abiData.forEach(value => {
                    value.encode = web3.eth.abi.encodeFunctionSignature({
                        name: value.name,
                        type: value.type,
                        inputs: value.inputs
                    });
                });
                abiData.forEach(value => {
                    if (value.encode === data) {
                        value.inputs.forEach((val, index) => {
                            if (val && val.type && val.name) {
                                this.abiType[index] = val.type + " " + val.name;
                            } else if (val && val.name) {
                                this.abiType[index] = val.name;
                            } else if (val && val.type) {
                                this.abiType[index] = val.type;
                            } else if (val) {
                                this.abiType[index] = val;
                            }
                        });
                        this.funcData = value.name;
                        if (value.inputs.length) {
                            this.decodeData = web3.eth.abi.decodeParameters(
                                value.inputs,
                                inputDatas
                            );
                            if (JSON.stringify(this.decodeData) != "{}") {
                                for (const key in this.decodeData) {
                                    value.inputs.forEach((val, index) => {
                                        if (val && val.name && val.type) {
                                            if (key === val.name) {
                                                this.inputData[index] = {};
                                                this.inputData[index].name =
                                                    val.name;
                                                this.inputData[index].type =
                                                    val.type;
                                                this.inputData[
                                                    index
                                                ].data = this.decodeData[key];
                                            }
                                        } else if (val) {
                                            if (index == key) {
                                                this.inputData[index] = {};
                                                this.inputData[
                                                    index
                                                ].type = val;
                                                this.inputData[
                                                    index
                                                ].data = this.decodeData[key];
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            }
        },
        //deloy-contract-transaction-decode
        decodeDeloy: function(val) {
            let abi = "";
            let contractName = "";
            let input = {};
            let num = 0;
            val = val.substring(2);
            if (this.contractList.length) {
                this.contractList.forEach(value => {
                    if (value.contractBin === val) {
                        abi = value.contractAbi;
                        contractName = value.contractName;
                        this.buttonSHow = true;
                    } else {
                        num++;
                    }
                });
                if (num == this.contractList.length) {
                    this.showDecode = true;
                    this.inputButtonShow = false;
                }
            }
            if (abi) {
                input = JSON.parse(abi);
                if (input.length > 0) {
                    input.forEach(value => {
                        if (
                            value.type === "constructor" ||
                            value.name === contractName
                        ) {
                            this.funcData = contractName;
                            value.inputs.forEach((item, index) => {
                                if (item && item.type && item.name) {
                                    this.abiType[index] =
                                        item.type + " " + item.name;
                                } else if (item && item.name) {
                                    this.abiType[index] = item.name;
                                } else if (item && item.type) {
                                    this.abiType[index] = item.type;
                                } else if (item) {
                                    this.abiType[index] = item;
                                }
                            });
                        } else {
                            this.showDecode = true;
                            this.inputButtonShow = false;
                        }
                    });
                }
            }
        }
    }
};
</script>
<style scoped>
.label {
    display: inline-block;
    width: 120px;
    font-weight: bold;
    vertical-align: top;
    font-size: 12px;
}
.item {
    padding: 3px 0;
}
.input {
    display: inline-block;
    font-size: 0;
    vertical-align: top;
}
.input span {
    font-size: 12px;
}
.input-data {
    display: inline-block;
    width: 100%;
    padding: 10px;
    max-height: 200px;
    overflow: auto;
    word-break: break-all;
    word-wrap: break-word;
    box-sizing: border-box;
}
.input-data-from {
    display: inline-block;
    width: calc(100% - 200px);
    height: auto;
    word-break: break-all;
    word-wrap: break-word;
    box-sizing: border-box;
}
.input-label {
    padding-bottom: 15px;
}
.input-label .label {
    width: 80px;
    font-size: 12px;
}
.detail-input-content {
    display: inline-block;
    width: calc(100% - 200px);
    height: auto;
    border: 1px solid #eaedf3;
    border-radius: 4px;
    font-size: 12px;
}

</style>


