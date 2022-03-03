<template>
  <div>
    <el-form :model="checkDeployForm" :rules="rules" ref="checkDeployForm" label-width="130px" class="demo-ruleForm">
      <!-- <el-form-item :label="$t('govCommittee.fromUser')" prop="governorAddress">
              <el-select v-model="checkDeployForm.governorAddress" :placeholder="$t('text.select')">
                <el-option v-for="item in produceCommittee" :key="item.governorAddress" :label="item.userName" :value="item.governorAddress">
                  <span>{{item.governorAddress}}</span>
                  <span class="font-12">{{item.governorAddress}}...</span>
                </el-option>
              </el-select>
            </el-form-item> -->
      <!-- <el-form-item :label="$t('govCommittee.toCommittee')" prop="governorAddress">
              <el-select v-model="checkDeployForm.governorAddress" :placeholder="$t('text.select')" @change="changeAddress">
                <el-option v-for="item in produceCommittee" :key="item.address" :label="item.userName" :value="item.address">
                  <span>{{item.governorAddress}}</span>
                  <span class="font-12">{{item.governorAddress}}...</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('govCommittee.weight')" prop="weight">
              <el-input v-model="checkDeployForm.weight" @input="e => (checkDeployForm.weight = isnumber(e))" class="form-item-input"></el-input>
            </el-form-item> -->
      <el-form-item :label="$t('contracts.contractAddress')" prop="weight">
        <el-input v-model="checkDeployForm.contractAddress" style="width:214px" class="form-item-input"></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('contracts.userAddress')" prop="weight">
              <el-input v-model="checkDeployForm.userAddress"  style="width:214px"  class="form-item-input"></el-input>
            </el-form-item>  -->
    </el-form>
    <!-- <p style="padding-left: 50px">{{$t('govCommittee.dialogTips')}}</p> -->
    <div class="text-right sure-btn" style="margin-top:10px">
      <el-button @click="closeCheckDeploy">{{this.$t('text.cancel')}}</el-button>
      <el-button type="primary" @click="suerCheckDeploy" :loading="btnLoading">{{this.$t('text.sure')}}</el-button>
    </div>
  </div>

</template>

<script>
import {
  importAbi,
  addFunctionAbi,
  committeeList,
  getUserList,
  resetAdmin,
  checkDeploy,
} from "@/util/api";
import { isJson } from "@/util/util";
import web3 from "@/util/ethAbi";
export default {
  name: "checkDeploy",

  components: {},

  props: {
    address: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      abiContent: "",
      checkDeployForm: {
        contractAbi: null,
        contractAddress: "",
        contractName: "",
      },
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
        contractAddress: [
          {
            required: true,
            message: this.$t("rule.contractAddress"),
            trigger: "blur",
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
          this.checkDeployForm.fromAddress = committeeList[0]["address"];
        } else {
          // 如果本地没有committee私钥，则不选默认值
        }
      }
      return committeeList;
    },
  },

  watch: {},

  created() {},

  mounted() {
    if (this.address) {
      this.abiForm.contractAddress = this.address;
    }
    this.getUserData();
    this.queryCommitteeList();
  },

  methods: {
    suerCheckDeploy() {
      this.$refs["checkDeployForm"].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let reqData = {
            groupId: localStorage.getItem("groupId"),
            userAddress: this.checkDeployForm.contractAddress,
          };
          checkDeploy(reqData)
            .then((res) => {
              this.btnLoading = false;
              if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: res.data.data
                    ? this.$t("govCommittee.haveAdmin")
                    : this.$t("govCommittee.noAdmin"),
                });
                this.$emit("checkSuccess");
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
    closeCheckDeploy() {
      //this.initGovernForm();
      // this.modifyWeightVisible = false;
      this.$emit("closeCheck");
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
              // this.checkDeployForm.fromAddress = this.adminRivateKeyList[0]['address'];
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
            this.checkDeployForm.threshold = data[0]["winRate"];
            this.checkDeployForm.participatesRate = data[0]["participatesRate"];
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
