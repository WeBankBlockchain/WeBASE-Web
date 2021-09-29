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
        <el-dialog :title="$t('contracts.createFolder')" :visible.sync="dialogVisible" :before-close="modelClose" class="dialog-wrapper" width="450px" :center="true">
            <div>
                <el-form :model="folderFrom" :rules="rules" ref="folderFrom" label-width="110px" class="demo-ruleForm">

                    <el-form-item :label="$t('contracts.folderName')" prop="folderName" style="width:400px" class="add-folder">
                        <span style="color: #a3a3a3">{{userFolader}}</span>
                        <el-input v-model="folderFrom.folderName" @keyup.enter.native="handleFolder"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="text-right sure-btn" style="margin-top:10px">
                <el-button @click="modelClose">{{this.$t("text.cancel")}}</el-button>
                <el-button type="primary" @click="submit('folderFrom')">{{this.$t("text.sure")}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { addContractPath } from "@/util/api"
export default {
    name: "addFolder",
    props: ['foldershow','isAddFile'],
    computed: {
        rules() {
            let data = {
                folderName: [
                    {
                        required: true,
                        message: this.$t("rule.folderName"),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 12,
                        message: this.$t("rule.folderLong"),
                        trigger: "blur"
                    },
                    {
                        pattern: /^[A-Za-z0-9_]+$/,
                        message: this.$t("rule.folderRule"),
                        trigger: "blur"
                    }
                ]
            }
            return data
        }
    },
    data: function () {
        return {
            folderFrom: {
                folderName: ""
            },
            dialogVisible: this.foldershow,
            folderList: [],
            userFolader: "",
            pathList: [],
        }
    },
    mounted: function () {
        if (localStorage.getItem("root") === 'developer') {
            this.userFolader = localStorage.getItem("user") + "_"
        } else {
            this.userFolader = ""
        }
    },
    methods: {


        submit: function (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.add()
                } else {
                    return false;
                }
            })
        },
        add: function () {
            let reqData = {
                contractPath: this.userFolader + this.folderFrom.folderName,
                groupId: localStorage.getItem("groupId")
            }
            addContractPath(reqData).then(res => {
                if (res.data.code === 0) {
                    // this.$emit("success")
                     this.addSuccess();
                } else {
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    });
                });
        },
        // modelClose: function () {
        //     // this.$emit("close")
        // },
          addSuccess:function(){
             this.$emit("success");
        },
        modelClose: function () {
            this.folderFrom = {
                folderName: ""
            }
            if(this.isAddFile == 'isAddFile'){
                this.$emit("folderClose");
            }else{
                this.$emit("close");
            }
        //    this.dialogVisible = false;
        },
        handleFolder() {
            console.log('enter')
        }
    }
}
</script>
<style scoped>
.add-folder >>> .el-input {
    width: 65% !important;
}
</style>

