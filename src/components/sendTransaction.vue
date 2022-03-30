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
    <div class="send-body">
      <div class="send-item">
        <span class="send-item-title">{{ this.$t("contracts.contractName") }}:</span>
        <span>{{ data.contractName }}</span>
      </div>
      <div class="send-item">
        <span class="send-item-title">CNS:</span>
        <span>
          <el-checkbox v-model="isCNS" @change="changeCns"></el-checkbox>
        </span>
      </div>
      <div class="send-item" v-if="isCNS">
        <span class="send-item-title"></span>
        <el-input v-model.trim="cnsName" style="width: 400px; margin-bottom: 4px" :placeholder="$t('dialog.cnsName')">
          <template slot="prepend">
            <span class="">name</span>
          </template>
        </el-input>
      </div>
      <div class="send-item" v-if="isCNS">
        <span class="send-item-title"></span>
        <el-input v-model.trim="cnsVersion" style="width: 400px; margin-bottom: 4px" :placeholder="$t('dialog.cnsVersion')">
          <template slot="prepend">
            <span class="">version</span>
          </template>
        </el-input>
      </div>
      <div class="send-item" v-else>
        <span class="send-item-title">{{ this.$t("contracts.contractAddress") }}:</span>
        <el-input v-model="contractAddress" style="width: 400px" :placeholder="$t('contracts.contractAddressInput')"></el-input>
        <el-tooltip class="item" effect="dark" :content="$t('contracts.contractAddressInfo')" placement="top-start">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </div>
      <div class="send-item" v-show="showUser">
        <span class="send-item-title">{{ this.$t("contracts.user") }}:</span>
        <el-select v-model="transation.userName" :placeholder="$t('contracts.selectUser')" style="width: 400px">
          <el-option :label="item.userName" :value="item.address" :key="item.userId" v-for="(item, index) in userList">
            <span>{{ item.userName }}</span>
            <!-- <span class="font-12">{{splitString(item.address)}}...</span> -->
            <span class="font-12">{{ item.address }}</span>
          </el-option>
        </el-select>
        <span v-if="isUserNameShow" class="contract-code-done" @click="$store.dispatch('switch_creat_user_dialog')">
          <span target="_blank" style="cursor: pointer; text-decoration: underline">{{ this.$t("privateKey.addUser") }}</span>
        </span>
      </div>
      <el-dialog :visible.sync="$store.state.creatUserVisible" :title="$t('privateKey.createUser')" width="640px" :append-to-body="true" class="dialog-wrapper" center>
        <v-creatUser @creatUserClose="creatUserClose" :disablePub="true" ref="creatUser"></v-creatUser>
      </el-dialog>
      <div class="send-item">
        <span class="send-item-title">{{ this.$t("contracts.method") }}:</span>
        <el-select v-model="transation.funcType" :placeholder="$t('contracts.methodType')" @change="changeType($event)" style="width: 100px">
          <el-option label="function" :value="'function'"></el-option>
        </el-select>
        <el-select v-model="transation.funcName" :placeholder="$t('contracts.methodName')" filterable v-show="funcList.length > 0" @change="changeFunc" style="width: 300px">
          <el-option :label="item.name" :key="item.funcId" :value="item.funcId" v-for="item in funcList"></el-option>
        </el-select>
      </div>
       <div v-show="form.pramasData.length" class="send-item">
        <el-form class="send-item" v-show="form.pramasData.length" style="line-height: 25px" :rules="rules" :model="form" ref="sendTransation">
          <span class="send-item-title" style="position: relative; top: 5px">{{ this.$t("contracts.params") }}:</span>
          <div v-for="(item, index) in form.pramasData" :key='index'>
            <el-form-item style="position: relative; top: -25px"  :prop="'pramasData.'+index+'.value'"  :rules='rules[item.type]'>
            <span class="send-item-title"></span>
            <template v-if="item.type == 'string'">
              <el-input v-model="item.value" style="width: 400px" :placeholder="item.type">
                <template slot="prepend">
                  <span class="">{{ item.name }}</span>
                </template>
              </el-input>
            </template>
            <template v-else>
              <el-input v-model="item.value" style="width: 400px" :placeholder="placeholderText(item.type)">
                <template slot="prepend">
                  <span class="">{{ item.name }}</span>
                </template>
              </el-input>
            </template>
          </el-form-item>
          </div>
      
          <div style="padding: 5px 0 0 28px; color: 'gray'">
            <i class="el-icon-info" style="padding-right: 4px"></i>{{ this.$t("contracts.paramsInfo") }}
          </div>
        </el-form>
      </div>
    </div>
    <div class="text-right send-btn">
      <el-button @click="close">{{ this.$t("text.cancel") }}</el-button>
      <el-button type="primary" @click="submit('sendTransation')" :disabled="buttonClick">{{ this.$t("text.sure") }}</el-button>
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
  props: ["data", "dialogClose", "abi", "version", "address"],
  data: function () {
    let intEight = (rule, value, callback) => {
      console.log(value);
      if (value >= -128 && value <= 127) {
        callback();
      } else {
        callback(this.$t("text.intEight"));
      }
    };
    let intSixTeen = (rule, value, callback) => {
      console.log(value);
      if (value >= -32768 && value <= 32767) {
        callback();
      } else {
        callback(this.$t("text.intSixTeen"));
      }
    };
    let uintEight = (rule, value, callback) => {
      console.log(value);
      if (value >= 0 && value <= 255) {
        callback();
      } else {
        callback(this.$t("text.uintEight"));
      }
    };
    let uintSixTeen = (rule, value, callback) => {
      console.log(value);
      if (value >= 0 && value <= 65535) {
        callback();
      } else {
        callback(this.$t("text.uintSixTeen"));
      }
    };
    let obj = {};
    for (let i = 0; i < 999; i++) {
      obj[`bytes${i}`] = [
        {
          required: true,
          message: this.$t("text.sendInput"),
          trigger: "blur",
        },
        {
          pattern: `^0[xX][0-9a-fA-F]{${i * 2}}$`,
          message: "必须是十六进制的数字或字母，长度是" + 2 * i,
          trigger: "blur",
        },
      ];
    }
    return {
      transation: {
        userName: "",
        funcName: "",
        funcValue: [],
        funcType: "function",
        reqVal: [],
      },
      userId: "",
      userList: [],
      abiList: [],
      form: { pramasData: [] },
      funcList: [],
      buttonClick: false,
      contractVersion: this.version,
      contractAddress: this.data.contractAddress || "",
      constant: false,
      pramasObj: null,
      stateMutability: "",
      isCNS: false,
      cnsList: [],
      cnsVersion: "",
      cnsName: "",
      isUserNameShow: false,
      ruleForm: {},
      ruleForms: {},
      rules: {
        int: [
          {
            required: true,
            message: this.$t("text.sendInput"),
            trigger: "blur",
          },
          {
            pattern: /^-?[0-9]\d*$/,
            message: "必须是数字，可以是负数",
            trigger: "blur",
          },
        ],
        string: [
          {
            required: true,
            message: this.$t("text.sendInput"),
            trigger: "blur",
          },
        ],
        int256: [
          {
            required: true,
            message: this.$t("text.sendInput"),
            trigger: "blur",
          },
          {
            pattern: /^-?[0-9]\d*$/,
            message: "必须是数字，可以是负数",
            trigger: "blur",
          },
        ],
          uint256: [
          {
            required: true,
            message: this.$t("text.sendInput"),
            trigger: "blur",
          },
          {
            pattern: /^[0-9]\d*$/,
            message: "必须是数字，不可以是负数",
            trigger: "blur",
          },
        ],
        bool: [
          {
            required: true,
            message: this.$t("text.sendInput"),
            trigger: "blur",
          },
        ],
        bytes: [
          {
            required: true,
            message: this.$t("text.sendInput"),
            trigger: "blur",
          },
        ],
        tuple: [
          {
            required: true,
            message: this.$t("text.sendInput"),
            trigger: "blur",
          },
        ],
        uint: [
          {
            required: true,
            message: this.$t("text.sendInput"),
            trigger: "blur",
          },
          {
            pattern: /^[0-9]\d*$/,
            message: "必须是数字，不可以是负数",
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: this.$t("text.sendInput"),
            trigger: "blur",
          },
          {
            pattern: `^0[xX][0-9a-fA-F]{40}$`,
            message: "必须是十六进制的数字或字母,长度是42",
            trigger: "blur",
          },
        ],
        int8: [
          {
            required: true,
            message: this.$t("text.sendInput"),
            trigger: "blur",
          },
          { validator: intEight, trigger: "blur" },
        ],
        int16: [
          {
            required: true,
            message: this.$t("text.sendInput"),
            trigger: "blur",
          },
          { validator: intSixTeen, trigger: "blur" },
        ],
        uint8: [
          {
            required: true,
            message: this.$t("text.sendInput"),
            trigger: "blur",
          },
          { validator: uintEight, trigger: "blur" },
        ],
        uint16: [
          {
            required: true,
            message: this.$t("text.sendInput"),
            trigger: "blur",
          },
          { validator: uintSixTeen, trigger: "blur" },
        ],
        ...obj,
      },
    };
  },
  computed: {
    showUser() {
      let showUser = true;
      if (
        this.constant ||
        this.stateMutability === "view" ||
        this.stateMutability === "pure"
      ) {
        showUser = false;
      }
      return showUser;
    },
  },
  mounted: function () {
    this.getUserData();
    this.formatAbi();
  },
  methods: {
    arrayLimit() {
      console.log(this.form.pramasData);
      this.form.pramasData.map((item, index) => {
        if (item.type.indexOf("[]") != -1) {
          this.rules[item.type] = [
            {
              required: true,
              message: this.$t("text.sendInput"),
              trigger: "blur",
            },
            {
              pattern: `^\\[.*?\\]$`,
              message: "必须是以[开头,以]结尾的数组",
              trigger: "blur",
            },
          ];
        }
      });
    },
    placeholderText(type) {
      if (
        type.length > 5 &&
        type.substring(0, 5) == "bytes" &&
        type.substring(type.length, type.length - 2) != "[]"
      ) {
        return (
          type + "(十六进制，长度是" + type.substring(5, type.length) * 2 + ")"
        );
      }
      switch (type) {
        case "string":
          return "string";
          break;
        case "bytes":
          return "bytes";
          break;
        case "int":
          return "int,整数";
          break;
        case "unit":
          return "unit,大于等于0的整数";
          break;
        default:
          return type;
          break;
      }
    },
    submit: function (formName) {
      //   if (this.isCNS) {
      //     if (!this.cnsName || !this.cnsVersion) {
      //       this.$message({
      //         type: "error",
      //         message: this.$t("text.cnsNameVersion"),
      //       });
      //       return;
      //     } else {
      //       this.send();
      //     }
      //   } else {
      //     this.send();
      //   }
      this.$refs.sendTransation.validate((valid) => {
        if (valid) {
          this.send();
        } else {
          return false;
        }
      });
    },
    close: function (formName) {
      this.$emit("close", false);
    },
    changeType: function (val) {
      this.funcList = [];
      if (val && val === "function") {
        this.abiList.forEach((value, index) => {
          if (value.type === val) {
            value.funcId = index;
            this.funcList.push(value);
          }
        });
      } else if (val && val === "constructor") {
        this.abiList.forEach((value) => {
          if (value.type === val) {
            this.form.pramasData = value.inputs;
            this.pramasObj = value;
            this.arrayLimit();
          }
        });
      } else {
        this.abiList.forEach((value, index) => {
          if (value.type === "function") {
            value.funcId = index;
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
      this.funcList.forEach((value) => {
        if (value.funcId === this.transation.funcName) {
          this.form.pramasData = value.inputs;
          this.constant = value.constant;
          this.pramasObj = value;
          this.stateMutability = value.stateMutability;
          this.arrayLimit();
        }
      });
      this.funcList.sort(function (a, b) {
        return (a.name + "").localeCompare(b.name + "");
      });
    },
    getUserData: function () {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        pageNumber: 1,
        pageSize: 1000,
      };
      let query = {};
      if (localStorage.getItem("root") === "developer") {
        query.account = localStorage.getItem("user");
      }
      getUserList(reqData, query)
        .then((res) => {
          if (res.data.code === 0) {
            if (res.data.data.length == 0) {
              this.$message({
                type: "info",
                message: this.$t("contracts.addPrivateKeyInfo"),
              });
            }
            res.data.data.forEach((value) => {
              if (value.hasPk === 1) {
                this.userList.push(value);
              }
            });
            if (this.userList.length) {
              this.transation.userName = this.userList[0].address;
              this.isUserNameShow = false;
            } else {
              this.isUserNameShow = true;
              this.placeholderText = this.$t("placeholder.selectedNoUser");
            }
            this.changeFunc();
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    send: function () {
      // this.buttonClick = true;
      let pattren = /^\s+|\s+$/g;
      if (this.transation.funcType === "constructor") {
        this.transation.funcName = this.data.contractName;
      }
      let rules = [];
      for (let item in this.form.pramasData) {
        let data = this.form.pramasData[item].value;
        if (data && isJson(data)) {
          try {
             rules.push(JSON.parse(data))
          } catch (error) {
            console.log(error);
          }
        } else if (data === "true" || data === "false") {
             rules.push(eval(data.toLowerCase()))
        }
         else {
          rules.push(data)
        }
      } 
      let functionName = "";
      this.funcList.forEach((value) => {
        if (value.funcId == this.transation.funcName) {
          functionName = value.name;
        }
      });
      let data = {
        groupId: localStorage.getItem("groupId"),
        user:
          this.constant ||
          this.stateMutability === "view" ||
          this.stateMutability === "pure"
            ? ""
            : this.transation.userName,
        contractName: this.data.contractName,
        funcName: functionName || "",
        funcParam: rules,
        contractId: this.data.contractId,
        contractAbi: [this.pramasObj],
        useCns: this.isCNS,
        cnsName: this.isCNS ? this.cnsName : "",
        version: this.isCNS ? this.cnsVersion : "",
      };
      if (this.contractAddress) {
        data.contractAddress = this.contractAddress;
      }
      sendTransation(data)
        .then((res) => {
          this.buttonClick = false;
          if (res.data.code === 0) {
            this.close();
            var resData = res.data.data;
            let successData = {
              resData: resData,
              input: {
                name: functionName,
                inputs: this.form.pramasData,
              },
              data: this.pramasObj,
            };
            if (this.contractAddress && !this.data.contractAddress) {
              successData.contractAddress = this.contractAddress;
            }
            this.$emit(
              "success",
              Object.assign({}, successData, {
                constant: this.constant,
              })
            );
            if (
              this.constant ||
              this.stateMutability === "view" ||
              this.stateMutability === "pure"
            ) {
              this.$message({
                type: "success",
                message: this.$t("text.selectSuccess"),
              });
            } else {
              if (resData.status == "0x0") {
                this.$message({
                  type: "success",
                  message: this.$t("text.transactionSuccess"),
                });
              } else {
                this.$message({
                  type: "success",
                  message: this.$t("text.transactionFail"),
                });
              }
            }
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.buttonClick = false;
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    splitString(val) {
      var str = val;
      return str.substring(0, 8);
    },
    changeCns(val) {
      if (val) {
        this.queryFindCnsInfo();
      }
    },
    queryFindCnsInfo() {
      let param = {
        groupId: localStorage.getItem("groupId"),
        contractAddress: this.data.contractAddress,
      };
      findCnsInfo(param).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data) {
            this.cnsVersion = res.data.data.version;
            this.cnsName = res.data.data.cnsName;
          }
        } else {
          this.$message({
            type: "error",
            message: this.$chooseLang(res.data.code),
          });
        }
      });
    },
    creatUserClose() {
      this.getUserData();
    },
  },
};
</script>

<style scoped>
.send-wrapper {
}
.send-item {
  line-height: 30px;
  margin-bottom: 24px;
}
.send-item-title {
  display: inline-block;
  width: 60px;
  text-align: right;
}
.send-item-params {
  display: inline-block;
}
.send-item >>> .el-input__inner {
  height: 32px;
  line-height: 32px;
}
.send-body {
  overflow-y: scroll;
  max-height: 400px;
  min-height: 200px;
}
.send-btn {
  margin-bottom: 24px;
  margin-top: 24px;
}
.send-btn >>> .el-button {
  padding: 9px 16px;
}
.send-item >>> .el-form-item__error {
  left: 180px !important;
}
.send-item >>> .el-input-group__prepend {
  width: 60px;
}
.send-item >>> .el-form-item {
  line-height: 30px;
  margin-bottom: 24px;
}
</style>
