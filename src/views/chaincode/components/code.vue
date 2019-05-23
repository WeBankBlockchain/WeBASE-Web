/*
 * Copyright 2014-2019 the original author or authors.
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
    <div class="contract-code" :class="{changeActive:changeWidth }" v-loading="loading">
        <div class="contract-code-head">
            <span class="contract-code-title" v-show="codeShow" :class="{titleActive:changeWidth }">{{contractName + '.sol'}}</span>
            <span class="contract-code-handle" v-show="codeShow">
                <span class="contract-code-done" @click="save" v-if="status !== 2 && !disabled">
                    <i class="wbs-icon-baocun font-16"></i>
                    <span>保存</span>
                </span>
                <span class="contract-code-done contract-code-nodone" v-if="status !== 2 && disabled">
                    <i class="wbs-icon-baocun font-16"></i>
                    <span>保存</span>
                </span>
                <span class="contract-code-done" @click="compile" v-if="status !== 2 && !disabled">
                    <i class="wbs-icon-bianyi font-16"></i>
                    <span>编译</span>
                </span>
                <span class="contract-code-done" @click="deploying" v-if="abiFile && status != 2 && !disabled">
                    <i class="wbs-icon-deploy font-16"></i>
                    <span>部署</span>
                </span>
                <span class="contract-code-done" v-if="status === 2 && !disabled" @click="send">
                    <i class="wbs-icon-send font-16"></i>
                    <span>发交易</span>
                </span>
            </span>
        </div>
        <div class="contract-code-content" :class="{infoHide: !successHide}">
            <div class="contract-code-mirror" :style="{height:codeHight}" ref="codeContent">
                <div style="padding-top: 60px;text-align:center;" v-show="!codeShow">
                    <span>请在左侧面板点击打开一个合约或新建一个合约</span>
                </div>
                <div class="ace-editor" ref="ace" v-show="codeShow"></div>
            </div>
            <div class="contract-info" v-show="successHide" :style="{height:infoHeight + 'px'}">
                <div class="move" @mousedown="dragDetailWeight($event)" @mouseup="resizeCode"></div>
                <div class="contract-info-title">
                    <i class="wbs-icon-clear float-right" @click="refreshMessage" title="清除"></i>
                </div>
                <div>
                    <div class="contract-info-list1" v-html="compileinfo">
                    </div>
                    <div class="contract-info-list1" style="color: #f00" v-show="errorInfo">
                        {{errorInfo}}
                    </div>
                    <div class="contract-info-list1" style="color: #f00" v-show="errorInfo">
                        <span style="display:inline-block;width:calc(100% - 120px);word-wrap:break-word">{{errorMessage}}</span>
                    </div>
                    <div style="color: #68E600;padding-bottom: 15px;" v-show="abiFileShow">{{successInfo}}</div>
                    <div class="contract-info-list" v-show="contractAddress">
                        <span class="contract-info-list-title" style="color: #0B8AEE">contractAddress </span>
                        <span style="display:inline-block;width:calc(100% - 120px);word-wrap:break-word">{{contractAddress}}</span>
                    </div>
                    <div class="contract-info-list" v-show="abiFile">
                        <span class="contract-info-list-title" style="color: #0B8AEE">contractName </span>
                        <span style="display:inline-block;width:calc(100% - 120px);word-wrap:break-word">{{contractName}}</span>
                    </div>
                    <div class="contract-info-list" v-show="abiFile">
                        <span class="contract-info-list-title" style="color: #0B8AEE">abi</span>
                        <span style="display:inline-block;width:calc(100% - 120px);word-wrap:break-word">{{abiFile}}</span>
                    </div>
                    <div class="contract-info-list" style="border-bottom: 1px solid #e8e8e8" v-show="abiFile">
                        <span class="contract-info-list-title" style="color: #0B8AEE">bin</span>
                        <span style="display:inline-block;width:calc(100% - 120px);word-wrap:break-word">{{bin}}</span>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="发送交易" :visible.sync="dialogVisible" width="500px" :before-close="sendClose" v-if="dialogVisible" center class="send-dialog">
            <v-transaction @success="sendSuccess" @close="handleClose" ref="send" :data="data" :abi='abiFile'></v-transaction>
        </el-dialog>
        <el-dialog title="选择用户" :visible.sync="dialogUser" width="400px" v-if="dialogUser" center class="send-dialog">
            <v-user @change="deployContract($event)" @close="userClose" :abi='abiFile'></v-user>
        </el-dialog>
    </div>
</template>

<script>
import ace from "ace-builds";
// import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/ext-language_tools";
require("ace-mode-solidity/build/remix-ide/mode-solidity");
let Mode = require("ace-mode-solidity/build/remix-ide/mode-solidity").Mode;
import errcode from "@/util/errcode";
let Base64 = require("js-base64").Base64;
let wrapper = require("solc/wrapper");
let solc = wrapper(window.Module);
import constant from "@/util/constant";
import {
    addChaincode,
    getDeployStatus,
    setCompile,
    editChain
} from "@/util/api";
import transaction from "../dialog/sendTransaction";
import changeUser from "../dialog/changeUser";

export default {
    name: "codes",
    props: ["data", "show", "changeStyle"],
    components: {
        "v-transaction": transaction,
        "v-user": changeUser
    },
    data: function() {
        return {
            successHide: true,
            loading: false,
            content: "",
            successShow: true,
            errorShow: false,
            dialogVisible: false,
            code: "",
            status: 0,
            abiFile: "",
            bin: "",
            contractAddress: "",
            contractName: "",
            infoHeight: 250,
            contractList: [],
            dialogUser: false,
            compileinfo: "",
            errorInfo: "",
            errorMessage: "",
            successInfo: "",
            abiFileShow: false,
            bytecodeBin: "",
            aceEditor: null,
            themePath: "ace/theme/chrome",
            modePath: "ace/mode/solidity",
            disabled: false
        };
    },
    mounted: function() {
        this.initEditor();
        if(localStorage.getItem("root") === "admin"){
            this.disabled = false
        }else{
            this.disabled = true
        }
    },
    watch: {
        data: function(val) {
            this.refreshMessage();
            this.code = "";
            this.status = null;
            this.abiFile = "";
            this.contractAddress = "";
            this.errorMessage = "";
            this.contractName = "";
            this.content = "";
            this.bin = "";
            this.code = Base64.decode(val.contractSource);
            this.content = this.code;
            this.aceEditor.setValue(this.content);
            this.status = val.contractStatus;
            this.abiFile = val.contractAbi;
            this.contractAddress = val.contractAddress;
            this.errorMessage = val.description || "";
            this.contractName = val.contractName;
            this.bin = val.contractBin;
            this.bytecodeBin = val.bytecodeBin;
        },
        successHide: function(val) {
            if (val) {
                this.infoHeight = 250;
            } else {
                this.infoHeight = 0;
            }
        }
    },
    computed: {
        codeHight: function() {
            if (this.infoHeight) {
                return `calc(100% - ${this.infoHeight}px)`;
            } else {
                return `100%`;
            }
        },
        changeWidth() {
            if (this.changeStyle) {
                return this.changeStyle;
            } else {
                return false;
            }
        },
        codeShow() {
            return this.show;
        },
        tipShow() {
            return !this.show;
        }
    },
    methods: {
        initEditor: function() {
            this.aceEditor = ace.edit(this.$refs.ace, {
                fontSize: 14,
                fontFamily: "Consolas,Monaco,monospace",

                theme: this.themePath,
                mode: this.modePath,
                tabSize: 4,
                useSoftTabs: true
            });
            this.aceEditor.setOptions({
                enableSnippets: true,
                enableLiveAutocompletion: true,
                enableBasicAutocompletion: true,
                autoScrollEditorIntoView: true,
                copyWithEmptySelection: true
            });
            let editor = this.aceEditor.alignCursors();
            this.aceEditor.getSession().setUseWrapMode(true);
            this.aceEditor.getSession().on("change", this.changeAce);
            this.aceEditor.resize();
        },
        resizeCode: function() {
            this.aceEditor.setOptions({
                maxLines:
                    Math.ceil(this.$refs.codeContent.offsetHeight / 17) - 1
            });
            this.aceEditor.resize();
        },
        dragDetailWeight: function(e) {
            let startY = e.clientY,
                infoHeight = this.infoHeight;
            document.onmousemove = e => {
                let moveY = startY - e.clientY;
                this.infoHeight = infoHeight + moveY;
            };
            document.onmouseup = e => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
            this.aceEditor.setOptions({
                maxLines:
                    Math.ceil(this.$refs.codeContent.offsetHeight / 17) - 1,
                minLines: 9
            });
        },
        sendSuccess: function() {
            this.dialogVisible = false;
        },
        changeAce: function() {
            this.content = this.aceEditor.getSession().getValue();
        },
        save: function() {
            if (this.content && !this.data.contractId) {
                this.addContract();
            } else if (this.content) {
                this.editContract();
            } else {
                this.$message({
                    message: "合约内容为空！",
                    type: "warning"
                });
            }
        },
        findImports: function(path) {
            this.contractList = JSON.parse(
                localStorage.getItem("contractList")
            );
            let arry = path.split("/");
            let newpath = arry[arry.length - 1];
            let num = 0;
            for (let i = 0; i < this.contractList.length; i++) {
                if (newpath == this.contractList[i].contractName + ".sol") {
                    return {
                        contents: Base64.decode(
                            this.contractList[i].contractSource
                        )
                    };
                } else {
                    num++;
                }
            }
            if (num == this.contractList.length) {
                return { error: "File not found" };
            }
        },
        compile: function() {
            this.refreshMessage();
            for (let i = 0; i < constant.COMPILE_INFO.length; i++) {
                this.compileinfo = this.compileinfo + constant.COMPILE_INFO[i];
            }
            this.contractList = JSON.parse(
                localStorage.getItem("contractList")
            );
            let content = "";
            let output;
            let input = {
                language: "Solidity",
                settings: {
                    outputSelection: {
                        "*": {
                            "*": ["*"]
                        }
                    }
                }
            };
            input.sources = {};
            input.sources[this.contractName + ".sol"] = {};
            let libs = [];
            input.sources[this.contractName + ".sol"] = {
                content: this.content
            };
            try {
                output = JSON.parse(
                    solc.compileStandard(
                        JSON.stringify(input),
                        this.findImports
                    )
                );
            } catch (error) {
                this.errorInfo = "合约编译失败！";
                this.errorMessage = error;
                this.compileShow = true;
            }
            if (output && JSON.stringify(output.contracts) != "{}") {
                this.status = 1;
                if (output.contracts[this.contractName + ".sol"]) {
                    this.changeOutput(
                        output.contracts[this.contractName + ".sol"]
                    );
                }
            } else {
                this.errorMessage = output.errors[0];
                this.errorInfo = "合约编译失败！";
            }
        },
        changeOutput: function(obj) {
            let arry = [];
            let data = null;
            if (JSON.stringify(obj) !== "{}") {
                for (const key in obj) {
                    arry.push(obj[key]);
                }
                if (arry.length) {
                    this.abiFileShow = true;
                    this.successInfo = "< 编译成功！";
                    this.abiFile = arry[0].abi;
                    this.abiFile = JSON.stringify(this.abiFile);
                    this.bin = arry[0].evm.deployedBytecode.object;
                    this.bytecodeBin = arry[0].evm.bytecode.object;
                } else {
                    this.errorInfo = "合约编译失败！";
                    this.compileShow = true;
                }
            } else {
                this.errorInfo = "合约编译失败！";
                this.compileShow = true;
            }
        },
        refreshMessage: function() {
            this.abiFileShow = false;
            this.errorInfo = "";
            this.compileinfo = "";
            this.abiFile = "";
            this.contractAddress = "";
        },
        deploying: function() {
            this.dialogUser = true;
        },
        userClose: function() {
            this.dialogUser = false;
        },
        deployContract(val) {
            this.loading = true;
            let reqData = {
                networkId: localStorage.getItem("networkId"),
                contractBin: this.bin,
                bytecodeBin: this.bytecodeBin,
                contractAbi: this.abiFile,
                contractSource: Base64.encode(this.content),
                userId: val.userId
            };
            if (!this.data.contractId) {
                reqData.contractName = this.contractName;
                reqData.contractVersion = this.data.contractVersion;
            } else {
                reqData.contractId = this.data.contractId;
            }
            if (val.params.length) {
                reqData.constructorParams = val.params;
            }
            getDeployStatus(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.abiFileShow = true;
                        this.$emit("deploy", res.data.data.contractId);
                        this.status = res.data.data.contractStatus;
                        this.successInfo = "< 部署成功！";
                        this.abiFile = res.data.data.contractAbi;
                        this.bin = res.data.data.contractBin;
                        this.$message({
                            message: "合约部署成功！",
                            type: "success"
                        });
                    } else {
                        this.status = 3;
                        this.$message({
                            message: errcode.errCode[res.data.code].cn,
                            type: "error"
                        });
                    }
                })
                .catch(err => {
                    this.status = 3;
                    this.loading = false;
                    this.$message({
                        message: "系统错误",
                        type: "error"
                    });
                });
        },
        addContract: function() {
            this.loading = true;
            let reqData = {
                networkId: localStorage.getItem("networkId"),
                contractName: this.contractName,
                contractBin: this.bin,
                bytecodeBin: this.bytecodeBin,
                contractVersion: this.data.contractVersion,
                contractSource: Base64.encode(this.content)
            };
            if (this.abiFile) {
                reqData.contractAbi = this.abiFile;
            }
            addChaincode(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.status = res.data.data.contractStatus;
                        this.abiFile = res.data.data.contractAbi || "";
                        this.contractAddress = res.data.data.contractAddress || "";
                        this.$message({
                            message: "合约保存成功！",
                            type: "success"
                        });
                        this.$emit("add", res.data.data);
                    } else {
                        this.$message({
                            message: errcode.errCode[res.data.code].cn,
                            type: "error"
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.$message({
                        message: "系统错误",
                        type: "error"
                    });
                });
        },
        editContract: function() {
            let reqData = {
                networkId: localStorage.getItem("networkId"),
                contractId: this.data.contractId,
                contractBin: this.bin,
                bytecodeBin: this.bytecodeBin,
                contractSource: Base64.encode(this.content)
            };
            if (this.abiFile) {
                reqData.contractAbi = this.abiFile;
            }
            editChain(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            message: "合约保存成功！",
                            type: "success"
                        });
                        this.$emit("add", res.data.data);
                    } else {
                        this.$message({
                            message: errcode.errCode[res.data.code].cn,
                            type: "error"
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: "系统错误",
                        type: "error"
                    });
                });
        },
        foldInfo: function(val) {
            this.successHide = val;
        },
        send: function() {
            this.dialogVisible = true;
        },
        handleClose: function() {
            this.dialogVisible = false;
        },
        sendClose: function() {
            this.$refs.send.close();
        }
    }
};
</script>
<style scoped>
.contract-code {
    height: 100%;
    border-left: 1px solid #eee;
    box-sizing: border-box;
}
.changeActive {
    padding-left: 0 !important;
}
.contract-code-head {
    width: 100%;
    height: 48px;
    line-height: 48px;
    border-bottom: 2px solid #e7ebf0;
    background-color: #fff;
    overflow: hidden;
}
.contract-code-done {
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
}
.contract-code-nodone{
    cursor:none
}
.contract-code-done i {
    vertical-align: middle;
}
.contract-code-done span {
    font-size: 12px;
    color: #9da2ab;
    vertical-align: middle;
}
.contract-no-content {
    border-left: 1px solid #e7ebf0;
    height: calc(100% - 50px);
    box-sizing: border-box;
}
.contract-code-content {
    border-left: 1px solid #e7ebf0;
    height: calc(100% - 50px);
    box-sizing: border-box;
}
.contract-code-mirror {
    width: 100%;
    height: 70%;
}
.contract-info {
    position: relative;
    padding-top: 20px;
    text-align: left;
    border-top: 1px solid #ddd;
    box-sizing: border-box;
    overflow: auto;
}
.contract-info-content {
    height: 100%;
    overflow-y: scroll;
    box-sizing: border-box;
}
.contract-code-title {
    float: left;
    font-weight: bold;
    font-size: 18px;
    color: #36393d;
    padding-left: 20px;
}
.contract-code-handle {
    float: right;
    padding-right: 20px;
}
.contract-info-title {
    padding-right: 20px;
}
.move {
    position: absolute;
    width: 100%;
    height: 3px;
    top: 0;
    left: 0;
    z-index: 9999;
    cursor: s-resize;
}
.contract-info-title i {
    padding-left: 8px;
    font-size: 10px;
    color: #aeb1b5;
    cursor: pointer;
}
.contract-info-title span {
    font-size: 16px;
    font-weight: bold;
    color: #36393d;
}
.contract-info-list {
    padding: 5px 20px;
    width: 90%;
    margin: 0 auto;
    border: 1px solid #e8e8e8;
    border-bottom: none;
}
.contract-info-list-title {
    display: inline-block;
    width: 100px;
    vertical-align: top;
}
.ace-editor {
    height: 100% !important;
    position: relative;
    text-align: left;
    letter-spacing: 0.1px;
    text-rendering: geometricPrecision;
    font-feature-settings: "liga" 0;
    font-variant-ligatures: none;
    font: 14px/normal "Monaco", "Menlo", "Ubuntu Mono", "Consolas",
        "source-code-pro", monospace !important;
}
.ace-editor>>>.ace_print-margin {
    display: none;
    text-rendering: geometricPrecision;
}
.infoHide {
    height: calc(100% - 50px);
}
.code-spread {
    position: absolute;
    width: 33px;
    height: 33px;
    line-height: 33px;
    left: 412px;
    bottom: 0;
    border: 1px solid #e8e8e8;
    color: #aeb1b5;
    background-color: #fff;
    text-align: center;
    z-index: 9999;
    cursor: pointer;
}
.code-spread i {
    font-size: 12px;
}
.contract-info {
    background-color: #fff;
}
.titleActive {
    padding-left: 40px;
}
.send-dialog /deep/ .el-dialog--center .el-dialog__body{
    padding: 5px 25px 20px;
}
</style>
