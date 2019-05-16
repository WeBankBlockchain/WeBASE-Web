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
        <!-- <v-content-head :headTitle="'节点管理'" :icon="true" v-if="urlQuery.from==='home'" :route="`${urlQuery.from}`"></v-content-head> -->
        <v-content-head :headTitle="'节点管理'" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper">
            <h3 style="padding: 20px 0 0 40px;">前置列表</h3>
            <div class="search-part" style="padding-top: 20px;">
                <div class="search-part-left">
                    <el-button type="primary" class="search-part-left-btn" @click="createFront">新增节点前置</el-button>
                </div>
                <!-- <div class="search-part-right">
                    <el-input placeholder="请输入前置编号" v-model="frontId" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div> -->
            </div>
            <div class="search-table">
                <el-table :data="frontData" class="search-table-content" v-loading="loading">
                    <el-table-column v-for="head in frontHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <span v-if='head.enName != "frontIp"'>{{scope.row[head.enName]}}</span>
                            <span v-else>
                                <router-link :to="{'path': 'hostDetail', 'query': {nodeIp: scope.row['frontIp'], nodeId: scope.row['frontId']}}" class="link">{{scope.row[head.enName]}}</router-link>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column  fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="deletedFront(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-show='total > 10' class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <div class="module-wrapper" style="margin-top: 10px;">
            <div class="search-table">
                <h3 style="padding: 20px 0 8px 0;">节点列表</h3>
                <el-table :data="nodeData" class="search-table-content" v-loading="loadingNodes">
                <el-table-column v-for="head in nodeHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center" :width='head.width'>
                    <template slot-scope="scope">
                        <template>
                            <span v-if="head.enName ==='nodeActive'">
                                <i :style="{'color': textColor(scope.row[head.enName])}" class="wbs-icon-radio font-6"></i> {{nodesStatus(scope.row[head.enName])}}
                            </span>
                            <span v-else>{{scope.row[head.enName]}}</span>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
             <el-pagination v-show='nodetotal > 10' class="page" @size-change="nodeSizeChange" @current-change="nodeCurrentChange" :current-page="nodecurrentPage" :page-sizes="[10, 20, 30, 50]" :page-size="nodepageSize" layout="total, sizes, prev, pager, next, jumper" :total="nodetotal">
                </el-pagination>
                <!-- <el-dialog :visible.sync="nodesDialogVisible" :title="nodesDialogTitle" width="433px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="nodesDialogVisible">
                    <v-nodesDialog :nodesDialogOptions="nodesDialogOptions" @success="success" @close="close"></v-nodesDialog>
                </el-dialog> -->
                <v-setFront :show='frontShow' v-if='frontShow' :showClose ='true' @close='close'></v-setFront>
            </div>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { getFronts, addnodes,deleteFront,getNodeList } from "@/util/api";
import { date } from "@/util/util";
import errcode from "@/util/errcode";
import setFront from "../index/dialog/setFront.vue"
import Bus from "@/bus"
export default {
    name: "node",
    components: {
        "v-content-head": contentHead,
        "v-setFront": setFront
    },
    watch: {
        $route: function() {
            this.urlQuery = this.$root.$route.query;
        }
    },
    data: function() {
        return {
            frontShow: false,
            nodeName: "",
            nodes: [],
            frontData: [],
            currentPage: 1,
            pageSize: 10,
            nodecurrentPage: 1,
            nodepageSize: 10,
            total: 0,
            nodetotal: 0,
            loading: false,
            nodesLoading: false,
            nodesDialogVisible: false,
            nodesDialogTitle: "",
            nodesDialogOptions: {},
            frontId: null,
            loadingNodes: false,
            frontHead: [
                {
                    enName: "frontId",
                    name: "前置编号"
                },
                {
                    enName: "frontIp",
                    name: "ip"
                },
                {
                    enName: "frontPort",
                    name: "前置端口"
                },
                {
                    enName: "agency",
                    name: "所属机构"
                },
                {
                    enName: "createTime",
                    name: "创建时间"
                },
                {
                    enName: "modifyTime",
                    name: "修改时间"
                }
            ],
            nodeHead: [
                {
                    enName: "nodeId",
                    name: "节点Id",
                    width: ""
                },
                {
                    enName: "blockNumber",
                    name: "块高",
                    width: 180
                },
                {
                    enName: "pbftView",
                    name: "pbftView",
                    width: 180
                },
                {
                    enName: "nodeActive",
                    name: "状态",
                    width: 150
                }
            ],
            nodeData: [],
            urlQuery: this.$root.$route.query
        };
    },
    mounted: function() {
        this.getFrontTable();
        this.getNodeTable();
    },
    methods: {
        changGroup(){
            this.getFrontTable();   
            this.getNodeTable();
        },
        search: function() {
            this.getFrontTable()   
        },
        getFrontTable: function() {
            let reqData = {
                frontId: this.frontId
            }
            getFronts(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.total = res.data.totalCount;
                        this.frontData = res.data.data || [];
                        this.loading = false;
                        this.getNodeTable()
                    } else {
                        this.loading = false;
                        this.$message({
                            message: errcode.errCode[res.data.code].cn,
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.$message({
                        message: "查询失败！",
                        type: "error",
                        duration: 2000
                    });
                });
        },
        handleSizeChange: function(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getFrontTable()
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            this.getFrontTable()
        },
        nodeSizeChange: function(val){
            this.nodepageSize = val;
            this.nodecurrentPage = 1;
            this.getNodeTable();
        },
        nodeCurrentChange: function(val){
            this.nodecurrentPage = val;
            this.getNodeTable()
        },
        textColor: function(val) {
            let colorString = "";
            switch (val) {
                case 1:
                    colorString = "#58cb7d";
                    break;
                case 2:
                    colorString = "#ed5454";
                    break;
            }
            return colorString;
        },
        nodesStatus: function(val) {
            let transString = "";
            switch (val) {
                case 1:
                    transString = "运行";
                    break;
                case 2:
                    transString = "异常";
                    break;
            }
            return transString;
        },
        createFront: function() {
            this.frontShow = true;
        },
        deleteNodes(val, type) {
            this.nodesDialogOptions = {
                type: type,
                data: val
            };
            this.nodesDialogVisible = true;
            this.nodesDialogTitle = "删除节点";
        },
        close(val) {
            this.frontShow = false;
            Bus.$emit("addFront")
            this.getFrontTable()
        },
        showDetail(item) {
            if(item.nodeType===2) return;
            this.$router.push({ path: 'hostDetail', query: { 'nodeIp': item.nodeIp, 'nodeId': item.nodeId}});
        },
        deletedFront: function(val){
            this.$confirm('确认删除？')
                .then(_ => {
                    deleteFront(val.frontId).then(res => {
                        if(res.data.code ===0){
                            Bus.$emit("deleteFront")
                            this.getFrontTable()
                        }else{
                            this.$message({
                                message: errcode.errCode[res.data.code].cn,
                                type: "error",
                                duration: 2000
                            });
                        }
                    }).catch(err => {
                        this.$message({
                            message: "系统错误",
                            type: "error",
                            duration: 2000
                        });
                    })
                }).catch(_=> {

                })
        },
        getNodeTable: function() {
            this.loadingNodes = true;
            let groupId = localStorage.getItem("groupId");
            let reqData = {
                    groupId: groupId,
                    pageNumber: this.nodecurrentPage,
                    pageSize: this.nodepageSize
                },
                reqQuery = {};
            getNodeList(reqData, reqQuery)
                .then(res => {
                    this.loadingNodes = false;
                    if (res.data.code === 0) {
                        this.nodetotal = res.data.totalCount;
                        this.nodeData = res.data.data || [];
                        this.nodeData.forEach((value, index) => {
                            if (value.status === 0) {
                                value.value = "运行";
                            } else if (value.status === 1) {
                                value.value = "异常";
                            }
                        });
                    } else {
                        this.nodeData = []
                        this.$message({
                            message: errcode.errCode[res.data.code].cn,
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.nodeData = []
                    this.$message({
                        message: "查询失败！",
                        type: "error",
                        duration: 2000
                    });
                });
        },
    }
};
</script>
<style scoped>
.module-wrapper {
    height: 100%;
}
.search-part {
    padding: 30px 41px 18px 42px;
    overflow: hidden;
}
.search-part::after {
    display: block;
    content: "";
    clear: both;
}
.search-part-left {
    float: left;
}
.search-part-left-btn {
    border-radius: 20px;
}
.search-part-right {
    float: right;
}
.search-table {
    padding: 0 40px 0 41px;
}
.search-table-content {
    width: 100%;
}
.search-table-content>>>td,
.search-table-content>>>th {
    padding: 8px 0;
    font-size: 12px;
}
.search-table-content>>>th {
    color: #8598b0;
}
.search-table-content>>>td {
    color: #737a86;
}
.search-table-detail {
    width: 91%;
    float: right;
}
.search-table-detail>>>td,
.search-table-detail>>>th {
    color: #737a86;
}
.input-with-select>>>.el-input__inner {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border: 1px solid #eaedf3;
    box-shadow: 0 3px 11px 0 rgba(159, 166, 189, 0.11);
}
.input-with-select>>>.el-input-group__append {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 3px 11px 0 rgba(159, 166, 189, 0.11);
}
.input-with-select>>>.el-button {
    border: 1px solid #20D4D9;
    border-radius: inherit;
    background: #20D4D9;
    color: #fff;
}
</style>
