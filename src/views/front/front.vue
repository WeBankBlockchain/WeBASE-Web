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
    <div class="front-module">
        <v-content-head :headTitle="$t('title.nodeTitle')" @changGroup="changGroup" ref='head'></v-content-head>
        <div class="module-wrapper" >
            <div class="search-part" style="padding-top: 20px;" v-if='deployShow || (configData && (configData.chainStatus == 3 || configData.chainStatus == 4)) '>
                    <div class="search-part-left" v-if='!disabled'>
                        <el-button v-if='deployShow' type="primary" class="search-part-left-btn" @click="deployChain">{{$t('text.deploy')}}</el-button>
                        <el-button type="primary" class="search-part-left-btn" v-if="configData && configData.chainStatus == 3" @click="createFront">{{$t('text.addNode')}}</el-button>
                        <el-button type="primary" class="search-part-left-btn" v-if="configData && (configData.chainStatus == 3 || configData.chainStatus == 4)" @click="reset">{{$t('text.reset')}}</el-button>
                    </div>
                </div>
        </div>
        <div class="module-wrapper" style="margin-top: 10px;">
            <div class="search-table">
                    <el-table :data="chainList" class="search-table-content" v-loading="loading">
                        <el-table-column label="链名称" prop="chainName" show-overflow-tooltip></el-table-column>
                        <el-table-column label="链版本" prop="version" show-overflow-tooltip></el-table-column>
                        <el-table-column label="链状态" prop="chainStatus" show-overflow-tooltip>
                            <template slot-scope='scope'>
                                <span>{{ChainStatus(scope.row.chainStatus)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="链进度" show-overflow-tooltip>
                            <template v-if='configData && configData.chainStatus != 3'>
                                <el-progress v-if='statusNumber || statusNumber == 0' :percentage="statusNumber" status="success" :showText='false'></el-progress>
                            </template>
                            <template v-else>
                                <span>链已部署完成</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
        </div>
        <div class="module-wrapper" style="margin-top: 10px;">
            <div class="search-table">
                
                
                <el-table :data="frontData" class="search-table-content" v-loading="loadingNodes" style="padding-bottom: 20px;">
                    <el-table-column v-for="head in frontHead" :label="head.name" :key="head.enName" show-overflow-tooltip :width='head.width'>
                        <template slot-scope="scope">
                            <template v-if='head.enName === "frontIp"'>
                                <span>
                                    <router-link :to="{'path': 'hostDetail', 'query': {nodeIp: scope.row['frontIp'], nodeId: scope.row['frontId']}}" class="link">{{scope.row[head.enName]}}</router-link>
                                </span>
                            </template>
                            <template v-else-if="head.enName ==='status'">
                                <span v-if='configData && configData.chainStatus  == 3'>
                                    <i :style="{'color': textColor(scope.row[head.enName])}" class="wbs-icon-radio font-6"></i> {{Status(scope.row.status)}}
                                </span>
                                <span v-else-if='configData'>
                                    <i style="color: #f00" class="wbs-icon-radio font-6"></i>
                                </span>
                            </template>
                            <template v-else-if="head.enName ==='nodeType'">
                                <span>
                                    {{nodeText(scope.row.nodeType)}}
                                    <span v-if='!scope.row.nodeType' class="el-icon-loading"></span>
                                </span>
                            </template>
                            <template v-else-if="head.enName ==='operate'">
                                <el-button v-if='scope.row.status == 2 && (configData && configData.chainStatus  == 3)' :disabled="disabled" type="text" size="small" 
                                :style="{'color': disabled?'#666':''}" @click="start(scope.row)">{{$t("text.start")}}</el-button>
                                <el-button v-if='scope.row.status == 1 && scope.row.nodeType == "remove" && (configData && configData.chainStatus  == 3)' 
                                :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="stop(scope.row)">{{$t('text.stop')}}</el-button>
                                <el-button v-if='scope.row.status == 5 || ((scope.row.nodeType == "remove" || !scope.row.nodeType) && scope.row.status == 2 && (configData && configData.chainStatus  == 3))'  
                                :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="deleted(scope.row)">{{$t("text.delete")}}</el-button>
                                <el-button v-if='scope.row.status == 1 && (configData && configData.chainStatus  == 3)'  :disabled="disabled" type="text" size="small" 
                                :style="{'color': disabled?'#666':''}" @click="modifyNodeType(scope.row)">{{$t("text.update")}}</el-button>
                            </template>
                            <template v-else>
                                <span>{{scope.row[head.enName]}}</span>
                            </template>
                        </template>

                    </el-table-column>
                </el-table>
                <el-pagination v-show='total > 10' class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
                <v-setFront :show='frontShow' v-if='frontShow' :showClose='true' @close='close'></v-setFront>
                <el-dialog :title="$t('nodes.updateNodesType')" :visible.sync="modifyDialogVisible" width="387px" v-if="modifyDialogVisible" center>
                    <modify-node-type @nodeModifyClose="nodeModifyClose" @nodeModifySuccess="nodeModifySuccess" :modifyNode="modifyNode"></modify-node-type>
                </el-dialog>
                <add-node v-if='addNodeShow' :show='addNodeShow' @close='addNodeClose'></add-node>
                <new-node v-if='newNodeShow' :show='newNodeShow' @close='newNodeClose' :data='frontData'></new-node>
                <update-node v-if='updateNodeShow' :show='updateNodeShow' @close='updateNodeClose' @success='updateNodeSuccess'></update-node>
                <delete-node v-if='deleteNodeShow' :show='deleteNodeShow' @close='deleteNodeClose' :data='nodeData'></delete-node>
                <set-config :show='configShow' v-if='configShow' @close='closeConfig' @success='successConfig'></set-config>
            </div>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import modifyNodeType from "./components/modifyNodeType";
import { getFronts, addnodes, deleteFront, getNodeList, 
getConsensusNodeId,getGroupsInvalidIncluded,startNode,stopNode,getChainInfo,getProgress,deleteChain,encryption,getVersion } from "@/util/api";
import { date, unique } from "@/util/util";
import errcode from "@/util/errcode";
import setFront from "../index/dialog/setFront.vue"
import setConfig from "../index/dialog/setConfig"
import addNode from "./dialog/addNode"
import newNode from "./dialog/newNode"
import updateNode from "./dialog/updateNode"
import deleteNode from "./dialog/deleteNode"
import Bus from "@/bus"
import guideImg from "@/../static/image/guide.69e4d090.png"
export default {
    name: "node",
    components: {
        "v-content-head": contentHead,
        "v-setFront": setFront,
        modifyNodeType,
        "add-node": addNode,
        'new-node': newNode,
        'update-node': updateNode,
        "delete-node": deleteNode,
        'set-config': setConfig
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
            nodesDialogTitle: "",
            nodesDialogOptions: {},
            frontId: null,
            loadingNodes: false,
            nodeData: [],
            urlQuery: this.$root.$route.query,
            disabled: false,
            modifyNode: {},
            modifyDialogVisible: false,
            addNodeShow: false,
            frontInterval: null,
            newNodeShow: false,
            updateNodeShow: false,
            deleteNodeShow: false,
            nodeData: null,
            configData: null,
            frontIntervar1: null,
            configShow: false,
            guideShow: false,
            guideImg: guideImg,
            deployShow: false,
            progressInterval: null,
            statusNumber: null,
            number: 0,
            chainList: []
        };
    },
    computed: {
        frontHead() {
            let data = [
                {
                    enName: "frontIp",
                    name: this.$t("nodes.ip")
                },
                {
                    enName: "frontPort",
                    name: this.$t("nodes.frontPort")
                },
                {
                    enName: "nodeId",
                    name: this.$t("home.nodeId")
                },
                {
                    enName: "clientVersion",
                    name: this.$t("nodes.version")
                },
                {
                    enName: "agency",
                    name: this.$t("nodes.agency")
                },
                {
                    enName: "createTime",
                    name: this.$t("home.createTime")
                },
                {
                    enName: "status",
                    name: this.$t("home.status"),
                    width: 150
                },
                {
                    enName: "nodeType",
                    name: this.$t("nodes.nodeStyle"),
                    width: 180
                },
                {
                    enName: "operate",
                    name: this.$t("nodes.operation"),
                    width: 180
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
                {
                    enName: "pbftView",
                    name: "pbftView",
                    width: 180
                },
                {
                    enName: "nodeActive",
                    name: this.$t("home.status"),
                    width: 150
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
    beforeDestroy: function() {
        Bus.$off("changeConfig");
        clearInterval(this.frontInterval);
        clearInterval(this.progressInterval)
    },
    mounted() {
        if (localStorage.getItem("root") === "admin") {
            this.disabled = false
        } else {
            this.disabled = true
        }
        Bus.$on("changeConfig",data => {
            this.getData();
        })
        this.getConfigList();
        this.getData();
        // if(localStorage.getItem("config") != 0){
        //     this.getProgresses();
        // }
    },
    methods: {
        getEncryption: function(){
            encryption().then(res => {
                if(res.data.code === 0){
                    // if(res.data.data == 1){
                    //     this.encryption = 'guomi'
                    // }else{
                    //     this.encryption = 'hash'
                    // }
                    localStorage.setItem("encryptionId",res.data.data)
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
        getProgresses: function () {
            clearInterval(this.progressInterval)
            this.progressInterval = setInterval ( () => {
                this.getProgressData()
            },1000)
        },
        getProgressData: function () {
            getProgress().then(res => {
                if(res.data.code === 0){
                    this.statusNumber = res.data.data
                    if(this.statusNumber == 10 || this.statusNumber == -1){
                        localStorage.setItem("config",0)
                        clearInterval(this.progressInterval)
                    }
                }else{
                    localStorage.setItem("config",0)
                    clearInterval(this.progressInterval)
                    this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                }
            })
            .catch(err => {
                localStorage.setItem("config",0)
                clearInterval(this.progressInterval)
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                    
                });
        },
        deployChain: function () {
            this.configShow = true
        },
        closeConfig: function() {
            this.configShow = false;
            this.getData()
        },
        successConfig: function() {
            this.configShow = false;
            this.getData();
            localStorage.setItem("config",1)
            this.getProgresses()
        },
        getData: function () {
            this.number = 0;
            this.loadingNodes = true;
            if(this.frontInterval){
                clearInterval(this.frontInterval)
            }
            this.getConfigList()
            this.frontInterval = setInterval(() => {
                this.getConfigList();
                this.number++
                if(this.number == 400){
                    clearInterval(this.frontInterval);
                    this.number = 0;
                }
            },10000)
        },
        getVersionList () {
            getVersion().then(res => {
                if(res.status == 200) {
                    this.$store.dispatch('set_mgr_version_action',res.data)
                }
            }).catch(err => {
                
                this.$message({
                    message: this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            })
        },
        getConfigList: function () {
            getChainInfo().then(res => {
                if(res.data.code === 0) {
                    
                    this.configData = res.data.data;
                    if(res.data.data){
                        this.chainList = [res.data.data]
                        localStorage.setItem("configData",res.data.data.chainStatus);
                        if(res.data.data.chainStatus != 3){
                            this.getProgresses();
                        }else{
                            clearInterval(this.progressInterval)
                        }
                    }else{
                        this.chainList = []
                        clearInterval(this.frontInterval)
                        localStorage.setItem("configData",0)
                    }
                    this.getFrontTable();
                }else{
                    clearInterval(this.frontInterval)
                    this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                }
            }).catch(err => {
                    clearInterval(this.frontInterval)
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                    
                });
        },
        start: function (val) {
            this.loadingNodes = true;
            let reqData = {
                nodeId: val.nodeId
            }
            startNode(reqData).then(res => {
                this.loadingNodes = false;
                if(res.data.code === 0){
                    this.$message({
                        type: "success",
                        message: this.$t("nodes.startSuccess")
                    })
                    this.getData()
                }else{
                    this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                }
            })
            .catch(err => {
                this.loadingNodes = false;
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                    
                });
        },
        stop: function (val) {
            this.loadingNodes = true;
            let reqData = {
                nodeId: val.nodeId
            }
            stopNode(reqData).then(res => {
                this.loadingNodes = false;
                if(res.data.code === 0){
                    this.$message({
                        type: "success",
                        message: this.$t("nodes.stopSuccess")
                    })
                    this.getData()
                }else{
                    this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                }
            })
            .catch(err => {
                this.loadingNodes = false;
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                    
                });
        },
        update: function () {
            this.updateNodeShow = true
        },
        reset () {
            this.$confirm(this.$t("text.deleteChain"), this.$t("text.delete"), {
                confirmButtonText: this.$t("text.sure"),
                cancelButtonText: this.$t("text.cancel"),
                type: 'warning'
                }).then(() => {
                    clearInterval(this.frontInterval);
                    this.loadingNodes = true;
                    this.loading = true;
                    deleteChain().then(res => {
                        if(res.data.code === 0){
                            this.$message({
                                type: "success",
                                message: this.$t('text.resetSuccess'),
                                duration: 2000
                            });
                            this.configData = null;
                            this.loadingNodes = false;
                            this.loading = false;
                            this.getConfigList();
                        }else{
                            this.$message({
                                type: "error",
                                message: this.$chooseLang(res.data.code),
                                duration: 2000
                            }); 
                        }
                    }).catch (err => {
                        this.$message({
                            message: this.$t('text.systemError'),
                            type: "error",
                            duration: 2000
                        });
                    })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        updateNodeClose: function () {
            this.updateNodeShow = false;
            this.getData()
        },
        updateNodeSuccess: function () {
            this.updateNodeShow = false;
            this.getData();
        },
        deleted: function (val) {
            this.nodeData = val;
            this.deleteNodeShow = true
        },
        deleteNodeClose: function () {
            this.deleteNodeShow = false;
            this.getData();
        },
        addNodeClose: function() {
            this.addNodeShow = false;
            this.getData();
        },
        newNodeClose: function() {
            this.newNodeShow = false;
            this.getData();
            // this.getProgresses();
        },
        changGroup() {
            this.getFrontTable();
            this.getData();
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
                        for(let i = 0; i < res.data.data.length; i++){
                            if(res.data.data[i].clientVersion){
                                this.$store.dispatch('set_version_action',res.data.data[i].clientVersion)
                            }
                        }
                        this.total = res.data.totalCount;
                        this.frontData = res.data.data || [];
                        this.loadingNodes = false;
                        if(this.frontData.length == 0){
                            this.deployShow = true 
                        }else{
                            this.deployShow = false
                        }
                        if(this.configData && this.configData.chainStatus == 3){
                            this.getEncryption();
                            this.getGroupList();
                            this.getConsensus();
                            this.getVersionList()
                        }
                    } else {
                        this.loadingNodes = false;
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                        
                    }
                })
                .catch(err => {
                    this.loadingNodes = false;
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                    
                });
        },
        getConsensus: function () {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: 1,
                pageSize: 100
            }
            getConsensusNodeId(reqData).then(res => {
                if(res.data.code === 0){
                    if(res.data.data){
                        for(let i = 0; i < this.frontData.length; i++){
                        // this.frontData[i].nodeType = "";
                            for(let index = 0; index < res.data.data.length; index++){
                                if(this.frontData[i].nodeId == res.data.data[index].nodeId){
                                    this.$set(this.frontData[i],'nodeType',res.data.data[index].nodeType)
                                }
                            }
                        }
                    } 
                }else{
                    this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                }
            }).catch(err => {
                debugger
                this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
            })
        },
        getGroupList: function(){
            let _this = this
            getGroupsInvalidIncluded().then(res => {
                if(res.data.code === 0){
                    if(res.data.data && res.data.data.length){
                        if(!localStorage.getItem("groupId")){
                            localStorage.setItem("groupId",res.data.data[0].groupId)
                        }
                        if(!localStorage.getItem("groupName")){
                            localStorage.setItem("groupName",res.data.data[0].groupName);
                        }
                        if(res.data.data.length > 0){
                            _this.$refs.head.getGroupList()
                        }
                    }
                }else{
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.$message({
                    message: this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            })
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
            this.getFrontTable();
        },
        nodeCurrentChange(val) {
            this.nodecurrentPage = val;
            this.getFrontTable()
        },
        textColor(val) {
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
        nodesStatus(val) {
            let transString = "";
            switch (val) {
                case 1:
                    transString = this.$t("home.run");
                    break;
                case 2:
                    transString = this.$t("home.unusual");
                    break;
            }
            return transString;
        },
        ChainStatus (val) {
            let str = ""
            switch (val) {
                case 0:
                    str = this.$t('nodes.initialize');
                    break;
                case 1:
                    str = this.$t('text.deploying');
                    break;
                case 2:
                    str = this.$t('text.deployFail');
                    break;
                case 3:
                    str = this.$t('text.running');
                    break;
                case 4:
                    str = this.$t('text.restarting')
            }
            return str;
        },
        nodeText(key) {
            var str = '';
            switch (key) {
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
        createFront() {
            this.newNodeShow = true;
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
                            message: this.$t('text.systemError'),
                            type: "error",
                            duration: 2000
                        });
                    })
                }).catch(_ => {

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
                    }else {
                        this.nodeData = [];
                    }

                }))
        },
        modifyNodeType(param) {
            this.modifyNode = param;
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
            this.getFrontTable()
        },
        nodeModifyClose() {
            this.modifyDialogVisible = false
        },
        Status(val) {
            switch (val) {
                case 0:
                    return this.$t("nodes.initialize")
                    break;
                case 1:
                    return this.$t("text.running")
                    break;
                case 2:
                    return this.$t("text.stop")
                    break;
                case 3:
                    return this.$t('text.starting');
                    break;
                case 4:
                    return this.$t("text.adding");
                    break;
                default:
                    return this.$t("text.addFail")
            }
        }
    },
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
.guide-title{
    width: 100%;
    padding: 30px 0 50px 0;
    font-size: 24px;
    color: #000;
    text-align: center;
}
.guide-item{
   padding-bottom: 60px;
    text-align: center;
}
.guide-item-title{
    font-size: 24px;
    color: #000;
}
.guide-item-img{
    margin: 0 60px;
}
.guide-content{
    padding-left: 10%;
    color: #999;
}
.guide-content-item{
    padding: 20px 0;
}
.guide-content-title{
    display: inline-block;
    color: #000;
}
</style>
