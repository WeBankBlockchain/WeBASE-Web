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
    <div class="chang-wrapper">
        <table class="opt-wrapper">
            <tr>
                <td style="width: 40px;">{{this.$t('contracts.user')}}：</td>
                <td>
                    <el-select v-model="userName" :placeholder="$t('text.select')" style="width: 100%">
                        <el-option :label="item.userName" :value="item.address" :key="item.userId" v-for='item in userList'></el-option>
                    </el-select>
                </td>
            </tr>
            <tr v-if='inputs.length'>
                <td style="vertical-align: top;">{{this.$t('contracts.params')}}：</td>
                <td>
                    <div v-for='(item,index) in inputs' :key='item.name' class="params-input">
                        <el-input v-model.trim="parameter[index]" style="margin-bottom:10px;" :placeholder="item.type">
                            <template slot="prepend">
                                <span :title="item.name">{{item.name}}</span>
                            </template>
                        </el-input>
                    </div>
                </td>
            </tr>
            <tr v-if='inputs.length'>
                <td></td>
                <td>
                    <p style="padding: 0px 0 0 0px;"><i class="el-icon-info" style="padding-right: 4px;"></i>{{this.$t('contracts.paramsInfo')}}</p>
                </td>
            </tr>
        </table>
        <div class="text-right send-btn">
            <el-button @click="close">{{this.$t("text.cancel")}}</el-button>
            <el-button type="primary" @click="submit">{{this.$t("text.sure")}}</el-button>
        </div>
    </div>
</template>
<script>
import { sendTransation, getUserList } from "@/util/api";
import errcode from "@/util/errcode";
import { isJson } from "@/util/util"
export default {
    name: "changeUser",
    props: ["abi"],
    data: function () {
        return {
            userName: "",
            userList: [],
            userId: null,
            inputs: [],
            parameter: [],
            abifile: JSON.parse(this.abi),
            version: "",
            versionShow: false,
            errorInfo: ""
        };
    },
    mounted: function () {
        this.getUserData();
        this.changeConstructor();
    },
    methods: {
        changeConstructor: function () {
            if (this.abifile.length) {
                this.abifile.forEach(value => {
                    if (value.type === "constructor") {
                        this.inputs = value.inputs;
                    }
                });
            }
        },
        close: function () {
            this.$emit("close");
        },
        submit: function () {
            this.versionShow = false;
            this.errorInfo = ''
            var params = []
            for (let i = 0; i < this.parameter.length; i++) {
                if (this.parameter[i] && isJson(this.parameter[i])) {
                    try {
                        params[i] = JSON.parse(this.parameter[i])
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    params[i] = this.parameter[i];
                }
            }
            let data = {
                userId: this.userName,
                params: params
            };
            this.$emit("change", data);
            this.$emit("close");
        },
        getUserData: function () {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: 1,
                pageSize: 1000
            };
            getUserList(reqData, {})
                .then(res => {
                    if (res.data.code === 0) {
                        res.data.data.forEach(value => {
                            if (value.hasPk === 1) {
                                this.userList.push(value);
                            }
                        });
                        if (this.userList.length) {
                            this.userName = this.userList[0].address;
                            // this.userId = this.userList[0].userId;
                        }
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
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        }
    }
};
</script>
<style scoped>
.chang-wrapper {
    padding-left: 20px;
    margin-top: 15px;
}

.chang-wrapper /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
}
.chang-wrapper /deep/ .el-input__icon {
    line-height: 32px;
}
.opt-wrapper tr td {
    padding-top: 0;
    padding-bottom: 10px;
}
.send-btn /deep/ .el-button {
    padding: 9px 16px;
}
.params-input >>> .el-input-group__prepend {
    max-width: 136px;
    overflow: hidden;
    text-overflow: ellipsis;

}
</style>

