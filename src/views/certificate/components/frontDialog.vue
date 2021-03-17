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
        <el-form :model="frontForm" ref="frontForm" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="$t('nodes.frontId')" prop="role" style="width: 300px;">
                <el-select v-model="frontForm.frontId" :placeholder="$t('text.select')">
                    <el-option v-for="item in frontList" :key="item.frontIp" :label="item.roleNameZh" :value="item.frontId">
                        <span style="float: left">{{ item.frontIp }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.frontId }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="submit('frontForm')">{{this.$t('text.sure')}}</el-button>
        </div>
    </div>
</template>

<script>
import {
    getFronts,
} from "@/util/api";
export default {
    name: "frontDialog",
    props: {

    },
    data() {
        return {
            frontList: [],
            frontForm: {
                frontId: ""
            }
        };
    },
    computed: {

    },
    mounted() {
        this.queryFronts();
    },
    methods: {
        queryFronts() {
            getFronts({})
                .then(res => {
                    if (res.data.code === 0) {
                        const { data } = res.data
                        if (data.length) {
                            this.frontList = data
                            this.frontForm.frontId = data[0]['frontId']
                        }
                        
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
        },
        modelClose() {
            this.$emit("close", false);
        },
        submit() {
            this.$emit('submit', this.frontForm.frontId)
        },

    }
};
</script>

<style scoped>
.dialog-footer {
    text-align: right;
    margin-right: -5px;
    padding-bottom: 20px;
    padding-top: 12px;
}
.isNone {
    display: none;
}
.isShow {
    display: block;
}
.demo-ruleForm >>> .el-form-item__error {
    padding-top: 0;
}
</style>
