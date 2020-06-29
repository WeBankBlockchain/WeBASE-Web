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
                     <div class="config-item-tile">docker版本:</div>
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
                            <el-button type="primary" icon='el-icon-refresh-right' style="margin-left: 20px;" @click='refresh'></el-button>
                    </el-form-item>
                     <div class="config-item-tile">docker目录:</div>
                      <el-form-item  prop="rootDirOnHost" :rules="[
                            {required: true, message: '请选择', trigger: 'blur'},]">
                            <el-input v-model="configFrom.rootDirOnHost" placeholder="请输入IP" style="width: 300px;" ></el-input>
                      </el-form-item>
                    <div class="config-item-tile">主机:</div>
                    <div v-for="(item,index) in configFrom.data" :key="item.key">
                        <el-form-item  :prop="'data.' + index + '.ip'" style="display: inline-block;width: 150px;" :rules="[
                            {required: true, message: '请输入IP', trigger: 'blur'},
                            {pattern:/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/, message: 'IP格式不正确', trigger: 'blur'}
                            ]">
                            <el-input v-model="item.ip" placeholder="请输入IP" style="width: 140px;" maxlength="16"></el-input>
                        </el-form-item>
                        <el-form-item  :prop="'data.' + index + '.number'" style="display: inline-block;width: 150px;" :rules=" [
                                {required: true, message: '请输入数量', trigger: 'blur'},
                                {pattern:/^[1-9]\d*$/,message: '必须大于1', trigger: 'blur'}
                            ]">
                                <el-input v-model="item.number"  placeholder="请输入节点数量" style="width: 140px;" maxlength="1"></el-input>
                        </el-form-item>
                        <el-form-item  :prop="'data.' + index + '.name'" style="display: inline-block;width: 150px;" :rules=" [
                                {required: true, message: '请输入的机构', trigger: 'blur'},
                                {pattern:/^[^\s]*$/,message: '不能含有空格', trigger: 'blur'},
                            ]">
                            <el-input v-model="item.name" placeholder="请输入机构名称" style="width: 140px;" maxlength="9"></el-input>
                        </el-form-item>
                        <el-form-item  :prop="'data.' + index + '.group'" style="display: inline-block;width: 150px;" :rules=" [
                                {required: true, message: '请输入群组id', trigger: 'blur'},
                            ]">
                                <el-input v-model="item.group" placeholder="请输入群组id" style="width: 140px;" maxlength="8"></el-input>
                        </el-form-item>
                        <span class="el-icon-plus" style="cursor: pointer;display: inline-block;padding-left: 20px" @click="add()"></span>
                        <span v-if="configFrom.data.length > 1" class="el-icon-minus" style="cursor: pointer;display: inline-block;padding-left: 10px" @click="delet(item)"></span>
                    </div>
                </el-form>
            </div>
            <div class="text-right sure-btn" style="margin-top:10px">
                <el-button v-if='closeVisible' @click="modelClose">{{this.$t("text.cancel")}}</el-button>
                <el-button type="primary" :loading="loading" @click="submit('configFrom')">{{this.$t("text.sure")}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getConfigList,deployConfig } from "@/util/api"
import errcode from "@/util/errcode";
export default {
    name: "setFront",
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
                rootDirOnHost: this.configFrom.rootDirOnHost
            }
            deployConfig(reqData).then(res => {
                this.loading = false;
                if(res.data.code == 0) {
                    this.$message({
                        type: "success",
                        message: "区块链正在部署"
                    })
                    this.modelClose()
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

