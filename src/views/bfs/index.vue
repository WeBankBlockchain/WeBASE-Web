<template>
  <div>
    <v-content-head :headTitle="$t('title.contractTitle')" :headSubTitle="$t('title.bfs')" @changGroup="changGroup" :headTooltip="$t('title.CNSTips')"></v-content-head>
    <div class="module-wrapper" style="padding: 20px 29px 0 29px;">
      <span class="cns-title">{{$t('contracts.bfsTitle')}}</span>
      <div class="tip">
        <span>提示:</span>
        <span>{{$t('bfs.Tip1')}}</span>
        <span>{{$t('bfs.Tip2')}}</span>
        <span>{{$t('bfs.Tip3')}}</span>
      </div>
      <el-form :model="bfsForm" :rules="rules" ref="bfsForm" class="demo-ruleForm">
        <el-form-item :label="$t('bfs.pwdRoute')" class="item-form">
          <el-input readonly v-model.trim="bfsForm.pwdRoute" class="select-31" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item :label="$t('bfs.operate')" class="item-form">
          <el-select v-model="bfsForm.operate" style="width: 100PX;" @change="removeValite">
            <el-option :label="item.operate" :value="item.operate" :key="item.operate" v-for='item in operateList'>
              <span>{{item.operate}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('bfs.routeParam')" class="item-form" ref='routeParam' prop="routeParam">
          <el-input v-model="bfsForm.routeParam" @input="routeParamChange" :placeholder="$t('text.input')" style="width: 200px;"></el-input>
          <!-- <div :class="{'errorShow':inputNullTip,'errorNotShow':!inputNullTip}">{{this.$t('rule.routeParam')}}</div> -->
        </el-form-item>
        <el-form-item :label="$t('bfs.userAddress')" class="item-form">
          <el-select v-model="bfsForm.fromAddress" :placeholder="placeholderText" style="width: 200px;">
            <el-option :label="item.address" :value="item.address" :key="item.address" v-for='item in userList'>
              <span class="font-12">{{item.userName}}</span>
              <span>{{item.address | splitString}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="implement" class="modify-btn" :disabled="disabled" :loading="loading1">{{this.$t('text.implement')}}</el-button>
        </el-form-item>
      </el-form>
      <div class="contents">
        <div class="tip">
          <span>提示:</span>
          <span>{{$t('bfs.Tip4')}}</span>
        </div>
        <json-viewer :value="bfsData" :expand-depth='5' class='jsonViewer'></json-viewer>

      </div>
    </div>
  </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import Bus from "@/bus";
import {
  getPwdRoute,
  modfiyPwdRoute,
  queryBfsPath,
  createBfsPath,
  getUserList,
  queryCnsListByName,
} from "@/util/api";
export default {
  name: "ConfigManagement",

  components: {
    "v-content-head": contentHead,
  },

  props: {},

  data() {
    var paramRule = (rule, value, callback) => {
      let val = value.trim().replace(/\s+/g, " ");
      console.log(val);
      let valArr = val.split("/");
      let valArr2 = val.substr(1).split("/");
      if (this.bfsForm.operate != "mkdir" && val == "/") {
        callback();
      }
      if (this.bfsForm.operate == "ls" && val == "") {
        callback();
      }
      if (!/^[0-9a-zA-Z_/.]{0,}$/.test(val)) {
        console.log(1);
        callback(new Error(this.$t("bfs.tip2")));
      } else if (val.substr(0, 2) != "./" && !/^[0-9a-zA-Z_/]{1,}$/.test(val)) {
        console.log(2);
        callback(new Error(this.$t("bfs.tip2")));
      } else if (valArr.includes("") && val.substr(0, 1) != "/") {
        console.log(3);
        callback(new Error(this.$t("bfs.tip2")));
      } else if (
        valArr2.includes("") &&
        val.substr(0, 2) != "./" &&
        valArr2.length > 1
      ) {
        console.log(4);
        callback(new Error(this.$t("bfs.tip2")));
        // } else if (
        //   this.bfsForm.operate == "mkdir" &&
        //   valArr[0] != "apps" &&
        //   valArr[0] != "tables" &&
        //   val.substr(0, 1) != "/"
        // ) {
        //   callback(new Error(this.$t("bfs.tip3")));
        // } else if (
        //   this.bfsForm.operate == "mkdir" &&
        //   valArr2[0] != "apps" &&
        //   valArr2[0] != "tables" &&
        //   val.substr(0, 1) == "/"
        // ) {
        //   callback(new Error(this.$t("bfs.tip3")));
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
        operate: "cd",
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
          // {
          //   required: true,
          //   message: this.$t("rule.routeParam"),
          //   trigger: "blur",
          // },
          {
            // required: true,
            validator: paramRule,
            trigger: "blur",
          },
        ],
      },
      bfsData: [],
      bfsData1: [],
      routeParamCommond: "",
      routeParamValue: "",
      handleValue: "",
      operateList: [{ operate: "cd" }, { operate: "ls" }, { operate: "mkdir" }],
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

    if (localStorage.getItem("groupId")) {
      this.queryPwdPath();
      this.getUserListMethod();
    }
  },

  methods: {
    removeValite() {
      this.$refs["bfsForm"].clearValidate();
    },
    implement() {
      let val = this.bfsForm.routeParam.trim().replace(/\s+/g, " ");
      this.routeParamValue = val;
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
      if (
        this.bfsForm.routeParam.trim() == "" &&
        this.bfsForm.operate == "ls"
      ) {
        this.handleValue = this.bfsForm.pwdRoute;
        this.ls();
      } else {
        this.$refs["bfsForm"].validate((val) => {
          if (val) {
            if (this.bfsForm.operate == "cd") {
              this.cd();
            } else if (this.bfsForm.operate == "ls") {
              this.ls();
            } else if (this.bfsForm.operate == "mkdir") {
              this.mkdir();
            }
          } else {
            //alert("error");
          }
        });
      }
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
            this.bfsData = [];
            res.data.data.forEach((item) => {
              this.bfsData.push({ name: item.fileName, type: item.fileType });
            });

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
            this.bfsData = [];
            res.data.data.forEach((item) => {
              this.bfsData.push({ name: item.fileName, type: item.fileType });
            });

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
            this.bfsData = [];
            res.data.data.forEach((item) => {
              this.bfsData.push({ name: item.fileName, type: item.fileType });
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
    changGroup() {
      this.bfsForm.routeParam = "";
      this.bfsForm.pwdRoute = "/";
      this.queryPwdPath();
      this.getUserListMethod();
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
.contents {
  width: 100%;
  position: relative;
  overflow-y: scroll;
  max-height: 700px;
}
.jsonViewer {
  width: 600px;
}
.tip {
  font-size: 14px;
  margin-bottom: 15px;
  color: #42b983;
}
.tip p {
  padding-left: 35px;
}
</style>
