<template>
    <div>
        <el-table :data="newNodeList" tooltip-effect="dark" style="width: 100%" v-loading='loading'>
            <el-table-column v-for="head in frontHead" :label="head.name" :key="head.enName" :prop="head.enName" :width="head.width" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="head.enName === 'nodeId'">
                        <i class="wbs-icon-copy font-12" @click="copyNodeIdKey(scope.row[head.enName])" :title="$t('text.copy')"></i>
                        {{scope.row[head.enName]}}
                    </span>
                    <span v-else-if="head.enName === 'status'">
                        {{transformStatus(scope.row[head.enName])}}
                    </span>
                    <span v-else>
                        {{scope.row[head.enName]}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('nodes.operation')" width="170">
                <template slot-scope="scope">
                    <el-button :disabled="scope.row.frontId=='-' ? true : false" :loading="loading&&operateIndex==scope.row.nodeId&&operateType==item.enName" type="text" size="small" @click="queryOperateGroup(scope.row,item.enName)" v-for="item in scope.row.groupStatusList" :key="item.enName">{{item.name}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="$t('text.joinExitedGroup')+'('+ 'ID:'+' '+`${itemNodeData.groupId}`+')'" :visible.sync="addGroupVisibility" v-if="addGroupVisibility" center append-to-body>
            <node-add-group @addGroupSuccess="addGroupSuccess" @addClose="addClose" :itemGroupData="itemGroupData" :addGroupData="addGroupData"></node-add-group>
        </el-dialog>
        <el-dialog :title="$t('text.joinExitedGroup')+'('+ 'ID:'+' '+`${itemNodeData.groupId}`+')'" :visible.sync="agreeNodeVisibility" v-if="agreeNodeVisibility" center append-to-body>
            <agree-node @addSuccess="addSuccess" @addClose="addClose" :itemNodeData="itemNodeData" @nodeHadGroup="nodeHadGroup"></agree-node>
        </el-dialog>
    </div>
</template>

<script>

import { createGroup, getFronts, crudGroup, groupStatus, getNodeList, p2pNodeList, getConsensusNodeId } from "@/util/api"
import nodeAddGroup from "./nodeAddGroup";
import agreeNode from "./agreeNode";
import { substring_0_40 } from "@/util/util"
export default {
    name: 'modify',

    components: {
        nodeAddGroup,
        agreeNode
    },

    props: {
        itemGroupData: {
            type: Object
        }
    },

    data() {
        return {
            loading: false,
            allNodeList: [],
            nodeList: [],
            nodeIdParam: [],
            operateStatus: '',
            selectStatus: '',
            nodeIdList: [],
            nodeGroupStatus: [],
            newNodeList: [],
            description: '',
            operateIndex: '',
            operateType: '',
            addGroupVisibility: false,
            addGroupData: {},
            agreeNodeVisibility: false,
            itemNodeData: {}
        }
    },

    computed: {
        frontHead() {
            let data = [
                {
                    enName: "frontId",
                    name: this.$t("nodes.frontId"),
                    width: ''
                },
                {
                    enName: "nodeId",
                    name: this.$t("nodes.nodeId"),
                    width: '220'
                },
                {
                    enName: "frontIp",
                    name: this.$t("nodes.frontIp"),
                    width: ''
                },
                {
                    enName: "frontPort",
                    name: this.$t("nodes.frontPort"),
                    width: ''
                },
                {
                    enName: "groupId",
                    name: this.$t("nodes.groupId"),
                    width: ''
                },
                {
                    enName: "agency",
                    name: this.$t("nodes.agency"),
                    width: ''
                },
                {
                    enName: "status",
                    name: this.$t("nodes.status"),
                    width: ''
                },
            ];
            return data
        }
    },

    watch: {
    },

    created() {
    },

    mounted() {
        this.queryNodeList()
    },

    methods: {

        queryNodeList() {
            let groupId = localStorage.getItem("groupId");

            p2pNodeList(groupId)
                .then(res => {
                    if (res.data.code === 0) {
                        this.allNodeList = res.data.data;
                        this.queryFronts(this.queryGroupStatus)
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        })
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    })
                })

        },
        queryFronts(callback) {
            let data = {
                groupId: ""
            }
            getFronts(data)
                .then(res => {
                    if (res.data.code === 0) {
                        this.nodeList = res.data.data;
                        this.nodeIdList = [];
                        var recomNodelist = [];
                        var outsideList = []
                        var sameList = this.nodeList.map(item => {
                            if (this.allNodeList.includes(item.nodeId)) {
                                return item.nodeId
                            }
                        })
                        this.allNodeList.forEach(item => {
                            if (!sameList.includes(item)) {
                                outsideList.push(item)
                            }
                        });
                        var outsideData = []
                        outsideList.forEach(item => {
                            outsideData.push({
                                nodeId: item,
                            })
                        })
                        recomNodelist = this.nodeList.concat(outsideData)
                        this.nodeIdList = this.nodeList.map(item => {
                            return item.nodeId
                        })
                        this.nodeList = recomNodelist;
                        callback()
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        })
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    })
                })
        },
        queryGroupStatus() {
            var groupIdList = [];
            groupIdList.push(this.itemGroupData.groupId)
            let data = {
                nodeIdList: this.nodeIdList,
                groupIdList: groupIdList
            }
            groupStatus(data)
                .then(res => {
                    if (res.data.code === 0) {
                        this.nodeGroupStatus = res.data.data
                        this.nodeGroupStatus.forEach(item => {
                            item.groupStatusMap[this.itemGroupData.groupId] = item.groupStatusMap[item.nodeId] || item.groupStatusMap[this.itemGroupData.groupId]
                            if (item.groupStatusMap[item.nodeId] === 'FAIL') {
                                this.$notify.error({
                                    title: '节点错误',
                                    message: `<div  class="error-node cursor-pointer">
                                    <span>
                                        <i style="word-break: break-word;" class="wbs-icon-copy font-12">${substring_0_40(item.nodeId)}..</i>
                                     <span>${this.$t('text.nodeId')}</span>${this.$t('text.getFail')}
                                    </span>
                                    </div>`,
                                    dangerouslyUseHTMLString: true,
                                    duration: 7000,
                                    onClick: () => {
                                        this.copyNodeIdKey(item.nodeId)
                                    }
                                });
                            }
                        })
                        this.newNodeList = []
                        this.nodeList.forEach(item => {
                            this.nodeGroupStatus.forEach(it => {
                                if (item.nodeId == it.nodeId) {
                                    this.newNodeList.push(Object.assign({}, item, {
                                        status: it['groupStatusMap'][this.itemGroupData.groupId]
                                    }))
                                }
                            })
                        })
                        var array = [];
                        this.nodeList.forEach((item, index) => {
                            array.push((Object.assign({}, item, this.newNodeList[index])))
                        })
                        array.forEach(item => {
                            item.status = item.status || '-';
                            item.frontId = item.frontId || '-';
                            item.frontIp = item.frontIp || '-';
                            item.frontPort = item.frontPort || '-';
                            item.agency = item.agency || this.$t('text.externalNode');
                        })
                        array.forEach(item => {
                            switch (item.status) {
                                case 'INEXISTENT':
                                    item.groupStatusList = [{
                                        enName: 'add',
                                        name: this.$t('text.add'),
                                    }]
                                    break;

                                case 'STOPPING':
                                    item.groupStatusList = [{
                                        enName: '-',
                                        name: '-',
                                    }]
                                    break;
                                case 'RUNNING':
                                    item.groupStatusList = [{
                                        enName: 'stop',
                                        name: this.$t('text.stop'),
                                    }]
                                    break;
                                case 'STOPPED':
                                    item.groupStatusList = [{
                                        enName: 'start',
                                        name: this.$t('text.start'),
                                    }, {
                                        enName: 'remove',
                                        name: this.$t('text.remove'),
                                    }]
                                    break;
                                case 'DELETED':
                                    item.groupStatusList = [{
                                        enName: 'recover',
                                        name: this.$t('text.recover'),
                                    }]
                                    break;
                                case 'FAIL':
                                    item.groupStatusList = [{
                                        enName: 'add',
                                        name: this.$t('text.add'),
                                    }]
                                    break;
                                case '-':
                                    item.groupStatusList = [{
                                        enName: 'add',
                                        name: this.$t('text.add'),
                                    }]
                                    break;
                            }
                        })
                        var runningList = []
                        array.forEach(item => {
                            if (item.status === 'RUNNING') {
                                runningList.push(item.status)
                            }
                        })
                        if (runningList.length) {
                            this.querygetConsensusNodeId(array)
                        } else {
                            this.newNodeList = array
                        }
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        })
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    })
                })
        },
        querygetConsensusNodeId(list) {
            let reqParam = {
                groupId: this.itemGroupData.groupId,
                pageNumber: 1,
                pageSize: 100
            };
            getConsensusNodeId(reqParam)
                .then(res => {
                    if (res.data.code === 0) {
                        var array = res.data.data, groupNodeList = [];
                        array.forEach(item => {
                            if (item.nodeType === 'sealer' || item.nodeType === 'observer') {
                                groupNodeList.push(item.nodeId)
                            }
                        })
                        this.newNodeList = list;
                        this.newNodeList.forEach(item => {
                            if (groupNodeList.includes(item.nodeId)) {
                                item.groupId = this.itemGroupData.groupId
                            } else {
                                item.groupId = '-'
                            }
                        })
                    } else {
                        this.newNodeList = list;
                        this.newNodeList.forEach(item => {
                            item.groupId = '-'
                        })
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        })
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    })
                })
        },
        transformStatus(key) {
            switch (key) {
                case 'INEXISTENT':
                    return this.$t('text.INEXISTENT')
                    break;
                case 'STOPPING':
                    return this.$t('text.STOPPING')
                    break;
                case 'RUNNING':
                    return this.$t('text.RUNNING')
                    break;
                case 'STOPPED':
                    return this.$t('text.STOPPED')
                    break;
                case 'DELETED':
                    return this.$t('text.DELETED')
                    break;
                case 'FAIL':
                    return this.$t('text.getFail')
                    break;
                case '-':
                    return '-'
                    break;
            }
        },
        queryOperateGroup(val, type) {
            this.operateIndex = val.nodeId;
            this.operateType = type;
            if (type != 'add') {
                if (type === 'stop') {
                    this.$confirm(this.$t("text.confirmStop"), {
                        type: 'warning'
                    })
                        .then(_ => {
                            this.queryCrudGroup(val, type)
                        })
                        .catch(_ => { });
                } else {
                    this.queryCrudGroup(val, type)
                }

            } else {
                // this.queryCreateGroup(val)
                this.queryAgreeNode(val)
            }
        },
        queryCrudGroup(val, type) {
            this.loading = true;
            let nodeId = val.nodeId;
            let data = {
                generateGroupId: this.itemGroupData.groupId,
                type: type
            }
            crudGroup(data, nodeId)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.queryNodeList()
                        this.$emit('modifySuccess')
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        })
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    })
                })
        },
        //共识节点
        queryAgreeNode(val) {
            this.itemNodeData = val
            this.itemNodeData.groupId = this.itemGroupData.groupId
            this.agreeNodeVisibility = true
        },
        queryCreateGroup(val) {
            this.addGroupData = val;
            this.addGroupVisibility = true
        },
        nodeHadGroup(val) {
            this.queryCreateGroup(val)
        },
        addSuccess() {
            this.addGroupVisibility = false
            this.queryNodeList()
        },
        addGroupSuccess() {
            this.addGroupVisibility = false;
            this.$nextTick(_ => {
                this.agreeNodeVisibility = false
                this.queryNodeList()
            })
        },
        addClose() {
            this.addGroupVisibility = false
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

    }
}
</script>

<style scoped>
.error-node {
    word-break: break-word;
}
</style>
