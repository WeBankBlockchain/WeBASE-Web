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
        <el-dialog title="切换群组" :visible.sync="dialogVisible" :before-close="close" class="dialog-wrapper" width="433px" :center="true">
            <span>选择群组</span>
            <el-select v-model="value" placeholder="请选择" @change="change($event)" class="block-network" filterable clearable>
                <el-option v-for="item in options" :key="item.groupId" :label="item.groupName" :value="item.groupId">
                </el-option>
            </el-select>
            <span class="error" v-if='errorShow'>请选择群组</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getGroups } from "@/util/api";
import errcode from "@/util/errcode";
export default {
    name: "groupDialog",
    props: ["show"],
    data: function() {
        return {
            options: [],
            value: "",
            groupList: [],
            groupId: null,
            dialogVisible: this.show,
            errorShow: false
        };
    },
    mounted: function() {
        this.$nextTick(function() {
            this.getGroupList();
        });
    },
    methods: {
        getGroupList: function() {
            getGroups()
                .then(res => {
                    if (res.data.code === 0) {
                        this.options = res.data.data;
                        if (res.data.data.length) {
                            this.value = res.data.data[0].groupId;
                            this.groupList = res.data.data || [];
                            this.groupId = res.data.data[0].groupId;
                        }
                    } else {
                        this.$message({
                            message: errcode.errCode[res.data.code].cn,
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: "系统错误！",
                        type: "error",
                        duration: 2000
                    });
                    this.$message.closeAll()
                });
        },
        change: function(row) {
            this.errorShow = false;
            this.groupId = row;
        },
        submit: function() {
            if (this.groupId) {
                this.errorShow = false;

                let groupName = "";
                this.groupList.forEach(value => {
                    if (value.groupId == this.groupId) {
                        groupName = value.groupName;
                    }
                });
                this.handleClose();
                localStorage.setItem("groupId", this.groupId);
                localStorage.setItem("groupName", groupName);
                this.$emit("changGroupSucess", {
                    groupId: this.groupId,
                    groupName: groupName
                });
            } else {
                this.errorShow = true;
            }
        },
        close: function() {
            if (this.groupId) {
                this.handleClose();
            } else {
                this.errorShow = true;
            }
        },
        handleClose: function() {
            this.$emit("close", false);
        }
    }
};
</script>
<style scoped>
.error {
    color: #f00;
}
</style>



