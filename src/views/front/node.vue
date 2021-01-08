<template>
    <div>
        <v-content-head :headTitle="$t('text.chainTitle')" :headSubTitle="$t('title.nodeTitle')" @changeGroup="changeGroup"></v-content-head>
        <div class="module-wrapper" style="padding-bottom: 20px">
            <p class="wrapper-title" v-if='type != "node"'>{{$t("text.addChain")}}</p>
            <!-- <p class="wrapper-title" v-if='type == "node"'>新增节点</p> -->
            <el-page-header class="wrapper-title" v-if='type == "node"' @back="goBack" :content="$t('text.addNode')">

            </el-page-header>
            <div class="link guide" @click='openGuide'>{{$t("text.noviceGuide")}}</div>
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
                    <el-form-item :label='$t("text.imageMode")' prop='dockerImageType'>
                        <el-radio v-model="chainFrom.dockerImageType" :label="2">{{$t("text.automatic")}}<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo1')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                        </el-radio>
                        <el-radio v-model="chainFrom.dockerImageType" :label="1">{{$t("text.manual")}}<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo2')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                        </el-radio>
                        <el-radio v-model="chainFrom.dockerImageType" :label="3">dockerhub<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo3')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                        </el-radio>
                    </el-form-item>
                    <el-form-item :label='$t("text.chainVersion")' prop='chainVersion'>
                        <el-select v-model="chainFrom.chainVersion" :placeholder="$t('text.select')">
                            <el-option v-for="item in configList" :key="item.id" :label="item.configValue" :value="item.configValue">
                            </el-option>
                        </el-select>
                    </el-form-item>
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
                <el-form style="padding-top: 20px" v-if='chainFrom' class="chain-info">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item :label='$t("text.chainName") + "："'>
                                <span>{{chainFrom.chainName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label='$t("text.chainVersion") + "："'>
                                <span>{{chainFrom.version}}</span>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12">
                            <el-form-item :label='$t("text.chainType") + "："'>
                                <span v-if='chainFrom.encryptType == 0'>{{$t("text.sha256")}}</span>
                                <span v-if='chainFrom.encryptType == 1'>{{$t("text.sm3")}}</span>
                            </el-form-item>
                        </el-col> -->
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
                                <el-radio v-model="chainFrom.dockerImageType" :label="2">{{$t("text.automatic")}}<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo1')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                                </el-radio>
                                <el-radio v-model="chainFrom.dockerImageType" :label="1">{{$t("text.manual")}}<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo2')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                                </el-radio>
                                <!-- <el-radio v-model="chainFrom.dockerImageType" :label="3">dockerhub<el-tooltip class="item" effect="dark" :content="$t('text.imageModeInfo3')" placement="top-start"><i class="el-icon-info" style="display: inline-block;padding-left: 10px;"></i></el-tooltip>
                                </el-radio> -->
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="search-table">
                <div style="padding: 20px 0">
                    <h3>{{$t("nodes.nodeList")}}</h3>
                    <el-divider></el-divider>
                    <el-button type="primary" @click="add">{{$t('text.addNode')}}</el-button>
                    <el-button type="primary" :loading="loading" @click="check('chainFrom')">{{$t('text.check')}}</el-button>
                </div>
                <el-table :data="nodeList" class="search-table-content" v-loading="loading3">
                    <el-table-column :label="$t('text.hostTitle')" prop="ip" show-overflow-tooltip></el-table-column>
                    <el-table-column :label="'Front' + $t('alarm.port')" prop="frontPort" show-overflow-tooltip></el-table-column>
                    <el-table-column :label="'P2P' + $t('alarm.port')" prop="p2pPort" show-overflow-tooltip></el-table-column>
                    <el-table-column :label="'Channel' + $t('alarm.port')" prop="channelPort" show-overflow-tooltip></el-table-column>
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
                <div style="padding: 30px 0" class="check-button">
                    <h3>{{$t('nodes.operation')}}</h3>
                    <el-divider></el-divider>
                    <el-button type="primary" :loading="loading1" @click="init('chainFrom')" v-if='!initShow'>{{$t('nodes.initialize')}}</el-button>
                    <el-button type="primary" :loading="loading2" @click="deploy('chainFrom')" v-if='initShow'>{{$t('text.deploy')}}</el-button>
                </div>
                <div style="padding: 30px 0" v-if='nodeList.length && remarkList.length'>
                    <h3>{{$t("text.nodeLog")}}</h3>
                    <el-divider></el-divider>
                    <div v-for='(item,index) in remarkList' :key='index'>
                        <div v-if='item.remark'>
                            <p>{{item.ip}}</p>
                            <json-viewer :class="{'danger': (item.status === 3 || item.status === 5 || item.status === 7)}" :value="item.remark" :expand-depth='5' copyable></json-viewer>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <addChainNode v-if="addChainNodeShow" :show="addChainNodeShow" :data='addChainNodeData' @close='addChainNodeClose' @success="addChainNodeSuccess($event)"></addChainNode>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import addChainNode from "./dialog/addChainNode"
import { getHosts, getConfigList, initChainData, checkPort, checkHost, deployChainData, getChainInfo, addChainNodeData } from "@/util/api"
import { format } from "@/util/util"
export default {
    components: {
        "v-content-head": contentHead,
        addChainNode
    },
    data() {
        return {
            chainFrom: {
                encryptType: localStorage.getItem("encryptionId"),
                chainVersion: null,
                dockerImageType: 2
            },
            loading: false,
            loading1: false,
            loading2: false,
            loading3: false,
            nodeList: [],
            configList: [],
            initShow: false,
            checkShow: true,
            addChainNodeShow: false,
            configType: 1,
            hostList: [],
            configValue: "",
            addChainNodeData: null,
            type: this.$route.query.type,
            chainInfo: null,
            remarkList: [],
            remarkData: `116.63.161.132 | FAILED! => { "changed": true, "msg": "non-zero return code", "rc": 2, "stderr": "Shared connection to 116.63.161.132 closed.\r\n", "stderr_lines": [ "Shared connection to 116.63.161.132 closed." ], "stdout": "Start download docker image tar of webase:v1.4.2...\r\nwget: /usr/local/lib/libssl.so.1.1: version 'OPENSSL_1_1_0' not found (required by wget)\r\nwget: /usr/local/lib/libcrypto.so.1.1: version 'OPENSSL_1_1_0' not found (required by wget)\r\nDownload finish in:[/root/v143/opt/download/docker-fisco-webase.tar].\r\nStart load docker image from tar...\r\n/root/v143/opt/download/docker-fisco-webase.tar not found!\r\n", "stdout_lines": [ "Start download docker image tar of webase:v1.4.2...", "wget: /usr/local/lib/libssl.so.1.1: version 'OPENSSL_1_1_0' not found (required by wget)", "wget: /usr/local/lib/libcrypto.so.1.1: version 'OPENSSL_1_1_0' not found (required by wget)", "Download finish in:[/root/v143/opt/download/docker-fisco-webase.tar].", "Start load docker image from tar...", "/root/v143/opt/download/docker-fisco-webase.tar not found!" ] }`
        }
    },
    computed: {
        rules() {
            let data = {
                encryptType: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' },
                ],
                chainVersion: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' },
                ],
                dockerImageType: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' }
                ]
            }
            return data
        }
    },
    mounted() {
        if (this.type === 'node') {
            this.getChainDetail()
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
        getChainDetail() {
            getChainInfo().then(res => {
                if (res.data.code === 0) {
                    this.chainFrom = res.data.data;
                    // this.chainFrom.dockerImageType = 2
                    this.$set(this.chainFrom, "dockerImageType", 2)
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
                        this.loading3 = true
                        this.loading1 = true;
                        this.initChain()
                    } else {
                        return false
                    }
                })
            } else {
                this.loading3 = true
                this.loading1 = true;
                this.initChain()
            }
        },
        check(val) {
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
            checkHost({ hostIdList: array }).then(res => {
                this.loading3 = false
                this.initShow = false
                if (res.data.code === 0) {
                    checkPort(data).then(res => {
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
                                message: this.$t('text.systemError'),
                                type: "error",
                                duration: 2000
                            });
                        });
                } else {
                    this.loading3 = false
                    this.loading = false;
                    this.getHostList()
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
                        message: this.$t('text.systemError')
                    });
                });

        },
        checkone(val) {
            this.loading3 = true
            let data = {
                chainName: "default_chain",
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
                        message: this.$t('text.systemError')
                    });
                });
        },
        formatParam(type) {
            let ipconf = [],
                deployNodeInfoList = [],
                hostIdList = []
            for (let i = 0; i < this.nodeList.length; i++) {
                ipconf[i] = `${this.nodeList[i].ip}:1 agency1 1 ${this.nodeList[i].p2pPort},${this.nodeList[i].channelPort},${this.nodeList[i].rpcPort}`;
                hostIdList.push(this.nodeList[i].hostId)
                deployNodeInfoList[i] = {};
                deployNodeInfoList[i].hostId = this.nodeList[i].hostId;
                deployNodeInfoList[i].ip = this.nodeList[i].ip;
                deployNodeInfoList[i].frontPort = this.nodeList[i].frontPort;
                deployNodeInfoList[i].p2pPort = this.nodeList[i].p2pPort;
                deployNodeInfoList[i].channelPort = this.nodeList[i].channelPort;
                deployNodeInfoList[i].rpcPort = this.nodeList[i].rpcPort;
            }
            let data = {
                chainName: "default_chain",
                ipconf: ipconf,
                imageTag: this.chainFrom.chainVersion,
                encryptType: this.chainFrom.encryptType,
                deployNodeInfoList: deployNodeInfoList,
                agencyName: "agency1"
            }
            if (this.type == "node") {
                data.imageTag = this.chainFrom.version;
                data.encryptType = this.chainFrom.encryptType
            }
            let data1 = {
                chainName: "default_chain",
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
            let data = this.formatParam('init')
            initChainData(data).then(res => {
                this.loading3 = false
                this.loading1 = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t('text.initializeSuccess'),
                    })
                    this.getHostList()
                    this.initShow = true
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                }
            })
                .catch(err => {
                    this.loading3 = false
                    this.loading1 = false;
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
                    this.$router.push("/newNode")
                } else {
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    this.loading3 = false
                    this.loading2 = false;
                    this.$message({
                        type: "error",
                        message: this.$t('text.systemError')
                    });
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
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    this.loading3 = false
                    this.loading2 = false;
                    this.$message({
                        type: "error",
                        message: this.$t('text.systemError')
                    });
                });
        },
        getHostList() {
            getHosts().then(res => {
                if (res.data.code === 0) {
                    this.hostList = res.data.data;
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
                        message: this.$t('text.systemError')
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
        getRemarkList() {
            this.remarkList = this.distinct(this.nodeList, 'hostId')
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
</style>