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
        <el-dialog 
        :title="$t('nodes.chainConfig')" 
        :visible.sync="dialogVisible" 
        :before-close="modelClose" 
        :close-on-click-modal='false'
        class="dialog-wrapper" 
        width="750px" 
        :center="true" 
        :show-close='true'>
            <div>
                <el-form  :model="configFrom"  ref="configFrom" label-width="0px" class="demo-ruleForm">
                     <div class="config-item-tile">{{$t('nodes.chainVersion')}}:</div>
                    <el-form-item  prop="tagId" style="display: inline-block;" :rules="[
                            {required: true, message: $t('alarm.pleaseSlect'), trigger: 'blur'},]">
                            <el-select v-model="configFrom.tagId" :placeholder="$t('alarm.pleaseSlect')" style="width: 300px;">
                                <el-option
                                v-for="item in configList"
                                :key="item.id"
                                :label="item.configValue"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button type="primary"  style="margin-left: 20px;" @click='refresh'>{{$t('nodes.newVersion')}}</el-button>
                    </el-form-item>
                     
                       <!-- <div class="config-item-tile">{{$t('nodes.webaseSignAdr')}}</div>
                      <el-form-item  prop="webaseSignAddr" :rules="[
                            {required: true, message: $t('alarm.pleaseSlect'), trigger: 'blur'},
                            {pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/, message: $t('nodes.addressError'), trigger: 'blur'}]">
                            <el-input v-model="configFrom.webaseSignAddr" :placeholder="$t('nodes.webaseSghAdrInfo')" style="width: 300px;" ></el-input>
                      </el-form-item>
                      <hr style="margin: 15px 0;"> -->
                    <div class="config-item-tile">{{$t('nodes.hostList')}}</div>
                    <div v-for="(item,index) in configFrom.data" :key="item.key">
                        <el-form-item  :prop="'data.' + index + '.ip'" style="display: inline-block;width: 150px;" :rules="[
                            {required: true, message: $t('nodes.inputHostIp'), trigger: 'blur'},
                            {pattern:/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/, message: $t('nodes.ipError'), trigger: 'blur'}
                            ]">
                            <el-input v-model.trim="item.ip" :placeholder="$t('nodes.hostIp')" style="width: 140px;" maxlength="16"></el-input>
                        </el-form-item>
                        <el-form-item  :prop="'data.' + index + '.number'" style="display: inline-block;width: 150px;" :rules=" [
                                {required: true, message: $t('nodes.inputNodesNumber'), trigger: 'blur'},
                                {pattern:/^[1-9]\d*$/,message: $t('nodes.thanOne'), trigger: 'blur'}
                            ]">
                                <el-input v-model.trim="item.number"  :placeholder="$t('nodes.NodesNumber')" style="width: 140px;" maxlength="1"></el-input>
                        </el-form-item>
                        <el-form-item  :prop="'data.' + index + '.name'" style="display: inline-block;width: 150px;" :rules=" [
                                {required: true, message: $t('nodes.inputHostAgency'), trigger: 'blur'},
                                {pattern:/^[^\s]*$/,message: $t('nodes.noWhitespace'), trigger: 'blur'},
                            ]">
                            <el-input v-model.trim="item.name" :placeholder="$t('nodes.hostAgency')" style="width: 140px;" maxlength="32"></el-input>
                        </el-form-item>
                        <!-- <el-form-item  :prop="'data.' + index + '.group'" style="display: inline-block;width: 150px;" :rules=" [
                                {required: true, message: $t('nodes.nodesGroup'), trigger: 'blur'},
                            ]">
                                <el-input v-model="item.group" :placeholder="$t('nodes.nodesGroupInfo')" style="width: 140px;" maxlength="8"></el-input>
                        </el-form-item> -->
                        <span class="el-icon-plus" style="cursor: pointer;display: inline-block;padding-left: 20px" @click="add()"></span>
                        <span v-if="configFrom.data.length > 1" class="el-icon-minus" style="cursor: pointer;display: inline-block;padding-left: 10px" @click="delet(item)"></span>
                    </div>
                    <div class="config-item-tile">{{$t('nodes.chainDirectory')}}:</div>
                      <el-form-item  prop="rootDirOnHost" :rules="[
                            {required: true, message: $t('alarm.pleaseSlect'), trigger: 'blur'},]">
                            <el-input v-model="configFrom.rootDirOnHost" :placeholder="$t('nodes.inputChainDirectory')" style="width: 300px;" ></el-input>
                      </el-form-item>
                </el-form>
            </div>
            <div class="text-right sure-btn" style="margin-top:10px">
                <el-button v-if='closeVisible' @click="modelClose">{{this.$t("text.cancel")}}</el-button>
                <el-button type="primary" :loading="loading" @click="submit('configFrom')">{{$t('nodes.startDeploy')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getConfigList,deployConfig } from "@/util/api"
import errcode from "@/util/errcode";
export default {
    name: "setConfig",
    props: ["show", 'showClose'],
    data: function () {
        return {
            loading: false,
            dialogVisible: this.show,
            closeVisible: this.showClose || false,
            configList: [],
            type: 1,
            update: false,
            configFrom: {
                tagId: "",
                rootDirOnHost: "/opt/fisco",
                // webaseSignAddr: "",
                data: [
                    {
                        ip: "",
                        number: null,
                        name: "",
                        group: 1,
                        key: Date.now()
                    }
                ]
            },
        }
    },
    mounted: function() {
        this.getConfigs();
    },
    methods: {
        getConfigs: function (val) {
            let reqData = {
                type: this.type,
                update: this.update
            }
            getConfigList(reqData).then(res => {
                if(res.data.code === 0){
                    if(val){
                       this.$message({
                            message: this.$t("nodes.dockerRefresh"),
                            type: "success",
                            duration: 2000
                        }); 
                    }
                    this.configList = [];
                    this.configList = res.data.data
                }else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        add: function () {
            let value = {
                    ip: "",
                    number: null,
                    name: "",
                    group: 1,
                    key: Date.now()
                };
                this.configFrom.data.push(value)
        },
        delet: function (value) {
            for (let i = 0; i < this.configFrom.data.length; i++){
                if(this.configFrom.data[i].key == value.key){
                    this.configFrom.data.splice(i,1)
                }
            }
        },
        refresh: function () {
            this.configFrom.tagId = "";
            this.update = true;
            this.getConfigs('new');
        },
        submit: function (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.deploy()
                } else {
                    return false
                }
            })
        },
        deploy: function () {
            let array = [];
            let nodeNumber = 0;
            for (let i = 0; i < this.configFrom.data.length; i++){
                nodeNumber = nodeNumber + this.configFrom.data[i].number
                let strings = this.configFrom.data[i].ip + ":" + this.configFrom.data[i].number + " " + this.configFrom.data[i].name + " " + this.configFrom.data[i].group;
                array.push(strings)
            }
            if(nodeNumber == 1 || nodeNumber < 1){
                this.$message({
                    message: this.$t("nodes.nodesNumber"),
                    type: "error",
                    duration: 2000
                });
                this.loading = false;
                return
            }
            let reqData = {
                ipconf: array,
                tagId: this.configFrom.tagId,
                rootDirOnHost: this.configFrom.rootDirOnHost,
                // webaseSignAddr: this.configFrom.webaseSignAddr
            }
            deployConfig(reqData).then(res => {
                this.loading = false;
                if(res.data.code == 0) {
                    this.$message({
                        type: "success",
                        message: this.$t("nodes.deploying")
                    })
                    this.$emit('success')
                }else{
                    this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                }
            })
            .catch(err => {
                    this.loading = false;
                    this.$message({
                        message: this.$t('text.systemError'),
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
.config-item{
    padding-bottom: 10px;
}
.config-item-tile{
    padding-bottom: 5px;
}

</style>

