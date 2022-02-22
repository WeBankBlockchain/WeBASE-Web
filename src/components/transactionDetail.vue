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
  <div style="padding: 0">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('table.transactionInfo')">
        <div>
          <div class="item">
            <span class="label">Block Hash:</span>
            <span>{{transactionData.blockHash || ""}}</span>
          </div>
          <div class="item">
            <span class="label">Block Height:</span>
            <span>{{transactionData.blockNumber || ""}}</span>
          </div>
          <div class="item">
            <span class="label">Gas:</span>
            <span>{{transactionData.gas || ""}}</span>
          </div>
          <div class="item">
            <span class="label">From:</span>
            <span class="input-data-from">
              <span>{{transactionData.from}}</span>
              <span v-show="transactionData && transactionData.user">=></span>
              <span @click='link(transactionData.user)' class="link">{{transactionData.user || ""}}</span>
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
            <span v-if="transactionData.to">{{transactionData.to | contractSource}}</span>
          </div>
          <div class="item">
            <span class="label">nonce:</span>
            <span>{{transactionData.nonce || ""}}</span>
          </div>
          <div class="item">
            <span class="label">Hash:</span>
            <span>{{transactionData.hash || ""}}</span>
          </div>
          <div class="item">
            <span class="label">Timestamp:</span>
            <span>{{createTime || ""}}</span>
          </div>
          <div class="item" style="font-size: 0">
            <span class="label">Input:</span>
            <div class="detail-input-content">
              <span v-if="showDecode" class="input-data">{{transactionData.input || ""}}</span><br v-if="showDecode">
              <div v-if="!showDecode" class="input-data">
                <div class="input-label">
                  <span class="label">function</span>
                  <span>{{funcData + "(" + abiType + outputType + ")"}}</span>
                  <el-tooltip v-if="funcData == '' " effect="dark" :content="$t('text.importContractTip')" placement="top-start">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
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
                        <i class="wbs-icon-copy font-12 copy-public-key" @click="copyPubilcKey(scope.row.data)" title="复制"></i>
                        <span>{{ abc(scope.row.data) }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <div class="item" v-show="inputButtonShow">
              <span class="label"></span>
              <el-button @click="decode" type="primary">{{buttonTitle}}</el-button>
              <span style="margin-left:20px"></span>
              <el-button v-show="exportContrctShow" type="primary" class="search-part-left-btn" @click="generateAbi">{{this.$t("nodes.addAbi")}}</el-button>
              <span style="margin-left:20px"></span>
              <el-button v-show="exportContrctShow" type="primary" class="search-part-left-btn" @click="generateContract">{{this.$t("nodes.addContract")}}</el-button>
            </div>
          </div>
        </div>
        <el-dialog :title="$t('nodes.addAbi')" :visible.sync="importVisibility" width="500px" v-if="importVisibility" center class="send-dialog">
          <import-abi @closeImport="closeImport" @importSuccess="closeImport"></import-abi>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane :label="$t('table.transactionReceipt')" name="txReceiptInfo">
        <el-row v-for="item in txReceiptInfoList" :key="item">
          <el-col :xs='24' :sm="24" :md="6" :lg="4" :xl="2">
            <span class="receipt-field">{{item}}：</span>
          </el-col>
          <el-col :xs='24' :sm="24" :md="18" :lg="20" :xl="22">
            <template class="item" style="font-size: 0" v-if="item == 'output'">
              <div>
                <span v-if="showOutputDecode && txInfoReceiptMap.status == '0x0'">{{txInfoReceiptMap.output || ""}}</span>
                <span v-if="txInfoReceiptMap.status != '0x0'">{{decodeOutData}}</span>
                <div v-if="!showOutputDecode && txInfoReceiptMap.status == '0x0' && showOutDecode" class="input-data">
                  <div class="item">
                    <span class="label">function</span>
                    <span>{{funcOutData + "(" + abiType + outputType + ")"}}</span>
                  </div>
                  <div class="item">
                    <span class="label">methodId</span>
                    <span>{{methodId}}</span>
                  </div>
                  <div class="item">
                    <span class="label">data</span>
                    <el-table :data="outputData" v-if="outputData.length" style="display:inline-block;width:100%;">
                      <el-table-column prop="name" label="name" align="left" v-if="outputData[0].name"></el-table-column>
                      <el-table-column prop="type" label="type" align="left"></el-table-column>
                      <el-table-column prop="data" label="data" align="left" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                          <i class="wbs-icon-copy font-12 copy-public-key" @click="copyPubilcKey(scope.row.data)" title="复制"></i>
                          <span>{{scope.row.data}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>

                </div>
                <div class="item" v-if="txInfoReceiptMap.status == '0x0' && showOutDecode && inputButtonShow">
                  <el-button @click="decodeOutput" type="primary">{{buttonOutTitle}}</el-button>
                </div>
              </div>
            </template>
            <template v-else-if="item == 'logs'">
              <span v-if="txInfoReceiptMap[item]&& !txInfoReceiptMap[item].length">{{txInfoReceiptMap[item]}}</span>
              <div v-for="(item,num) in eventLog" v-if="eventSHow">
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
                    <div v-for="(val,index) in item.topics " :key='val'>[{{index}}] {{val}}</div>
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
                          <i class="wbs-icon-copy font-12 copy-public-key" @click="copyPubilcKey(scope.row.data)" title="复制"></i>
                          <span>{{scope.row.data}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <div class="item" v-show='item.eventButtonShow'>
                  <span class="label"></span>
                  <el-button @click="decodeButtonEvent(num)" type="primary">{{eventTitle}}</el-button>
                </div>
              </div>
            </template>
            <template v-else-if="item == 'status'">
              <p class="base-p" :style="{'color': txStatusColor(txInfoReceiptMap[item])}">{{txInfoReceiptMap[item]}}</p>
            </template>
            <template v-else-if="item == 'to'">
              <p class="base-p">{{txInfoReceiptMap[item]}} <span v-if="txInfoReceiptMap[item]">{{txInfoReceiptMap[item] | contractSource}}</span></p>
            </template>
            <template v-else>
              <p class="base-p">{{txInfoReceiptMap[item]}}</p>
            </template>
          </el-col>
        </el-row>

      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
import {
  getTransactionReceipt,
  hashTransactionInfo,
  getBlockDetail,
  getUserList,
  getFunctionAbi, // get method id
  getAbi,
} from "@/util/api";
import { getDate, isNumber } from "@/util/util";
import errcode from "@/util/errcode";
import router from "@/router";
import importAbi from "@/views/abiList/components/importAbi";

export default {
  name: "transactionDetail",
  components: {
    importAbi,
  },
  props: {
    transHash: {
      type: String,
    },
  },
  data: function () {
    return {
      detail: null,
      transactionData: {},
      contractList: [],
      decodeData: {},
      funcData: "",
      showDecode: false,
      buttonTitle: this.$t("transaction.reduction"),
      eventTitle: this.$t("transaction.reduction"),
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
      userList: [],
      unEvent: false,
      txReceiptInfoList: [
        "output",
        "blockHash",
        "gasUsed",
        "blockNumber",
        "contractAddress",
        "from",
        "transactionIndex",
        "to",
        "logsBloom",
        "transactionHash",
        "status",
        "message",
        "logs",
      ],
      txInfoReceiptMap: {},
      showReceiptDecode: true,
      abiOutType: "",
      funcOutData: "",
      decodeOutData: "",
      outputData: [],
      showOutDecode: false,
      buttonOutTitle: this.$t("transaction.reduction"),
      outputShow: false,
      showOutputDecode: false,
      transOutputData: "",
      outputType: null,
      importVisibility: false,
      exportContrctShow: false,
    };
  },
  mounted: function () {
    this.getHashTransactionInfo();
    this.getUser();
  },
  destroyed: function () {
    localStorage.setItem("transaction", "");
  },
  methods: {
    abc(arr) {
      if (!Array.isArray(arr)) {
        return arr;
      }
      return "[" + arr.toString() + "]";
    },
    link: function (val) {
      router.push({
        path: "/privateKeyManagement",
        query: {
          userName: val,
        },
      });
    },
    copyPubilcKey: function (val) {
      if (!val) {
        this.$message({
          type: "fail",
          showClose: true,
          message: "key为空，不复制。",
          duration: 2000,
        });
      } else {
        this.$copyText(val).then((e) => {
          this.$message({
            type: "success",
            showClose: true,
            message: "复制成功",
            duration: 2000,
          });
        });
      }
    },
    getHashTransactionInfo() {
      let reqdata = {
        groupId: localStorage.getItem("groupId"),
        transHash: this.transHash,
      };
      hashTransactionInfo(reqdata, {})
        .then((res) => {
          if (res.data.code === 0) {
            this.transactionData = res.data.data;
            if (res.data.data) {
              this.getCreatTime(res.data.data.blockNumber);
              this.getAdderss(res.data.data.to, res.data.data.input);
            } else {
              this.$message({
                type: "error",
                message: "无法查询到交易信息",
              });
            }
          } else {
            this.$message({
              type: "error",
              message: errcode.errCode[res.data.code].cn,
            });
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "系统错误!",
          });
        });
    },
    // decode method
    getMethod: function (id, output) {
      let data = {
        groupId: localStorage.getItem("groupId"),
        data: id.substring(0, 10),
      };
      getFunctionAbi(data, {})
        .then((res) => {
          if (res.data.code == 0) {
            // if cannot get abi from backend, show btn of import abi/contract
            if (!res.data.data) {
              this.exportContrctShow = true;
            }
            this.decodefun(id, res.data.data);
            // if output not null, show decode/recover button
            if (output) {
              // decode method id
              this.decodeOutPutfun(output, res.data.data);
              this.outputShow = true;
            } else {
              this.outputShow = false;
            }
          } else {
            this.$message({
              type: "error",
              message: errcode.errCode[response.data.code].cn,
            });
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "系统错误!",
          });
        });
    },
    getDeloyAbi: function (input, output) {
      if (input && input != "0x") {
        let data = {
          groupId: localStorage.getItem("groupId"),
          partOfBytecodeBin: input.substring(2),
        };
        getAbi(data)
          .then((res) => {
            if (res.data.code == 0) {
              this.decodeDeployOutput(output, res.data.data);
              this.decodeDeloy(res.data.data);
            } else {
              this.$message({
                type: "error",
                message: errcode.errCode[response.data.code].cn,
              });
            }
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: "系统错误!",
            });
          });
      }
    },
    getUser: function () {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        pageNumber: 1,
        pageSize: 1000,
      };
      getUserList(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            this.userList = res.data.data;
          } else {
            this.$message({
              type: "error",
              message: errcode.errCode[response.data.code].cn,
            });
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "系统错误!",
          });
        });
    },
    getCreatTime: function (number) {
      let data = {
        groupId: localStorage.getItem("groupId"),
        blockNumber: number,
      };
      getBlockDetail(data)
        .then((res) => {
          if (res.data.code === 0) {
            this.createTime = getDate(res.data.data.timestamp);
          } else {
            this.$message({
              type: "error",
              message: errcode.errCode[response.data.code].cn,
            });
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "系统错误!",
          });
        });
    },
    handleClick(tab, event) {
      if (tab.index == "1") {
        this.decodeEventClick();
      }
    },
    decode: function () {
      if (this.showDecode) {
        this.buttonTitle = this.$t("transaction.reduction");
        this.showDecode = false;
      } else {
        this.buttonTitle = this.$t("transaction.decode");
        this.showDecode = true;
      }
      if (this.eventDataShow) {
        this.buttonTitle = this.$t("transaction.decode");
        this.eventDataShow = false;
      } else {
        this.buttonTitle = this.$t("transaction.reduction");
        this.eventDataShow = true;
      }
    },
    decodeOutput: function () {
      if (this.showOutputDecode) {
        this.buttonOutTitle = this.$t("transaction.reduction");
        this.showOutputDecode = false;
      } else {
        this.buttonOutTitle = this.$t("transaction.decode");
        this.showOutputDecode = true;
      }
    },
    decodeAbi: function (val, list) {
      this.inputButtonShow = true;
      let input = this.transactionData.input;
      this.transactionTo = this.transactionData.to;

      if (this.transactionTo) {
        this.decodefun(input, this.transactionTo);
      } else {
        this.methodId = input.substring(0, 10);
        this.decodeDeloy(this.bin);
      }
    },
    getAdderss: function (to, input) {
      let data = {
        groupId: localStorage.getItem("groupId"),
        transHash: this.transHash,
      };

      getTransactionReceipt(data, {})
        .then((res) => {
          if (res.data.code === 0) {
            this.txInfoReceiptMap = res.data.data;
            this.eventLog = res.data.data.logs;
            // if not deploy contract trans
            if (to && to != "0x0000000000000000000000000000000000000000") {
              this.exportContrctShow = false;
              this.getMethod(input, res.data.data.output);
            } else {
              // else contract deploy trans not decode method
              this.getDeloyAbi(input, res.data.data.output);
            }
          } else {
            this.$message({
              type: "error",
              message: errcode.errCode[res.data.code].cn,
            });
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "系统错误！",
          });
        });
    },
    //decodeEvent
    decodeEventClick: function () {
      for (let i = 0; i < this.eventLog.length; i++) {
        if (this.eventLog[i]["data"] === "0x") {
          this.unEvent = true;
          return;
        }
        let data = {
          groupId: localStorage.getItem("groupId"),
          data: this.eventLog[i].topics[0],
        };
        getFunctionAbi(data)
          .then((res) => {
            if (res.data.code == 0 && res.data.data) {
              this.eventLog[i] = this.decodeEvent(
                res.data.data,
                this.eventLog[i]
              );
              setTimeout(() => {
                this.eventSHow = true;
              }, 200);
            } else if (res.data.code !== 0) {
              this.$message({
                type: "error",
                message: errcode.errCode[res.data.code].cn,
              });
            }
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: "系统错误！",
            });
          });
      }
    },
    //decodeEventLog
    decodeEvent: function (eventData, data) {
      let Web3EthAbi = require("web3-eth-abi");
      let abi = "";
      eventData.abiInfo = JSON.parse(eventData.abiInfo);
      let list = data;
      list.eventTitle = "还原";
      list.eventDataShow = true;
      list.eventButtonShow = true;
      list.eventName = eventData.abiInfo.name + "(";
      for (let i = 0; i < eventData.abiInfo.inputs.length; i++) {
        console.log(eventData.abiInfo.inputs[i]);
        if (i == eventData.abiInfo.inputs.length - 1) {
          if (eventData.abiInfo.inputs[i]["indexed"]) {
            list.eventName =
              list.eventName +
              eventData.abiInfo.inputs[i].type +
              " " +
              "indexed" +
              " " +
              eventData.abiInfo.inputs[i].name;
          } else {
            list.eventName =
              list.eventName +
              eventData.abiInfo.inputs[i].type +
              " " +
              eventData.abiInfo.inputs[i].name;
          }
        } else {
          if (eventData.abiInfo.inputs[i]["indexed"]) {
            list.eventName =
              list.eventName +
              eventData.abiInfo.inputs[i].type +
              " " +
              "indexed" +
              " " +
              eventData.abiInfo.inputs[i].name +
              ",";
          } else {
            list.eventName =
              list.eventName +
              eventData.abiInfo.inputs[i].type +
              " " +
              eventData.abiInfo.inputs[i].name +
              ",";
          }
        }
      }
      list.eventName = list.eventName + ")";
      console.log(eventData.abiInfo.inputs, "=====");
      let eventResult = Web3EthAbi.decodeLog(
        eventData.abiInfo.inputs,
        list.data,
        list.topics.slice(1)
      );
      list.outData = {};
      list.eventLgData = [];
      for (const key in eventResult) {
        if (+key || +key == 0) {
          list.outData[key] = eventResult[key];
        }
      }
      if (
        eventData.abiInfo.inputs.length &&
        JSON.stringify(list.outData) != "{}"
      ) {
        for (const key in list.outData) {
          eventData.abiInfo.inputs.forEach((items, index) => {
            if (index == key) {
              list.eventLgData[index] = {};
              list.eventLgData[index].name = items.name;
              list.eventLgData[index].data = list.outData[key];
            }
          });
        }
      }
      return list;
    },
    decodeButtonEvent: function (num) {
      if (this.eventLog[num].eventDataShow) {
        this.$set(this.eventLog[num], "eventDataShow", false);
        this.$set(
          this.eventLog[num],
          "eventTitle",
          this.$t("transaction.decode")
        );
        this.$set(this.eventLog, num, this.eventLog[num]);
      } else {
        this.$set(this.eventLog[num], "eventDataShow", true);
        this.$set(
          this.eventLog[num],
          "eventTitle",
          this.$t("transaction.reduction")
        );
        this.$set(this.eventLog, num, this.eventLog[num]);
      }
    },
    //transactionDecode
    decodefun: function (input, abiData) {
      let Web3EthAbi = require("web3-eth-abi");
      if (this.userList.length) {
        this.userList.forEach((value) => {
          if (value.address == this.transactionData.from) {
            this.transactionData.user = value.userName;
          }
        });
      }
      this.methodId = input.substring(0, 10);
      // this.methodId = data;
      let inputDatas = "0x" + input.substring(10);
      if (abiData) {
        abiData.abiInfo = JSON.parse(abiData.abiInfo);
        abiData.abiInfo.inputs.forEach((val, index) => {
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
        console.log(this.abiType);
        if (abiData.abiInfo.outputs && abiData.abiInfo.outputs.length) {
          let outputType = [];
          abiData.abiInfo.outputs.forEach((val, index) => {
            if (val && val.type && val.name) {
              outputType[index] = val.type + " " + val.name;
            } else if (val && val.name) {
              outputType[index] = val.name;
            } else if (val && val.type) {
              outputType[index] = val.type;
            } else if (val) {
              outputType[index] = val;
            }
          });
          this.outputType = " returns ";
          for (let i = 0; i < outputType.length; i++) {
            this.outputType = this.outputType + outputType[i];
          }
        } else {
          this.outputType = "";
        }
        this.funcData = abiData.abiInfo.name;

        if (abiData.abiInfo.inputs.length) {
          this.decodeData = Web3EthAbi.decodeParameters(
            abiData.abiInfo.inputs,
            inputDatas
          );
          if (JSON.stringify(this.decodeData) != "{}") {
            for (const key in this.decodeData) {
              abiData.abiInfo.inputs.forEach((val, index) => {
                if (val && val.name && val.type) {
                  if (key === val.name) {
                    this.inputData[index] = {};
                    this.inputData[index].name = val.name;
                    this.inputData[index].type = val.type;
                    this.inputData[index].data = this.decodeData[key];
                  }
                } else if (val) {
                  if (index == key) {
                    this.inputData[index] = {};
                    this.inputData[index].type = val;
                    this.inputData[index].data = this.decodeData[key];
                  }
                }
              });
            }
          }
        }
        this.showDecode = false;
        this.buttonTitle = this.$t("transaction.reduction");
      }
    },
    decodeDeployOutput: function (output, data) {
      this.showOutputDecode = true;
    },
    //解析output(method id)
    decodeOutPutfun: function (output, abiData) {
      let web3 = new Web3(Web3.givenProvider);
      if (abiData) {
        abiData.abiInfo.outputs.forEach((val, index) => {
          if (val && index < abiData.abiInfo.outputs.length - 1) {
            this.abiOutType = this.abiOutType + val.type + " " + val.name + ",";
          } else if (val && index == abiData.abiInfo.outputs.length - 1) {
            this.abiOutType = this.abiOutType + val.type + " " + val.name;
          }
        });
        this.funcOutData = abiData.abiInfo.name;
        if (abiData.abiInfo.outputs.length) {
          this.showOutputDecode = false;
          this.showOutDecode = true;
          this.decodeOutData = web3.eth.abi.decodeParameters(
            abiData.abiInfo.outputs,
            output
          );
          // console.log(this.decodeOutData)
          if (JSON.stringify(this.decodeOutData) != "{}") {
            for (const key in this.decodeOutData) {
              for (
                let index = 0;
                index < abiData.abiInfo.outputs.length;
                index++
              ) {
                this.outputData[index] = {};
                this.outputData[index].name =
                  abiData.abiInfo.outputs[index].name;
                this.outputData[index].type =
                  abiData.abiInfo.outputs[index].type;
                this.outputData[index].data = this.decodeOutData[index];
                // console.log(typeof(this.outputData[index].data))
                if (typeof this.outputData[index].data == "boolean") {
                  this.outputData[index].data =
                    this.outputData[index].data.toString();
                }
              }
            }
          }
          // console.log(this.outputData)
        } else {
          this.showOutDecode = false;
          this.showOutputDecode = true;
          try {
            let data = "0x" + output.substring(10);
            this.decodeOutData = web3.eth.abi.decodeParameter("string", data);
            // console.log(this.decodeOutData)
          } catch (error) {
            console.log(error);
          }

          // console.log(this.decodeOutData)
        }
        this.buttonOutTitle = this.$t("transaction.reduction");
      }
    },
    //deloy-contract-transaction-decode
    decodeDeloy: function (items) {
      if (this.userList.length) {
        this.userList.forEach((value) => {
          if (value.address == this.transactionData.from) {
            this.transactionData.user = value.userName;
          }
        });
      }
      if (items) {
        let input = JSON.parse(items.contractAbi);
        this.funcData = items.contractName;
        input.forEach((value) => {
          if (value.type == "constructor") {
            value.inputs.forEach((item, index) => {
              if (item && item.type && item.name) {
                this.abiType[index] = item.type + " " + item.name;
              } else if (item && item.name) {
                this.abiType[index] = item.name;
              } else if (item && item.type) {
                this.abiType[index] = item.type;
              } else if (item) {
                this.abiType[index] = item;
              }
            });
          }
        });
        this.showDecode = false;
        this.buttonTitle = this.$t("transaction.reduction");
      } else {
        this.buttonSHow = false;
        this.showDecode = false;
      }
    },
    txStatusColor(val) {
      if (val == "0x0") {
        return "#67C23A";
      } else {
        return "#F56C6C";
      }
    },
    // 打开添加abi弹窗
    generateAbi() {
      this.importVisibility = true;
    },
    closeImport() {
      this.getHashTransactionInfo();
      this.importVisibility = false;
    },
    generateContract() {
      localStorage.setItem("dataFrom", "transactionDetail");
      router.push("/contract");
    },
  },
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
.receipt-field {
  font-weight: bold;
}
.base-p {
  overflow: hidden;
  word-break: break-all;
  word-wrap: break-word;
}
</style>


