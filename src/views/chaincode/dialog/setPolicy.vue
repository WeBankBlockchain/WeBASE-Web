<template>
  <div>
    <el-form :model="policyData" :rules="rules" ref="policyData" label-width="130px" class="demo-ruleForm">
      <el-form-item :label="$t('contracts.contractAdmin')" prop="contractAdmin">
        <el-input v-model="policyData.contractAdmin" style="width:300px" class="form-item-input"></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('govCommittee.toCommittee')" prop="governorAddress">
              <el-select v-model="governForm.governorAddress" :placeholder="$t('text.select')" @change="changeAddress">
                <el-option v-for="item in produceCommittee" :key="item.address" :label="item.userName" :value="item.address">
                  <span>{{item.governorAddress}}</span>
                  <span class="font-12">{{item.governorAddress}}...</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('govCommittee.weight')" prop="weight">
              <el-input v-model="governForm.weight" @input="e => (governForm.weight = isnumber(e))" class="form-item-input"></el-input>
            </el-form-item> -->
      <!-- <el-form-item :label="$t('contracts.contractAddress')" prop="weight">
              <el-input v-model="governForm.contractAddress" style="width:300px"  class="form-item-input"></el-input>
            </el-form-item>  -->
      <!-- <el-form-item :label="$t('contracts.userAddress')" prop="weight">
              <el-input v-model="governForm.userAddress"  style="width:300px"  class="form-item-input"></el-input>
            </el-form-item>  -->

      <el-form-item :label="$t('table.contractAddress')" prop="contractAddress">
        <el-input v-model="policyData.contractAddress" style="width:300px" class="form-item-input"></el-input>
      </el-form-item>
      <el-form-item :label="$t('table.eventName')" prop="eventName" class="event-option">
        <el-select v-model="policyData.eventName" :placeholder="$t('placeholder.selected')" style="width:300px;" class="event-name">
          <el-option v-for="item in eventNameList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item :label="$t('contracts.userAddress')" prop="userAddress">
        <el-autocomplete v-model.trim="policyData.userAddress" :fetch-suggestions="querySearch" @select="selectAddress" style="width: 300px;" clearable>
          <template slot-scope="{ item }">
            <div class="name"> {{item.userName}} / {{ item.address | splitString}}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item :label="$t('contracts.set')" prop="set">
        <el-radio v-model="policyData.authType" :label=1>{{this.$t('contracts.WhiteList')}}</el-radio>
        <el-radio v-model="policyData.authType" :label=2>{{this.$t('contracts.blackList')}}</el-radio>
      </el-form-item>
    </el-form>
    <!-- <p style="padding-left: 50px">{{$t('govCommittee.dialogTips')}}</p> -->
    <div class="text-right sure-btn" style="margin-top:10px">
      <el-button @click="closeSetPolicy">{{this.$t('text.cancel')}}</el-button>
      <el-button type="primary" @click="sureSetPolicy" :loading="btnLoading">{{this.$t('text.sure')}}</el-button>
    </div>
  </div>

</template>

<script>
import {
  queryAdmin,
  addFunctionAbi,
  committeeList,
  getUserList,
  setPolicy,
  checkDeploy,
} from "@/util/api";
import { isJson } from "@/util/util";
import web3 from "@/util/ethAbi";
export default {
  name: "checkDeploy",

  components: {},

  props: ["setPolicyItem"],

  data() {
    return {
      abiContent: "",
      policyData: {
        contractAbi: this.setPolicyItem.contractAbi,
        contractAddress: this.setPolicyItem.contractAddress,
        contractName: "",
        fromAddress: "",
        authType: 1,
        blackList: 1,
        eventName: "",
        userAddress: "",
        contractAdmin: "",
      },
      contractAdmin: "",
      loading: false,
      adminRivateKeyList: [],
      chainRivateKeyList: [],
      chainCommitteeList: [],
      btnLoading: false,
    };
  },

  computed: {
    rules() {
      let _this = this;
      let validateJSON = (rule, value, callback) => {
        if (value === "") {
          callback(new Error(_this.$t("rule.contractAbi")));
        } else {
          if (!isJson(value)) {
            callback(new Error(_this.$t("rule.correctJson")));
          } else {
            callback();
          }
        }
      };
      let data = {
        contractAbi: [
          {
            required: true,
            message: this.$t("rule.contractAbi"),
            trigger: "blur",
          },
          {
            validator: validateJSON,
            trigger: "blur",
          },
        ],
        contractAdmin: [
          {
            required: true,
            message: this.$t("rule.contractAdmin"),
            trigger: "blur",
          },
        ],
        eventName: [
          {
            required: true,
            message: this.$t("rule.eventName"),
            trigger: "blur",
          },
        ],
        contractAddress: [
          {
            required: true,
            message: this.$t("rule.contractAddress"),
            trigger: "blur",
          },
        ],
        userAddress: [
          {
            required: true,
            message: this.$t("rule.userAddress"),
            trigger: "change",
          },
        ],
        contractName: [
          {
            required: true,
            message: this.$t("rule.contractName"),
            trigger: "blur",
          },
          {
            required: true,
            min: 1,
            max: 100,
            message: this.$t("rule.textLong1_100"),
            trigger: "blur",
          },
        ],
      };
      return data;
    },
    produceCommittee() {
      let privateKeyList = this.adminRivateKeyList;
      let committeeList = this.chainCommitteeList;
      // whether find committee in local private key list
      let flagFind = false;
      privateKeyList.forEach((item) => {
        committeeList.forEach((it) => {
          if (item.address == it.address) {
            it.userName = item.userName;
            flagFind = true;
          }
        });
      });
      // if committee not empty
      if (!committeeList.length) {
        if (flagFind) {
          // 如果本地有committee私钥，则设置
          this.governForm.fromAddress = committeeList[0]["address"];
        } else {
          // 如果本地没有committee私钥，则不选默认值
        }
      }
      return committeeList;
    },
    eventNameList() {
      var options = [];

      if (!this.policyData.contractAbi) {
        this.policyData.eventName = "";
        this.inputList = [];
        return;
      }
      try {
        var abiList = JSON.parse(this.policyData.contractAbi);
        abiList.forEach((item) => {
          if (item.type == "function") {
            var param = [],
              label = [];
            item.inputs.forEach((it) => {
              param.push(`${it.type}`);
              label.push(this.labelParam(it).replace(/(^\s*)|(\s*$)/g, ""));
            });
            options.push({
              label: `${item.name}(${label.join(",")})`,
              value: `${item.name}(${param.join(",")})`,
            });
          }
        });
      } catch (error) {}
      return options;
    },
  },

  watch: {},

  created() {},

  mounted() {
    if (this.address) {
      this.abiForm.contractAddress = this.address;
    }
    this.queryAdminMethod();
    this.policyData.eventName = this.eventNameList[0]["value"];
    this.getUserData();
  },

  methods: {
    createFilter(queryString) {
      return (adminRivateKeyList) => {
        return (
          adminRivateKeyList.address
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    selectAddress(item) {
      console.log(item);
      this.policyData.userAddress = item.address;
    },
    querySearch(queryString, cb) {
      var adminRivateKeyList = this.adminRivateKeyList;
      var results = queryString
        ? adminRivateKeyList.filter(this.createFilter(queryString))
        : adminRivateKeyList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    labelParam(it) {
      if (it.indexed) {
        return `${it.type} indexed ${it.name} `;
      } else {
        return `${it.type} ${it.name} `;
      }
    },
    queryAdminMethod() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        contractAddr: this.policyData.contractAddress,
      };
      queryAdmin(reqData)
        .then((res) => {
          this.btnLoading = false;
          if (res.data.code == 0) {
            this.policyData.contractAdmin = res.data.data;
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.btnLoading = false;
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    sureSetPolicy() {
      this.$refs["policyData"].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let reqData = {
            groupId: localStorage.getItem("groupId"),
            authType: this.policyData.authType,
            contractAddr: this.policyData.contractAddress,
            fromAddress: this.policyData.contractAdmin,
            func: this.policyData.eventName,
            signUserId: "",
            userAddress: this.policyData.userAddress,
          };
          setPolicy(reqData)
            .then((res) => {
              this.btnLoading = false;
              if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: this.$t("contracts.setSucess"),
                });
                this.$emit("setPolicySuccess");
              } else {
                this.$message({
                  message: this.$chooseLang(res.data.code),
                  type: "error",
                  duration: 2000,
                });
              }
            })
            .catch((err) => {
              this.btnLoading = false;
              this.$message({
                message: err.data || this.$t("text.systemError"),
                type: "error",
                duration: 2000,
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closeSetPolicy() {
      //this.initGovernForm();
      // this.modifyWeightVisible = false;
      this.$emit("closeSetPolicy");
    },
    getUserData() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        pageNumber: 1,
        pageSize: 1000,
      };
      getUserList(reqData, {})
        .then((res) => {
          if (res.data.code === 0) {
            this.adminRivateKeyList = [];
            res.data.data.forEach((value) => {
              // if (value.hasPk === 1) {
              this.adminRivateKeyList.push(value);
              // }
            });
            if (this.adminRivateKeyList.length === 0) {
              this.isShowPrivate = true;
            } else {
              this.isShowPrivate = false;
              // this.governForm.fromAddress = this.adminRivateKeyList[0]['address'];
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
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    queryCommitteeList() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        // pageNumber: this.currentPage,
        // pageSize: this.pageSize
      };
      committeeList(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            let data = res.data.data;
            this.chainCommitteeList = data[0]["governorList"];
            this.governForm.threshold = data[0]["winRate"];
            this.governForm.participatesRate = data[0]["participatesRate"];
            this.chainRivateKeyList = [];
            // data.forEach(item=>{
            //     this.chainRivateKeyList.push({

            //     })
            // })
            this.total = res.data.totalCount;
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

    submit(abiForm) {
      this.$refs[abiForm].validate((valid) => {
        if (valid) {
          this.queryImportAbi();
        } else {
          return false;
        }
      });
    },
    queryImportAbi() {
      this.loading = true;
      let data = {
        contractName: this.abiForm.contractName,
        contractAddress: this.abiForm.contractAddress,
        contractAbi: JSON.parse(this.abiForm.contractAbi),
        groupId: localStorage.getItem("groupId"),
        account: localStorage.getItem("user"),
      };
      importAbi(data)
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.setMethod();
            this.$emit("importSuccess");
            this.$message({
              type: "success",
              message: this.$t("system.importSuccess"),
            });
          } else {
            this.$message({
              type: "error",
              message: this.$chooseLang(res.data.code),
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            type: "error",
            message: err.data || this.$t("text.systemError"),
          });
        });
    },
    setMethod() {
      let Web3EthAbi = web3;
      let arry = [];
      if (this.abiForm.contractAbi) {
        let list = JSON.parse(this.abiForm.contractAbi);
        list.forEach((value) => {
          if (value.name && value.type == "function") {
            let data = {};
            let methodId;
            if (localStorage.getItem("encryptionId") == 1) {
              methodId = Web3EthAbi.smEncodeFunctionSignature({
                name: value.name,
                type: value.type,
                inputs: value.inputs,
              });
            } else {
              methodId = Web3EthAbi.encodeFunctionSignature({
                name: value.name,
                type: value.type,
                inputs: value.inputs,
              });
            }
            data.methodId = methodId;
            data.abiInfo = JSON.stringify(value);
            data.methodType = value.type;
            arry.push(data);
          } else if (value.name && value.type == "event") {
            let data = {};
            let methodId;
            if (localStorage.getItem("encryptionId") == 1) {
              methodId = Web3EthAbi.smEncodeEventSignature({
                name: value.name,
                type: value.type,
                inputs: value.inputs,
              });
            } else {
              methodId = Web3EthAbi.encodeEventSignature({
                name: value.name,
                type: value.type,
                inputs: value.inputs,
              });
            }
            data.methodId = methodId;
            data.abiInfo = JSON.stringify(value);
            data.methodType = value.type;
            arry.push(data);
          }
        });
        if (arry.length) {
          this.addAbiMethod(arry);
        }
      }
    },
    addAbiMethod(list) {
      let data = {
        groupId: localStorage.getItem("groupId"),
        methodList: list,
      };
      addFunctionAbi(data)
        .then((res) => {
          if (res.data.code === 0) {
            console.log("method 保存成功！");
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
    close() {
      this.$emit("closeImport");
    },
  },
};
</script>

<style scoped>
</style>
