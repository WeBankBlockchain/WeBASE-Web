<template>
  <div>
    <el-form :model="resetForm" :rules="rules" ref="resetForm" label-width="130px" class="demo-ruleForm">
      <el-form-item :label="$t('govCommittee.fromUser')" prop="fromAddress">
        <el-select v-model="resetForm.fromAddress" :placeholder="$t('text.select')" style="width:300px">
          <el-option v-for="item in produceCommittee" :key="item.governorAddress" :label="item.userName" :value="item.governorAddress">
            <span>{{item.userName}}</span>
            <span>{{item.governorAddress| splitString}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item :label="$t('govCommittee.toCommittee')" prop="governorAddress">
              <el-select v-model="resetForm.governorAddress" :placeholder="$t('text.select')" @change="changeAddress">
                <el-option v-for="item in produceCommittee" :key="item.address" :label="item.userName" :value="item.address">
                  <span>{{item.governorAddress}}</span>
                  <span class="font-12">{{item.governorAddress}}...</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('govCommittee.weight')" prop="weight">
              <el-input v-model="resetForm.weight" @input="e => (resetForm.weight = isnumber(e))" class="form-item-input"></el-input>
            </el-form-item> -->
      <el-form-item :label="$t('contracts.contractAddress')" prop="contractAddress">
        <el-input v-model="resetForm.contractAddress" style="width:300px" class="form-item-input" :placeholder="$t('rule.contractAddress')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('contracts.userAddress')" prop="userAddress">
        <!-- <el-select v-model="resetForm.userAddress" :placeholder="$t('text.select')">
          <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
            <span>{{item.userName}}</span>
            <span class="font-12">{{item.address}}...</span>
          </el-option>
        </el-select> -->
        <el-autocomplete v-model.trim="resetForm.userAddress" :fetch-suggestions="querySearch" @select="selectAddress" style="width: 300px;" clearable>
          <template slot-scope="{ item }">
            <div class="name"> {{item.userName}} / {{ item.address | splitString}}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
    </el-form>
    <p style="padding-left: 50px">{{$t('govCommittee.resetTips')}}</p>
    <div class="text-right sure-btn" style="margin-top:10px">
      <el-button @click="closeReset">{{this.$t('text.cancel')}}</el-button>
      <el-button type="primary" @click="sureReset" :loading="btnLoading">{{this.$t('text.sure')}}</el-button>
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
} from "@/util/api";
import { isJson } from "@/util/util";
import web3 from "@/util/ethAbi";
export default {
  name: "resetDialog",

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
      resetForm: {
        contractAbi: null,
        contractAddress: "",
        contractName: "",
        fromAddress: "",
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
        userAddress: [
          {
            required: true,
            message: this.$t("rule.userAddress"),
            trigger: "change",
          },
        ],
        fromAddress: [
          {
            required: true,
            message: this.$t("rule.fromAddress"),
            trigger: "change",
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
      let committeeLists=[]
      privateKeyList.forEach((item) => {
        committeeList.forEach((it) => {
          if (item.address == it.governorAddress) {
            it.userName = item.userName;
            flagFind = true;
            committeeLists.push(it)
          }
        });
      });
      // if committee not empty
      if (!committeeList.length) {
        if (flagFind) {
          // 如果本地有committee私钥，则设置
          this.resetForm.fromAddress = committeeList[0]["address"];
        } else {
          // 如果本地没有committee私钥，则不选默认值
        }
      }
      return committeeLists;
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
    // this.$nextTick(()=>{
    // this.resetForm.fromAddress=this.produceCommittee[0]['governorAddress']

    // })
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
      this.resetForm.userAddress = item.address;
    },
    querySearch(queryString, cb) {
      var adminRivateKeyList = this.adminRivateKeyList;
      var results = queryString
        ? adminRivateKeyList.filter(this.createFilter(queryString))
        : adminRivateKeyList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    sureReset() {
      this.$refs["resetForm"].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let reqData = {
            groupId: localStorage.getItem("groupId"),
            fromAddress: this.resetForm.fromAddress,
            contractAddr: this.resetForm.contractAddress,
            newAdmin: this.resetForm.userAddress,
            signUserId: "",
          };
          resetAdmin(reqData)
            .then((res) => {
              this.btnLoading = false;
              if (res.data.code === 0) {
                this.$message({
                  type: "success",
                  message: this.$t("govCommittee.resetSuccess"),
                });
                this.$emit("resetSuccess");
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
    closeReset() {
      this.$emit("closeReset");
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
               if (value.hasPk === 1) {
              this.adminRivateKeyList.push(value);
               }
            });
            if (this.adminRivateKeyList.length === 0) {
              this.isShowPrivate = true;
            } else {
              this.isShowPrivate = false;
              // this.resetForm.fromAddress = this.adminRivateKeyList[0]['address'];
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
            this.resetForm.threshold = data[0]["winRate"];
            this.resetForm.participatesRate = data[0]["participatesRate"];
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
