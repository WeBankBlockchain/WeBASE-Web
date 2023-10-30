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
  <div class="contract-content" v-loading='loading'>
    <v-content-head :headTitle="$t('title.contractTitle')" :headSubTitle="$t('title.contractIDE')" style="font-size: 14px;" @changGroup="changGroup"></v-content-head>
    <div style="height: calc(100% - 56px)">
      <div class="code-menu-wrapper" :style="{width: menuWidth+'px'}">
        <v-menu @change="changeCode($event)" ref="menu" v-show="menuHide" :liquidChecks='liquidCheck'>
          <template slot="footer"   >
            <div class="version-selector">
              <el-select v-model="version" placeholder="请选择" @change="onchangeLoadVersion" >
                <el-option v-for="item in versionList" :key="item.versionId" :label="item.solcName" :value="item.solcName">
                </el-option>
              </el-select>
            </div>
          </template>
        </v-menu>
        <div class="move" @mousedown="dragDetailWeight($event)"></div>
      </div>
      <div :class="[!menuHide ?  'code-detail-wrapper' : 'code-detail-reset-wrapper']" :style="{width: contentWidth}">
        <v-code ref="codes" :changeStyle="changeWidth" :frontIds='frontId' :liquidChecks='liquidCheck' :data="contractData" :show="showCode" @add="add($event)" @compile="compile($event)" @deploy="deploy($event)"></v-code>
      </div>
    </div>
  </div>
</template>

<script>
import menu from "./components/contractCatalog";
import codes from "./components/code";
import contentHead from "@/components/contentHead";
import {
  encryption,
  checkIsWasm,
  getFronts,
  liquidCompileCheck,
  liquidCheck,
} from "@/util/api";
import webworkify from "webworkify-webpack";
export default {
  name: "contract",
  components: {
    "v-menu": menu,
    "v-code": codes,
    "v-content-head": contentHead,
  },
  watch: {
    $route: function () {
      this.urlQuery = this.$root.$route.query;
    },
    menuHide: function (val) {
      if (val) {
        this.menuWidth = 240;
      } else {
        this.menuWidth = 0;
      }
    },
  },
  data: function () {
    return {
      contractData: {},
      showCode: false,
      menuHide: true,
      changeWidth: false,
      contractHide: false,
      menuWidth: 240,
      urlQuery: this.$root.$route.query,
      allVersion: [],
      versionList: [],
      version: localStorage.getItem("solcName")
        ? localStorage.getItem("solcName")
        : "",
      baseURLWasm: "./static/js",
      versionId: localStorage.getItem("versionId")
        ? localStorage.getItem("versionId")
        : "",
      versionData: null,
      loading: false,
      host: location.host,
      protocol: location.protocol,
      subPath: window.__POWERED_BY_QIANKUN__ ? '/child/bcos3' : '',
      groupId: localStorage.getItem("groupId")
        ? localStorage.getItem("groupId")
        : "",
      liquidCheck: false,
      frontList: null,
      frontId: "",
    };
  },
  computed: {
    contentWidth: function () {
      if (this.menuWidth) {
        return `calc(100% - ${this.menuWidth}px)`;
      } else {
        return `100%`;
      }
    },
  },
  destroyed() {
    if (this.$store.state.worke) {
      this.$store.state.worker.terminate();
      this.$store.state.worker = null;
    }
  },
  mounted: function () {
    if (localStorage.getItem("dataFrom") === "transactionDetail") {
      localStorage.setItem("dataFrom", "");
      this.$message({
        type: "warning",
        message: this.$t("text.importContractTip"),
      });
    }
    this.allVersion = [
      {
        solcName: "v0.4.25",
        versionId: 0,
        url: `${this.protocol}//${this.host}${this.subPath}/static/js/v0.4.25.js`,
        encryptType: 0,
        net: 1,
      },
      {
        solcName: "v0.4.25-gm",
        versionId: 1,
        url: `${this.protocol}//${this.host}${this.subPath}/static/js/v0.4.25-gm.js`,
        encryptType: 1,
        net: 1,
      },
      {
        solcName: "v0.5.2",
        url: `${this.protocol}//${this.host}${this.subPath}/static/js/v0.5.2.js`,
        versionId: 2,
        encryptType: 0,
        net: 1,
      },
      {
        solcName: "v0.5.2-gm",
        versionId: 3,
        url: `${this.protocol}//${this.host}${this.subPath}/static/js/v0.5.2-gm.js`,
        encryptType: 1,
        net: 1,
      },
      {
        solcName: "v0.6.10",
        versionId: 4,
        url: `${this.protocol}//${this.host}${this.subPath}/static/js/v0.6.10.js`,
        encryptType: 0,
        net: 1,
      },
      {
        solcName: "v0.6.10-gm",
        versionId: 5,
        url: `${this.protocol}//${this.host}${this.subPath}/static/js/v0.6.10-gm.js`,
        encryptType: 1,
        net: 1,
      },
      {
        solcName: "v0.8.11",
        versionId: 6,
        url: `${this.protocol}//${this.host}${this.subPath}/static/js/v0.8.11.js`,
        encryptType: 0,
        net: 1,
      },
      {
        solcName: "v0.8.11-gm",
        versionId: 7,
        url: `${this.protocol}//${this.host}${this.subPath}/static/js/v0.8.11-gm.js`,
        encryptType: 1,
        net: 1,
      },
    ];
    // this.initWorker()
    // this.getEncryption(this.querySolcList);
    // this.liquidList();
    // this.liquidCheck = true;
    if (localStorage.getItem("groupId") && localStorage.getItem("groupId").length > 0) {
      this.getfrontList()
    }
    //this.liquidCheckMethod()
  },
  methods: {
    liquidCheckMethod() {
      let groupId = localStorage.getItem("groupId");
      checkIsWasm(this.frontId, groupId)
        .then((res) => {
          if (res.data.data == true) {
            this.liquidList();
            this.liquidCheck = true;
          } else {
            this.liquidCheck = false;
            this.initWorker();
            this.getEncryption(this.querySolcList);
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: err.data || this.$t("text.systemError"),
          });
        });
    },
    liquidList() {
      this.versionList = [
        {
          solcName: "liquid",
          versionId: 0,
        },
      ];
      this.version = "liquid";
      localStorage.setItem("solcName", "liquid");
      //this.frontList();
    },
    getfrontList() {
      let reqData = {
        // frontId: this.frontId,
        groupId: localStorage.getItem("groupId")
      };
      getFronts(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            this.frontList = res.data.data || [];
            this.frontId = this.frontList[0].frontId;
            this.loading = false;
            this.liquidCheckMethod();
          } else {
            this.loading = false;
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
    },
    complieCheck() {
      let reqData = {
        frontId: this.frontId,
      };
      liquidCheck(reqData.frontId)
        .then((res) => {
          if (res.data.code === 0) {
          } else {
            this.loading = false;
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
    },
    initWorker() {
      let w = webworkify(require.resolve("@/util/file.worker"));
      console.log("w:", w);
      this.$store.state.worker = w;
    },
    querySolcList() {
      for (let i = 0; i < this.allVersion.length; i++) {
        if (
          localStorage.getItem("encryptionId") == this.allVersion[i].encryptType
        ) {
          this.versionList.push(this.allVersion[i]);
        }
      }

      //if (!localStorage.getItem('solcName')) {
      this.version = this.versionList[0]["solcName"];
      this.versionId = this.versionList[0]["id"];
      localStorage.setItem("solcName", this.versionList[0]["solcName"]);
      localStorage.setItem("versionId", this.versionList[0]["versionId"]);
      //}
      this.initSolc(localStorage.getItem("versionId"));
    },
    initSolc(versionId) {
      let that = this;
      // let w = webworkify(require.resolve('@/util/file.worker'));
      if (versionId) {
        for (let i = 0; i < this.versionList.length; i++) {
          if (this.versionList[i].versionId == versionId) {
            this.versionData = this.versionList[i];
            this.version = this.versionList[i]["solcName"];
            this.$store.dispatch("set_version_data_action", this.versionData);
          }
        }
      } else {
        this.versionData = this.versionList[0];
        this.version = this.versionList[0]["solcName"];
        this.$store.dispatch("set_version_data_action", this.versionData);
      }

      if (this.versionData && this.versionData.net) {
        let w = webworkify(require.resolve("@/util/file.worker"));
        this.$store.state.worker = w;
        w.addEventListener("message", function (ev) {
          if (ev.data.cmd == "versionLoaded") {
            console.log(ev.data, that);
            that.loading = false;
          } else {
            console.log(ev.data);
            console.log(JSON.parse(ev.data.data));
          }
        });
        w.postMessage({
          cmd: "loadVersion",
          data: this.versionData.url,
        });
        w.addEventListener("error", function (ev) {
          that.$message({
            type: "error",
            message: this.$t("text.versionError"),
          });
          that.loading = false;
          console.log(ev);
        });
      } else {
        var head = document.head;
        var script = document.createElement("script");
        script.src = `${this.baseURLWasm}/${this.version}.js`;
        script.setAttribute("id", "soljson");
        if (!document.getElementById("soljson")) {
          head.appendChild(script);
          console.time("耗时");
          script.onload = function () {
            console.log("加载成功.");
            console.timeEnd("耗时");
            that.loading = false;
          };
        } else {
          that.loading = false;
        }
      }
    },
    initVersion() {
      localStorage.removeItem("solcName");
    },
    // changeChain(type) {
    //     this.initVersion()
    //     this.querySolcList(this.initSolc, 'changeChain')
    //     this.$router.go(0)
    //     this.$refs.menu.getContracts()
    // },
    onchangeLoadVersion(version) {
      this.loading = true;
      localStorage.setItem("solcName", version);
      var versionId = "";
      this.versionList.forEach((item) => {
        if (item.solcName == version) {
          versionId = item.versionId;
        }
      });
      localStorage.setItem("versionId", versionId);
      this.initSolc(versionId);
      if (
        this.$store.state.versionData &&
        this.$store.state.versionData.net == 0
      ) {
        this.$router.go(0);
      }

      this.$refs.menu.getContractPaths();
    },
    getEncryption: function (callback) {
      this.loading = true;
      this.groupId = localStorage.getItem("groupId");
      encryption(this.groupId)
        .then((res) => {
          if (res.status == 200) {
            localStorage.setItem("encryptionId", res.data.data);
            callback();
          } else {
            this.$message({
              type: "error",
              message: this.$chooseLang(res.data.code),
            });
          }
        })

        .catch((err) => {
          this.$message({
            type: "error",
            message: err.data || this.$t("text.systemError"),
          });
        });
    },
    changGroup: function () {
       this.initVersion();
       this.versionList = [];
      // this.getEncryption(this.querySolcList);
       this.$refs.menu.getContractPaths();
        this.getfrontList()
    },
    dragDetailWeight: function (e) {
      let startX = e.clientX,
        menuWidth = this.menuWidth;
      document.onmousemove = (e) => {
        let moveX = e.clientX - startX;
        if (menuWidth + moveX > 180) {
          this.menuWidth = menuWidth + moveX;
        }
      };

      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    changeCode: function (val) {
      this.contractData = val;
      this.showCode = true;
    },
    add: function (val) {
      this.$refs.menu.saveContact(val);
    },
    compile: function (val) {
      this.$refs.menu.saveContact(val);
    },
    deploy: function (val) {
      this.$refs.menu.saveContact(val);
    },
  },
};
</script>
<style scoped>
.contract-content {
  width: 100%;
  height: 100%;
  font-size: 0;
}
.contract-content::after {
  display: block;
  content: "";
  clear: both;
}
.code-menu-wrapper {
  float: left;
  position: relative;
  height: 100%;
  font-size: 12px;
  box-sizing: border-box;
}
.move {
  position: absolute;
  top: 0;
  left: 98%;
  width: 3px;
  height: 100%;
  z-index: 9999;
  cursor: w-resize;
}
.menu-spread {
  position: relative;
  width: 31px;
  height: 47px;
  line-height: 47px;
  border: 1px solid #e7ebf0;
  border-bottom: 2px solid #e7ebf0;
  color: #aeb1b5;
  background-color: #fff;
  text-align: center;
  cursor: pointer;
}
.menu-spread i {
  font-size: 12px;
}
.code-detail-wrapper {
  float: left;
  height: 100%;
  font-size: 12px;
}
.code-detail-reset-wrapper {
  float: left;
  height: 100%;
  font-size: 12px;
}
.menu-drag {
  position: absolute;
  width: 36px;
  height: 36px;
  line-height: 32px;
  border: 1px solid #e8e8e8;
  left: 370px;
  top: 50%;
  background-color: #fff;
  cursor: pointer;
}
.version-selector {
  position: absolute;
  top: 0px;
  right: 5px;
  z-index: 1;
  box-sizing: border-box;
}
.version-selector >>> .el-select {
  width: 100%;
  max-width: 118px;
}
</style>
