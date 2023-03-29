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
  <div class="content-head-wrapper">
    <div class="content-head-title">
      <span class="content-head-icon" v-if="icon" @click="skip">
        <i class="wbs-icon-back"></i>
      </span>
      <span :class="{ 'font-color-9da2ab': headSubTitle}">{{title}}</span>
      <span>{{headSubTitle}}</span>
    </div>
    <div class="content-head-network">
      <a v-if="$store.state.version>=2.5" class="content-head-network-link" target="_blank"
        href="https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/design/security_control/chain_governance.html">{{this.$t("head.helpText")}}</a>
      <a v-else class="content-head-network-link" target="_blank" href="https://webasedoc.readthedocs.io/zh_CN/latest/">{{this.$t("head.helpText")}}</a>
      <span style="padding-right:10px"></span>
      <el-popover placement="bottom" width="0" min-width="50px" disabled>
        <a class="browse-user" slot="reference">
          <i class="wbs-icon-user-icon"></i>
        </a>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  name: "conetnt-head",
  data: function () {
    return {
      title: this.headTitle,
      groupName: "-",
      accountName: "-",
      dialogShow: false,
      path: "",
      icon: true,
      way: this.route || "",
      changePasswordDialogVisible: false,
      groupList: [],
      abnormalList: [],
      root: localStorage.getItem("root"),
      groupVisible: false,
      versionInfoVisible: false,
      headSubTitle:"注册"
    };
  },
  methods:{
    skip: function () {
      if (this.route) {
        this.$router.push(this.way);
      } else {
        this.$router.go(-1);
      }
    },
  }
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
