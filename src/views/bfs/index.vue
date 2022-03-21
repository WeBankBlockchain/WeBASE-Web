<template>
  <div>
    <v-content-head :headTitle="$t('title.contractTitle')" :headSubTitle="$t('title.bfs')" @changGroup="changGroup" :headTooltip="$t('title.CNSTips')"></v-content-head>
    <div class="module-wrapper" style="padding: 20px 29px 0 29px;">
      <span class="cns-title">{{$t('contracts.bfsTitle')}}</span>
      <el-form :model="bfsForm" :rules="rules" ref="bfsForm" class="demo-ruleForm">
        <el-form-item :label="$t('bfs.pwdRoute')" class="item-form">
          <el-input readonly v-model.trim="bfsForm.pwdRoute" class="select-31" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item :label="$t('bfs.routeParam')" class="item-form" ref='routeParam' prop="routeParam">
          <el-input v-model="bfsForm.routeParam" @input="routeParamChange" :placeholder="$t('text.input')" style="width: 200px;"></el-input>
          <!-- <div :class="{'errorShow':inputNullTip,'errorNotShow':!inputNullTip}">{{this.$t('rule.routeParam')}}</div> -->
        </el-form-item>
        <el-form-item :label="$t('bfs.userAddress')" class="item-form">
          <el-select v-model="bfsForm.fromAddress" :placeholder="placeholderText" style="width: 200px;">
            <el-option :label="item.address" :value="item.address" :key="item.address" v-for='item in userList'>
              <span class="font-12">{{item.userName}}</span>
              <span>{{item.address}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="implement" class="modify-btn" :disabled="disabled" :loading="loading1">{{this.$t('text.implement')}}</el-button>
          <!-- <el-button size="small" type="primary" @click="ls" class="modify-btn" :disabled="disabled" :loading="loading1">{{this.$t('bfs.ls')}}</el-button> -->
          <!-- <el-button size="small" type="primary" @click="mkdir" class="modify-btn" :disabled="disabled" :loading="loading1">{{this.$t('bfs.mkdir')}}</el-button> -->
        </el-form-item>
      </el-form>
      <json-viewer :value="bfsData" :expand-depth='5' copyable></json-viewer>
      <!-- <el-table :data="bfsList" tooltip-effect="dark" v-loading="loading" class="search-table-content">
                <el-table-column v-for="head in bfsHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center" :width="head.width">
                    <template slot-scope="scope">
                        <span>{{scope.row[head.enName]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination> -->
    </div>
    <!-- 本地cns注释 -->
    <!-- <div class="module-wrapper" style="padding: 20px 29px 0 29px;">
            <span class="cns-title">{{$t('contracts.localCnsTitle')}}</span>
            <el-table :data="localCnsList" tooltip-effect="dark" v-loading="loadingLocal" class="search-table-content">
                <el-table-column v-for="head in localCnsHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center" :width="head.width">
                    <template slot-scope="scope">
                        <span>{{scope.row[head.enName]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="page" @size-change="localSizeChange" @current-change="localCurrentChange" :current-page="currentPageLocal" :page-sizes="[10, 20, 30, 50]" :page-size="pageSizeLocal" layout="total, sizes, prev, pager, next, jumper" :total="totalLocal">
            </el-pagination>
        </div> -->
  </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import {
  getPwdRoute,
  modfiyPwdRoute,
  queryBfsPath,
  createBfsPath,
  getUserList,
} from "@/util/api";
export default {
  name: "ConfigManagement",

  components: {
    "v-content-head": contentHead,
  },

  props: {},

  data() {
    var paramRule = (rule, value, callback) => {
      let valArray = value.trim().replace(/\s+/g, " ").split(" ");
      console.log(valArray[0]);
      let valArr = [];
      if (valArray.length > 1) {
        valArr = valArray[1].split("/");
      }
      if (
        valArray[0] != "cd" &&
        valArray[0] != "ls" &&
        valArray[0] != "mkdir"
      ) {
        callback(new Error(this.$t("bfs.tip1")));
      } else if (valArray.length < 2 || valArray.length != 2) {
        callback(new Error(this.$t("bfs.tip2")));
      } else if (!/^[0-9a-zA-Z_/.]{0,}$/.test(valArray[1])) {
        //console.log(1)
        callback(new Error(this.$t("bfs.tip2")));
      } else if (
        valArray[1].substr(0, 2) != "./" &&
        !/^[0-9a-zA-Z_/]{1,}$/.test(valArray[1])
      ) {
        //console.log(2)
        callback(new Error(this.$t("bfs.tip2")));
      } else if (valArr.includes("") && valArr[0] != "") {
        callback(new Error(this.$t("bfs.tip2")));
      } else if (
        valArray[0] == "mkdir" &&
        valArray[1].substr(0, 4) != "apps" &&
        valArray[1].substr(0, 6) != "tables"
      ) {
        callback(new Error(this.$t("bfs.tip3")));
      } else {
        callback();
      }
    };
    return {
      disabled: false,
      loading: false,
      loading1: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      bfsForm: {
        pwdRoute: "/",
        routeParam: "",
        fromAddress: "",
      },
      bfsList: [],
      loadingLocal: false,
      currentPageLocal: 1,
      pageSizeLocal: 10,
      totalLocal: 0,
      localCnsList: [],
      userList: [],
      placeholderText: "",
      inputNullTip: false,
      rules: {
        contractName: [
          {
            required: true,
            message: this.$t("rule.contractName"),
            trigger: "blur",
          },
        ],
        routeParam: [
          {
            required: true,
            message: this.$t("rule.routeParam"),
            trigger: "blur",
          },
          {
            required: true,
            validator: paramRule,
            trigger: "blur",
          },
        ],
      },
      bfsData: "",
      routeParamCommond: "",
      routeParamValue: "",
      handleValue: "",
    };
  },

  computed: {
    bfsHead() {
      let data = [
        {
          enName: "name",
          name: this.$t("bfs.routeName"),
          width: "",
        },
        // {
        //     enName: "version",
        //     name: this.$t('contracts.contractVersion'),
        //     width: ''
        // },
        // {
        //     enName: "address",
        //     name: this.$t('contracts.contractAddress'),
        //     width: ''
        // },
        // {
        //     enName: "abi",
        //     name: this.$t('contracts.contractAbi'),
        //     width: ''
        // },
      ];
      return data;
    },
    localCnsHead() {
      let data = [
        {
          enName: "cnsName",
          name: this.$t("contracts.contractName"),
          width: "120",
        },
        {
          enName: "version",
          name: this.$t("contracts.contractVersion"),
          width: "",
        },
        {
          enName: "contractAddress",
          name: this.$t("contracts.contractAddress"),
          width: "",
        },
        {
          enName: "contractAbi",
          name: this.$t("contracts.contractAbi"),
          width: "",
        },
      ];
      return data;
    },
  },

  mounted() {
    if (
      localStorage.getItem("root") === "admin" ||
      localStorage.getItem("root") === "developer" ||
      localStorage.getItem("groupId")
    ) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
    // 本地cns查询注释
    // if (localStorage.getItem("groupId") && (localStorage.getItem("configData") == 3 || localStorage.getItem("deployType") == 0)) {
    //     this.queryLocalCns();
    // }

    this.queryPwdPath();
    this.getUserListMethod();
  },

  methods: {
    implement() {
      let valArray = this.bfsForm.routeParam
        .trim()
        .replace(/\s+/g, " ")
        .split(" ");
      let commond = valArray[0];
      this.routeParamCommond = commond;
      this.routeParamValue = valArray[1];
      if (this.bfsForm.pwdRoute != "/") {
        if (this.routeParamValue.substr(0, 2) == "./") {
          this.handleValue =
            this.bfsForm.pwdRoute + "/" + this.routeParamValue.substr(2);
        } else if (this.routeParamValue.substr(0, 1) == "/") {
          this.handleValue = this.routeParamValue;
        } else {
          this.handleValue = this.bfsForm.pwdRoute + "/" + this.routeParamValue;
        }
      } else {
        if (this.routeParamValue.substr(0, 2) == "./") {
          this.handleValue =
            this.bfsForm.pwdRoute + this.routeParamValue.substr(2);
        } else if (this.routeParamValue.substr(0, 1) == "/") {
          this.handleValue = this.routeParamValue;
        } else {
          this.handleValue = this.bfsForm.pwdRoute + this.routeParamValue;
        }
      }
      this.$refs["bfsForm"].validate((val) => {
        if (val) {
          if (commond == "cd") {
            this.cd();
          } else if (commond == "ls") {
            this.ls();
          } else if (commond == "mkdir") {
            this.mkdir();
          }
        } else {
          //alert("error");
        }
      });
    },
    routeParamChange() {
      if (this.bfsForm.routeParam == "") {
        this.inputNullTip = true;
        return false;
      } else {
        this.inputNullTip = false;
      }
    },
    getUserListMethod() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        pageNumber: 1,
        pageSize: 1000,
      };
      let query = {};
      if (localStorage.getItem("root") === "developer") {
        query.account = localStorage.getItem("user");
      }
      getUserList(reqData, query).then((res) => {
        if (res.data.code === 0) {
          res.data.data.forEach((value) => {
            if (value.hasPk === 1) {
              this.userList.push(value);
            }
          });
          if (this.userList.length) {
            this.bfsForm.fromAddress = this.userList[0].address;
            //this.isUserNameShow = false;
          } else {
            //this.isUserNameShow = true;
            this.placeholderText = this.$t("placeholder.selectedNoUser");
          }
        } else {
          this.$message({
            message: this.$chooseLang(res.data.code),
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    mkdir() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        path: this.handleValue,
        fromAddress: this.bfsForm.fromAddress,
        signUserId: "",
      };
      createBfsPath(reqData)
        .then((res) => {
          //this.loadingLocal = false;
          if (res.data.code === 0) {
            this.$message({
              message: this.$t("bfs.creatSuccess"),
              type: "success",
              duration: 2000,
            });
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          //this.loadingLocal = false;
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    ls() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        path: this.handleValue,
      };
      queryBfsPath(reqData)
        .then((res) => {
          //this.loadingLocal = false;
          if (res.data.code === 0) {
            this.bfsData = res.data.data;
            this.$message({
              type: "success",
              message: this.$t("bfs.lsSucess"),
            });
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          //this.loadingLocal = false;
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    cd() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        path: this.handleValue,
      };
      queryBfsPath(reqData)
        .then((res) => {
          //this.loadingLocal = false;
          if (res.data.code === 0) {
            this.bfsData = res.data.data;
            this.bfsForm.pwdRoute = this.handleValue;
            this.$message({
              type: "success",
              message: this.$t("bfs.cdSucess"),
            });
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          //this.loadingLocal = false;
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    queryPwdPath() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        path: "/",
      };
      queryBfsPath(reqData)
        .then((res) => {
          //this.loadingLocal = false;
          if (res.data.code === 0) {
            this.bfsData = res.data.data;
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          //this.loadingLocal = false;
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    changGroup() {
      this.getCnsList();
      //this.queryLocalCns()
    },
    searchCns(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading1 = true;
          this.getCnsList("handleSearch");
        } else {
          return false;
        }
      });
    },
    getCnsList(handleType) {
      this.loading = true;
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        // pageNumber: this.currentPage,
        // pageSize: this.pageSize,
      };
      if (this.bfsForm.contractVersion) {
        reqData.contractNameAndVersion = `${this.bfsForm.contractVersion}`;
        reqData.contractName = `${this.bfsForm.contractName}`;
        queryCnsListByNameVersion(reqData)
          .then((res) => {
            this.loading = false;
            this.loading1 = false;
            if (res.data.code === 0) {
              this.bfsList = res.data.data;
              this.total = res.data.totalCount;
              if (handleType == "handleSearch") {
                this.$message({
                  type: "success",
                  message: this.$t("text.selectSuccess"),
                });
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
            this.loading = false;
            this.loading1 = false;
            this.$message({
              message: err.data || this.$t("text.systemError"),
              type: "error",
              duration: 2000,
            });
          });
      } else {
        reqData.contractName = `${this.bfsForm.contractName}`;
        queryCnsListByName(reqData)
          .then((res) => {
            this.loading = false;
            this.loading1 = false;
            if (res.data.code === 0) {
              this.bfsList = res.data.data;
              this.total = res.data.totalCount;
              if (handleType == "handleSearch") {
                this.$message({
                  type: "success",
                  message: this.$t("text.selectSuccess"),
                });
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
            this.loading = false;
            this.loading1 = false;
            this.$message({
              message: err.data || this.$t("text.systemError"),
              type: "error",
              duration: 2000,
            });
          });
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getCnsList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCnsList();
    },
    queryLocalCns() {
      this.loadingLocal = true;
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        contractName: "",
      };
      findCnsInfoList(reqData)
        .then((res) => {
          this.loadingLocal = false;
          if (res.data.code === 0) {
            this.localCnsList = res.data.data;
            this.totalLocal = res.data.totalCount;
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.loadingLocal = false;
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    localSizeChange(val) {
      this.pageSizeLocal = val;
      this.currentPageLocal = 1;
      this.queryLocalCns();
    },
    localCurrentChange(val) {
      this.currentPageLocal = val;
      this.queryLocalCns();
    },
  },
};
</script>

<style scoped>
.demo-ruleForm {
  display: flex;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: -moz-flex;
}
.item-form {
  display: flex;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: -moz-flex;
  margin-left: 10px;
}
.item-form:first-child {
  margin-left: 0px;
}
.modify-btn {
  margin-left: 10px;
}
.instructions {
  margin-bottom: 16px;
  padding: 10px 10px;
  color: #2e384d;
  border-radius: 10px;
  display: inline-block;
}
.search-table-content >>> th {
  background: #fafafa;
}
.cns-title {
  display: inline-block;
  margin-bottom: 20px;
  font-weight: bold;
}
.select-31 >>> .el-input__inner {
  border: 0;
}
.errorShow {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
.errorNotShow {
  display: none;
}
.errorBoder >>> .el-input__inner {
  border: 1px solid #f56c6c;
}
</style>
