<template>
    <div>
        <el-dialog :title="$t('text.exportJavaProject')"  :close-on-click-modal="false" :visible.sync="dialogVisible" :before-close="modelClose" class="dialog-wrapper" width="750px">
            <h3 style="padding-left: 18px">{{$t('text.projectTitle')}}</h3>
            <el-form :model="projectFrom" :rules="rules" ref="projectFrom" label-width="116px" class="demo-ruleForm">
                <el-form-item :label="$t('text.projectName')" prop="artifactName">
                    <el-input v-model="projectFrom.artifactName" style="width: 415px"></el-input>
                </el-form-item>
                <el-form-item :label="$t('text.projectGroupName')" prop="group">
                    <el-input v-model="projectFrom.group" style="width: 415px"></el-input>
                </el-form-item>
                <!-- <div class="channel-ip"> -->
                <el-form-item :label="$t('text.projectFront')" prop="frontId">
                    <el-select v-model="projectFrom.frontId" :placeholder="$t('text.select')" style="width: 415px" @change="changeFront">
                        <el-option v-for="item in frontList" :key="item.frontId" :label="item.nodeId" :value="item.frontId">
                            <span style="float: left">{{ item.nodeId | splitString6}}...</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.frontId }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="channelIp" prop="channelIp">
                    <el-input v-model="projectFrom.channelIp" style="width: 415px"></el-input>
                    <el-tooltip effect="dark" :content="$t('text.actualChannelIp')" placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="channelPort" prop="channelPort">
                    <el-input v-model="projectFrom.channelPort" :disabled="queryPort ? true : false " style="width: 415px"></el-input>
                    <el-tooltip effect="dark" :content="$t('text.haveChannelPort')" placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                    <el-button type="text" size="small" @click="checkChannelIP()">{{this.$t("contracts.checkNodeActive")}}</el-button>
                </el-form-item>
                <!-- </div> -->
                <el-form-item :label="$t('text.projectUser')">
                    <!-- <el-select v-model="projectFrom.userAddress" :placeholder="$t('text.select')" style="width: 415px">
                        <el-option v-for="item in userList" :key="item.address" :label="item.userName" :value="item.address">
                        </el-option>
                    </el-select> -->
                    <el-select  v-model="projectFrom.userAddress"  class="filter-item"  :placeholder="$t('text.select')"  multiple style="width: 415px">
                        <el-option v-for="item in userList" :key="item.address" :label="item.userName"  :value="item.address">
                        </el-option>
                    </el-select> 
                </el-form-item>
            </el-form>
            <el-divider></el-divider>
            <h3 style="padding-left: 18px">{{$t('text.projectContract')}}</h3>
            <p style="padding-left: 28px">{{$t('text.exportJavaProjectInfo1')}}</p>
            <p style="padding:5px 0;color: #F56C6C;padding-left: 28px">{{$t('text.exportJavaProjectInfo2')}}</p>
            <el-table :show-header='false' :data="tableData" class="block-table-content" style="width: 100%;padding: 0 20px" :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="handleExpand" @row-click="clickTable" ref="refTable">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- <span>{{contractList}}</span> -->
                        <div class="table-content">
                            <el-table ref="multipleTable" :data="scope.row.contractList" :show-header='true' @select-all="handleSelectAll" @selection-change="handleSelectionChange($event, scope.row)" :default-sort="{prop: 'contractPath', order: 'descending'}">
                                <el-table-column type="selection"   width="55">
                                </el-table-column>
                                <el-table-column prop="contractName" show-overflow-tooltip :label="$t('contracts.contractName')"></el-table-column>
                                <el-table-column prop="contractPath" :label="$t('text.compileStatus')">
                                    <template slot-scope="prop">
                                        <span v-if='prop.row.contractAbi' style="color: #67C23A">{{$t('text.compiled')}}</span>
                                        <span v-if='!prop.row.contractAbi' style="color: #F56C6C">{{$t('text.uncomplie')}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <!-- <div v-else>暂无数据</div> -->
                    </template>
                </el-table-column>
                <el-table-column prop="contractPath" :label="$t('text.uncomplie')" show-overflow-tooltip></el-table-column>
                <el-table-column prop="modifyTime" :label="$t('nodes.modifyTime')"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="modelClose">{{$t('text.cancel')}}</el-button>
                <el-button type="primary" @click="submit('projectFrom')">{{$t('text.confirm')}}</el-button>
            </div>
        </el-dialog> 	
    </div>
</template>

<script>
import { searchContract, getUserList, getFronts, exportJavaProject, fetchChannelPort,addFunctionAbi,queryChannelIP} from "@/util/api";
import creatUser from "@/views/privateKeyManagement/components/creatUser";
import web3 from "@/util/ethAbi";
let Base64 = require("js-base64").Base64;
import { unique } from "@/util/util";
import {
    compile
} from "@/util/compile";
export default {
    name: 'exportProject',
     components: {
        "v-creatUser": creatUser,
    },
    props: {
        folderList: {
            type: Array,
            default: []
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        var isPort = (rule, value, callback) => {
            var parten = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;

            if (value === '') {
                callback(new Error(this.$t('rule.isPort')))
            } else {
                if (!parten.test(value)) {
                    callback(new Error(this.$t('rule.portRule')))
                } else {
                    callback()
                }
            }

        }
        return {
            tableData: [],
            dialogVisible: this.show,
            expands: [],
            getRowKeys: function (row) {
                return row.contractPath;
            },
            contractList: [],
            multipleSelection: [],
            selectedList: [],
            selectDisabled(row, index) {
                if (!row.contractAbi) {
                    return false
                } else {
                    return true
                }
            },
            userList: [],
            frontList: [],
            projectFrom: {
                artifactName: "demo",
                group: 'org.example',
                userAddress: [],
                frontId: null,
                channelIp: '127.0.0.1',
                channelPort: ''
            },
            queryPort: '',
            dynamicObject: {},
            selectedParentPath: '',
            multipleSelectedId: [],
            rules: {
                artifactName: [
                    {
                        required: true,
                        message: this.$t("rule.artifactName"),
                        trigger: "blur",
                    },
                    {
                        min: 1,
                        max: 32,
                        message: this.$t("rule.contractLong"),
                        trigger: "blur",
                    },
                    {
                        pattern: /^[a-zA-Z_]+([a-zA-Z_][a-zA-Z0-9_]*[_])*([a-zA-Z_][a-zA-Z0-9_]*)$/,
                        message: this.$t("rule.contractRule"),
                        trigger: "blur",
                    },
                ],
                group: [
                    {
                        required: true,
                        message: this.$t("rule.group"),
                        trigger: "blur",
                    },
                    {
                        min: 1,
                        max: 32,
                        message: this.$t("rule.contractLong"),
                        trigger: "blur",
                    },
                    {
                        pattern: /^[a-zA-Z_]+([a-zA-Z_][a-zA-Z0-9_]*[.])*([a-zA-Z_][a-zA-Z0-9_]*)$/,
                        message: this.$t("rule.contractGroupRule"),
                        trigger: "blur",
                    },
                ],
                frontId: [
                    {
                        required: true,
                        message: this.$t("rule.frontId"),
                        trigger: "change",
                    },
                ],
                p12Password: [
                    {
                        required: true,
                        message: this.$t('privateKey.placeholderPassword'),
                        trigger: "blur"
                    },
                ],
                channelIp: [
                    {
                        required: true,
                        message: this.$t('rule.ipName'),
                        trigger: "blur",
                    },
                    {
                        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        message: this.$t("rule.IpRule"),
                        trigger: "blur",
                    },
                ],
                channelPort: [
                    { validator: isPort, trigger: 'change' }
                ]
            },
            contractList:[]
        }
    },
    destroyed() {
        this.$store.state.exportProjectShow = false
    },
    mounted() {
        this.getList();
        this.getFrontTable()
        this.getUserInfoData()
        console.log(this.$store.state.selectedContractInfo, '======');
    },
    methods: {
        getList() {
            this.expands = []
            this.tableData = this.folderList.map((value) => {
                value.contractList = []
                return value
            })
            this.expands.push(this.$store.state.selectedContracts.contractPath)
            this.$nextTick(() => {

                this.getContractList(this.$store.state.selectedContracts)
            })
        },
        getUserInfoData() {
            this.loading = true;
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: 1,
                pageSize: 500
            }, reqQuery = {}
            if (localStorage.getItem('root') === 'developer') {
                reqQuery.account = localStorage.getItem("user")
            }
            getUserList(reqData, reqQuery)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.userList = res.data.data || []; 
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
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        modelClose() {
            this.$emit('close')
        },
        handleExpand(row) {
            this.getContractList(row, 'ExpandEvent')
        },
        clickTable: function (row, column, $event) {
            this.getContractList(row, 'ExpandEvent')
            let nodeName = $event.target.nodeName;
            this.$refs.refTable.toggleRowExpansion(row);
            // this.$nextTick(() => {

            // })
            if (nodeName === "I") {
                return
            }
        },
        getContractList(row, handleType) {
            const reqData = {
                groupId: localStorage.getItem("groupId"),
                contractPathList: [row.contractPath]
            }
            searchContract(reqData).then(res => {
                if (res.data.code === 0) {
                    this.contractList = res.data.data
                    let num
                    // 调用数组方法强刷数据
                    this.tableData.forEach((value, index) => {
                        if (value.contractPath === row.contractPath) {
                            row.contractList = this.contractList
                            num = index
                        }
                    });

                    this.$set(this.tableData, num, row)
                    if (!handleType) {
                        var selectedDirectoryInfo = {}
                        var rootDirectoryInfo = {}
                        for (var i = 0; i < this.tableData.length; i++) {
                            if (this.tableData[i]['contractPath'] == row.contractPath) {
                                selectedDirectoryInfo = this.tableData[i]
                                this.tableData.splice(i, 1);
                                break;
                            }
                        }
                        if (Object.keys(selectedDirectoryInfo).length > 0) {
                            this.tableData.unshift(selectedDirectoryInfo);
                        }
                        for (var i = 0; i < this.tableData.length; i++) {
                            if (this.tableData[i]['contractPath'] == '/') {
                                rootDirectoryInfo = this.tableData[i]
                                this.tableData.splice(i, 1);
                                break;
                            }
                        }
                        if (Object.keys(rootDirectoryInfo).length > 0) {
                            this.tableData.unshift(rootDirectoryInfo);
                        }
                    }

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
        handleSelectionChange($event, val) { 
            let num = 0 ;
            this.selectedParentPath = val.contractPath
            this.multipleSelection = $event;
            if (this.selectedParentPath) {
                this.dynamicObject[this.selectedParentPath] = this.multipleSelection
            }
            const dynamicObject = Object.values(this.dynamicObject)
            this.multipleSelectedId = []
            const contractAbiArray = []
            dynamicObject.forEach(item => {
                item.forEach(it => {
                    this.multipleSelectedId.push(it.contractId)
                    if (!it.contractAbi) {
                        num++;
                        compile(it, this);
                    }
                })
            })
            if (num > 0) { 
                setTimeout(() => {
                    num =0;
                    this.getContractList(val,true);
               }, 4000)
            }    
            this.multipleSelectedId = Array.from(new Set(this.multipleSelectedId))    
        },
        submit(formName) {
            if (this.multipleSelectedId.length === 0) {
                this.$message({
                    type: "error",
                    message: this.$t('rule.checkContract')
                });
            } else {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.export()
                    } else {
                        return false;
                    }
                })
            }

        },
        handleSelectAll(selection) {
            // if(!selection.length){
            //     this.$message({
            //         type:"error",
            //         message: this.$t('text.haveSelectionAll')
            //     })
            // }
        },
        export() {
            // const idList = this.multipleSelection.map(value => {
            //     return value.contractId
            // })
            const reqData = {
                contractIdList: this.multipleSelectedId,
                group: this.projectFrom.group,
                artifactName: this.projectFrom.artifactName,
                frontId: this.projectFrom.frontId,
                groupId: localStorage.getItem("groupId"),
                channelIp: this.projectFrom.channelIp,
                channelPort:this.projectFrom.channelPort
            }
            if (this.projectFrom.userAddress) {
                reqData.userAddressList = this.projectFrom.userAddress
            }
            exportJavaProject(reqData).then(res => {
                if (res.data.code === 0) {
                    this.modelClose();
                    const content = Base64.toUint8Array(res.data.data.fileStreamBase64);
                    const blob = new Blob([content], { type: `application/zip;charset=utf-8` })
                    const fileName = res.data.data.fileName
                    if ('download' in document.createElement('a')) {
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = URL.createObjectURL(blob)
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href)
                        document.body.removeChild(elink)
                    } else {
                        navigator.msSaveBlob(blob, fileName)
                    }
                    this.$message({
                        type: 'success',
                        message: this.$t('text.exportSuccessed')
                    })
                } else {
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code),
                        customClass: 'zZindex'
                    });
                }
            })
        },
        getFrontTable() {
            getFronts({})
                .then(res => {
                    if (res.data.code === 0) {
                        this.frontList = res.data.data || [];
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
        changeFront(val) {
            this.queryChannelPort(val)
        },
        queryChannelPort(val) {
            let param = {
                frontId: val
            }
            fetchChannelPort(param)
                .then(res => {
                    if (res.data.code === 0) {
                        if (res.data.data) {
                            if (res.data.data.channelPort) {
                                if (res.data.data.channelPort == 'null') {
                                    this.projectFrom.channelPort = ''
                                } else {
                                    this.queryPort = true
                                    this.projectFrom.channelPort = res.data.data.channelPort
                                }
                            }
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
        checkChannelIP(){
           if(!this.projectFrom.channelIp || !this.projectFrom.channelPort){
                this.$message({
                    message: "channelIp 和 channelPort 必填",
                    type: "error",
                    duration: 2000
                });
                return false;
           } 

           let param = {
                nodeIp: this.projectFrom.channelIp,
                channelPort: this.projectFrom.channelPort
            }
            queryChannelIP(param)
                .then(res => {
                    if (res.data.code === 0) {
                        if (res.data.data) {
                            this.$message({
                                type: 'success',
                                message: this.$t('text.nodeActive')
                            })
                        }else{
                             this.$message({
                                message: this.$t('text.nodeNotActive'),
                                type: "error",
                            });
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
    }
}
</script>

<style scoped>
.table-content {
    max-height: 270px;
    overflow: auto;
}
.channel-ip {
    display: flex;
}
.block-table-content >>> .el-table__row {
    cursor: pointer;
}
</style>