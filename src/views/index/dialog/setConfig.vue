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
        <el-dialog :title="$t('nodes.chainConfig')" :visible.sync="dialogVisible" :before-close="modelClose" :close-on-click-modal='false' class="dialog-wrapper" width="500px" :center="true" :show-close='true'>
            <div>
                <el-form :model="configFrom" ref="configFrom" label-width="0px" class="demo-ruleForm">
                    <div class="config-item-tile">{{$t('nodes.chainVersion')}}:</div>
                    <el-form-item prop="tagId" style="display: inline-block;" :rules="[
                            {required: true, message: $t('alarm.pleaseSlect'), trigger: 'blur'},]">
                        <el-select v-model="configFrom.tagId" :placeholder="$t('alarm.pleaseSlect')" style="width: 300px;">
                            <el-option v-for="item in configList" :key="item.id" :label="item.configValue" :value="item.id">
                            </el-option>
                        </el-select>
                        <!-- <el-button type="primary"  style="margin-left: 20px;" @click='refresh'>{{$t('nodes.newVersion')}}</el-button> -->
                    </el-form-item>
                    <div class="config-item-tile">{{$t('text.imageMode')}}

                    </div>
                    <el-radio v-model="configFrom.dockerImageType" :label="0">{{$t("text.manual")}}<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo2')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                    </el-radio>
                    <el-radio v-model="configFrom.dockerImageType" :label="1">{{$t("text.automatic")}}<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo1')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                    </el-radio>
                    <hr style="margin: 15px 0;">
                    <div class="config-item-tile">{{$t('text.ip')}}
                        <el-tooltip class="item" effect="dark" :content="$t('text.hostListInfo')" placement="top-start"><i class="el-icon-info"></i></el-tooltip>
                        <span style="dispaly: inline-block;padding-left: 125px;">{{$t("text.org")}}</span>
                    </div>
                    <div v-for="(item,index) in configFrom.data" :key="item.key">
                        <el-form-item :prop="'data.' + index + '.ip'" style="display: inline-block;width: 170px;" :rules="[
                            {required: true, message: $t('nodes.inputHostIp'), trigger: 'blur'},
                            {required: true, validator: validatePass, trigger: 'blur'},
                            {pattern:/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/, message: $t('nodes.ipError'), trigger: 'blur'}
                            ]">
                            <el-input v-model.trim="item.ip" :placeholder="$t('nodes.hostIp')" style="width: 160px;" maxlength="16"></el-input>
                        </el-form-item>
                        <el-form-item :prop="'data.' + index + '.name'" style="display: inline-block;width: 170px;" :rules=" [
                                {required: true, message: $t('nodes.inputHostAgency'), trigger: 'blur'}
                            ]">
                            <el-input v-model.trim="item.name" :placeholder="$t('nodes.hostAgency')" style="width: 160px;" maxlength="32"></el-input>
                        </el-form-item>
                        <span class="el-icon-plus" style="cursor: pointer;display: inline-block;padding-left: 20px" @click="add()"></span>
                        <span v-if="configFrom.data.length > 4" class="el-icon-minus" style="cursor: pointer;display: inline-block;padding-left: 10px" @click="delet(item)"></span>
                    </div>
                </el-form>
            </div>
            <div class="text-right sure-btn" style="margin-top:10px">
                <el-button v-if='closeVisible' @click="modelClose">{{this.$t("text.cancel")}}</el-button>
                <el-button type="primary" :loading="loading" :disabled="disabled" @click="submit('configFrom')">{{$t('nodes.startDeploy')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getConfigList, deployConfig } from "@/util/api"
import errcode from "@/util/errcode";
export default {
    name: "setConfig",
    props: ["show", 'showClose'],
    data: function () {
        var validatePass = (rule, value, callback) => {
            let num = 0;
            for (let i = 0; i < this.configFrom.data.length; i++) {
                if (value == this.configFrom.data[i].ip) {
                    num++
                }
            }
            if (value === "") {
                callback(new Error(this.$t('nodes.inputHostIp')));
            } else if (num > 1) {
                callback(new Error(this.$t('rule.ipSame')));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            disabled: false,
            dialogVisible: this.show,
            closeVisible: this.showClose || false,
            configList: [],
            type: 1,
            update: false,
            validatePass: validatePass,
            configFrom: {
                tagId: "",
                rootDirOnHost: "/opt/fisco",
                dockerImageType: 0,
                // webaseSignAddr: "",
                data: [
                    {
                        ip: "",
                        name: "",
                        number: 1,
                        group: 1,
                        key: Date.now()
                    },
                    {
                        ip: "",
                        name: "",
                        number: 1,
                        group: 1,
                        key: Date.now() + 1
                    },
                    {
                        ip: "",
                        name: "",
                        number: 1,
                        group: 1,
                        key: Date.now() + 2
                    },
                    {
                        ip: "",
                        name: "",
                        number: 1,
                        group: 1,
                        key: Date.now() + 3
                    }
                ]
            },
        }
    },
    mounted: function () {
        this.getConfigs();
    },
    methods: {
        getConfigs: function (val) {
            let reqData = {
                type: this.type,
                update: this.update
            }
            getConfigList(reqData).then(res => {
                if (res.data.code === 0) {
                    if (val) {
                        this.$message({
                            message: this.$t("nodes.dockerRefresh"),
                            type: "success",
                            duration: 2000
                        });
                    }
                    this.configList = [];
                    this.configList = res.data.data
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                }
            })
                .catch(err => {
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        add: function () {
            let value = {
                ip: "",
                name: "",//����
                group: 1,
                number: 1,
                key: Date.now()
            };
            this.configFrom.data.push(value)
        },
        delet: function (value) {
            for (let i = 0; i < this.configFrom.data.length; i++) {
                if (this.configFrom.data[i].key == value.key) {
                    this.configFrom.data.splice(i, 1)
                }
            }
        },
        // refresh: function () {
        //     this.configFrom.tagId = "";
        //     this.update = true;
        //     this.getConfigs('new');
        // },
        submit: function (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.disabled = true;
                    this.deploy()
                } else {
                    return false
                }
            })
        },
        deploy: function () {
            let array = [];
            let nodeNumber = 0;
            for (let i = 0; i < this.configFrom.data.length; i++) {
                nodeNumber = nodeNumber + this.configFrom.data[i].number
                let strings = this.configFrom.data[i].ip + ":" + this.configFrom.data[i].number + " " + this.configFrom.data[i].name + " " + this.configFrom.data[i].group;
                array.push(strings)
            }
            if (nodeNumber == 1 || nodeNumber < 1) {
                this.$message({
                    message: this.$t("nodes.nodesNumber"),
                    type: "error",
                    duration: 2000
                });
                this.loading = false;
                this.disabled = false;
                return
            }
            let reqData = {
                ipconf: array,
                tagId: this.configFrom.tagId,
                rootDirOnHost: this.configFrom.rootDirOnHost,
                dockerImageType: this.configFrom.dockerImageType
                // webaseSignAddr: this.configFrom.webaseSignAddr
            }
            deployConfig(reqData).then(res => {
                this.loading = false;
                this.disabled = false;
                if (res.data.code == 0) {
                    this.$message({
                        type: "success",
                        message: this.$t("nodes.deploying")
                    })
                    this.$emit('success')
                } else {
                    this.loading = false;
                    this.disabled = false;
                    this.$message({
                        message: this.$chooseLang(res.data.code, res.data.attachment),
                        type: "error",
                        duration: 2000
                    });
                }
            })
                .catch(err => {
                    this.loading = false;
                    this.disabled = false;
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });

                });
        },
        modelClose: function () {
            this.$emit("close")
        }
    }
}
</script>
<style scoped>
.config-item {
    padding-bottom: 10px;
}
.config-item-tile {
    padding-bottom: 5px;
}
</style>

