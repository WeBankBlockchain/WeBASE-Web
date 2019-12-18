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
        <v-content-head :headTitle="$t('title.blockTitle')" :icon="true" :route="'home'" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper">
            <div class="search-part">
                <div class="search-part-left-bg">
                    <span>{{this.$t("text.total")}}</span>
                    <span>{{numberFormat(total, 0, ".", ",")}}</span>
                    <span>{{this.$t("text.tiao")}}</span>
                </div>
                <div class="search-part-right">
                    <el-input :placeholder="$t('inputText.blockInput')" v-model="searchKey.value" class="input-with-select" @clear="clearText">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="search-table">
                <el-table :data="blockData" class="block-table-content" v-loading="loading" @row-click="clickTable" ref="refTable">
                    <el-table-column prop="blockNumber" :label="$t('home.blockHeight')" width="120" align="center">
                        <template slot-scope="scope">
                            <span @click="link(scope.row.blockNumber)" class="link">{{scope.row.blockNumber}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="transCount" :label="$t('home.transaction')" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="">{{scope.row['transCount']}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pkHash" :label="$t('home.blockHash')" :show-overflow-tooltip="true" align="center">
                        <template slot-scope="scope">
                            <span class="">
                                <i class="wbs-icon-copy font-12 copy-key" @click="copyPubilcKey(scope.row['pkHash'])" :title="$t('text.copyHash')"></i>
                                {{scope.row['pkHash']}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="blockTimestamp" :label="$t('home.createTime')" width="280" :show-overflow-tooltip="true" align="center">
                        <template slot-scope="scope">
                            <span class="">{{scope.row['blockTimestamp']}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout=" sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { getBlockPage } from "@/util/api";
import router from "@/router";
import errcode from "@/util/errcode";
import { numberFormat } from "@/util/util";
export default {
    name: "blockInfo",
    components: {
        "v-content-head": contentHead
    },
    data: function() {
        return {
            blockData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            loading: false,
            numberFormat: numberFormat,
            searchKey: {
                key: "",
                value: ""
            }
        };
    },
    mounted: function() {
        this.getBlockList();
    },
    methods: {
        changGroup(val){
            this.getBlockList()
        },
        search: function() {
            if (
                this.searchKey.key == "pkHash" &&
                this.searchKey.value.length != 66 &&
                this.searchKey.value
            ) {
                this.$message({
                    message: this.$t("text.blockSearchMsg"),
                    type: "error",
                    duration: 2000
                });
            } else {
                this.currentPage = 1
                this.getBlockList();
            }
        },
        getBlockList: function() {
            this.loading = true;
            let groupId = localStorage.getItem("groupId");
            let reqData = {
                    groupId: groupId,
                    pageNumber: this.currentPage,
                    pageSize: this.pageSize
                },
                reqQuery = {};
            if (this.$route.query.blockNumber) {
                this.searchKey.key = "blockNumber";
                this.searchKey.value = this.$route.query.blockNumber;
            }
            if(this.searchKey.value){
                if(this.searchKey.value.length===66){
                    reqQuery.pkHash = this.searchKey.value;
                }else {
                    reqQuery.blockNumber = this.searchKey.value;
                }
            }
            getBlockPage(reqData, reqQuery)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.blockData = res.data.data;
                        this.total = res.data.totalCount;
                    } else {
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
                    this.$message.closeAll()
                });
        },
        handleSizeChange: function(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getBlockList();
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            this.getBlockList();
        },
        link: function(val) {
            router.push({
                path: "/transactionInfo",
                query: {
                    blockNumber: val
                }
            });
        },
        clickTable: function(row, column, $event) {
            let nodeName = $event.target.nodeName;
            if (nodeName === "I") {
                return
            }
            this.link(row.blockNumber)
        },
        
        clearText: function(){
            this.getBlockList()
        },
        copyPubilcKey(val) {
            if (!val) {
                this.$message({
                    type: "fail",
                    showClose: true,
                    message: this.$t("text.copyErrorMsg"),
                    duration: 2000
                });
            } else {
                this.$copyText(val).then(e => {
                    this.$message({
                        type: "success",
                        showClose: true,
                        message: this.$t("text.copySuccessMsg"),
                        duration: 2000
                    });
                });
            }
        },
    }
};
</script>
<style scoped>
.search-part {
    padding: 30px 0px;
    overflow: hidden;
    margin: 0;
}
.input-with-select {
    width: 610px;
}
.input-with-select>>>.el-input__inner {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border: 1px solid #eaedf3;
    box-shadow: 0 3px 11px 0 rgba(159, 166, 189, 0.11);
}
.input-with-select>>>.el-input--suffix > .el-input__inner {
    box-shadow: none;
}
.input-with-select>>>.el-input-group__prepend {
    border-left-color: #fff;
}
.input-with-select>>>.el-input-group__append {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 3px 11px 0 rgba(159, 166, 189, 0.11);
}
.input-with-select>>>.el-button {
    border: 1px solid #20d4d9;
    border-radius: inherit;
    background: #20d4d9;
    color: #fff;
}
.block-table-content {
    width: 100%;
    padding-bottom: 16px;
    font-size: 12px;
}
.block-table-content /deep/ .el-table__row {
    cursor: pointer;
}
</style>
