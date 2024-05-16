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
  <div class="contract-menu" style="position: relative; height: 100%" v-loading="loading">
    <div class="contract-menu-header noBlurs">
      <div style="padding-left: 20px">
        <el-tooltip class="item" effect="dark" :content="$t('contracts.createFile')" v-if="!disabled" placement="top-start">
          <i class="wbs-icon-Addfile icon contract-icon" @click="addFile"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" v-if="!disabled" :content="$t('contracts.createFolder')" placement="top-start">
          <i class="wbs-icon-Addfolder icon contract-icon" @click="addFolder"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('contracts.upLoadFile')" v-if="!disabled" placement="top-start">
          <i class="wbs-icon-shangchuan contract-icon" style="position: relative" @click="uploading">
            <input multiple title="" type="file" id="file" ref="file" name="chaincodes" class="uploads" @change="upload($event)" />
          </i>
        </el-tooltip>
        <!-- <el-select v-model="Highlight" class="langChoose" @change="langChange">
          <el-option v-for="item in Language" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
        <div>
          <slot name="footer"></slot>
        </div>
      </div>
    </div>

    <div class="contract-menu-content">
      <ul>
        <li v-for="item in contractArry" :key="item.contractId">
          <div v-if="item.contractType == 'file'" class="contract-file" :id="item.contractId">
            <i class="wbs-icon-file" @click="select(item)" v-if="!item.renameShow" :id="item.contractId"></i>
            <span @contextmenu.prevent="handle($event, item)" @click="select(item)" :id="item.contractId" v-if="!item.renameShow" :class="{ colorActive: item.contractActive }">{{ item.contractName }}</span>
            <el-input v-model="contractName" v-focus maxlength="32" @blur="changeName(item)" v-if="item.renameShow"></el-input>
            <div class="contract-menu-handle" v-if="!disabled && item.handleModel" :style="{ top: clentY, left: clentX }" v-Clickoutside="checkNull">
              <ul v-if="contractFile">
                <li class="contract-menu-handle-list" @click="rename">
                  {{ $t("contracts.rename") }}
                </li>
                <!-- <li class="contract-menu-handle-list" v-if='!item.renameShow && !item.contractAddress' @click="deleteFile(item)">{{$t("text.delete")}}</li> -->
                <li class="contract-menu-handle-list" @click="deleteFile(item)">
                  {{ $t("text.delete") }}
                </li>
                <li class="contract-menu-handle-list" @click="exportFile(item)">
                  {{ $t("contracts.exportSol") }}
                </li>
              </ul>
            </div>
          </div>
          <div v-if="item.contractType == 'folder'" class="contract-folder" :id="item.folderId">
            <i :class="item.folderIcon" @contextmenu.prevent="handle($event, item)" @click="open(item)" v-if="!item.renameShow" :id="item.folderId"></i>
            <i class="wbs-icon-folder" @contextmenu.prevent="handle($event, item)" @click="open(item)" v-if="!item.renameShow" style="color: #d19650" :id="item.folderId"></i>
            <span :title="item.contractName" @contextmenu.prevent="handle($event, item)" @click="open(item)" :id="item.folderId" v-if="!item.renameShow"
              :class="[{ colorActive: item.contractActive }, 'cursor-pointer']">{{ item.contractName }}</span>
            <div class="contract-menu-handle" v-if="!disabled && item.handleModel" :style="{ top: clentY, left: clentX }" v-Clickoutside="checkNull">
              <ul>
                <li class="contract-menu-handle-list" @click="addFiles(item)">
                  {{ $t("contracts.createFile") }}
                </li>
                <!-- <li class="contract-menu-handle-list" v-if="!item.renameShow" @click='deleteFolder(item)'>{{$t("text.delete")}}</li> -->
                <li class="contract-menu-handle-list" @click="deleteFolder(item)">
                  {{ $t("text.delete") }}
                </li>
                <li class="contract-menu-handle-list" @click="exportFolder(item)">
                  {{ $t("contracts.exportSol") }}
                </li>
              </ul>
            </div>
            <br />
            <ul v-if="item.folderActive" style="padding-left: 20px">
              <li class="contract-file" v-for="list in item.child" :key="list.contractId">
                <i class="wbs-icon-file" v-if="!list.renameShow" @click="select(list)"></i>
                <span @click="select(list)" @contextmenu.prevent="handle($event, list)" :id="list.contractId" v-if="!list.renameShow" :class="{ colorActive: list.contractActive }">{{ list.contractName }}</span>
                <el-input v-model="contractName" v-focus maxlength="32" @blur="changeName(list)" v-if="list.renameShow"></el-input>
                <div class="contract-menu-handle" v-if="!disabled && list.handleModel" :style="{ top: clentY, left: clentX }" v-Clickoutside="checkNull">
                  <ul v-if="contractFile">
                    <li class="contract-menu-handle-list" @click="rename">
                      {{ $t("contracts.rename") }}
                    </li>
                    <!-- <li class="contract-menu-handle-list" v-if='!list.renameShow && !list.contractAddress' @click="deleteFile(list)">{{$t("text.delete")}}</li> -->
                    <li class="contract-menu-handle-list" @click="deleteFile(list)">
                      {{ $t("text.delete") }}
                    </li>
                    <li class="contract-menu-handle-list" @click="exportFile(list)">
                      {{ $t("contracts.exportSol") }}
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div class="el-loading-mask" v-show="liquidLoad">
      <div class="el-loading-spinner"></div>
    </div>
    <add-folder v-if="foldershow" :foldershow="foldershow" @close="folderClose" @success="folderSuccess"></add-folder>
    <add-file v-if="fileshow" :data="selectFolderData" :fileshow="fileshow" @close="fileClose" @success="fileSucccess($event)" :id="folderId"></add-file>
    <select-catalog v-if="cataLogShow" :show="cataLogShow" @success="catalogSuccess($event)" @close="catalogClose"></select-catalog>
    <export-project v-if="$store.state.exportProjectShow" :show="$store.state.exportProjectShow" :folderList="pathList" @close="exportProjectShowClose" @javaProjectComplie="javaProjectComplie"></export-project>
  </div>
</template>
<script>
import addFolder from "../dialog/addFolder";
import addFile from "../dialog/addFile";
import selectCatalog from "../dialog/selectCatalog";
import exportProject from "../dialog/exportProject";
import {
  searchContract,
  saveChaincode,
  deleteCode,
  getContractPathList,
  deletePath,
} from "@/util/api";
import Bus from "@/bus";
import errcode from "@/util/errcode";
import Clickoutside from "element-ui/src/utils/clickoutside";
import { subStringToNumber } from "@/util/util";
let Base64 = require("js-base64").Base64;
const FileSaver = require("file-saver");
import JSZip from "jszip";
export default {
  name: "contractCatalog",
  components: {
    "add-folder": addFolder,
    "add-file": addFile,
    "select-catalog": selectCatalog,
    exportProject,
  },
  props: ["liquidChecks"],
  data: function () {
    return {
      liquidCheck: this.liquidChecks,
      pathList: [],
      foldershow: false,
      fileshow: false,
      filename: "",
      fileString: "",
      contractList: [],
      folderList: [],
      contractArry: [],
      contractData: null,
      cataLogShow: false,
      realContractList: [],
      contractName: "",
      clentX: 0,
      clentY: 0,
      contractFile: false,
      contractFolder: false,
      ID: "",
      handleModel: false,
      folderId: null,
      disabled: false,
      selectFolderData: null,
      folderData: null,
      loading: false,
      Highlight: true,
      Language: [
        {
          value: true,
          label: "javascript",
        },
        {
          value: false,
          label: "rust",
        },
      ],
      liquidLoad: false,
    };
  },
  beforeDestroy: function () {
    Bus.$off("compile");
    Bus.$off("deploy");
    Bus.$off("open");
    Bus.$off("save");
    Bus.$off("compileLiquid");
  },
  watch: {
    liquidChecks: function (val) {
      this.liquidCheck = val;
    },
  },
  mounted: function () {
    if (
      localStorage.getItem("root") === "admin" ||
      localStorage.getItem("root") === "developer" ||
      localStorage.getItem("groupId")
    ) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
    if (
      localStorage.getItem("groupId") ||
      localStorage.getItem("configData") == 3 ||
      localStorage.getItem("deployType") == 0
    ) {
      this.$nextTick(function () {
        if (localStorage.getItem("groupId")) {
          this.getContractPaths();
        }
      });
    }
    Bus.$on("compileLiquid", (data) => {
      this.compileLiquid(data);
    });
    Bus.$on("compile", (data) => {
      this.saveContract(data, this.$t("contracts.contractCompileSuccess"));
    });
    Bus.$on("save", (data) => {
      this.saveContract(data);
    });
    Bus.$on("deploy", (data) => {
      this.getContracts("", data);
    });
    Bus.$on("open", (data) => {
      this.contractArry.forEach((value) => {
        if (value.contractName == data.contractPath && !value.folderActive) {
          this.$set(value, "folderActive", true);
          this.$set(value, "folderIcon", "el-icon-caret-bottom");
        }
      });
      this.select(data);
    });
    Bus.$on("send", (data) => {
      this.contractArry.forEach((value) => {
        if (value.contractId == data.contractId) {
          this.$set(value, "contractAddress", data.contractAddress);
        } else if (value.contractType == "folder") {
          value.child.forEach((list) => {
            if (list.contractId == data.contractId) {
              this.$set(list, "contractAddress", data.contractAddress);
            }
          });
        }
      });
    });
    console.log(this.disabled);
    document.querySelector(".noBlurs").onmousedown = function (e) {
      console.log(1);
      Bus.$emit("limit", false);
      e.preventDefault();
    };
  },
  directives: {
    Clickoutside,
    focus: {
      inserted: function (el, { value }) {
        let dom = el.getElementsByClassName("el-input__inner")[0];
        dom.focus();
      },
    },
  },
  methods: {
    compileLiquid: function (val) {
      this.liquidLoad = val;
    },
    /**
     * @method 点击任意处清除右键弹窗
     */
    checkNull: function (list) {
      this.contractArry.forEach((value) => {
        value.handleModel = false;
        if (value.contractType == "folder") {
          value.child.forEach((list) => {
            list.handleModel = false;
          });
        }
      });
      this.ID = "";
      this.contractFile = false;
      this.contractFolder = false;
      this.handleModel = false;
    },
    /**
     * 右键弹窗
     * @param e 选中位置
     * @param list  选中对象
     */
    handle: function (e, list) {
      console.log(e);
      this.checkNull();
      list.handleModel = true;
      // if (e.clientX > 201) {
      //     this.clentX = e.clientX - 200 + 'px';
      // } else {
      this.clentX = e.clientX + "px";
      // }
      this.clentY = e.clientY + "px";
      this.ID = e.target.id;
      let item = {};
      if (this.ID) {
        this.handleModel = true;
        this.contractArry.forEach((value) => {
          if (
            (value.contractId && value.contractId == this.ID) ||
            (value.folderId && value.folderId == this.ID)
          ) {
            item = value;
          } else if (value.contractType == "folder") {
            value.child.forEach((list) => {
              if (list.contractId == this.ID) {
                item = list;
              }
            });
          }
        });
        if (item.contractType == "file") {
          this.contractFile = true;
          this.contractFolder = false;
        } else {
          this.contractFile = false;
          this.contractFolder = true;
        }
      } else {
        this.ID = "";
        this.contractFile = false;
        this.contractFolder = false;
        this.handleModel = false;
      }
    },
    // 导出项目
    exportProjectShowClose() {
      this.$store.dispatch("set_exportProject_show_action", false);
    },
    /**
     * 重命名
     * @param val  选中内容
     * 主要是将选中的对象的renameShow 置为true
     */
    rename: function (val) {
      this.contractArry.forEach((value) => {
        value.handleModel = false;
        if (value.contractType == "folder") {
          value.child.forEach((list) => {
            list.handleModel = false;
          });
        }
      });
      this.contractArry.forEach((value) => {
        if (value.contractId == this.ID && value.contractStatus != 2) {
          this.$set(value, "renameShow", true);
          this.contractName = value.contractName;
        } else if (
          value.contractType == "folder" &&
          value.folderId !== this.ID
        ) {
          value.child.forEach((item) => {
            if (item.contractId == this.ID && item.contractStatus != 2) {
              this.$set(item, "renameShow", true);
              this.contractName = item.contractName;
            } else if (item.contractId == this.ID && item.contractStatus == 2) {
              this.$set(item, "renameShow", false);
              this.$message({
                message: this.$t("contracts.renameFail"),
                type: "error",
              });
            } else {
              this.$set(item, "renameShow", false);
            }
          });
        } else if (
          value.contractType == "folder" &&
          value.folderId == this.ID
        ) {
          let num = 0;
          value.child.forEach((item) => {
            if (item.contractStatus == 2) {
              num++;
            }
          });
          if (num == 0) {
            this.$set(value, "renameShow", true);
            this.contractName = value.contractName;
          }
        } else if (value.contractId == this.ID && value.contractStatus == 2) {
          this.$set(value, "renameShow", false);
          this.$message({
            message: this.$t("contracts.renameFail"),
            type: "error",
          });
        } else {
          this.$set(value, "renameShow", false);
        }
      });

      this.contractFile = false;
      this.contractFolder = false;
      this.handleModel = false;
    },
    /**
     * 重命名修改合约名称
     * @param val  修改的合约对象
     * 判断合约是否符合规则 and 合约名再统一contractPath是否重复，置为false，再调用保存合约方法
     */
    changeName: function (val) {
      let pattern = /^[A-Za-z0-9_]+$/;
      if (
        pattern.test(this.contractName) &&
        this.contractName.length < 32 &&
        this.contractName.length > 1
      ) {
        if (this.contractName !== val.contractName) {
          for (let i = 0; i < this.contractList.length; i++) {
            if (
              this.contractList[i].contractName == this.contractName &&
              this.contractList[i].contractPath == val.contractPath
            ) {
              this.$message({
                message: this.$t("contracts.nameFail"),
                type: "error",
              });
              this.$set(val, "renameShow", false);
              return;
            }
          }
          if (this.contractName) {
            this.$set(val, "contractName", this.contractName);
            this.contractName = "";
            this.saveContract(val);
          } else {
            this.$set(val, "renameShow", false);
          }
        } else {
          this.$set(val, "renameShow", false);
        }
      } else {
        this.$message({
          message: this.$t("contracts.contractLong"),
          type: "error",
        });
        this.$set(val, "renameShow", false);
      }
    },
    /**
     * 新增文件夹 打开文件夹弹窗
     */
    addFolder: function () {
      this.checkNull();
      this.foldershow = true;
    },
    /**
     * 新增文件  打开文件弹窗
     */
    addFile: function () {
      this.checkNull();
      this.fileshow = true;
    },
    /**
     * 在文件夹下新增文件
     * @param   val  选中的文件夹对象
     */
    addFiles: function (val) {
      this.selectFolderData = val;
      this.fileshow = true;
      this.folderId = this.ID;
      this.ID = "";
      this.contractFile = false;
      this.contractFolder = false;
      this.handleModel = false;
    },
    /**
     * @method 批量上传
     * 此处判断合约数量不大于20个，每个合约大小不大于400k，判断成立  打开输入合约路径的弹窗
     */
    upload: function (e) {
      this.checkNull();
      if (!e.target.files.length) {
        return;
      }
      this.uploadFiles = e.target.files;
      if (this.uploadFiles.length > 20) {
        this.$message({
          message: this.$t("text.contractCount"),
          type: "error",
        });
        return;
      }
      for (let i = 0; i < this.uploadFiles.length; i++) {
        let filessize = Math.ceil(this.uploadFiles[i].size / 1024);
        let files = this.uploadFiles[i].name.split(".");
        let filetype = files[files.length - 1];
        if (filessize > 400) {
          this.$message({
            message: this.$t("contracts.contractSize"),
            type: "error",
          });
          this.cataLogShow = false;
          break;
        } else if (filetype !== "sol") {
          this.$message({
            message: this.$t("contracts.contractType"),
            type: "error",
          });
          this.cataLogShow = false;
          break;
        } else {
          this.cataLogShow = true;
        }
      }
    },
    /**
     * @method   执行批量上传
     * 执行批量上传请求，通过for循环依次执行新建合约请求
     * 新建合约请求为同步执行
     * 最后一次新建合约请求完成后查询合约列表
     */
    catalogSuccess: function (val) {
      let len = this.uploadFiles.length;
      for (let i = 0; i < this.uploadFiles.length; i++) {
        let reader = new FileReader(); //新建一个FileReader
        reader.readAsText(this.uploadFiles[i], "UTF-8"); //读取文件
        let filename = "",
          _this = this;
        // let files = this.uploadFiles[i].name.split(".");
        // for (let i = 0; i < files.length - 1; i++) {
        //     filename = filename + files[i]
        // }
        filename = this.uploadFiles[i].name.slice(
          0,
          this.uploadFiles[i].name.length - 4
        );
        let num = 0;
        this.contractList.forEach((value) => {
          if (
            value.contractName == filename &&
            value.contractPath == val &&
            num === 0
          ) {
            this.$message({
              type: "error",
              message: this.$t("contracts.contractNameSameFail"),
            });
            return;
          }
        });
        let data;
        reader.onload = function (evt) {
          var fileString = "";
          fileString = Base64.encode(evt.target.result); // 读取文件内容
          data = {
            contractName: filename,
            contractSource: fileString,
            contractPath: val,
            contractType: "file",
            contractActive: false,
            contractstatus: 0,
            contractAbi: "",
            contractBin: "",
            contractAddress: "",
            contractVersion: "",
            contractNo: new Date().getTime(),
          };
          if (i == len - 1) {
            _this.saveOneContract(data, true);
          } else {
            _this.saveOneContract(data);
          }
        };
      }
      this.catalogClose();
    },
    /**
     * @method 同步保存合约  （upload合约专用）
     * @param data  合约内容
     * @param type  为true执行查询合约列表请求
     */
    async saveOneContract(data, type) {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        contractName: data.contractName,
        contractPath: data.contractPath,
        contractSource: data.contractSource,
        contractAbi: data.contractAbi,
        contractBin: data.contractBin,
        bytecodeBin: data.bytecodeBin,
        account: localStorage.getItem("user"),
      };
      if (data.contractId) {
        reqData.contractId = data.contractId;
      }
      await saveChaincode(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            // if (localStorage.getItem("root") === "developer") {
            setTimeout(() => {
              this.getContractPaths();
            }, 200);
            // }
            if (type) {
              this.$refs.file.value = null;
              this.getContracts(data.contractPath, res.data.data);
            }
            if (data.contractId) {
              this.$message({
                type: "success",
                message: title || this.$t("contracts.contractSaveSuccess"),
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
    /**
     * 关闭选择合约路径弹窗
     */
    catalogClose: function () {
      this.$refs.file.value = null;
      this.cataLogShow = false;
    },
    /**
     * 关闭文件夹弹窗
     */
    folderClose: function () {
      this.foldershow = false;
    },
    /**
     * 新建文件成功事件
     */
    folderSuccess: function () {
      this.folderClose();
      this.getContractPaths();
    },
    /**
     * 关闭文件弹窗
     */
    fileClose: function () {
      this.fileshow = false;
      this.folderId = "";
      this.ID = "";
    },
    /**
     * 查询合约目录列表 并预处理
     * 再执行查询合约内容请求
     * @param val 合约对象
     */
    getContractPaths(val) {
      getContractPathList(localStorage.getItem("groupId"))
        .then((res) => {
          if (res.data.code == 0) {
            this.pathList = res.data.data;
            this.folderList = [];
            for (let i = 0; i < this.pathList.length; i++) {
              if (this.pathList[i].contractPath != "/") {
                let item = {
                  folderName: this.pathList[i].contractPath,
                  folderId:
                    new Date().getTime() + this.pathList[i].contractPath,
                  folderActive: false,
                  groupId: localStorage.getItem("groupId"),
                  modifyTime: this.pathList[i].modifyTime,
                };
                this.folderList.push(item);
              }
            }
            if (val) {
              this.getContracts(val);
            } else {
              this.getContracts();
            }
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
    /**
     * 生成合约目录树状结构
     */
    getContractArry: function (val) {
      let result = [];
      let list = [];
      let folderArry = this.createFolder(val);
      let newFileList = [];
      list = this.contractList || [];
      list.forEach((value) => {
        this.$set(value, "handleModel", false);
        if (value.contractPath == "/") {
          newFileList.push(value);
        }
      });
      folderArry.forEach((value) => {
        this.$set(value, "handleModel", false);
        value.child = [];
        list.forEach((item, index) => {
          if (item.contractPath == value.contractName) {
            value.child.push(item);
          }
        });
      });
      result = newFileList.concat(folderArry);
      this.contractArry = result;
      if (this.contractList.length && !val) {
        this.select(this.contractList[0]);
      } else if (val && val.contractType == "folder") {
        // let num = 0
        // for (let i = 0; i < this.contractArry.length; i++) {
        //     if (val.contractName === this.contractArry[i].contractName) {
        //         if (this.contractArry[i].child.length) {
        //             this.select(this.contractArry[i].child[0]);
        //             num++;
        //         }
        //     }
        // }
        // if (num == 0) {
        //     let index = 0;
        //     for (let i = 0; i < this.contractList.length; i++) {
        //         if (this.contractList[i] && this.contractList[i].contractPath == "/") {
        //             this.select(this.contractList[i]);
        //             index++;
        //             console.log("*")
        //             continue;
        //         }
        //     }
        //     if (index == 0) {
        //         this.select(this.contractList[0]);
        //     }
        // }
        this.select(val, "title");
      } else if (
        val &&
        val.contractType !== "folder" &&
        this.contractList.length
      ) {
        this.select(val);
      } else {
        Bus.$emit("noData", true);
      }
    },
    /**
     * 新建或者更更新合约
     * @param data  合约对象
     * @param title 新建成功后提示信息
     */
    saveContract: function (data, title) {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        contractName: data.contractName,
        contractPath: data.contractPath,
        contractSource: data.contractSource,
        contractAbi: data.contractAbi,
        contractBin: data.contractBin,
        bytecodeBin: data.bytecodeBin,
        account: localStorage.getItem("user"),
      };
      if (data.contractId) {
        reqData.contractId = data.contractId;
      }
      if (this.liquidCheck) {
        reqData.isWasm = true;
      }
      if (data.contractAddress) {
        reqData.contractAddress = data.contractAddress;
      }
      saveChaincode(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            this.getContracts(data.contractPath, res.data.data);
            Bus.$emit("limit", true);
            if (data.contractId) {
              this.$message({
                type: "success",
                message: title || "合约保存成功！",
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
    /**
     * 查询合约列表
     * @param  path  合约路径
     * @param  合约对象
     * 根据合约路径查询合约列表
     */
    getContracts: function (path, list) {
      let data = {
        groupId: localStorage.getItem("groupId"),
      };
      try {
        //当用户权限为开发者时，需要传入参数account
        if (localStorage.getItem("root") === "developer") {
          data.account = localStorage.getItem("user");
        }
        //当合约路径传入，且合约列表长度大于0，参数contractPathList即为传入的path
        //当合约路径传入，且合约列表长度等于0，需要加上根目录"/"，如果path不是对象，则contractPathList再加上path
        if (path && this.$store.state.contractDataList.length > 0) {
          data.contractPathList = [path];
        } else if (path && this.$store.state.contractDataList.length == 0) {
          if (typeof path == "object") {
            path.push("/");
          } else {
            path = [path, "/"];
          }

          data.contractPathList = path;
        }
        //判断url是否存在合约路径，且合约路径是不是""/"
        else if (this.$route.query.contractPath) {
          if (this.$route.query.contractPath == "/") {
            data.contractPathList = [this.$route.query.contractPath];
          } else {
            data.contractPathList = [this.$route.query.contractPath, "/"];
          }
        }
        //selectData时在左侧目录选中的合约或者文件夹，
        // 判断对象是有contractPath，且contractPath == "/"  此时选中对象时合约对象，那么contractPathList值为选中对象的contractPath
        // 判断对象是有contractPath，且contractPath ！= "/"  此时选中对象时合约对象，那么contractPathList值为选中对象的contractPath和'/'
        // 判断对象没有contractPath，且contractType == "folder"  此时选中对象时文件夹对象，那么contractPathList值为选中对象的名称（contractName）和'/'
        else if (localStorage.getItem("selectData")) {
          if (JSON.parse(localStorage.getItem("selectData"))) {
            if (
              JSON.parse(localStorage.getItem("selectData")).contractPath &&
              JSON.parse(localStorage.getItem("selectData")).contractPath == "/"
            ) {
              data.contractPathList = [
                JSON.parse(localStorage.getItem("selectData")).contractPath,
              ];
            } else if (
              JSON.parse(localStorage.getItem("selectData")).contractType ==
              "folder"
            ) {
              data.contractPathList = [
                JSON.parse(localStorage.getItem("selectData")).contractName,
                "/",
              ];
            } else {
              data.contractPathList = [
                JSON.parse(localStorage.getItem("selectData")).contractPath,
                "/",
              ];
            }
          }
        } else {
          data.contractPathList = ["/"];
        }
      } catch (error) {
        console.log(error);
      }

      this.loading = true;
      searchContract(data)
        .then((res) => {
          this.loading = false;
          if (res.data.code == 0) {
            this.contractList = [];
            let contractList = res.data.data || [];
            console.log(
              "contractDataList:",
              this.$store.state.contractDataList
            );
            let contractDataList = this.$store.state.contractDataList;
            //查询的合约列表与存入的合约列表合并且除重处理
            this.contractList = this.changeContractData(
              contractDataList,
              contractList,
              data.contractPath
            );
            this.$store.dispatch(
              "set_contract_dataList_action",
              this.contractList
            );
            localStorage.setItem(
              "contractList",
              JSON.stringify(this.contractList)
            );
            if (res.data.data.length) {
              let result = [];
              let arrry = [];
              let obj = {};
              this.contractList.forEach((value) => {
                this.$set(value, "contractType", "file");
                this.$set(value, "contractActive", false);
                this.$set(value, "renameShow", false);
                this.$set(value, "inputShow", false);
              });
              //当有传入的对象时
              if (list) {
                this.getContractArry(list);
                //当有没有传入的对象时，url存在合约id时
              } else if (this.$route.query.contractId) {
                let num = 0;
                this.contractList.forEach((value) => {
                  if (value.contractId == this.$route.query.contractId) {
                    num++;
                    this.getContractArry(value);
                  }
                });
                if (!num) {
                  this.getContractArry();
                }
              } else if (
                this.$route.query.contractPath &&
                !this.$route.query.contractId
              ) {
                if (res.data.data.length) {
                  this.getContractArry(res.data.data[0]);
                } else {
                  this.getContractArry();
                }
              }
              //当有选中合约时
              else if (
                localStorage.getItem("selectData") &&
                JSON.parse(localStorage.getItem("selectData")) &&
                JSON.parse(localStorage.getItem("selectData")).contractId
              ) {
                let num = 0;
                this.contractList.forEach((value) => {
                  if (
                    value.contractId ==
                    JSON.parse(localStorage.getItem("selectData")).contractId
                  ) {
                    num++;
                    this.getContractArry(value);
                  }
                });
                if (!num) {
                  this.getContractArry();
                }
              } else {
                this.getContractArry();
              }
            } else {
              if (list) {
                this.getContractArry(list);
              } else {
                this.getContractArry();
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
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    /**
     * 合约列表除重且更新
     * @param  list1  已存在的合约列表
     * @param list2 查询的合约列表
     * @param path 已查询的合约路径
     */
    changeContractData(list1, list2, path) {
      let arry = [];
      let obj = {};
      let list3 = list1.concat(list2);
      let list = [];
      list3 = list3.reduce(function (item, next) {
        obj[next.contractId]
          ? ""
          : (obj[next.contractId] = true && item.push(next));
        return item;
      }, []);
      for (let i = 0; i < list3.length; i++) {
        if (list3[i].groupId == localStorage.getItem("groupId")) {
          list.push(list3[i]);
        }
      }
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list2.length; j++) {
          if (list[i].contractId === list2[j].contractId) {
            list[i].contractName = list2[j].contractName;
            list[i].contractAddress = list2[j].contractAddress;
            list[i].contractPath = list2[j].contractPath;
            list[i].contractStatus = list2[j].contractStatus;
            list[i].contractSource = list2[j].contractSource;
            list[i].contractAbi = list2[j].contractAbi;
            list[i].contractBin = list2[j].contractBin;
            list[i].bytecodeBin = list2[j].bytecodeBin;
          }
        }
      }
      return list;
    },
    /**
     * 新建文件成功事件
     */
    fileSucccess: function (val) {
      let num = 0;
      this.contractList.forEach((value) => {
        if (
          value.contractName == val.contractName &&
          value.contractPath == val.contractPath
        ) {
          this.$message({
            type: "error",
            message: this.$t("contracts.contractNameSameFail"),
          });
          num++;
        }
      });
      if (!num) {
        this.saveContract(val);
      }
      this.fileClose();
    },
    /**
     * 预处理合约路径列表
     */
    createFolder: function (val) {
      let result = [];
      this.folderList.forEach((value) => {
        let num = 0;
        let data = {
          contractName: value.folderName,
          folderId: value.folderId,
          contractActive: false,
          contractType: "folder",
          folderIcon: "el-icon-caret-right",
          folderActive: false,
          renameShow: false,
          inputShow: false,
        };
        this.contractArry.forEach((item) => {
          if (
            item.contractType == "folder" &&
            item.contractName == data.contractName
          ) {
            data.folderIcon = item.folderIcon;
            data.folderActive = item.folderActive;
            this.$set(data, "contractActive", data.contractActive);
          }
        });
        if (val && val.contractPath && val.contractPath != "/") {
          if (data.contractName == val.contractPath) {
            data.folderIcon = "el-icon-caret-bottom";
            data.folderActive = true;
            data.contractActive = true;
          }
        }
        result.push(data);
      });
      return result;
    },
    /**
     * 打开文件夹
     */
    open: function (val) {
      console.log(val);
      if (val.contractName != "/" && val.contractPath != "/") {
        this.getContracts(val.contractName, val);
      }
      this.contractArry.forEach((value) => {
        this.$set(value, "contractActive", false);
        if (value.contractType == "folder") {
          value.child.forEach((item) => {
            this.$set(item, "contractActive", false);
          });
        }
        if (
          value.contractName === val.contractName &&
          value.contractType == "folder"
        ) {
          this.$set(value, "contractActive", true);
        }
      });
      if (val.folderActive) {
        this.$set(val, "folderActive", false);
        this.$set(val, "folderIcon", "el-icon-caret-right");
      } else {
        this.$set(val, "folderActive", true);
        this.$set(val, "folderIcon", "el-icon-caret-bottom");
      }
      this.$set(val, "contractActive", true);
      this.folderData = val;
    },
    /**
     * 选中某个合约或文件夹
     */
    select: function (val, type) {
      console.log(val, type);
      if (!type) {
        this.$store.dispatch("set_selected_contracts_action", val);
        this.$store.dispatch("set_selected_contracts_info_action", val);
      }
      let num = 0;
      this.contractArry.forEach((value) => {
        if (val && val.contractId && value.contractId == val.contractId) {
          this.$set(value, "contractActive", true);
        } else if (value.contractType == "folder") {
          if (
            this.folderData &&
            this.folderData.contractName === value.contractName
          ) {
            this.$set(value, "contractActive", this.folderData.contractActive);
          } else {
            this.$set(value, "contractActive", false);
          }
          value.child.forEach((item) => {
            if (item.contractId == val.contractId) {
              this.$set(item, "contractActive", true);
            } else {
              this.$set(item, "contractActive", false);
            }
          });
        } else {
          this.$set(value, "contractActive", false);
        }
      });
      this.folderData = null;
      if (!type) {
        localStorage.setItem("selectData", JSON.stringify(val));
        Bus.$emit("select", val, this.Highlight);
      }
    },
    /**
     * 删除合约
     */
    deleteFile: function (val) {
      this.$confirm(this.$t("text.confirmDelete"))
        .then((_) => {
          this.deleteData(val);
        })
        .catch((_) => {});
    },
    /**
     * 删除合约请求
     */
    deleteData: function (val) {
      this.loading = true;
      let data = {
        groupId: localStorage.getItem("groupId"),
        contractId: val.contractId,
      };
      deleteCode(data, {})
        .then((res) => {
          if (res.data.code === 0) {
            let allContractList = this.$store.state.contractDataList;
            for (let i = 0; i < allContractList.length; i++) {
              if (allContractList[i].contractId == val.contractId) {
                allContractList.splice(i, 1);
              }
            }
            this.$store.dispatch("set_contract_dataList_action", []);
            let arry = [];

            for (let i = 0; i < this.contractArry.length; i++) {
              if (
                this.contractArry[i].contractType == "folder" &&
                this.contractArry[i].folderActive
              ) {
                arry.push(this.contractArry[i].contractName);
              }
            }
            // localStorage.setItem("contractList", JSON.stringify(allContractList))
            this.getContracts(arry);
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
    /**
     * 删除文件夹
     */
    deleteFolder: function (val) {
      this.$confirm(this.$t("text.confirmDelete"))
        .then((_) => {
          this.deleteFolderData(val);
        })
        .catch((_) => {});
    },
    /**
     * 删除文件夹请求
     */
    deleteFolderData: function (val) {
      this.loading = true;
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        contractPath: val.contractName,
      };
      deletePath(reqData)
        .then((res) => {
          // this.loading = false
          if (res.data.code === 0) {
            let allContractList = this.$store.state.contractDataList;
            let contractList = [];
            for (let i = 0; i < allContractList.length; i++) {
              if (allContractList[i].contractPath == val.folderName) {
                allContractList.srue = true;
              }
            }
            for (let i = 0; i < allContractList.length; i++) {
              if (!allContractList.srue) {
                contractList.push(allContractList[i]);
              }
            }
            this.$store.dispatch("set_contract_dataList_action", []);
            let arry = [];

            for (let i = 0; i < this.contractArry.length; i++) {
              if (
                this.contractArry[i].contractType == "folder" &&
                this.contractArry[i].folderActive
              ) {
                arry.push(this.contractArry[i].contractName);
              }
            }
            // localStorage.setItem("contractList", JSON.stringify(allContractList))
            this.getContractPaths(arry);
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
    exportFile(val) {
      this.$confirm(`${this.$t("contracts.sureExport")}？`)
        .then((_) => {
          this.sureExportSol(val);
        })
        .catch((_) => {});
    },
    sureExportSol(val) {
      const zip = new JSZip();
      let contractSource = Base64.decode(val.contractSource);
      let contractAbi = val.contractAbi;
      let contractBin = val.bytecodeBin;
      var blobContractSource = new Blob([contractSource], {
        type: "text;charset=utf-8",
      });
      var blobContractAbi = new Blob([contractAbi], {
        type: "text;charset=utf-8",
      });
      var blobContractBin = new Blob([contractBin], {
        type: "text;charset=utf-8",
      });
      if (this.liquidCheck) {
        zip.file(`${val.contractName}.rs`, blobContractSource, {
          binary: true,
        });
      } else {
        zip.file(`${val.contractName}.sol`, blobContractSource, {
          binary: true,
        });
      }
      zip.file(`${val.contractName}.abi`, blobContractAbi, { binary: true });
      zip.file(`${val.contractName}.bin`, blobContractBin, { binary: true });
      zip.generateAsync({ type: "blob" }).then((content) => {
        FileSaver.saveAs(content, `${val.contractName}`);
      });
    },
    exportFolder(val) {
      this.$confirm(`${this.$t("contracts.sureExport")}？`)
        .then((_) => {
          this.sureExportFolderSol(val);
        })
        .catch((_) => {});
    },
    sureExportFolderSol(val) {
      this.loading = true;
      let data = {
        groupId: localStorage.getItem("groupId"),
        contractPathList: [val.contractName],
      };
      searchContract(data).then((res) => {
        if (res.data.code == 0) {
          this.loading = false;
          var contractList = res.data.data;
          const zip = new JSZip();
          if (contractList.length > 0) {
            contractList.forEach((item) => {
              var blobContractSource = new Blob(
                [Base64.decode(item.contractSource)],
                { type: "text;charset=utf-8" }
              );
              var blobContractAbi = new Blob([item.contractAbi], {
                type: "text;charset=utf-8",
              });
              var blobContractBin = new Blob([item.bytecodeBin], {
                type: "text;charset=utf-8",
              });
              if (this.liquidCheck) {
                zip.file(`${val.contractName}.rs`, blobContractSource, {
                  binary: true,
                });
              } else {
                zip.file(`${val.contractName}.sol`, blobContractSource, {
                  binary: true,
                });
              }
              zip.file(`${item.contractName}.abi`, blobContractAbi, {
                binary: true,
              });
              zip.file(`${item.contractName}.bin`, blobContractBin, {
                binary: true,
              });
            });
            zip.generateAsync({ type: "blob" }).then((content) => {
              FileSaver.saveAs(content, `${val.contractName}`);
            });
          } else {
            this.$message({
              type: "warning",
              message: this.$t("text.emptyFolder"),
              duration: 2000,
            });
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

    javaProjectComplie(val) {
      Bus.$emit("javaProjectComplie", val);
    },
     uploading(){
     this.$refs.file.click()   
    }
  },
};
</script>
<style scoped>
.icon {
  font-weight: bold;
}
.contract-menu-header {
  /* position: relative; */
  width: calc(100% + 1px);
  height: 48px;
  line-height: 48px;
  border-bottom: 2px solid #e7ebf0;
}
.contract-icon {
  vertical-align: middle;
  padding-left: 10px;
  cursor: pointer;
}
.checkContract-upload {
  display: block;
  position: absolute;
  height: 30px;
  left: 0;
  margin-top: -30px;
  width: 100%;
  opacity: 0;
  z-index: 9;
  cursor: pointer;
}
.contract-file {
  position: relative;
  padding-left: 25px;
}
.contract-folder {
  position: relative;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.contract-folder i {
  cursor: pointer;
}
.contract-file span {
  cursor: pointer;
}
.contract-file i {
  cursor: pointer;
}
.uploads {
  position: absolute;
  width: 0px;
  height: 0px;
  left: 10px;
  top: 0;
  opacity: 0;
  z-index: 999;
  font-size: 0;
  cursor: pointer;
}
.colorActive {
  color: rgb(55, 238, 242);
}
.contract-delete {
  padding-left: 20px;
  font-weight: 100;
  font-size: 16px;
}
.contract-file-handle {
  position: absolute;
  width: 60px;
  top: 24px;
  padding: 10px;
  background-color: #fff;
  z-index: 9999;
  box-shadow: 1px 1px 1px;
}
.contract-menu-content {
  overflow: auto;
  height: calc(100% - 110px);
  padding-bottom: 60px;
}
.contract-menu-content >>> .el-input__inner {
  width: 100px;
  height: 24px;
  line-height: 24px;
  padding: 0 5px;
}
.contract-menu-handle {
  position: fixed;
  font-size: 0;
  width: 100px;
  /* top: 0; */
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  vertical-align: middle;
  background-color: #fff;
  box-shadow: 1px 4px 4px 1px;
  z-index: 9999;
}
.contract-menu-handle li {
  font-size: 12px;
  height: 30px;
  line-height: 30px;
  padding-left: 8px;
}
.contract-menu-handle-list {
  cursor: pointer;
  color: #666;
}
.contract-menu-handle-list:hover {
  color: rgb(55, 238, 242);
}
.langChoose {
  width: 110px;
  padding-left: 7px;
}
.el-loading-mask {
  position: absolute;
  z-index: 2000;
  background-color: rgba(255, 255, 255, 0.9);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}
</style>


