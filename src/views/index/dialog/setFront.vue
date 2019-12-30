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
    <div>
        <el-dialog :title="$t('nodes.frontConfig')" :visible.sync="dialogVisible" :before-close="modelClose" class="dialog-wrapper" width="433px" :center="true" :show-close='false'>
            <div>
                <el-form :model="frontFrom" :rules="rules" ref="frontFrom" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="ip" prop="ip" style="width:330px">
                        <el-input v-model="frontFrom.ip"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('nodes.frontPort')" prop="port" style="width:330px">
                        <el-input v-model="frontFrom.port"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('nodes.agency')" prop="company" style="width:330px">
                        <el-input v-model="frontFrom.company"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="text-right sure-btn" style="margin-top:10px">
                <el-button v-if='closeVisible' @click="modelClose">{{this.$t("text.cancel")}}</el-button>
                <el-button type="primary" :loading="loading" @click="submit('frontFrom')">{{this.$t("text.sure")}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { addFront } from "@/util/api"
import errcode from "@/util/errcode";
export default {
    name: "setFront",
    props: ["show", 'showClose'],
    computed: {
        rules() {
            let data = {
                ip: [
                    {
                        required: true,
                        message: this.$t("rule.ipName"),
                        trigger: "blur"
                    },
                    {
                        pattern: /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/,
                        message: this.$t("rule.ipRule"),
                        trigger: "blur"
                    }
                ],
                port: [
                    {
                        required: true,
                        message: this.$t("rule.portName"),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 12,
                        message: this.$t("rule.portLong"),
                        trigger: "blur"
                    },
                    {
                        pattern: /^[0-9]*[1-9][0-9]*$/,
                        message: this.$t("rule.portRule"),
                        trigger: "blur"
                    }
                ],
                company: [
                    {
                        required: true,
                        message: this.$t("rule.agencyName"),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 16,
                        message: this.$t("rule.agencyLong"),
                        trigger: "blur"
                    },
                    {
                        pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,20}$/,
                        message: this.$t("rule.agencyRule"),
                        trigger: "blur"
                    }
                ]
            }
            return data
        }
    },
    data: function () {
        return {
            loading: false,
            dialogVisible: this.show,
            closeVisible: this.showClose || false,
            frontFrom: {
                ip: "",
                port: "",
                company: "",
            },
        }
    },
    methods: {
        submit: function (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.setFront()
                } else {
                    return false
                }
            })
        },
        setFront: function () {
            let reqData = {
                frontIp: this.frontFrom.ip,
                frontPort: this.frontFrom.port,
                agency: this.frontFrom.company
            }
            addFront(reqData).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        message: this.$t("nodes.addFrontSuccessMsg"),
                        type: "success"
                    });
                    this.$emit("close")
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error"
                    });
                }
            }).catch(err => {
                this.loading = false;
                this.$message({
                    message: this.$t('text.systemError'),
                    type: "error"
                });
            })
        },
        modelClose: function () {
            this.$emit("close")
        }
    }
}
</script>

