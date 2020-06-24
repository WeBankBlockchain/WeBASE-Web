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
        <el-dialog :title="'区块链配置'" :visible.sync="dialogVisible" :before-close="modelClose" 
        class="dialog-wrapper" width="750px" :center="true" :show-close='true'>
            <div>
                <!-- <div class="config-item">
                    <div class="config-item-tile">docker版本:</div>
                    <el-select v-model="tagId" placeholder="请选择" style="width: 300px;">
                                <el-option
                                v-for="item in configList"
                                :key="item.id"
                                :label="item.configValue"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button type="primary" icon='el-icon-refresh-right' style="margin-left: 20px;" @click='refresh'></el-button>
                </div> -->
                <el-form  :model="configFrom"  ref="configFrom" label-width="0px" class="demo-ruleForm">
                     <div class="config-item-tile">区块链应用版本:</div>
                    <el-form-item  prop="tagId" style="display: inline-block;" :rules="[
                            {required: true, message: '请选择', trigger: 'blur'},]">
                            <el-select v-model="configFrom.tagId" placeholder="请选择" style="width: 300px;">
                                <el-option
                                v-for="item in configList"
                                :key="item.id"
                                :label="item.configValue"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button type="primary"  style="margin-left: 20px;" @click='refresh'>获取最新版本</el-button>
                    </el-form-item>
                     
                       <div class="config-item-tile">WeBASE-Sign的地址:</div>
                      <el-form-item  prop="webaseSignAddr" :rules="[
                            {required: true, message: '请选择', trigger: 'blur'},
                            {pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/, message: '地址格式不正确', trigger: 'blur'}]">
                            <el-input v-model="configFrom.webaseSignAddr" placeholder="WeBASE-Sign的地址，例：127.0.0.1:6004" style="width: 300px;" ></el-input>
                      </el-form-item>
                      <hr style="margin: 15px 0;">
                    <div class="config-item-tile">主机列表:</div>
                    <div v-for="(item,index) in configFrom.data" :key="item.key">
                        <el-form-item  :prop="'data.' + index + '.ip'" style="display: inline-block;width: 150px;" :rules="[
                            {required: true, message: '请输入主机IP地址', trigger: 'blur'},
                            {pattern:/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/, message: 'IP格式不正确', trigger: 'blur'}
                            ]">
                            <el-input v-model="item.ip" placeholder="主机IP地址" style="width: 140px;" maxlength="16"></el-input>
                        </el-form-item>
                        <el-form-item  :prop="'data.' + index + '.number'" style="display: inline-block;width: 150px;" :rules=" [
                                {required: true, message: '请输入部署节点数量', trigger: 'blur'},
                                {pattern:/^[1-9]\d*$/,message: '必须大于1', trigger: 'blur'}
                            ]">
                                <el-input v-model="item.number"  placeholder="部署节点数量" style="width: 140px;" maxlength="1"></el-input>
                        </el-form-item>
                        <el-form-item  :prop="'data.' + index + '.name'" style="display: inline-block;width: 150px;" :rules=" [
                                {required: true, message: '请输入主机所属机构', trigger: 'blur'},
                                {pattern:/^[^\s]*$/,message: '不能含有空格', trigger: 'blur'},
                            ]">
                            <el-input v-model="item.name" placeholder="主机所属机构" style="width: 140px;" maxlength="32"></el-input>
                        </el-form-item>
                        <el-form-item  :prop="'data.' + index + '.group'" style="display: inline-block;width: 150px;" :rules=" [
                                {required: true, message: '请输入节点所属群组', trigger: 'blur'},
                            ]">
                                <el-input v-model="item.group" placeholder="节点所属群组，默认为1" style="width: 140px;" maxlength="8"></el-input>
                        </el-form-item>
                        <span class="el-icon-plus" style="cursor: pointer;display: inline-block;padding-left: 20px" @click="add()"></span>
                        <span v-if="configFrom.data.length > 1" class="el-icon-minus" style="cursor: pointer;display: inline-block;padding-left: 10px" @click="delet(item)"></span>
                    </div>
                    <div class="config-item-tile">区块链数据存储目录:</div>
                      <el-form-item  prop="rootDirOnHost" :rules="[
                            {required: true, message: '请选择', trigger: 'blur'},]">
                            <el-input v-model="configFrom.rootDirOnHost" placeholder="请输入区块链数据存储目录" style="width: 300px;" ></el-input>
                      </el-form-item>
                </el-form>
            </div>
            <div class="text-right sure-btn" style="margin-top:10px">
                <el-button v-if='closeVisible' @click="modelClose">{{this.$t("text.cancel")}}</el-button>
                <el-button type="primary" :loading="loading" @click="submit('configFrom')">开始部署</el-button>
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
                webaseSignAddr: "",
                data: [
                    {
                        ip: "",
                        number: null,
                        name: "",
                        group: "",
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
        getConfigs: function () {
            let reqData = {
                type: this.type,
                update: this.update
            }
            getConfigList(reqData).then(res => {
                if(res.data.code === 0){
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
                    group: "",
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
            this.update = true;
            this.getConfigs();
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
            console.log(this.configFrom);
            let array = []
            for (let i = 0; i < this.configFrom.data.length; i++){
                let strings = this.configFrom.data[i].ip + ":" + this.configFrom.data[i].number + " " + this.configFrom.data[i].name + " " + this.configFrom.data[i].group;
                array.push(strings)
            }
            let reqData = {
                ipconf: array,
                tagId: this.configFrom.tagId,
                rootDirOnHost: this.configFrom.rootDirOnHost,
                webaseSignAddr: this.configFrom.webaseSignAddr
            }
            deployConfig(reqData).then(res => {
                this.loading = false;
                if(res.data.code == 0) {
                    this.$message({
                        type: "success",
                        message: "区块链正在部署"
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

