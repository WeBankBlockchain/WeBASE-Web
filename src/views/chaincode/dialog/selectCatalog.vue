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
        <el-dialog title="选择目录" :visible.sync="dialogVisible" :before-close="close" class="dialog-wrapper" width="433px" :center="true">
            <div>
                <el-form :model="folderFrom" :rules="rules" ref="folderFrom" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="文件夹名称" prop="folderName" style="width: 330px">
                        <el-select v-model="folderFrom.folderName" placeholder="请选择" class="block-network">
                            <el-option v-for="item in options" :key="item.folderName" :label="item.folderName" :value="item.folderName">
                            </el-option>
                        </el-select>
                    <span class="contract-code-done"  @click='addFolder' style="float:right;margin-right:-55px">
                        <a target="_blank" style="font-size:12px;cursor:pointer;text-decoration:underline;">{{this.$t('contracts.createFolder')}}</a>
                    </span>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="submit('folderFrom')">确 定</el-button>
            </div>
        </el-dialog>
         <add-folder v-if="foldershow" :foldershow="foldershow" :isAddFile="isAddFile" @close='folderClose'  @success='folderSuccess'></add-folder>
    </div>
</template>
<script>
import { subStringToNumber } from "@/util/util";
import { getContractPathList } from "@/util/api";
import addFolder from "../dialog/addFolder"
export default {
    name: "selectCatalog",
    props: ["show"],
    components: {
        "add-folder": addFolder
    },
    data: function () {
        return {
            options: [],
            folderFrom: {
                folderName: "", 
            },
            rules: {
                folderName: [
                    {
                        required: true,
                        message: "请选择文件夹",
                        trigger: "blur",
                    },
                ],
            },
            dialogVisible: this.show,
            pathList: [],
            folderList: [],
            userFolader: "", 
            foldershow: false,
            isAddFile:""
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
                                        folderName: this.pathList[i].contractPath,
                                        folderId: new Date().getTime() + this.pathList[i].contractPath,
                                        folderActive: false,
                                        groupId: localStorage.getItem("groupId"),
                                        modifyTime: this.pathList[i].modifyTime,
                                    };
                                    this.folderList.push(item);
                                }
                                if (this.pathList[i].contractPath == this.userFolader) {
                                    num++;
                                }
                            }
                        } else {
                            for (let i = 0; i < this.pathList.length; i++) {
                                let item = {
                                    folderName: this.pathList[i].contractPath,
                                    folderId: new Date().getTime() + this.pathList[i].contractPath,
                                    folderActive: false,
                                    groupId: localStorage.getItem("groupId"),
                                    modifyTime: this.pathList[i].modifyTime,
                                };
                                this.folderList.push(item);
                                if (this.pathList[i].contractPath == this.userFolader) {
                                    num++;
                                }
                            }
                        }
                        // if (num == 0 && localStorage.getItem("root") === "developer") {
                        //     console.log(11111);
                        //     this.addPath();
                        // } 
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
            console.log(this.folderList);
            for (let i = 0; i < this.folderList.length; i++) {
                if ((!this.folderList[i].folderName || this.folderList[i].folderName == "/") && localStorage.getItem("root") === "developer") {
                    this.folderList.splice(i, 1);
                }
            }
            this.options = this.folderList;
            if (this.folderList.length === 0 && localStorage.getItem("root") !== "developer") {
                this.options = [
                    {
                        folderName: "/",
                        folderId: new Date().getTime(),
                    },
                ];
            } else if (this.folderList.length === 0 && localStorage.getItem("root") === "developer") {
                this.options = [
                    {
                        folderName: this.userFolader,
                        folderId: new Date().getTime(),
                    },
                ];
            }
            let num = 0
            for (let i = 0; i < this.options.length; i++) {
                if (this.options[i].folderName == "/") {
                    num++
                }
            }
            if (num == 0 && localStorage.getItem("root") !== "developer") {
                this.options.unshift(
                    {
                        folderName: "/",
                        folderId: new Date().getTime(),
                    }
                )
            }
        },
        submit: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit("success", this.folderFrom.folderName);
                } else {
                    return false;
                }
            });
        },
        close: function () {
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
        folderSuccess(){
             this.folderClose()
           
        }
    },
};
</script>

