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
    <div>
        <el-dialog :title="$t('contracts.createFile')" :visible.sync="dialogVisible" :before-close="modelClose" class="dialog-wrapper" width="433px" :center="true">
            <div>
                <el-form :model="fileFrom" :rules="rules" ref="fileFrom" label-width="116px" class="demo-ruleForm">
                    <el-form-item :label="$t('contracts.contractName')" prop="contractName">
                        <el-input v-model="fileFrom.contractName" style="width: 210px"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('contracts.filePath')">
                        <el-select v-model="fileFrom.contractType" :disabled="disabled" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.folderName" :label="item.folderName" :value="item.folderName">
                            </el-option>
                        </el-select>
                    <!-- <span class="contract-code-done"  @click='addFolder' style="float:right;">
                        <span target="_blank" style="cursor: pointer;text-decoration:underline;">{{this.$t('dialog.newFile')}}</span>
                    </span> -->
                    </el-form-item>
                </el-form>
            </div>
            <div class="text-right sure-btn" style="margin-top: 10px">
                <el-button @click="modelClose">{{
                    this.$t("text.cancel")
                }}</el-button>
                <el-button type="primary" @click="submit('fileFrom')">{{
                    this.$t("text.sure")
                }}</el-button>
            </div>
        </el-dialog>
         <add-folder v-if="foldershow" :foldershow="foldershow"  :isAddFile="isAddFile" @close='folderClose'></add-folder>
    </div>
</template>
<script>
import { subStringToNumber } from "@/util/util";
import { getContractPathList, addContractPath } from "@/util/api";
import addFolder from "../dialog/addFolder"
export default {
    name: "addFile",
    props: ["fileshow", "data", "id"],
    components: {
        "add-folder": addFolder
    },
    computed: {
        rules() {
            let data = {
                contractName: [
                    {
                        required: true,
                        message: this.$t("rule.contractName"),
                        trigger: "blur",
                    },
                    {
                        min: 1,
                        max: 32,
                        message: this.$t("rule.contractLong"),
                        trigger: "blur",
                    },
                    {
                        pattern: /^[A-Za-z0-9_]+$/,
                        message: this.$t("rule.contractRule"),
                        trigger: "blur",
                    },
                ],
            };
            return data;
        },
    },
    data: function () {
        return {
            dialogVisible: this.fileshow,
            fileFrom: {
                contractName: "",
                contractType: "",
            },
            disabled: false,
            folderId: this.id,
            options: [],
            pathList: [],
            folderList: [],
            userFolader: "",
            foldershow: false, 
            isAddFile: ""
        };
    },
    mounted: function () {
        if (localStorage.getItem("root") === "developer") {
            this.userFolader = localStorage.getItem("user");
        }
        this.getContractPaths();
    },
    methods: {
        addPath() {
            let reqData = {
                contractPath: this.userFolader,
                groupId: localStorage.getItem("groupId"),
            };
            addContractPath(reqData)
                .then((res) => {
                    if (res.data.code === 0) {
                        this.getContractPaths();
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
                        message: this.$t("text.systemError"),
                    });
                });
        },
        getContractPaths() {
            getContractPathList(localStorage.getItem("groupId"))
                .then((res) => {
                    if (res.data.code == 0) {
                        this.pathList = res.data.data;
                        let num = 0;
                        this.folderList = [];
                        if (localStorage.getItem("root") === "developer") {
                            for (let i = 0; i < this.pathList.length; i++) {
                                if (this.pathList[i].contractPath != "/") {
                                    let item = {
                                        folderName: this.pathList[i]
                                            .contractPath,
                                        folderId:
                                            new Date().getTime() +
                                            this.pathList[i].contractPath,
                                        folderActive: false,
                                        groupId: localStorage.getItem(
                                            "groupId"
                                        ),
                                        modifyTime: this.pathList[i].modifyTime,
                                    };
                                    this.folderList.push(item);
                                }
                                if (
                                    this.pathList[i].contractPath ==
                                    this.userFolader
                                ) {
                                    num++;
                                }
                            }
                        } else {
                            for (let i = 0; i < this.pathList.length; i++) {
                                let item = {
                                    folderName: this.pathList[i].contractPath,
                                    folderId:
                                        new Date().getTime() +
                                        this.pathList[i].contractPath,
                                    folderActive: false,
                                    groupId: localStorage.getItem("groupId"),
                                    modifyTime: this.pathList[i].modifyTime,
                                };
                                this.folderList.push(item);
                                if (
                                    this.pathList[i].contractPath ==
                                    this.userFolader
                                ) {
                                    num++;
                                }
                            }
                        }
                        if (
                            num == 0 &&
                            localStorage.getItem("root") === "developer"
                        ) {
                            this.addPath();
                        } 
                        this.changeOptions();
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
                        message: this.$t("text.systemError"),
                    });
                });
        },
        changeOptions: function () {
            this.options = [];
            for (let i = 0; i < this.folderList.length; i++) {
                if (
                    (!this.folderList[i].folderName ||
                        this.folderList[i].folderName == "/") &&
                    localStorage.getItem("root") === "developer"
                ) {
                    this.folderList.splice(i, 1);
                }
            }
            this.options = this.folderList;
            if (
                this.folderList.length === 0 &&
                localStorage.getItem("root") !== "developer"
            ) {
                this.options = [
                    {
                        folderName: "/",
                        folderId: new Date().getTime(),
                    },
                ];
            } else if (
                this.folderList.length === 0 &&
                localStorage.getItem("root") === "developer"
            ) {
                this.options = [
                    {
                        folderName: this.userFolader,
                        folderId: new Date().getTime(),
                    },
                ];
            }
            this.fileFrom.contractType = this.options[0].folderName;
            for (let i = 0; i < this.options.length; i++) {
                if (this.data && this.options[i].folderName == this.data.contractName) {
                    this.fileFrom.contractType = this.options[i].folderName;
                }
            }
            let num = 0;
            for (let i = 0; i < this.options.length; i++) {
                if (this.options[i].folderName == "/") {
                    num++;
                }
            }
            if (num == 0 && localStorage.getItem("root") !== "developer") {
                this.options.unshift({
                    folderName: "/",
                    folderId: new Date().getTime(),
                });
            }
        },
        submit: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        contractName: this.fileFrom.contractName,
                        contractSource: "",
                        contractPath: this.fileFrom.contractType,
                        contractType: "file",
                        contractActive: false,
                        contractstatus: 0,
                        contractAbi: "",
                        contractBin: "",
                        contractAddress: "",
                        contractVersion: "",
                        contractNo: new Date().getTime(),
                    };
                    this.$emit("success", data);
                } else {
                    return false;
                }
            });
        },
        modelClose: function () {
            this.$emit("close");
        },
          /**
         * 关闭文件夹弹窗
         */
        folderClose: function () {
            this.getContractPaths();
            this.foldershow = false
        },
        /**
         * 新增文件夹 打开文件夹弹窗
         */
        addFolder: function () {
            // this.checkNull();
            this.foldershow = true
        },
        //   /**
        //  * @method 点击任意处清除右键弹窗
        //  */
        // checkNull: function (list) {
        //     this.contractArry.forEach(value => {
        //         value.handleModel = false;
        //         if (value.contractType == 'folder') {
        //             value.child.forEach(list => {
        //                 list.handleModel = false;
        //             })
        //         }
        //     })
        //     this.ID = "";
        //     this.contractFile = false;
        //     this.contractFolder = false;
        //     this.handleModel = false;
        // },
    },
};
</script>
