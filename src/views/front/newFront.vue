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
        <!-- <v-content-head :headTitle="$t('title.nodeTitle')" @changGroup="changGroup"></v-content-head> -->
        <nav-menu :headTitle="$t('text.chainTitle')" :headSubTitle="$t('title.nodeTitle')"></nav-menu>
        <div class="module-wrapper">
            <h3 style="padding: 20px 0 0 40px;">{{this.$t("nodes.nodeFront")}}</h3>
            <div class="search-part" style="padding-top: 20px;">
                <div class="search-part-left" v-if='!disabled'>
                    <el-button type="primary" class="search-part-left-btn" @click="createFront">{{this.$t("nodes.addFront")}}</el-button>
                </div>
            </div>
            <div class="search-table">
                <el-table :data="frontData" class="search-table-content" v-loading="loading">
                    <el-table-column v-for="head in frontHead" :label="head.name" :key="head.enName" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if='head.enName === "frontIp"'>
                                <router-link :to="{'path': 'hostDetail', 'query': {nodeIp: scope.row['frontIp'], nodeId: scope.row['frontId']}}" class="link">{{scope.row[head.enName]}}</router-link>
                            </span>
                            <span v-else-if="head.enName === 'nodeId'">
                                <i class="wbs-icon-copy font-12" @click="copyNodeIdKey(scope.row[head.enName])" :title="$t('text.copy')"></i>
                                {{scope.row[head.enName]}}
                            </span>
                            <span v-else-if="head.enName === 'status'">
                                <i :style="{'color': textColor(scope.row[head.enName])}" class="wbs-icon-radio font-6"></i> {{nodesStatus(scope.row[head.enName])}}
                            </span>
                            <span v-else>{{scope.row[head.enName]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" :label="$t('nodes.operation')" width="200">
                        <template slot-scope="scope">
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="deletedFront(scope.row)" type="text" size="small">{{$t('text.delete')}}</el-button>
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="exportSdk(scope.row)" type="text" size="small">{{$t('text.exportSdk')}}</el-button>
                            <el-button  @click="viewDetail(scope.row)" type="text" size="small">{{$t('text.detail')}}</el-button>
                            <!-- <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="prcModify(scope.row)" type="text" size="small">{{$t('text.RPC')}}</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-show='total > 10' class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <div class="module-wrapper" style="margin-top: 10px;">
            <div class="search-table">
                <h3 style="padding: 20px 0 8px 0;">
                    {{this.$t("nodes.nodeList")}}
                    <el-tooltip effect="dark" placement="top-start">
                        <div slot="content">{{$t('nodes.nodeDescription')}}</div>
                        <i class="el-icon-info contract-icon font-15"></i>
                    </el-tooltip>
                </h3>
                <el-table :data="nodeData" class="search-table-content" v-loading="loadingNodes" style="padding-bottom: 20px;">
                    <el-table-column v-for="head in nodeHead" :label="head.name" :key="head.enName" show-overflow-tooltip :width='head.width'>
                        <template slot-scope="scope">
                            <template v-if="head.enName!='operate'">
                                <span v-if="head.enName ==='nodeActive'">
                                    <i :style="{'color': textColor(scope.row[head.enName])}" class="wbs-icon-radio font-6"></i> {{nodesStatus(scope.row[head.enName])}}
                                </span>
                                <span v-else-if="head.enName === 'nodeId'">
                                    <i class="wbs-icon-copy font-12" @click="copyNodeIdKey(scope.row[head.enName])" :title="$t('text.copy')"></i>
                                    {{scope.row[head.enName]}}
                                </span>
                                <span v-else-if="head.enName==='nodeType'">{{nodeText(scope.row)}}</span>
                                <span v-else-if="head.enName==='weight'">
                                    {{weightText(scope.row)}}
                                </span>
                                <span v-else>{{scope.row[head.enName]}}</span>
                            </template>
                            <template v-else>
                                <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="modifyNodeType(scope.row)">{{$t("text.update")}}</el-button>
                             <el-button
                  :disabled="disabled"
                  type="text"
                  size="small"
                  :style="{ color: disabled ? '#666' : '' }"
                  @click="remarks(scope.row)"
                  >{{ $t("text.remarks") }}</el-button
                >
                            </template>
                        </template>

                    </el-table-column>
                </el-table>
                <el-pagination v-show='nodetotal > 10' class="page" @size-change="nodeSizeChange" @current-change="nodeCurrentChange" :current-page="nodecurrentPage" :page-sizes="[10, 20, 30, 50]" :page-size="nodepageSize" layout="total, sizes, prev, pager, next, jumper" :total="nodetotal">
                </el-pagination>
        <el-dialog :title="$t('nodes.frontConfig')" :visible.sync="frontShow" v-if="frontShow"  class="dialog-wrapper" width="500px" :center="true" :show-close='false'>
                <v-setFront  :showClose='true' @close='close' @updateSDK='getSDK'></v-setFront>
                    </el-dialog>
                <el-dialog :title="$t('nodes.updateNodesType')" :visible.sync="modifyDialogVisible" width="387px" v-if="modifyDialogVisible" center>
                    <modify-node-type @nodeModifyClose="nodeModifyClose" @nodeModifySuccess="nodeModifySuccess" :modifyNode="modifyNode"></modify-node-type>
                </el-dialog>
                 <el-dialog :title="$t('nodes.modifyPRC')" :visible.sync="PrcDialogVisible" width="600px" v-if="PrcDialogVisible" center>
                    <modify-prc @prcClose="prcClose" @prcSuccess="prcSuccess" :prcParam="prcParam"></modify-prc>
                </el-dialog>
                <el-dialog :show-close='false' :close-on-click-modal="false" :title="$t('title.addSDK')" :visible.sync="sdkDialogVisible" width="600px" v-if="sdkDialogVisible" center>
               <update-sdk @updateSDKsucess="sdkSuccess" :sdkParam="sdkParam" @backSetfront='backSetfront'></update-sdk>                                                                                                                               
        </el-dialog>
        <el-dialog  :close-on-click-modal="false" :title="$t('text.detail')" :visible.sync="detailDialogVisible" width="900px" v-if="detailDialogVisible" center>
              <detail-page @detailClose="detailClose" @detailSuccess="detailSuccess" :detailParam="detailParam"></detail-page>                                                                                                                           
        </el-dialog>
            <el-dialog
          :title="$t('text.remarks')"
          :visible.sync="remarkDialogVisible"
          width="500px"
          v-if="remarkDialogVisible"
          center
        >
          <remark-node
            @nodeRemarkClose="nodeRemarkClose"
            @nodeRemarkSuccess="nodeRemarkSuccess"
            :remarkNode="remarkNode"
          ></remark-node>
        </el-dialog>
            </div> 
        </div>
    </div>
</template>

<script>
import remarkNode from "./components/remarkNode";
// import contentHead from "@/components/contentHead";
import modifyNodeType from "./components/modifyNodeType";
import detailPage from "./components/detailPage";
import updateSDK from "./components/updateSDK";
import { getFronts, addnodes, deleteFront, getNodeList, getConsensusNodeId, getVersion, exportCertSdk, getPermissionManagementStatus } from "@/util/api";
import { date, unique } from "@/util/util";
import setFront from "../index/dialog/setFront.vue"
import Bus from "@/bus"
import navMenu from '@/components/navs/navMenu'
export default {
    name: "newFront",
    components: {
        // "v-content-head": contentHead,
        "v-setFront": setFront,
        modifyNodeType,
        'update-sdk':updateSDK,
        detailPage,
        remarkNode,
        'nav-menu': navMenu
    },
    watch: {
        $route() {
            this.urlQuery = this.$root.$route.query;
        }
    },
    data() {
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
            detailDialogVisible: false,
            nodesDialogTitle: "",
            nodesDialogOptions: {},
            frontId: null,
            loadingNodes: false,
            nodeData: [],
            urlQuery: this.$root.$route.query,
            disabled: false,
            modifyNode: {},
            modifyDialogVisible: false,
            PrcDialogVisible: false,
            sdkDialogVisible: false,
            sdkParam:{},
            detailParam:{},
            remarkDialogVisible: false,
            isAuthEnable: false
        };
    },
    computed: {
        frontHead() {
            let data = [
                {
                    enName: "frontId",
                    name: this.$t("nodes.frontId")
                },
                {
                    enName: "frontIp",
                    name: this.$t("nodes.ip")
                },
                {
                    enName: "frontPort",
                    name: this.$t("nodes.frontPort")
                },
                // {
                //     enName: "nodeId",
                //     name: this.$t("home.nodeId")
                // },
                // {
                //     enName: "clientVersion",
                //     name: this.$t("nodes.version")
                // },
                // {
                //     enName: "agency",
                //     name: this.$t("nodes.agency")
                // },
                {
                    enName: "createTime",
                    name: this.$t("home.createTime")
                },
                {
                    enName: "modifyTime",
                    name: this.$t("nodes.modifyTime")
                },
                {
                    enName: "status",
                    name: this.$t("nodes.status")
                }
            ];
            return data
        },
        nodeHead() {
            let data = [
                {
                    enName: "nodeId",
                    name: this.$t("home.nodeId"),
                    width: ""
                },
                {
                    enName: "nodeType",
                    name: this.$t("nodes.nodeStyle"),
                    width: 180
                },
                {
                    enName: "blockNumber",
                    name: this.$t("home.blockHeight"),
                    width: 180
                },
                // {
                //     enName: "pbftView",
                //     name: "pbftView",
                //     width: 180
                // },
                {
                    enName: "nodeActive",
                    name: this.$t("home.status"),
                    width: 150
                },
                  {
                    enName: "weight",
                    name: this.$t("govCommittee.weight"),
                    width: 180
                },
                {
                    enName: "operate",
                    name: this.$t("nodes.operation"),
                    width: 150
                }
            ];
            return data
        }
    },
    mounted() {
        if (localStorage.getItem("root") === "admin") {
            this.disabled = false
        } else {
            this.disabled = true
        }
        this.getFrontTable();
        this.getNodeTable();
        this.checkAuth();
    },
    methods: {
         remarks(param) {
      this.remarkNode = param;
      this.remarkDialogVisible = true;
    },
        viewDetail(param){
            this.detailParam=param
            this.detailDialogVisible=true
        },
        detailClose(){
            this.detailDialogVisible=false
        },
        detailSuccess(){
            this.detailDialogVisible=true;
        },
        backSetfront(){
            this.sdkDialogVisible=false;
            this.frontShow = true;
        },
                sdkSuccess(){
            this.sdkDialogVisible=false;
        },
          getSDK(){
             this.sdkDialogVisible=true
            },
        getVersionList() {
            getVersion().then(res => {
                if (res.status == 200) {
                    this.version = res.data;
                    this.$store.dispatch('set_mgr_version_action', this.version)
                }
            }).catch(err => {

                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            })
        },
        changGroup() {
            this.getFrontTable();
            this.getNodeTable();
        },
        search() {
            this.currentPage = 1
            this.getFrontTable()
        },
        getFrontTable() {
            let reqData = {
                frontId: this.frontId
            }
            getFronts(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.total = res.data.totalCount;
                        this.frontData = res.data.data || [];
                        this.loading = false;
                        let num = 0;
                        let versionKey;
                        if (!localStorage.getItem("nodeVersionChange")) {
                            for (let i = 0; i < this.frontData.length; i++) {
                                if (res.data.data[i].clientVersion || res.data.data[i].supportVersion) {
                                    this.$store.dispatch('set_version_action', res.data.data[i].clientVersion);
                                    this.$store.dispatch('set_support_version_action', res.data.data[i].supportVersion);
                                    if (res.data.data[i].supportVersion) {
                                        versionKey = res.data.data[i].supportVersion.substring(2, 3)
                                        if (versionKey > 4) {
                                            num++
                                        }
                                    }
                                }
                            }
                            if (num > 0) {
                                localStorage.setItem("nodeVersionChange", 1)
                            } else {
                                localStorage.setItem("nodeVersionChange", "")
                            }
                            this.getVersionList();
                            if (localStorage.getItem("nodeVersionChange")) {
                                this.$emit("versionChange")
                            }
                        }
                    } else {
                        this.loading = false;
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
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });

                });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getFrontTable()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getFrontTable()
        },
        nodeSizeChange(val) {
            this.nodepageSize = val;
            this.nodecurrentPage = 1;
            this.getNodeTable();
        },
        nodeCurrentChange(val) {
            this.nodecurrentPage = val;
            this.getNodeTable()
        },
        textColor(val) {
            let colorString = "";
            switch (val) {
                case 1:
                    colorString = "#67C23A";
                    break;
                case 2:
                    colorString = "#F56C6C";
                    break;
                case 2:
                    colorString = "#E6A23C";
                    break;
                case 2:
                    colorString = "#909399";
                    break;
            }
            return colorString;
        },
        nodesStatus(val) {
            let transString = "";
            switch (val) {
                case 1:
                    transString = this.$t("home.run");
                    break;
                case 2:
                    transString = this.$t("home.unusual");
                    break;
                case 3:
                    transString = this.$t("nodes.starting");
                    break;
                case 4:
                    transString = this.$t("text.down");
                    break;
            }
            return transString;
        },
        nodeText(key) {
            var str = '';
            switch (key.nodeType) {
                case 'sealer':
                    str = this.$t("nodes.sealer");
                    break;
                case 'observer':
                    str = this.$t("nodes.observer");
                    break;
                case 'remove':
                    str = this.$t("nodes.remove");
                    break;
            }
            return str;
        },
        weightText(key) {
            var str = '';
            switch (key.nodeType) {
                case 'sealer':
                    str = key.weight;
                    break;
                case 'observer':
                    str = '-';
                    break;
                case 'remove':
                    str = '-';
                    break;
            }
            return str;
        },
        createFront() {
            this.frontShow = true;
        },
        deleteNodes(val, type) {
            this.nodesDialogOptions = {
                type: type,
                data: val
            };
            this.nodesDialogVisible = true;
            this.nodesDialogTitle = this.$t("nodes.deleteNode");
        },
        close(val) {
            this.frontShow = false;
            Bus.$emit("addFront")
            this.getFrontTable();
            this.getNodeTable();
        },
        showDetail(item) {
            if (item.nodeType === 2) return;
            this.$router.push({ path: 'hostDetail', query: { 'nodeIp': item.nodeIp, 'nodeId': item.nodeId } });
        },
        deletedFront(val) {
            this.$confirm(this.$t("text.confirmDelete"))
                .then(_ => {
                    deleteFront(val.frontId).then(res => {
                        if (res.data.code === 0) {
                            // Bus.$emit("deleteFront")
                            this.getFrontTable();
                            this.getNodeTable()
                        } else {
                            this.$message({
                                message: this.$chooseLang(res.data.code),
                                type: "error",
                                duration: 2000
                            });
                        }
                    }).catch(err => {
                        this.$message({
                            message: err.data || this.$t('text.systemError'),
                            type: "error",
                            duration: 2000
                        });
                    })
                }).catch(_ => {
                })
        },
        exportSdk(val) {
            exportCertSdk(val.frontId).then(res => {
                const { status } = res;
                if (status === 200) {
                    const blob = new Blob([res.data])
                    const fileName = `sdk.zip`
                    if ('download' in document.createElement('a')) { // 非IE下载
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = URL.createObjectURL(blob)
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href) // 释放URL 对象
                        document.body.removeChild(elink)
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName)
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: this.$t('text.haveCertSdk')
                    })
                }

            })
        },
        getNodeTable() {
            this.loadingNodes = true;
            let groupId = localStorage.getItem("groupId");
            let reqData = {
                groupId: groupId,
                pageNumber: 1,
                pageSize: 100
            },
                reqQuery = {},
                reqParam = {
                    groupId: groupId,
                    pageNumber: 1,
                    pageSize: 100
                };
            this.$axios.all([getNodeList(reqData, reqQuery), getConsensusNodeId(reqParam)])
                .then(this.$axios.spread((acct, perms) => {
                    this.loadingNodes = false;
                    if (acct.data.code === 0 && perms.data.code === 0) {
                        var nodesStatusList = acct.data.data, nodesAuthorList = perms.data.data;
                        var nodesStatusIdList = nodesStatusList.map(item => {
                            return item.nodeId
                        })
                        this.nodeData = [];
                        nodesAuthorList.forEach((item, index) => {
                            nodesStatusList.forEach(it => {
                                if (nodesStatusIdList.includes(item.nodeId)) {
                                    if (item.nodeId === it.nodeId) {
                                        this.nodeData.push(Object.assign({}, item, it))
                                    }
                                } else {
                                    this.nodeData.push(item)
                                }
                            })
                        })
                        this.nodeData.forEach(item => {
                            if (item.nodeType === "observer") {
                                item.pbftView = '--';
                            } else if (item.nodeType === "remove") {
                                item.pbftView = '--';
                                item.blockNumber = '--';
                                item.nodeActive = 1;
                            }
                        });
                        this.nodeData = unique(this.nodeData, 'nodeId')
                    } else {
                        this.nodeData = [];
                    }
                }))
        },
        modifyNodeType(param) {
            this.modifyNode = param;
            this.modifyNode.enAbleAuth = this.enAbleAuth;
            this.modifyDialogVisible = true;
        },
        copyNodeIdKey(val) {
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
        nodeModifySuccess() {
            this.modifyDialogVisible = false
            this.getNodeTable()
        },
        nodeModifyClose() {
            this.modifyDialogVisible = false
        },
        prcModify(){
            this.PrcDialogVisible=true
        },
        prcSuccess() {
            this.PrcDialogVisible = false
            this.getNodeTable()
        },
        prcClose() {
            this.PrcDialogVisible = false
        },
            nodeRemarkSuccess() {
      this.remarkDialogVisible = false;
      this.getNodeTable();
    },
    nodeRemarkClose() {
      this.remarkDialogVisible = false;
    },

    checkAuth() {
      getPermissionManagementStatus(localStorage.getItem("groupId"))
        .then((res) => {
          if (res.data.data == true) {
            this.isAuthEnable = true;
          } else {
            this.isAuthEnable = false;
          }
        })
        .catch((err) => {});
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
.search-table-content >>> td,
.search-table-content >>> th {
    padding: 8px 0;
    font-size: 12px;
}
/* .search-table-content>>>th {
    color: #8598b0;
}
.search-table-content>>>td {
    color: #737a86;
} */
.search-table-detail {
    width: 91%;
    float: right;
}
.search-table-detail >>> td,
.search-table-detail >>> th {
    color: #737a86;
}
.input-with-select >>> .el-input__inner {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border: 1px solid #eaedf3;
    box-shadow: 0 3px 11px 0 rgba(159, 166, 189, 0.11);
}
.input-with-select >>> .el-input-group__append {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 3px 11px 0 rgba(159, 166, 189, 0.11);
}
.input-with-select >>> .el-button {
    border: 1px solid #20d4d9;
    border-radius: inherit;
    background: #20d4d9;
    color: #fff;
}
.grayColor {
    color: #666 !important;
}
</style>