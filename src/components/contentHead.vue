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
  <div v-if='!isMicroApp' class="content-head-wrapper">
    <div class="content-head-title">
      <span class="content-head-icon" v-if="icon" @click="skip">
        <i class="wbs-icon-back"></i>
      </span>
      <span :class="{ 'font-color-9da2ab': headSubTitle}">{{title}}</span>
      <span v-show="headSubTitle" class="font-color-9da2ab">/</span>
      <span>{{headSubTitle}}</span>
      <el-tooltip effect="dark" placement="bottom-start" v-if="headTooltip" offset='0'>
        <div slot="content">{{headTooltip}}</div>
        <i class="el-icon-info contract-icon font-15"></i>
      </el-tooltip>
      <a v-if="headHref" target="_blank" :href="headHref.href" class="font-color-fff font-12">{{headHref.content}}</a>
    </div>
    <div class="content-head-network">
      <!-- <span class="content-head-version" v-if='$store.state.version'>链版本: </span>
            <span class="content-head-version content-head-version-data">{{$store.state.version}}</span>
            <span class="content-head-version" v-if='$store.state.mgrVersion'>WeBASE版本: </span>
            <span class="content-head-version content-head-version-data">{{$store.state.mgrVersion}}</span> -->
      <!-- <a style="display:none"  class="content-head-network-link"><router-link to="bigScreen" style="color:white;text-decoration: none;">{{this.$t("head.dataBigScreen")}}</router-link></a> -->
      <a class="content-head-network-link"><router-link to="bigScreen" style="color:white;text-decoration: none;">{{this.$t("head.dataBigScreen")}}</router-link></a>
      <a v-if="$store.state.version>=2.5" class="content-head-network-link" target="_blank"
        href="https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/design/security_control/chain_governance.html">{{this.$t("head.helpText")}}</a>
      <a v-else class="content-head-network-link" target="_blank" href="https://webasedoc.readthedocs.io/zh_CN/lab/">{{this.$t("head.helpText")}}</a>
      <!-- <el-button type='text' size='small' @click='deleteConfig'>删除</el-button> -->
      <span v-if="abnormalList.length>0">
        <el-tooltip class="item" effect="dark" placement="bottom-end">
          <div slot="content">
            <span>{{$t('text.group')}}</span>
            <span>{{abnormalList}}</span>
            <span>{{$t('text.groupConf4')}}</span>
            <span class="cursor-pointer font-color-2956a3" @click="goGroupMgmt">{{$t('text.groupMgmt')}}</span>
            <span>{{$t('text.groupConf4_1')}}</span>
          </div>
          <i class="el-icon-warning-outline font-color-E6A23C"></i>
        </el-tooltip>

      </span>
      <el-dropdown trigger="click" @command="changeGroup" placement="bottom">
        <span class="cursor-pointer font-color-fff" @click="groupVisible = !groupVisible">
          {{this.$t("head.group")}}: {{groupName}}<i :class="[groupVisible?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <li class="cursor-pointer font-color-2956a3 text-center" @click="goGroupMgmt" v-if="root==='admin'">{{this.$t('title.groupManagement')}}</li>
          <ul style="max-height: 220px;overflow-y:auto" class="text-center">
            <el-dropdown-item v-for=" item in groupList" :key="item.group" :command="item">
              <i class="wbs-icon-radio font-6" :style="{'color': groupStatusColor(item.groupStatus)}"></i>
              {{item.groupName}}
            </el-dropdown-item>
          </ul>
        </el-dropdown-menu>
      </el-dropdown>
      <span style="padding-right:10px"></span>
      <el-popover placement="bottom" width="0" min-width="50px" trigger="click">
        <div class="sign-out-wrapper">
          <span class="change-password" @click="changeMessage">{{this.$t("head.changeMessage")}}</span><br>
          <span class="change-password" @click="changePassword">{{this.$t("head.changePassword")}}</span><br>
          <span class="change-password" @click="lookVersion">{{this.$t("head.versionInfo")}}</span><br>
          <span class="sign-out" @click="deleteSelf">{{this.$t("head.deleteSelf")}}</span><br>
          <span class="sign-out" @click="signOut">{{this.$t("head.exit")}}</span>
        </div>
        <a class="browse-user" slot="reference">
          <i class="wbs-icon-user-icon"></i>
          <i>{{accountName}}</i>
        </a>
      </el-popover>
    </div>
    <el-dialog :title="$t('head.changeMessage')" v-if="changeMessageDialogVisible" :visible.sync="changeMessageDialogVisible" width="600px" style="text-align: center;">
      <change-message-dialog @success="changeMessageSuccess"></change-message-dialog>
    </el-dialog>
    <el-dialog :title="$t('head.changePassword')" :visible.sync="changePasswordDialogVisible" width="500px" style="text-align: center;">
      <change-password-dialog @success="success"></change-password-dialog>
    </el-dialog>
    <el-dialog :title="$t('head.versionInfo')" :visible.sync="versionInfoVisible" width="30%" style="text-align: center;">
      <!-- <p class="version-item">
        <span>{{$t("text.chainVersion")}}: </span>
        <span>{{$store.state.version}}</span>
      </p> -->
      <!-- <p class="version-item">
                <span>{{$t('text.supportVersion')}}: </span>
                <span>{{$store.state.supportVersion}}</span>
            </p> -->
      <div class="version-item" style="margin-top: -25px;">
        <span>{{$t("text.webaseVersion")}}: </span>
        <span>{{$store.state.mgrVersion}}</span>
        <el-tooltip class="item" :content="$t('text.versionInfo')" placement="top-start">
          <i class="el-icon-info" style="font-size: 18px;margin: 12px 0 0 12px;"></i>
        </el-tooltip>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import changePasswordDialog from "./changePasswordDialog";
import changeMessageDialog from "./changeMessageDialog";
import router from "@/router";
import {
  loginOut,
  groupStatus4,
  getGroupsInvalidIncluded,
  deleteChain,
  deleteAccount
} from "@/util/api";
import { delCookie } from "@/util/util";
import Bus from "@/bus";
export default {
  name: "conetnt-head",
  props: {
    headTitle: {
      type: String,
    },
    icon: {
      type: Boolean,
    },
    route: {
      type: String,
    },
    headSubTitle: {
      type: String,
    },
    headTooltip: {
      type: String,
    },
    headHref: {
      type: Object,
    },
    updateGroup: {
      type: Number,
    },
    updateGroupType: {
      type: String,
    },
  },
  components: {
    changePasswordDialog,
    changeMessageDialog
  },
  watch: {
    headTitle: function (val) {
      this.title = val;
    },
    updateGroup: function (val) {
      this.getGroupList();
    },
  },
  data: function () {
    return {
      isMicroApp: window.__POWERED_BY_QIANKUN__ ? true : false,
      title: this.headTitle,
      groupName: "-",
      accountName: "-",
      dialogShow: false,
      path: "",
      headIcon: this.icon || false,
      way: this.route || "",
      changePasswordDialogVisible: false,
      groupList: [],
      abnormalList: [],
      root: localStorage.getItem("root"),
      groupVisible: false,
      versionInfoVisible: false,
      changeMessageDialogVisible: false,
    };
  },
  beforeDestroy: function () {
    Bus.$off("deleteFront");
    Bus.$off("changeHeadGroup");
    Bus.$off("addFront");
  },
  mounted: function () {
    if (localStorage.getItem("groupName")) {
      this.groupName = localStorage.getItem("groupName");
    }
    if (localStorage.getItem("user")) {
      this.accountName = localStorage.getItem("user");
    }
    this.getGroupList();
    Bus.$on("deleteFront", () => {
      this.groupName = "";
      this.getGroupList("delete");
    });
    Bus.$on("addFront", () => {
      this.getGroupList();
    });
    Bus.$on("changeHeadGroup", () => {
      this.getGroupList();
    });
    this.queryGroupStatus4();
  },
  methods: {
    deleteSelf(){
      this.$confirm(this.$t("text.confirmDelete"), {
            center: true,
          })
            .then(() => {
              deleteAccount({account:this.accountName})
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message({
              message: this.$t("text.cancelSuccessMsg"),
              type: "success",
              duration: 2000,
            });
            router.push("/login");
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
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
            })
            .catch(() => {
              // this.modelClose();
            });
    },
    getGroupList: function (type) {
      getGroupsInvalidIncluded()
        .then((res) => {
          if (res.data.code === 0) {
            if (res.data.data && res.data.data.length) {
              this.groupList = res.data.data || [];
              if (this.updateGroupType === "update") {
                this.$nextTick((_) => {
                  this.groupName = res.data.data[0].groupName;
                  localStorage.setItem("groupName", res.data.data[0].groupName);
                  localStorage.setItem("groupId", res.data.data[0].groupId);
                  localStorage.setItem("chainId", res.data.data[0].chainId)
                  localStorage.setItem("chainName", res.data.data[0].chainName)
                });
              }
            } else {
              this.groupList = [];
              localStorage.setItem("groupName", "");
              localStorage.setItem("groupId", "");
              localStorage.setItem("chainId", "")
              localStorage.setItem("chainName", "")
            }
            if (type && res.data.data && res.data.data.length) {
              this.groupName = res.data.data[0].groupName;
              localStorage.setItem("groupName", res.data.data[0].groupName);
              localStorage.setItem("groupId", res.data.data[0].groupId);
              localStorage.setItem("chainId", res.data.data[0].chainId)
              localStorage.setItem("chainName", res.data.data[0].chainName)
            } else if (
              res.data.data &&
              res.data.data.length &&
              !localStorage.getItem("groupName")
            ) {
              this.groupName = res.data.data[0].groupName;
              localStorage.setItem("groupName", res.data.data[0].groupName);
              localStorage.setItem("groupId", res.data.data[0].groupId);
              localStorage.setItem("chainId", res.data.data[0].chainId)
              localStorage.setItem("chainName", res.data.data[0].chainName)
            } else if (
              res.data.data &&
              res.data.data.length &&
              localStorage.getItem("groupName")
            ) {
              this.groupName = localStorage.getItem("groupName");
            }
          } else {
            this.groupList = [];
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
            localStorage.setItem("groupName", "");
            localStorage.setItem("groupId", "");
            localStorage.setItem("chainId", "")
            localStorage.setItem("chainName", "")
          }
        })
        .catch((err) => {
          this.groupList = [];
          localStorage.setItem("groupName", "");
          localStorage.setItem("groupId", "");
          localStorage.setItem("chainId", "")
          localStorage.setItem("chainName", "")
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    checkGroup: function () {
      if (this.dialogShow) {
        this.dialogShow = false;
      } else {
        this.dialogShow = true;
      }

      this.path = this.$route.path;
    },
    changeGroup: function (val) {
      this.groupName = val.groupName;
      localStorage.setItem("groupName", val.groupName);
      localStorage.setItem("groupId", val.groupId);
      localStorage.setItem("chainId", val.chainId)
      localStorage.setItem("chainName", val.chainName)
      this.$emit("changGroup", val.groupId);
      Bus.$emit("changGroup", val.groupId);

      // this.dialogShow = true;
    },
    skip: function () {
      if (this.route) {
        this.$router.push(this.way);
      } else {
        this.$router.go(-1);
      }
    },
    signOut: function () {
      localStorage.removeItem("user");
      loginOut().then().catch();
      delCookie("JSESSIONID");
      delCookie("NODE_MGR_ACCOUNT_C");
      this.$router.push("/login");
      // if(localStorage.getItem('root')==='developer'){
      //     setTimeout(() => {
      //         location.reload();
      //     }, 300);
      // }
    },
    changePassword: function () {
      this.changePasswordDialogVisible = true;
    },
    changeMessage: function () {
      this.changeMessageDialogVisible = true;
    },
    lookVersion: function () {
      this.versionInfoVisible = true;
    },
    success: function (val) {
      this.changePasswordDialogVisible = false;
    },
    changeMessageSuccess: function (val) {
      this.changeMessageDialogVisible = false;
    },
    goGroupMgmt() {
      this.$router.push("groupManagement");
    },
    queryGroupStatus4() {
      groupStatus4(4)
        .then((res) => {
          if (res.data.code === 0) {
            var abnormalData = res.data.data;
            this.abnormalList = [];
            if (abnormalData) {
              abnormalData.forEach((item) => {
                this.abnormalList.push(item.groupId);
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
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    groupStatusColor(key) {
      switch (key) {
        case 1:
          return "rgb(88, 203, 125)";
          break;

        case 2:
          return "#E6A23C";
          break;
        case 3:
          return "#F56C6C";
          break;
        case 4:
          return "#F56C6C";
          break;
      }
    },
  },
};
</script>
<style scoped>
.content-head-wrapper {
  width: calc(100%);
  background-color: #181f2e;
  text-align: left;
  line-height: 54px;
  position: relative;
}
.content-head-wrapper::after {
  display: block;
  content: "";
  clear: both;
}
.content-head-icon {
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
.content-head-title {
  margin-left: 40px;
  display: inline-block;
  font-size: 16px;
  color: #fff;
  font-weight: bold;
}
.content-head-network {
  float: right;
  padding-right: 10px;
  position: relative;
}
.content-head-version {
  color: #bbb;
}
.content-head-version-data {
  display: inline-block;
  padding-right: 10px;
}
.browse-user {
  text-align: center;
  text-decoration: none;
  font-size: 12px;
  cursor: pointer;
  color: #cfd7db;
}
.sign-out-wrapper {
  line-height: 32px;
  text-align: center;
}
.sign-out {
  cursor: pointer;
  color: #ed5454;
}
.change-password {
  color: #0db1c1;
  cursor: pointer;
}
.network-name {
  font-size: 12px;
  color: #9da2ab;
  padding: 3px 0px;
  /* border-right: 2px solid #e7ebf0; */
  margin-right: 16px;
}
.select-network {
  color: #2d5f9e;
  cursor: default;
}
.content-head-network-link {
  text-decoration: none;
  outline: none;
  color: #cfd7db;
  padding-right: 15px;
  border-right: 1px solid #657d95;
  margin-right: 15px;
}
.contant-head-name {
  position: relative;
  cursor: pointer;
}
.contant-head-name ul {
  position: absolute;
  width: 150%;
  left: -10px;
  top: 35px;
  background-color: #fff;
  color: #666;
  text-align: center;
  z-index: 9999999;
  box-shadow: 1px 4px 4px;
}
.contant-head-name ul li {
  width: 100%;
  padding: 0 10px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
}
.group-item {
  line-height: 32px;
  text-align: center;
  max-height: 200px;
  overflow-y: auto;
  position: relative;
}
.group-item-list {
  cursor: pointer;
}
.group-item-list:hover {
  color: #0db1c1;
}
.right-menu-item {
  padding: 0 20px;
}
.hover-effect {
  cursor: pointer;
  /* transition: background 0.3s; */
}
.content-head-lang {
  position: absolute;
  /* background-color: #fff; */
  right: 350px;
  top: 0px;
}
.version-item {
  line-height: 22px;
}
</style>
