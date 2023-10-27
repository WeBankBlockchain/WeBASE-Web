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
        <!-- <v-content-head :headTitle="$t('title.nodeTitle')" :headSubTitle="$t('title.nodeTitle')" @changGroup="changGroup" ref='heads'></v-content-head> -->
        <nav-menu :headTitle="$t('title.nodeTitle')"></nav-menu>
        <!-- <div class="module-wrapper" >
            <div class="search-part" style="padding-top: 20px;" v-if='deployShow || (configData && (configData.chainStatus == 3 || configData.chainStatus == 4)) '>
                    <div class="search-part-left" v-if='!disabled'>
                        <el-button v-if='deployShow' type="primary" class="search-part-left-btn" @click="deployChain">{{$t('text.deploy')}}</el-button>
                        <el-button type="primary" class="search-part-left-btn" v-if="configData && configData.chainStatus == 3" @click="createFront">{{$t('text.addNode')}}</el-button>
                        <el-button type="primary" class="search-part-left-btn" v-if="configData && (configData.chainStatus == 3 || configData.chainStatus == 4)" @click="reset">{{$t('text.reset')}}</el-button>
                    </div>
                </div>
        </div> -->
        <div class="module-wrapper">
            <div class="search-part" style="padding-top: 30px;" v-if='!disabled'>
                <div class="search-part-left">
                    <!-- <el-button v-if='deployShow' type="primary" class="search-part-left-btn" @click="deployChain">{{$t('text.deploy')}}</el-button> -->
                    <el-button type="primary" class="search-part-left-btn" :disabled="!(configData && configData.chainStatus == 3)" @click="createFront">{{$t('text.addNode')}}</el-button>
                    <!-- <el-button type="primary" class="search-part-left-btn" :disabled='!(configData && (configData.chainStatus == 3 || configData.chainStatus == 2))' @click="reset">{{$t('text.reset')}}</el-button> -->
                </div>
            </div>
            <div class="search-table">
                <el-form style="padding-top: 20px" v-if='chainList' class="chain-info">
                    <el-row>
                        <!-- <el-col :span="12">
                            <el-form-item :label='$t("text.chainName") + "："'>
                                <span>{{chainList.chainName}}</span>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item :label='$t("text.chainVersion") + "："'>
                                <span>{{chainList.version}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label='$t("text.chainType") + "："'>
                                <span v-if='chainList.encryptType === 0'>{{$t("text.sha256")}}</span>
                                <span v-if='chainList.encryptType === 1'>{{$t("text.sm3")}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label='$t("text.chainStatus") + "："'>
                                <span :style="{'color': chainColor(chainList.chainStatus)}">{{ChainStatus(chainList.chainStatus)}}</span>
                                <i class="el-icon-loading" v-if='chainList.chainStatus != 2 && chainList.chainStatus != 3'></i>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label='$t("home.createTime") + "："'>
                                <span>{{changeDate(chainList.createTime)}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!-- <el-table :data="chainList" class="search-table-content" v-loading="loading">
                    <el-table-column :label="$t('text.chainName')" prop="chainName" show-overflow-tooltip></el-table-column>
                    <el-table-column :label="$t('text.chainVersion')" prop="version" show-overflow-tooltip></el-table-column>
                    <el-table-column :label="$t('text.chainStatus')" prop="chainStatus" show-overflow-tooltip>
                        <template slot-scope='scope'>
                            <span v-if='scope.row.chainStatus != 2'>{{ChainStatus(scope.row.chainStatus)}}</span>
                            <span v-if='scope.row.chainStatus == 2'>{{ChainStatus(scope.row.chainStatus)}}-<span class='cursor-pointer' style="color: #f00" @click='openHostInfo'>{{$t("text.errInfo")}}</span></span>
                        </template>
                    </el-table-column>
                </el-table> -->
            </div>
        </div>
        <div class="module-wrapper" style="margin-top: 10px;">
            <div class="search-table">

                <el-table :data="frontData" class="search-table-content" v-loading="loadingNodes" :element-loading-text="loadingTxt" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)" style="padding-bottom: 20px;">
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
                                    <!-- {{Status(scope.row.status)}} -->
                                </span>
                            </template>
                            <template v-else-if="head.enName ==='nodeType'">
                                <span>
                                    {{nodeText(scope.row.nodeType)}}
                                    <span v-if='scope.row.status == 1 && !scope.row.nodeType' class="el-icon-loading"></span>
                                    <span v-if='scope.row.status == 2 && !scope.row.nodeType'>{{$t("nodes.remove")}}</span>
                                </span>
                            </template>

                            <template v-else-if="head.enName ==='operate'">
                                <el-button v-if='scope.row.status == 2 && (configData && configData.chainStatus  == 3)' :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="start(scope.row)">{{$t("text.start")}}</el-button>
                                <el-button v-if='scope.row.status == 1 && scope.row.nodeType == "remove" && (configData && configData.chainStatus  == 3)' :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="stop(scope.row)">{{$t('text.stop')}}</el-button>
                                <el-button v-if='scope.row.status == 5 || ((scope.row.nodeType == "remove" || !scope.row.nodeType) && scope.row.status == 2 && (configData && configData.chainStatus  == 3))' :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="deleted(scope.row)">{{$t("text.delete")}}</el-button>
                                <el-button v-if='scope.row.status == 1 && (configData && configData.chainStatus  == 3)' :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="modifyNodeType(scope.row)">{{$t("text.update")}}</el-button>
                                <el-button v-if='scope.row.status == 1 && (configData && configData.chainStatus  == 3)' :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="restartNode(scope.row)">{{$t("text.restart")}}</el-button>
                            </template>
                            <template v-else>
                                <span>{{scope.row[head.enName]}}</span>
                            </template>
                        </template>

                    </el-table-column>
                </el-table>
                <v-setFront :show='frontShow' v-if='frontShow' :showClose='true' @close='close'></v-setFront>
                <el-dialog :title="$t('nodes.updateNodesType')" :visible.sync="modifyDialogVisible" width="387px" v-if="modifyDialogVisible" center>
                    <modify-node-type @nodeModifyClose="nodeModifyClose" @nodeModifySuccess="nodeModifySuccess" :modifyNode="modifyNode"></modify-node-type>
                </el-dialog>
                <add-node v-if='addNodeShow' :show='addNodeShow' @close='addNodeClose'></add-node>
                <new-node v-if='newNodeShow' :show='newNodeShow' @close='newNodeClose' :data='frontData'></new-node>
                <update-node v-if='updateNodeShow' :show='updateNodeShow' @close='updateNodeClose' @success='updateNodeSuccess'></update-node>
                <!-- <delete-node v-if='deleteNodeShow' :show='deleteNodeShow' @close='deleteNodeClose' :data='nodeData'></delete-node> -->
                <set-config :show='configShow' v-if='configShow' @close='closeConfig' @success='successConfig'></set-config>
                <host-info v-if='hostInfoShow' :show='hostInfoShow' @close='hostInfoClose'></host-info>
            </div>
        </div>
    </div>
</template>

<script>
// import contentHead from "@/components/contentHead";
import modifyNodeType from "./components/modifyNodeType";
import {
    getFronts, addnodes, deleteFront, getNodeList,
    getConsensusNodeId, getGroupsInvalidIncluded, startNode, stopNode, getChainInfo, getProgress, deleteChain, encryption, getVersion, startChainData, deleteNode,
    getFrontStatus, restartNode, initAuthAdmin, getPermissionManagementStatus
} from "@/util/api";
import { format, unique, dynamicPoint } from "@/util/util";
import setFront from "../index/dialog/setFront.vue"
import setConfig from "../index/dialog/setConfig"
import addNode from "./dialog/addNode"
import newNode from "./dialog/newNode"
import updateNode from "./dialog/updateNode"
import Bus from "@/bus"
import guideImg from "@/../static/image/guide.69e4d090.png"
import hostInfo from "./dialog/hostInfo"
import navMenu from "@/components/navs/navMenu";
export default {
    name: "node",
    components: {
        // "v-content-head": contentHead,
        "v-setFront": setFront,
        modifyNodeType,
        "add-node": addNode,
        'new-node': newNode,
        'update-node': updateNode,
        'set-config': setConfig,
        "host-info": hostInfo,
        "nav-menu": navMenu,
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
            chainList: null,
            hostInfoShow: false,
            loadingTxt: this.$t('text.loading'),
            optShow: false,
            groupId:localStorage.getItem('groupId') ? localStorage.getItem('groupId') : '',
            sdkDialogVisible: false,
            sdkParam:{},
            enableAuth: this.$route.query.enableAuth,
            isAuthEnable: false
        };
    },
    computed: {
        frontHead() {
            let data = [
                {
                    enName: "frontIp",
                    name: this.$t("nodes.ip"),
                    width: 120
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
                    width: 100
                },
                {
                    enName: "nodeType",
                    name: this.$t("nodes.nodeStyle"),
                    width: 100
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
    beforeDestroy: function () {
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
        Bus.$on("changeConfig", data => {
            this.getData();
        })
        if (this.enableAuth == "1") {
            this.isAuthEnable = true;
        } else {
            this.checkAuth();
        }
        this.getConfigList();
        this.getData();
    },
    methods: {
        changeDate(val) {
            let data;
            data = format(val, "yyyy-MM-dd HH:mm:ss")
            return data
        },
        hostInfoClose: function () {
            this.hostInfoShow = false
        },
        openHostInfo: function () {
            this.hostInfoShow = true
        },
        getEncryption: function () {
            this.groupId=localStorage.getItem('groupId')
            encryption(this.groupId).then(res => {
                if (res.data.code === 0) {
                    // if(res.data.data == 1){
                    //     this.encryption = 'guomi'
                    // }else{
                    //     this.encryption = 'hash'
                    // }
                    localStorage.setItem("encryptionId", res.data.data)
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
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        // 动态小数点
        getProgresses: function (val) {
            clearInterval(this.progressInterval)
            let number = 0
            this.progressInterval = setInterval(() => {
                number = number + 1
                if (val) {
                    this.loadingTxt = dynamicPoint(val, number)
                } else {
                    this.loadingTxt = dynamicPoint(this.$t('text.loading'), number)
                }
            }, 500)
        },
        deployChain: function () {
            this.configShow = true
        },
        closeConfig: function () {
            this.configShow = false;
            this.getData()
        },
        successConfig: function () {
            this.configShow = false;
            this.getData();
            localStorage.setItem("config", 1)
            // this.getProgresses()
        },
        getData: function () {
            this.number = 0;
            this.loadingNodes = true;
            if (this.frontInterval) {
                clearInterval(this.frontInterval)
            }
            this.getFrontStatus()
            this.getProgresses()
            // this.getConfigList()
            this.frontInterval = setInterval(() => {
                this.getFrontStatus()
                // this.getConfigList();
                this.number++
                if (this.number == 400) {
                    clearInterval(this.frontInterval);
                    this.number = 0;
                }
            }, 10000)
        },
        getVersionList() {
            getVersion().then(res => {
                if (res.status == 200) {
                    this.$store.dispatch('set_mgr_version_action', res.data)
                }
            }).catch(err => {

                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            })
        },
        // 更新front状态  定时器中需要最先执行
        getFrontStatus() {
            getFrontStatus().then(() => {
                this.getConfigList()
            })
        },
        getConfigList: function () {
            getChainInfo().then(res => {
                if (res.data.code === 0) {
                    // clearInterval(this.frontInterval)
                    this.configData = res.data.data;
                    if (res.data.data) {
                        this.chainList = res.data.data
                        localStorage.setItem("configData", res.data.data.chainStatus);
                        if ((res.data.data.chainStatus == 3 || res.data.data.chainStatus == 2) && !this.optShow) {
                            clearInterval(this.progressInterval)
                            this.loadingNodes = false;

                            // 如果链启动成功了，并且是启用了权限治理模式，则需要调用接口，导入自动生成的私钥
                            console.log("!!!!!enableAuth:", this.enableAuth);
                            if (this.enableAuth == "1") {
                                this.initImportAdmin();
                                this.enableAuth = "0";
                            }
                        } else {
                            this.getProgresses(this.$t("text.loadingInfo"))
                        }
                    } else {
                        this.chainList = null
                        clearInterval(this.progressInterval)
                        clearInterval(this.frontInterval)
                        localStorage.setItem("configData", 0)
                    }
                    this.getFrontTable();
                } else {
                    clearInterval(this.progressInterval)
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
                    message: err.data || this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });

            });
        },
        /**
         * @method  启动节点
         */
        start: function (val,type) {
            clearInterval(this.frontInterval)
            this.loadingNodes = true;
            let reqData = {
                nodeId: val.nodeId
            }
            // this.loadingTxt = 
            if(!type){
                this.getProgresses(this.$t("text.startingInfo"))
            }
            this.optShow = true
            startNode(reqData).then(res => {
                this.optShow = false
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t("nodes.startSuccess")
                    })
                    this.getData()
                } else {
                    this.getData()
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                }
            })
                .catch(err => {
                    this.getData()
                    this.optShow = false
                    this.loadingNodes = false;
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });

                });
        },
        /**
         * @method  停止节点
         */
        stop: function (val) {
            clearInterval(this.frontInterval)
            this.loadingNodes = true;
            let reqData = {
                nodeId: val.nodeId
            }
            this.optShow = true
            this.getProgresses(this.$t("text.stopingInfo"))
            stopNode(reqData).then(res => {
                this.optShow = false
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t("nodes.stopSuccess")
                    })
                    this.getData()
                } else {
                    this.getData()
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                }
            })
                .catch(err => {
                    this.optShow = false
                    this.getData()
                    this.loadingNodes = false;
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });

                });
        },
        /**
         * @method  重启
         */
        restartNode(val) {
            let text = this.$t("text.restartIndfo2")
            if(val&& val.nodeType === "sealer"){
                text = this.$t("text.restartIndfo1")
            }
            this.$confirm(text, this.$t("text.restart"), {
                confirmButtonText: this.$t("text.sure"),
                cancelButtonText: this.$t("text.cancel"),
                type: 'warning'
            }).then(() => {
                this.restart(val)
            }).catch(err => {
                console.log(err)
            })
        },
        restart(val) {
            clearInterval(this.frontInterval)
            this.loadingNodes = true;
            let reqData = {
                nodeId: val.nodeId
            }
            this.optShow = true
            this.getProgresses(this.$t("text.restartingInfo"))
            restartNode(reqData).then(res => {
                if(res.data.code === 0){
                    this.start(val,true)
                }else {
                    this.getData()
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                }
            })
                .catch(err => {
                    this.optShow = false
                    this.getData()
                    this.loadingNodes = false;
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });

                });
        },
        /**
         * @method 打开修改弹窗
         */
        update: function () {
            this.updateNodeShow = true
        },
        /**
         * @method  重置链
         */
        reset() {
            this.$confirm(this.$t("text.deleteChain"), this.$t("text.delete"), {
                confirmButtonText: this.$t("text.sure"),
                cancelButtonText: this.$t("text.cancel"),
                type: 'warning'
            }).then(() => {
                clearInterval(this.frontInterval);
                this.loadingNodes = true;
                this.loading = true;
                this.optShow = true
                this.getProgresses(this.$t("text.resetingInfo"))
                deleteChain().then(res => {
                    this.optShow = false
                    if (res.data.code === 0) {
                        this.$message({
                            type: "success",
                            message: this.$t('text.resetSuccess'),
                            duration: 2000
                        });
                        this.$router.push({
                            path: "/node/chain",
                        })
                        this.$store.dispatch('set_contract_dataList_action', []);
                        localStorage.setItem("contractList", JSON.stringify([]))
                        localStorage.setItem("groupId", null)
                        this.configData = null;
                        this.loadingNodes = false;
                        this.loading = false;
                        this.getConfigList();
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code),
                            duration: 2000
                        });
                    }
                }).catch(err => {
                    this.optShow = false
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('text.cancelDelete')
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
            this.$confirm(this.$t("text.confirmDelete"))
                .then(_ => {
                    this.loadingNodes = true;
                    this.detetedNode(val)
                })
        },
        detetedNode: function (val) {
            let reqData = {
                nodeId: val.nodeId,
            }
            clearInterval(this.frontInterval);
            this.optShow = true
            this.getProgresses(this.$t("text.deletingingInfo"))
            deleteNode(reqData).then(res => {
                this.optShow = false
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t("nodes.dleteNodeSuccess")
                    })
                    this.getData()
                } else {
                    this.getData()
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                }
            })
                .catch(err => {
                    this.getData()
                    this.optShow = false
                    this.loading = false;
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        deleteNodeClose: function () {
            this.deleteNodeShow = false;
            this.getData();
        },
        addNodeClose: function () {
            this.addNodeShow = false;
            this.getData();
        },
        newNodeClose: function () {
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
                frontId: this.frontId,
            }
            getFronts(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        let num = 0;
                        let versionKey;
                        for (let i = 0; i < res.data.data.length; i++) {
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
                        if (localStorage.getItem("nodeVersionChange")) {
                            this.$emit("versionChange")
                        }
                        this.total = res.data.totalCount;
                        this.frontData = res.data.data || [];
                        if (this.frontData.length == 0) {
                            this.deployShow = true
                        } else {
                            this.deployShow = false
                        }
                        if (this.configData && this.configData.chainStatus == 3) {
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
                        message: err.data || this.$t('text.systemError'),
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
                if (res.data.code === 0) {
                    if (res.data.data) {
                        for (let i = 0; i < this.frontData.length; i++) {
                            // this.frontData[i].nodeType = "";
                            for (let index = 0; index < res.data.data.length; index++) {
                                if (this.frontData[i].nodeId == res.data.data[index].nodeId) {
                                    this.$set(this.frontData[i], 'nodeType', res.data.data[index].nodeType)
                                }
                            }
                        }
                    }
                } else {
                    clearInterval(this.frontInterval);
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                }
            }).catch(err => {
                clearInterval(this.frontInterval);
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            })
        },
        getGroupList: function () {
            let _this = this
            getGroupsInvalidIncluded().then(res => {
                if (res.data.code === 0) {
                    try {
                        if (res.data.data && res.data.data.length) {
                            if (!localStorage.getItem("groupId")) {
                                localStorage.setItem("groupId", res.data.data[0].groupId)
                                localStorage.setItem("chainId", res.data.data[0].chainId)
                                localStorage.setItem("chainName", res.data.data[0].chainName)
                            }
                            if (!localStorage.getItem("groupName")) {
                                localStorage.setItem("groupName", res.data.data[0].groupName);
                            }
                            if (res.data.data.length > 0) {
                                Bus.$emit("changeHeadGroup")
                            }
                        }
                    } catch (error) {
                        console.log(error)
                    }

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
        ChainStatus(val) {
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
                    str = this.$t('text.restarting');
                    break;
                case 5:
                    str = this.$t('nodea.upgrading');
                    break;
                case 6:
                    str = this.$t('text.upgradeFailed');
                    break;
                case 7:
                    str = this.$t('text.addingNode');
                    break;
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
            this.$router.push({
                path: `/node/node`,
            })
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
                    // this.loadingNodes = false;
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
            this.modifyNode.isAuthEnable = this.isAuthEnable;
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
        },
        chainColor(val) {
            let colorString = "";
            switch (val) {
                case 0:
                    colorString = "#E6A23C";
                    break;
                case 1:
                    colorString = "#E6A23C";
                    break;
                case 2:
                    colorString = "#F56C6C";
                    break;
                case 3:
                    colorString = "#67C23A";
                    break;
                case 4:
                    colorString = "#E6A23C";
                    break;
            }
            return colorString;
        },

        initImportAdmin() {
            let reqQuery = {
                chainName: this.chainList.chainName,
                encryptType: this.chainList.encryptType,
                userName: "admin_auth",
                groupId: localStorage.getItem("groupId"),
                description: "初始治理账户",
                account: localStorage.getItem("user")
            };
            initAuthAdmin(reqQuery)
                .then(res => {
                    const { data, status } = res;
                    console.log("initAuthAdmin, res data:", data);
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError'),
                    });
                });
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
                .catch((err) => { });
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
.guide-title {
    width: 100%;
    padding: 30px 0 50px 0;
    font-size: 24px;
    color: #000;
    text-align: center;
}
.guide-item {
    padding-bottom: 60px;
    text-align: center;
}
.guide-item-title {
    font-size: 24px;
    color: #000;
}
.guide-item-img {
    margin: 0 60px;
}
.guide-content {
    padding-left: 10%;
    color: #999;
}
.guide-content-item {
    padding: 20px 0;
}
.guide-content-title {
    display: inline-block;
    color: #000;
}
.chain-info >>> .el-form-item__label {
    line-height: 16px;
}
.chain-info >>> .el-form-item__content {
    line-height: 16px;
}
</style>
