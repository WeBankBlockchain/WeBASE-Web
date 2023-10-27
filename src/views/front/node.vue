<template>
    <div>
        <!-- <v-content-head :headTitle="$t('text.chainTitle')" :headSubTitle="$t('title.nodeTitle')" @changeGroup="changeGroup"></v-content-head> -->
        <nav-menu :headTitle="$t('text.chainTitle')" :headSubTitle="$t('title.nodeTitle')" @changGroup="changeGroup"></nav-menu>
        <div class="module-wrapper" style="padding-bottom: 20px">
            <p class="wrapper-title" v-if='type != "node"'>{{$t("text.addChain")}}</p>
            <!-- <p class="wrapper-title" v-if='type == "node"'>新增节点</p> -->
            <el-page-header class="wrapper-title" v-if='type == "node"' @back="goBack" :content="$t('text.addNode')">

            </el-page-header>
            <!-- <div class="link guide" @click='openGuide'>{{$t("text.noviceGuide")}}</div> -->
            <div class="search-part" v-if='type != "node"'>
                <h3>{{$t('text.chainInfo')}} (
                    <span v-if='chainFrom.encryptType == 0'>{{$t("text.sha256")}}</span>
                    <span v-if='chainFrom.encryptType == 1'>{{$t("text.sm3")}}</span>
                    )
                </h3>
                <el-divider></el-divider>
                <el-form :model="chainFrom" :rules='rules' ref="chainFrom" label-width="110px" class="demo-ruleForm">
                    <!-- <el-form-item :label='$t("text.chainType")'>
                        <span v-if='chainFrom.encryptType == 0'>{{$t("text.sha256")}}</span>
                        <span v-if='chainFrom.encryptType == 1'>{{$t("text.sm3")}}</span>
                    </el-form-item> -->
                    <el-form-item :label='$t("text.chainName")' prop='chainName'>
                        <el-input v-model="chainFrom.chainName" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item :label='$t("text.imageMode")' prop='dockerImageType'>
                        <el-radio v-model="chainFrom.dockerImageType" :label="1">{{$t("text.automatic")}}<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo3')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                        </el-radio>
                        <el-radio v-model="chainFrom.dockerImageType" :label="0">{{$t("text.manual")}}<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo2')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                        </el-radio>
                        <!-- <el-radio v-model="chainFrom.dockerImageType" :label="3">dockerhub<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo3')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                        </el-radio> -->
                    </el-form-item>
                    <el-form-item :label='$t("text.enableAuth")' prop='enableAuth'>
                        <el-radio v-model="chainFrom.enableAuth" :label="0">{{$t("text.disable")}}
                        </el-radio>
                        <el-radio v-model="chainFrom.enableAuth" :label="1">{{$t("text.enable")}}
                        </el-radio>
                        <!-- <el-radio v-model="chainFrom.dockerImageType" :label="3">dockerhub<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo3')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                        </el-radio> -->
                    </el-form-item>
                    <!-- <el-form-item :label='$t("text.chainVersion")' prop='chainVersion'>
                        <el-select v-model="chainFrom.chainVersion" :placeholder="$t('text.select')">
                            <el-option v-for="item in configList" :key="item.id" :label="item.configValue" :value="item.configValue">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                </el-form>
            </div>
            <div class="search-part" v-if='type == "node"'>
                <h3>{{$t('text.chainInfo')}}
                    (
                    <span v-if='chainFrom.encryptType == 0'>{{$t("text.sha256")}}</span>
                    <span v-if='chainFrom.encryptType == 1'>{{$t("text.sm3")}}</span>
                    )
                </h3>
                <el-divider></el-divider>
                <el-form v-if='chainFrom' class="chain-info">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item :label='$t("text.chainVersion") + "："'>
                                <span>{{chainFrom.version}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label='$t("text.chainStatus") + "："'>
                                <span :style="{'color': chainColor(chainFrom.chainStatus)}">{{ChainStatus(chainFrom.chainStatus)}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label='$t("home.createTime") + "："'>
                                <span>{{changeDate(chainFrom.createTime)}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item :label='$t("text.imageMode") + "："' prop='dockerImageType'>
                                <el-radio v-model="chainFrom.dockerImageType" :label="1">{{$t("text.automatic")}}<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo3')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                                </el-radio>
                                <el-radio v-model="chainFrom.dockerImageType" :label="0">{{$t("text.manual")}}<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo2')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                                </el-radio>
                                <!-- <el-radio v-model="chainFrom.dockerImageType" :label="3">dockerhub<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo3')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                                </el-radio> -->
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="search-table">
                <div>
                    <h3>{{$t("nodes.nodeList")}}</h3>
                    <el-table :data="frontList" class="search-table-content" v-if='type == "node"'>
                        <el-table-column :label='$t("nodes.ip")' prop="frontIp" show-overflow-tooltip></el-table-column>
                        <el-table-column :label='$t("nodes.frontPort")' prop="frontPort" show-overflow-tooltip></el-table-column>
                        <el-table-column :label="'P2P' + $t('alarm.port')" prop="p2pPort" show-overflow-tooltip></el-table-column>
                        <!-- <el-table-column :label="'Channel' + $t('alarm.port')" prop="channelPort" show-overflow-tooltip></el-table-column> -->
                        <el-table-column :label="'RPC' + $t('alarm.port')" prop="jsonrpcPort" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
                <div :element-loading-text="laodingText" v-loading="loading3" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">
                    <el-divider></el-divider>
                    <el-button type="primary" @click="add">{{$t('text.addNode')}}</el-button>
                    <el-button type="primary" :loading="loading" @click="check()">{{$t('text.check')}}</el-button>
                    <el-button class="clear-right" @click='clearNode'>{{$t("text.clearNode")}}</el-button>

                    <el-table :data="nodeList" class="search-table-content">
                        <el-table-column :label="$t('text.hostTitle')" prop="ip" show-overflow-tooltip></el-table-column>
                        <el-table-column :label="'Front' + $t('alarm.port')" prop="frontPort" show-overflow-tooltip></el-table-column>
                        <el-table-column :label="'P2P' + $t('alarm.port')" prop="p2pPort" show-overflow-tooltip></el-table-column>
                        <!-- <el-table-column :label="'Channel' + $t('alarm.port')" prop="channelPort" show-overflow-tooltip></el-table-column> -->
                        <el-table-column :label="'RPC' + $t('alarm.port')" prop="rpcPort" show-overflow-tooltip></el-table-column>
                        <el-table-column :label="$t('contracts.status')" prop="status" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span :style="{'color': nodeColor(scope.row.status)}">{{Status(scope.row.status)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('nodes.operation')" fixed="right" width='200px'>
                            <template slot-scope='scope'>
                                <el-button type='text' @click="deleteNode(scope.row)">{{$t('text.delete')}}</el-button>
                                <!-- <el-button type='text' v-if='scope.row.status === 5' @click="checkone(scope.row)">{{$t('text.check')}}</el-button> -->
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="padding: 10px 0" class="check-button">
                        <el-button type="primary" :loading="loading1" @click="init('chainFrom')" v-if='!initShow'>{{$t('nodes.initialize')}}</el-button>
                        <el-button type="primary" :loading="loading2" @click="deploy('chainFrom')" v-if='initShow'>{{$t('text.deploy')}}</el-button>
                    </div>
                </div>
                <div style="padding: 30px 0 0 0" v-if='nodeList.length && remarkList.length'>
                    <h3 style="padding-bottom: 20px">{{$t("text.nodeLog")}}</h3>
                    <!-- <el-divider></el-divider> -->
                    <div v-for='(item,index) in remarkList' :key='index'>
                        <div v-if='item.remark'>
                            <p>{{item.ip}}</p>
                            <json-viewer :class="{'danger': (item.status === 3 || item.status === 5 || item.status === 7)}" :value="item.remark" :expand-depth='5' copyable></json-viewer>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <addChainNode v-if="addChainNodeShow" :show="addChainNodeShow" :data='addChainNodeData' :front='frontList' @close='addChainNodeClose' @success="addChainNodeSuccess($event)"></addChainNode>
    </div>
</template>

<script>
// import contentHead from "@/components/contentHead";
import NavMenu from '@/components/navs/navMenu'
import addChainNode from "./dialog/addChainNode"
import { getUserList, getHosts, getConfigList, initChainData, checkPort, checkHost, deployChainData, getChainInfo, addChainNodeData, initCheck, getProgress, getFronts } from "@/util/api"
import { format, dynamicPoint } from "@/util/util"
export default {
    components: {
        // "v-content-head": contentHead,
        addChainNode,
        'nav-menu': NavMenu
    },
    data() {
        return {
            chainFrom: {
                chainName: null,
                encryptType: localStorage.getItem("encryptionId"),
                chainVersion: null,
                dockerImageType: 1,
                enableAuth: 0
            },
            loading: false,   // 检测按钮loading
            loading1: false,  // 初始化按钮loading
            loading2: false,  // 部署按钮loading
            loading3: false,  // 节点列表loading
            nodeList: [],     // 节点列表
            configList: [],    // 链镜像版本
            initShow: false,
            checkShow: true,
            addChainNodeShow: false,
            configType: 1,
            hostList: [],
            configValue: "",
            addChainNodeData: null,
            type: this.$route.params.id,
            chainInfo: null,
            remarkList: [],    // 节点日志数组
            timer: null,      // 定时器
            deployOpt: false,// 判断链是否执行部署操作,
            laodingText: "加载中",  //loading文案
            progressTimer: null,    //progress定时器,
            statusNumber: 0,   /// progess 值
            frontList: [],
            chainCount: this.$route.query ? this.$route.query.chainCount : 0,
        }
    },
    computed: {
        rules() {
            let data = {
                chainName: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' },
                ],
                encryptType: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' },
                ],
                // chainVersion: [
                //     { required: true, message: this.$t('text.notNull'), trigger: 'blur' },
                // ],
                dockerImageType: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' }
                ],
                enableAuth: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' }
                ]
            }
            return data
        }
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer)
        }
        if (this.progressTimer) {
            clearInterval(this.progressTimer)
        }
        // this.$route.query.type === this.type
    },
    mounted() {
        console.log(this.type)
        if (this.type === 'node') {
            this.getChainDetail()
            this.getFrontList()

        } else {
            this.getConfigs();
        }
        if (this.$store.state.nodeList && this.$store.state.nodeList.length) {
            this.nodeList = this.$store.state.nodeList;
        } else if (sessionStorage.getItem("nodeList")) {
            this.nodeList = JSON.parse(sessionStorage.getItem("nodeList"))
        }
    },
    methods: {
        openGuide() {
            this.$router.push("/guide")
        },
        goBack() {
            this.$router.go(-1)
        },
        changeDate(val) {
            let data;
            data = format(val, "yyyy-MM-dd HH:mm:ss")
            return data
        },
        //离开页面，节点状态重置
        resetNodeStatus() {
            for (let i = 0; i < this.nodeList.length; i++) {
                this.nodeList[i].status = -1
            }
            sessionStorage.setItem('nodeList', JSON.stringify(this.nodeList))
            this.$store.dispatch('set_node_list_action', this.nodeList)
        },
        getChainDetail() {
            const chainName = localStorage.getItem('chainName');
            let reqData = {
                chainName: chainName
            }
            getChainInfo(reqData).then(res => {
                if (res.data.code === 0) {
                    this.chainFrom = res.data.data;
                    this.chainFrom.dockerImageType = 1
                    this.$set(this.chainFrom, "dockerImageType", 1)
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
            });
        },
        add() {
            this.addChainNodeShow = true
        },
        deleteNode(val) {
            this.$confirm(this.$t("text.confirmDelete"), this.$t("text.tips"), {
                confirmButtonText: this.$t("text.sure"),
                cancelButtonText: this.$t("text.cancel"),
                type: 'warning'
            }).then(() => {
                this.deleteData(val)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t("text.cancelDelete")
                });
            });
        },
        deleteData(val) {
            for (let i = 0; i < this.nodeList.length; i++) {
                if (this.nodeList[i].id === val.id) {
                    this.nodeList.splice(i, 1)
                }
            }
            sessionStorage.setItem('nodeList', JSON.stringify(this.nodeList))
            this.$store.dispatch('set_node_list_action', this.nodeList)
            if (this.nodeList.length) {
                this.check(this.$t("system.deleteSuccess"))
            }

        },
        /**
         * @param type 1：docker镜像版本
         */
        getConfigs: function (val) {
            let reqData = {
                type: this.configType,
                update: false
            }
            getConfigList(reqData).then(res => {
                if (res.data.code === 0) {
                    if (val) {
                        this.$message({
                            message: this.$t("nodes.dockerRefresh"),
                            type: "success",
                            duration: 2000
                        });
                    }
                    this.configList = [];
                    this.configList = res.data.data
                    console.log(this.chainFrom)
                    this.chainFrom.chainVersion = this.configList[0].configValue
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
        update(val) {
            this.addChainNodeShow = true;
            this.addChainNodeData = val
        },
        changeGroup() {

        },
        handleSizeChange() {

        },
        handleCurrentChange() {

        },
        addChainNodeClose() {
            this.addChainNodeShow = false;
        },
        addChainNodeSuccess(val) {
            if (sessionStorage.getItem("nodeList")) {
                this.nodeList = JSON.parse(sessionStorage.getItem("nodeList"))
            }
            this.addChainNodeShow = false
            this.check(this.$t("text.addNodeInfo"))
        },
        init: function (formName) {
            if (this.nodeList.length == 0) {
                this.$message({
                    type: "error",
                    message: this.$t("text.noAddNodeInfo"),
                })
                return
            } else if (this.checkShow) {
                this.$message({
                    type: "error",
                    message: this.$t('text.checkErrorInfo'),
                })
                return
            }
            if (this.type != "node") {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.nodeList.length < 2) {
                            this.$message({
                                type: "error",
                                message: this.$t("text.nodeCount"),
                            })
                            return
                        }
                        this.laodingText = dynamicPoint(this.$t("text.loadingInit"), 0)
                        this.loading3 = true
                        this.loading1 = true;
                        this.initChain()
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$t("text.chainVersion") + this.$t('text.notNull'),
                        })
                        return false
                    }
                })
            } else {
                this.laodingText = dynamicPoint(this.$t("text.loadingInit"), 0)
                this.loading3 = true
                this.loading1 = true;
                this.initChain()
            }
        },
        check(val) {
            this.deployOpt = false
            console.log(val)
            this.loading3 = true
            this.loading = true;
            let data = this.formatParam();
            let array = [],
                hostDta = []
            for (let i = 0; i < this.nodeList.length; i++) {
                array.push(this.nodeList[i].hostId)
            }
            if (array.length === 0) {
                this.$message({
                    message: this.$t("text.noAddNodeInfo"),
                    type: "error",
                    duration: 2000
                });
                this.loading3 = false
                this.loading = false;
                return
            }
            // 检测开始  先清除定时器，定时器打开
            if (this.progressTimer) {
                clearInterval(this.progressTimer)
            }
            this.getProgressData()
            this.laodingText = dynamicPoint(this.$t("text.laodngCheck"), 0)
            checkHost({ hostIdList: array }).then(res => {
                if (res.data.code === 0) {
                    // this.initShow = false
                    checkPort(data).then(res => {
                        this.loading3 = false
                        this.initShow = false
                        this.loading = false;
                        if (res.data.code === 0) {
                            if (val) {
                                this.$message({
                                    type: "success",
                                    message: val,
                                })
                            } else {
                                this.$message({
                                    type: "success",
                                    message: this.$t("text.checkSuccess"),
                                })
                            }
                            this.checkShow = false;
                            this.getHostList();
                        } else {
                            this.getHostList();
                            this.checkShow = true
                            this.$message({
                                message: this.$chooseLang(res.data.code),
                                type: "error",
                                duration: 2000
                            });
                        }
                    })
                        .catch(err => {
                            this.loading3 = false
                            this.initShow = false
                            this.loading = false;
                            this.getHostList()
                            this.checkShow = true
                            this.$message({
                                message: err.data || this.$t('text.systemError'),
                                type: "error",
                                duration: 2000
                            });
                        });
                } else {
                    this.loading3 = false
                    this.loading = false;
                    this.getHostList()
                    this.initShow = false
                    this.checkShow = true
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    this.loading3 = false
                    this.loading = false;
                    this.checkShow = true
                    this.getHostList()
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    });
                });

        },
        checkone(val) {
            this.loading3 = true
            let data = {
                chainName: this.chainFrom.chainName,
                imageTag: this.chainFrom.chainVersion,
                encryptType: this.chainFrom.encryptType,
                agencyName: "agency1",
                ipconf: [`${val.ip}:1 agency1 1 ${val.p2pPort},${val.channelPort},${val.rpcPort}`],
                deployNodeInfoList: [
                    {
                        hostId: val.hostId,
                        ip: val.ip,
                        frontPort: val.frontPort,
                        p2pPort: val.p2pPort,
                        channelPort: val.channelPort,
                        rpcPort: val.rpcPort
                    }
                ]
            }
            checkPort(data).then(res => {
                this.loading3 = false
                if (res.data.code === 0) {
                    this.getHostList();
                } else {
                    this.getHostList()
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    this.loading3 = false
                    this.getHostList()
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    });
                });
        },
        formatParam(type) {
            let ipconf = [],
                deployNodeInfoList = [],
                hostIdList = []
            // groupid需要动态的（如果是添加节点，那么就是已有的groupid）
            let groupId = this.chainFrom.groupId;

            // 如果是新增链，则以链数量为基准，id为当前数量+1
            if  (this.type != "node") {
                groupId = parseInt(this.chainCount) + 1;
            }

            let agency = 'agency' + groupId;
            for (let i = 0; i < this.nodeList.length; i++) {
                ipconf[i] = `${this.nodeList[i].ip}:1 ${agency} ${groupId} ${this.nodeList[i].p2pPort},${this.nodeList[i].channelPort},${this.nodeList[i].rpcPort}`;
                hostIdList.push(this.nodeList[i].hostId)
                deployNodeInfoList[i] = {};
                deployNodeInfoList[i].hostId = this.nodeList[i].hostId;
                deployNodeInfoList[i].ip = this.nodeList[i].ip;
                deployNodeInfoList[i].frontPort = this.nodeList[i].frontPort;
                deployNodeInfoList[i].p2pPort = this.nodeList[i].p2pPort;
                // deployNodeInfoList[i].channelPort = this.nodeList[i].channelPort;
                deployNodeInfoList[i].rpcPort = this.nodeList[i].rpcPort;
            }
            let data = {
                chainName: this.chainFrom.chainName,
                ipconf: ipconf,
                imageTag: this.chainFrom.chainVersion,
                encryptType: this.chainFrom.encryptType,
                deployNodeInfoList: deployNodeInfoList,
                agencyName: "agency1",
                enableAuth: this.chainFrom.enableAuth
            }
            if (this.type == "node") {
                data.imageTag = this.chainFrom.version;
                data.encryptType = this.chainFrom.encryptType
            }
            let data1 = {
                chainName: this.chainFrom.chainName,
                imageTag: this.chainFrom.chainVersion,
                dockerImageType: this.chainFrom.dockerImageType,
                hostIdList: hostIdList
            }
            console.log(this.chainFrom)
            if (this.type == "node") {
                data1.imageTag = this.chainFrom.version;
            }
            if (type === "init") {
                return data1
            } else {
                return data
            }
        },
        initChain() {
            this.deployOpt = false
            let data = this.formatParam('init')
            initChainData(data).then(res => {
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t('text.initializeStart'),
                    })
                    this.getHostList()
                    this.initTimer()
                } else {
                    this.loading1 = false;
                    this.loading3 = false
                    if (res.data.code === 202466) {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code, res.data.attachment)
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        });
                    }
                }
            })
                .catch(err => {
                    if (err.data && this.statusNumber === 5) {
                        this.$message({
                            message: this.$t('text.initChainTimeout'),
                            type: "error",
                            duration: 2000
                        });
                    } else {
                        this.loading3 = false
                        this.loading1 = false;
                        this.$message({
                            message: err.data || this.$t('text.systemError'),
                            type: "error",
                            duration: 2000
                        });
                    }
                });
        },
        initTimer() {
            this.initCheck()
            this.timer = setInterval(() => {
                this.initCheck()
            }, 3000)
        },
        initCheck() {
            let data = this.formatParam('init')
            initCheck(data).then(res => {
                if (res.data.code === 0) {
                    let num1 = 0,
                        num2 = 0
                    for (let i = 0; i < res.data.data.length; i++) {
                        if (res.data.data[i].status === 2) {
                            num1++
                        } else if (res.data.data[i].status === 3) {
                            num2++
                        }
                    }
                    if (num2 > 0) {
                        this.loading1 = false;
                        this.loading3 = false
                        clearInterval(this.timer)
                        this.getHostList()
                    } else if (num1 === res.data.data.length) {
                        this.initShow = true
                        this.loading1 = false;
                        this.loading3 = false
                        clearInterval(this.timer)
                        this.getHostList()
                    }
                } else {
                    this.initShow = true
                    this.loading1 = false;
                    this.loading3 = false
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    this.initShow = true
                    this.loading3 = false
                    this.loading1 = false;
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    });
                });
        },
        deploy: function (formName) {
            if (this.type != "node") {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.nodeList.length < 2 && this.type != 'node') {
                            this.$message({
                                type: "success",
                                message: this.$t("text.nodeCount"),
                            })
                            return
                        }
                        this.laodingText = dynamicPoint(this.$t("text.loadingDeploy"), 0)
                        this.loading3 = true
                        this.loading2 = true;
                        if (this.type == "node") {
                            this.addNode()
                        } else {
                            this.deployChain()
                        }

                    } else {
                        return false
                    }
                })
            } else {
                this.loading3 = true
                this.loading2 = true;
                if (this.type == "node") {
                    this.addNode()
                } else {
                    this.deployChain()
                }
            }
        },
        deployChain() {
            let data = this.formatParam()
            deployChainData(data).then(res => {
                this.deployOpt = true
                this.loading3 = false
                this.loading2 = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t('text.chainConfigSuccess'),
                    })
                    this.nodeList = []
                    sessionStorage.setItem('nodeList', JSON.stringify(this.nodeList))
                    this.$store.dispatch('set_node_list_action', this.nodeList)
                    this.$router.push({path: "/newNode", query: {enableAuth: this.chainFrom.enableAuth}})
                } else {
                    this.getHostList()
                    this.initShow = false
                    if (res.data.code === 202466) {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code, res.data.attachment)
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        });
                    }
                }
            })
                .catch(err => {
                    if (err.data) {
                        this.initShow = false
                        this.deployOpt = true
                        this.loading3 = false
                        this.loading2 = false;
                        this.$router.push("/newNode")
                        this.nodeList = []
                        sessionStorage.setItem('nodeList', JSON.stringify(this.nodeList))
                        this.$store.dispatch('set_node_list_action', this.nodeList)
                        // this.$message({
                        //     type: "error",
                        //     message: err.data || this.$t('text.systemError')
                        // });
                    }else{
                        this.getHostList()
                        this.initShow = false
                        this.deployOpt = true
                        this.loading3 = false
                        this.loading2 = false;
                        this.$message({
                            type: "error",
                            message: err.data || this.$t('text.systemError')
                        });
                    }
                });
        },
        addNode() {
            let data = this.formatParam()
            const reqData = {
                chainName: data.chainName,
                deployNodeInfoList: data.deployNodeInfoList,
                groupId: 1,
                agencyName: data.agencyName,
                encryptType: data.encryptType
            }
            addChainNodeData(reqData).then(res => {
                this.deployOpt = true
                this.loading3 = false
                this.loading2 = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t("text.addNodeConfigSuccess"),
                    })
                    this.nodeList = []
                    sessionStorage.setItem('nodeList', JSON.stringify(this.nodeList))
                    this.$store.dispatch('set_node_list_action', this.nodeList)
                    this.$router.push("/newNode")
                } else {
                    this.initShow = false
                    this.getHostList()
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    if(err.data) {
                        this.initShow = false
                        this.deployOpt = true
                        this.loading3 = false
                        this.loading2 = false;
                        this.nodeList = []
                        sessionStorage.setItem('nodeList', JSON.stringify(this.nodeList))
                        this.$store.dispatch('set_node_list_action', this.nodeList)
                        this.$router.push("/newNode")
                        // this.$message({
                        //     type: "error",
                        //     message: err.data || this.$t('text.systemError')
                        // });
                    }else{
                        this.getHostList()
                        this.initShow = false
                        this.deployOpt = true
                        this.loading3 = false
                        this.loading2 = false;
                        this.$message({
                            type: "error",
                            message: err.data || this.$t('text.systemError')
                        });
                    }
                    
                });
        },
        getHostList() {
            getHosts().then(res => {
                if (res.data.code === 0|| res.data.code === 200) {
                    this.hostList = res.data.rows;
                    this.changeHostStatus()
                } else {
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    });
                });
        },
        changeHostStatus() {
            for (let i = 0; i < this.nodeList.length; i++) {
                for (let j = 0; j < this.hostList.length; j++) {
                    if (this.nodeList[i].hostId === this.hostList[j].id) {
                        this.nodeList[i].status = this.hostList[j].status
                        this.nodeList[i].remark = this.hostList[j].remark
                        this.$set(this.nodeList, i, this.nodeList[i])
                        if (this.nodeList[i].status === 3) {
                            this.initShow = false;
                        }
                        if (this.nodeList[i].status === 5 || this.nodeList[i].status == 0) {
                            this.checkShow = true;
                        }
                    }
                }
            }
            try {
                this.getRemarkList()
            } catch (error) {
                console.log(error)
            }

        },

        // 查询已部署的节点列表
        getFrontList() {
            getFronts({}).then(res => {
                if (res.data.code === 0) {
                    this.frontList = res.data.data
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
        // 清空节点
        clearNode() {
            this.$confirm(this.$t("text.clearNodeInfo"), this.$t("text.tips"), {
                confirmButtonText: this.$t("text.sure"),
                cancelButtonText: this.$t("text.cancel"),
                type: 'warning'
            }).then(() => {
                this.nodeList = []
                this.initShow = false; 
                sessionStorage.setItem('nodeList', JSON.stringify(this.nodeList))
                this.$store.dispatch('set_node_list_action', this.nodeList)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t("text.Cancelled")
                });
            });
        },
        getRemarkList() {
            this.remarkList = this.distinct(this.nodeList, 'hostId')
        },
        /**
         * @method  进度条定时器
         */
        getProgressData: function () {
            let number = 0
            this.progressTimer = setInterval(() => {
                getProgress().then(res => {
                    if (res.data.code === 0) {
                        this.statusNumber = res.data.data
                        // 根据进度，修改loading文字描述
                        number = number + 1
                        this.laodingText = dynamicPoint(this.$t("progress." + this.statusNumber), number)
                        if (number > 1800) {
                            clearInterval(this.progressTimer)
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
                            message: err.data || this.$t('text.systemError'),
                            type: "error",
                            duration: 2000
                        });

                    });
            }, 1000)
        },
        //数组对象除重
        distinct(arr, key) {
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {
                var flag = true;
                for (var j = 0; j < newArr.length; j++) {
                    if (arr[i].id == newArr[j].id) {
                        flag = false;
                        break
                    };
                };
                if (flag) {
                    newArr.push(arr[i]);
                };
            };
            return newArr;
        },
        Status(val) {
            let string
            switch (val) {
                case 0:
                    string = this.$t("text.new")
                    break
                case 1:
                    string = this.$t("nodes.initialize")
                    break
                case 2:
                    string = this.$t("text.initializeSuccess")
                    break
                case 3:
                    string = this.$t("text.initializeFail")
                    break
                case 4:
                    string = this.$t("text.checkSuccess")
                    break
                case 5:
                    string = this.$t("text.checkFail")
                    break
                case 6:
                    string = this.$t("text.configSuccess")
                    break
                case 7:
                    string = this.$t("text.configFail")
                    break
                default:
                    string = this.$t("text.NotCheck")
                    break
            }
            return string
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
                    str = this.$t('text.restarting')
            }
            return str;
        },
        nodeColor(val) {
            let colorString = "";
            switch (val) {
                case 0:
                    colorString = "#909399";
                    break;
                case 1:
                    colorString = "#909399";
                    break;
                case 2:
                    colorString = "#67C23A";
                    break;
                case 3:
                    colorString = "#F56C6C";
                    break;
                case 4:
                    colorString = "#67C23A";
                    break;
                case 5:
                    colorString = "#F56C6C";
                    break;
                case 6:
                    colorString = "#67C23A";
                    break;
                case 7:
                    colorString = "#F56C6C";
                    break;
                default:
                    colorString = "#909399";
                    break;
            }
            return colorString;
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
                    colorString = "#909399";
                    break;
            }
            return colorString;
        },
    },
    beforeRouteLeave: function (to, from, next) {
        if ((to.path !== "/guide" && to.path !== "/login" && to.path !== "/newNode") && (!this.deployOpt && this.nodeList.length !== 0)) {
            this.$confirm(this.$t("text.leavePageInfo"), this.$t("text.tips"), {
                confirmButtonText: this.$t("text.sure"),
                cancelButtonText: this.$t("text.cancel"),
                type: 'warning'
            }).then(() => {
                this.resetNodeStatus()
                next();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t("text.Cancelled")
                });
            });
        } else {
            next();
        }
    }
}
</script>

<style scoped>
.wrapper-title {
    padding: 20px 30px;
    font-size: 18px;
}
.chain-info >>> .el-form-item__label {
    line-height: 16px;
}
.chain-info >>> .el-form-item__content {
    line-height: 16px;
}
.danger >>> .jv-string {
    color: #f56c6c !important;
}
.check-button >>> .is-disabled {
    color: #fff !important;
    background-color: #c8c9cc !important;
    border-color: #c8c9cc !important;
}
.guide {
    position: absolute;
    right: 40px;
    top: 90px;
}
.clear-right {
    float: right;
}

</style>