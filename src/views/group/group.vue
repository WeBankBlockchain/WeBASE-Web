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
        <v-content-head :headTitle="'节点管理'"></v-content-head>
        <div class="module-wrapper">
            <div class="search-part">
                <div class="search-part-left">
                    <el-button type="primary" class="search-part-left-btn" :disabled="disabled" @click="createNodes">新增节点</el-button>
                </div>
                <div class="search-part-right">
                    <el-input placeholder="请输入节点名称" v-model="nodeName" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="search-table">
                <el-table :data="nodeData" class="search-table-content" v-loading="loading">
                    <el-table-column v-for="head in nodeHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <template v-if="head.enName!='operate'">
                                <span v-if="head.enName ==='nodeActive'">
                                    <i :style="{'color': textColor(scope.row[head.enName])}" class="wbs-icon-radio font-6"></i> {{nodesStatus(scope.row[head.enName])}}
                                </span>
                                <a v-else-if="head.enName === 'nodeIp'" :class="[{'font-color-2956a3':scope.row['nodeType']===1}, {'cursor-pointer':scope.row['nodeType']===1}]" @click="showDetail(scope.row)">{{scope.row[head.enName]}}</a>
                                <span v-else>{{scope.row[head.enName]}}</span>
                            </template>
                            <template v-else>
                                <!-- <el-button type="text" size="small" @click="deleteNodes(scope.row,'delete')" style="color:#ed5454" >删除</el-button> -->
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span>
                                <i :style="{'color': textColor(scope.row['nodeActive'])}" class="wbs-icon-radio font-6"></i>
                                {{nodesStatus(scope.row['nodeActive'])}}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
                <el-dialog :visible.sync="nodesDialogVisible" :title="nodesDialogTitle" width="433px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="nodesDialogVisible">
                    <v-nodesDialog :nodesDialogOptions="nodesDialogOptions" @success="success" @close="close"></v-nodesDialog>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import nodesDialog from "./components/nodesDialog";
import { getNodeList, addnodes } from "@/util/api";
import { date } from "@/util/util";
import errcode from "@/util/errcode";
export default {
    name: "group",
    components: {
        "v-content-head": contentHead,
        "v-nodesDialog": nodesDialog
    },
    watch: {
        $route: function() {
            this.urlQuery = this.$root.$route.query;
        }
    },
    data: function() {
        return {
            nodeName: "",
            nodes: [],
            nodeData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            loading: false,
            nodesLoading: false,
            nodesDialogVisible: false,
            nodesDialogTitle: "",
            nodesDialogOptions: {},
            nodeHead: [
                {
                    enName: "orgName",
                    name: "机构名称"
                },
                {
                    enName: "nodeName",
                    name: "节点名称"
                },
                {
                    enName: "blockNumber",
                    name: "块高"
                },
                {
                    enName: "pbftView",
                    name: "pbftView"
                },
                {
                    enName: "nodeIp",
                    name: "ip"
                },
                {
                    enName: "p2pPort",
                    name: "p2p端口"
                },
                {
                    enName: "rpcPort",
                    name: "rpc端口"
                }
            ],
            urlQuery: this.$root.$route.query,
            disabled: false
        };
    },
    mounted: function() {
        this.getNodeTable();
        if(localStorage.getItem("root") === "admin"){
            this.disabled = false
        }else{
            this.disabled = true
        }
    },
    methods: {
        search: function() {
            this.getNodeTable();
        },
        getNodeTable: function() {
            this.loading = true;
            let networkId = localStorage.getItem("networkId");
            let reqString = `${networkId}/1/100`;
            let reqData = {
                    networkId: networkId,
                    pageNumber: this.currentPage,
                    pageSize: this.pageSize
                },
                reqQuery = {};
            reqQuery = {
                nodeName: this.nodeName.replace(/^\s+|\s+$/g, "")
            };
            getNodeList(reqData, reqQuery)
                .then(res => {
                    if (res.data.code === 0) {
                        this.total = res.data.totalCount;
                        this.nodeData = res.data.data || [];
                        this.nodeData.forEach((value, index) => {
                            if (value.status === 0) {
                                value.value = "运行";
                            } else if (value.status === 1) {
                                value.value = "停止";
                            }
                        });
                        this.loading = false;
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
            this.getNodeTable();
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            this.getNodeTable();
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
                    transString = "停止";
                    break;
            }
            return transString;
        },
        createNodes: function() {
            this.nodesDialogVisible = true;
            this.nodesDialogTitle = "创建节点";
            this.nodesDialogOptions = {
                type: "creat",
                data: {
                    nodeIp: ""
                }
            };
        },
        deleteNodes(val, type) {
            this.nodesDialogOptions = {
                type: type,
                data: val
            };
            this.nodesDialogVisible = true;
            this.nodesDialogTitle = "删除节点";
        },
        success() {
            this.getNodeTable();
        },
        close(val) {
            this.nodesDialogVisible = val;
        },
        showDetail(item) {
            if(item.nodeType===2) return;
            this.$router.push({ path: 'hostDetail', query: { 'nodeIp': item.nodeIp, 'nodeId': item.nodeId}});
        }
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
