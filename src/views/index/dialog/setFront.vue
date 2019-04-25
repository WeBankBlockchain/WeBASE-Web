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
        <el-dialog title="节点配置" :visible.sync="dialogVisible" :before-close="modelClose"  class="dialog-wrapper" width="433px" :center="true" :show-close='false'>
            <div>
                <el-form :model="frontFrom" :rules="rules" ref="frontFrom" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="ip" prop="ip" style="width:330px">
                        <el-input v-model="frontFrom.ip"></el-input>
                    </el-form-item>
                    <el-form-item label="前置端口" prop="port" style="width:330px">
                        <el-input v-model="frontFrom.port"></el-input>
                    </el-form-item>
                    <el-form-item label="所属机构" prop="company" style="width:330px">
                        <el-input v-model="frontFrom.company"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button v-if='closeVisible' @click="modelClose">取 消</el-button>
                <el-button type="primary" @click="submit('frontFrom')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {addFront} from "@/util/api"
import errcode from "@/util/errcode";
export default {
    name: "setFront",
    props: ["show",'showClose'],
    data: function(){
        return {
            dialogVisible: this.show,
            closeVisible: this.showClose || false,
            frontFrom: {
                ip: "",
                port: "",
                company: "",
            },
            rules: {
                ip: [
                    {
                        required: true,
                        message: "请输入ip名称",
                        trigger: "blur"
                    },
                    {
                        pattern: /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/,
                        message: "ip不符合规则",
                        trigger: "blur"
                    }
                ],
                port: [
                    {
                        required: true,
                        message: "请输入端口名称",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 12,
                        message: "长度在 1 到 12 个数字",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[0-9]*[1-9][0-9]*$/,
                        message: "端口不符合规则",
                        trigger: "blur"
                    }
                ],
                company: [
                    {
                        required: true,
                        message: "请输入机构名称",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 12,
                        message: "长度在 1 到 12 位",
                        trigger: "blur"
                    },
                    {
                        pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,20}$/,
                        message: "机构名称请输入中文、英文和数字",
                        trigger: "blur"
                    }
                ]
            }
        }
    },
    methods: {
        submit: function(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.setFront()
                }else{
                    return false
                }
            })
        },
        setFront: function(){
            let reqData = {
                frontIp: this.frontFrom.ip,
                frontPort: this.frontFrom.port,
                agency: this.frontFrom.company
            }
            addFront(reqData).then(res => {
                if(res.data.code === 0){
                    this.$message({
                        message: '添加前置成功',
                        type: "success"
                    });
                    this.$emit("close")
                }else{
                    this.$message({
                        message: errcode.errCode[res.data.code].cn || '添加前置失败',
                        type: "error"
                    });
                }
            }).catch(err => {
                this.$message({
                        message: '系统错误',
                        type: "error"
                    });
            })
        },
        modelClose: function(){
            this.$emit("close")
        }
    }
}
</script>

