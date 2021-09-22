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
        <div class="module-wrapper">
            <div class="search-part">
                <div class="search-part-left" style="padding-top: 20px;">
                    <el-button type="primary" class="search-part-left-btn" @click="generateAbi">{{this.$t("nodes.addAbi")}}</el-button>
                    <el-button type="primary" class="search-part-left-btn" @click="routeAbi">{{$t('title.parseAbi')}}</el-button>
                </div>
                <div class="search-part-right">
                    <el-input :placeholder="$t('placeholder.contractListSearch')" v-model="contractData" class="input-with-select" clearable @clear="clearInput">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div> 
            </div>
            <div class="search-table">
                <el-table :data="contractList" tooltip-effect="dark" v-loading="loading">
                    <el-table-column prop="contractAddress" :label="$t('contracts.contractAddress')" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <i class="wbs-icon-copy font-12 copy-public-key" @click="copyPubilcKey(scope.row.contractAddress)" :title="$t('contracts.copyContractAddress')"></i>
                            <span>{{scope.row.contractAddress}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="contractName" :label="$t('contracts.contractName')" show-overflow-tooltip width="120" align="center">
                        <template slot-scope="scope">
                            <span class="link" @click='open(scope.row)' v-if='scope.row.contractId'>{{scope.row.contractName}}</span>
                            <span  v-if='!scope.row.contractId'>{{scope.row.contractName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="contractPath"  :label="$t('contracts.contractCatalogue')" show-overflow-tooltip width="135" align="center">
                        <template slot-scope="scope">
                            <span class="link" @click='openPath(scope.row)' v-if='scope.row.contractPath'>{{scope.row.contractPath}}</span>
                            <span  v-if='!scope.row.contractPath'>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="handleType" :label="$t('contracts.contractStatus')" show-overflow-tooltip width="135" align="center">
                        <template slot-scope="scope">
                            <span>{{contractStatusZh(scope.row.handleType) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="contractAbi" :label="$t('contracts.contractAbi')" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <i class="wbs-icon-copy font-12 copy-public-key" v-if='scope.row.contractAbi' @click="copyPubilcKey(scope.row.contractAbi)" :title="$t('contracts.copyContractAbi')"></i>
                            <span class="link" @click='openAbi(scope.row)'>{{scope.row.contractAbi}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="contractBin" :label="$t('contracts.contractBin')" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <i class="wbs-icon-copy font-12 copy-public-key" v-if='scope.row.contractBin' @click="copyPubilcKey(scope.row.contractBin)" :title="$t('contracts.copyContractBin')"></i>
                            <span>{{scope.row.contractBin}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" :label="$t('home.createTime')" show-overflow-tooltip width="150" align="center"></el-table-column>
                    <el-table-column fixed="right" :label="$t('nodes.operation')" width="360">
                        <template slot-scope="scope">
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="send(scope.row)" type="text" size="small">{{$t('contracts.sendTransaction')}}</el-button>
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="updateAbi(scope.row)" type="text" size="small">{{$t('contracts.updateAbi')}}</el-button>
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="deleteAbi(scope.row)" type="text" size="small">{{$t('contracts.deleteAbi')}}</el-button>
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="handleStatusBtn(scope.row)" type="text" size="small">{{freezeThawBtn(scope.row)}}</el-button>
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="handleMgmtCns(scope.row)" type="text" size="small">{{$t('text.cns')}}</el-button>
                             <el-button :disabled="!scope.row.contractAddress || !scope.row.haveEvent" :class="{'grayColor': !scope.row.contractAddress}" @click="checkEvent(scope.row)" type="text" size="small">{{$t('title.checkEvent')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-if="total > 10" class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <abi-dialog :show="abiDialogShow" v-if="abiDialogShow" :data='abiData' @close="abiClose"></abi-dialog>
        <el-dialog :title="$t('contracts.sendTransaction')" :visible.sync="dialogVisible" width="580px" :before-close="sendClose" v-if="dialogVisible" center class="send-dialog">
            <send-transation @success="sendSuccess($event)" @close="handleClose" ref="send" :data="data" :abi='abiData' :version='version'></send-transation>
        </el-dialog>
        <v-editor v-if='editorShow' :show='editorShow' :data='editorData' :input='editorInput' :editorOutput="editorOutput" :sendConstant="sendConstant" @close='editorClose'></v-editor>
        <el-dialog title="" :visible.sync="freezeThawVisible" width="500px" v-if="freezeThawVisible" center>
            <freeze-thaw @freezeThawSuccess="freezeThawSuccess" @freezeThawClose="freezeThawClose" :contractInfo="contractInfo" :handleFreezeThawType="handleFreezeThawType"></freeze-thaw>
        </el-dialog>
        <el-dialog v-if="checkEventVisible" :title="$t('table.checkEvent')" :visible.sync="checkEventVisible" width="470px" center class="send-dialog">
            <check-event-dialog @checkEventSuccess="checkEventSuccess($event)" @checkEventClose="checkEventClose" :contractInfo="contractInfo"></check-event-dialog>
        </el-dialog>
        <el-dialog v-if="checkEventResultVisible" :title="$t('table.checkEventResult')" :visible.sync="checkEventResultVisible" width="670px" center class="send-dialog">
            <check-event-result @checkEventResultSuccess="checkEventResultSuccess($event)" @checkEventResultClose="checkEventResultClose" :checkEventResult="checkEventResult"></check-event-result>
        </el-dialog>
        <el-dialog v-if="mgmtCnsVisible" :title="$t('text.cns')" :visible.sync="mgmtCnsVisible" width="470px" center class="send-dialog">
            <mgmt-cns :mgmtCnsItem="mgmtCnsItem" :contractName="contractName" @mgmtCnsResultSuccess="mgmtCnsResultSuccess($event)" @mgmtCnsResultClose="mgmtCnsResultClose"></mgmt-cns>
        </el-dialog>
        <el-dialog :title="$t('nodes.addAbi')" :visible.sync="importVisibility" width="500px" v-if="importVisibility" center class="send-dialog">
            <import-abi @importSuccess="importSuccess" @closeImport="closeImport"></import-abi>
        </el-dialog>
        <el-dialog :title="$t('nodes.updateAbi')" :visible.sync="updateVisibility" width="500px" v-if="updateVisibility" center class="send-dialog">
            <update-abi @updateSuccess="updateSuccess" @closeUpdate="closeUpdate" :updateItem="updateItem"></update-abi>
        </el-dialog>
    </div>
</template>
<script>
import sendTransation from "@/components/sendTransaction";
import editor from "@/components/editor"
import abiDialog from "./dialog/abiDialog"
import freezeThaw from "./dialog/freezeThaw"
import checkEventDialog from "./dialog/checkEventDialog"
import checkEventResult from "./dialog/checkEventResult"
import mgmtCns from "./dialog/mgmtCns"
import { getContractList, getAllContractStatus, deleteHandleHistory, getAllAbiList, deleteImportAbi, deleteCode } from "@/util/api"
import importAbi from "../abiList/components/importAbi"
import updateAbi from "../abiList/components/updateAbi"
import router from '@/router'
export default {
    name: "registeredContract",
    components: {
        "v-editor": editor,
        "abi-dialog": abiDialog,
        "send-transation": sendTransation,
        freezeThaw,
        checkEventDialog,
        checkEventResult,
        mgmtCns,
        importAbi,
        updateAbi
    },
    data: function () {
        return {
            contractList: [],
            loading: false,
            currentPage: 1,
            pageSize: 10,
            editorShow: false,
            editorData: null,
            abiDialogShow: false,
            abiData: null,
            contractData: "",
            contractName: "",
            contractAddress: "",
            version: "",
            data: null,
            dialogVisible: false,
            total: 0,
            disabled: false,
            editorInput: null,
            editorOutput: null,
            freezeThaw: '',
            freezeThawVisible: false,
            contractInfo: {},
            handleFreezeThawType: '',
            historyCurrentPage: 1,
            historyPageSize: 10,
            historyTotal: 0,
            btnIndex: '',
            btnLoading: false,
            adminRivateKeyList: [],
            contractHistoryList: [],
            contractHistoryHead: [
                {
                    enName: 'id',
                    name: 'ID',
                    width: ''
                },
                {
                    enName: 'modifyAddress',
                    name: this.$t("contracts.userAddress"),
                    width: ''
                },
                {
                    enName: 'contractAddress',
                    name: this.$t("contracts.contractAddress"),
                    width: ''
                },
                {
                    enName: 'status',
                    name: this.$t("contracts.status"),
                    width: ''
                },
                {
                    enName: 'createTime',
                    name: this.$t("home.createTime"),
                    width: ''
                },
                {
                    enName: 'modifyTime',
                    name: this.$t("nodes.createTime"),
                    width: ''
                },
                {
                    enName: 'operate',
                    name: this.$t("govCommittee.operate"),
                    width: ''
                },
            ],
            checkEventVisible: false,
            checkEventResultVisible: false,
            // contractInfo: null,
            checkEventResult: null,
            groupId: localStorage.getItem("groupId"),
            mgmtCnsVisible: false,
            mgmtCnsItem: {},
            importVisibility: false,
            updateVisibility: false,
            updateItem: null
        }
    },
    created() {
        if (this.$route.query) {
            this.contractName = this.$route.query.contractName
        }
    },
    mounted: function () {
        if ((localStorage.getItem("root") === "admin" || localStorage.getItem("root") === "developer") && localStorage.getItem("groupId")) {
            this.disabled = false
        } else {
            this.disabled = true
        }
        if (localStorage.getItem("groupId")) {
            this.getContracts()
        }
    },
    methods: {
        formatterPath: function(row) {
            let str = row ? row : "-"
            return str
        },
        changGroup: function (data) {
            this.groupId = data
            this.getContracts()
        },
        getContracts: function () {
            const data = {
                groupId: this.groupId,
                pageNumber: this.currentPage,
                pageSize: this.pageSize,
                // contractName: this.contractName,
                // contractAddress: this.contractAddress,
                // contractStatus: 2
            }
            const query = {}
            if (localStorage.getItem("root") === 'developer') {
                query.account = localStorage.getItem("user")
            }
            if (this.contractName) {
                query.contractName = this.contractName
            } 
            if (this.contractAddress) {
                query.contractAddress = this.contractAddress
            }
            getAllAbiList(data,query).then(res => {
                if (res.data.code == 0) {
                    let newData = (new Date()).getTime()
                    let dataArray = res.data.data || [];
                    this.total = res.data.totalCount || 0;
                    let contractAddressList = []
                    dataArray.forEach(item => {
                        contractAddressList.push(item.contractAddress)
                    });
                    dataArray.forEach(item => {
                        item.haveEvent = false
                        if (item.contractAbi) {
                            let contractAbi = JSON.parse(item.contractAbi)
                            for (let index = 0; index < contractAbi.length; index++) {
                                if (contractAbi[index]['type'] === "event") {
                                    item.haveEvent = true
                                    break;
                                }
                            }
                        }
                    });
                    // console.log(dataArray);
                    this.queryAllContractStatus(contractAddressList, dataArray)
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
        queryAllContractStatus(contractAddressList, dataArray) {
            let data = {
                groupId: this.groupId,
                addressList: contractAddressList
            }
            getAllContractStatus(data)
                .then(res => {
                    if (res.data.code == 0) {
                        let statusList = res.data.data;
                        for (let key in statusList) {
                            dataArray.forEach(item => {
                                if (item.contractBin) {
                                    item.bin = item.contractBin.substring(0,6)+ '...'
                                } else {
                                    item.bin = item.contractBin
                                }
                                if (key == item.contractAddress) {
                                    item.handleType = statusList[key]
                                }
                            })
                        }
                        this.contractList = dataArray;
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
        getUserData() {
            let reqData = {
                groupId: this.groupId,
                pageNumber: 1,
                pageSize: 1000
            };
            getUserList(reqData, {})
                .then(res => {
                    if (res.data.code === 0) {
                        let arr = res.data.data;
                        this.adminRivateKeyList = arr;
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
        deleteHistory(val) {
            this.$confirm(this.$t("govCommittee.delete") + '?', {
                center: true
            })
                .then(_ => {
                    this.btnIndex = val.id
                    this.btnLoading = true
                    deleteHandleHistory(val.id)
                        .then(res => {
                            this.btnLoading = false
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: this.$t('govCommittee.success')
                                })

                            } else {
                                this.$message({
                                    message: this.$chooseLang(res.data.code),
                                    type: "error",
                                    duration: 2000
                                });
                            }
                        })
                        .catch(err => {
                            this.btnLoading = false
                            this.$message({
                                message: err.data || this.$t('text.systemError'),
                                type: "error",
                                duration: 2000
                            });
                        });
                })
                .catch(_ => {

                });

        },
        // 打开添加abi弹窗
        generateAbi() {
            this.importVisibility = true;
        },
        closeImport() {
            this.importVisibility = false
        },
        importSuccess() {
            this.importVisibility = false;
            this.getContracts()
        },
        closeUpdate() {
            this.updateVisibility = false
        },
        updateAbi(val) {
            this.updateItem = val;
            this.updateVisibility = true;
        },
        updateSuccess() {
            this.updateVisibility = false;
            this.getContracts()
        },
        routeAbi() {
            this.$router.push("/parseAbi")
        },
        deleteAbi(val) {
            this.$confirm(this.$t('text.confirmDelete'))
                .then(_ => {
                    this.deleteData(val)
                })
                .catch(_ => { });

        },
        // 删除功能，当仅存在abiId是调用删除abi接口
        // 当仅存在contractId时调用删除合约接口
        // 当同时存在abiId和contractId时，两个接口都调用
        async deleteData(val) {
            if(val.abiId && !val.contractId) {
                this.deleteAbiData(val)
            } else if(!val.abiId && val.contractId) {
                this.deleteContractData(val)
            } else {
                await this.deleteAbiData(val,'wait')
                await this.deleteContractData(val)
            }
        },
        async deleteAbiData(val,type) {
            this.loading = true
            await deleteImportAbi(val.abiId)
                .then(res => {
                    this.loading = false
                    if (type) {
                        this.loading = true
                    }
                    if (res.data.code === 0) {
                        this.$message({
                            type: "success",
                            message: this.$t('text.resetSuccess')
                        })
                        this.getContracts()
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
        async deleteContractData(val) {
            this.loading = true;
            let data = {
                groupId: localStorage.getItem("groupId"),
                contractId: val.contractId
            }
            await deleteCode(data, {}).then(res => {
                this.loading = false
                    if (res.data.code === 0) {
                        // 更新vuex contractList
                        let allContractList = this.$store.state.contractDataList;
                        let list = allContractList.filter((item) => {
                            return item.contractId !== val.contractId
                        })
                        this.$store.dispatch('set_contract_dataList_action', list);
                        this.getContracts()
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
        copyPubilcKey: function (val) {
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
        open: function (val) {
            router.push({
                path: "/contract",
                query: {
                    contractId: val.contractId,
                    contractPath: val.contractPath
                }
            })
        },
        openPath(val) {
            router.push({
                path: "/contract",
                query: {
                    contractPath: val.contractPath
                }
            })
        },
        editorClose: function () {
            this.editorShow = false;
        },
        openAbi: function (val) {
            this.abiData = val.contractAbi;
            this.abiDialogShow = true
        },
        abiClose: function () {
            this.abiDialogShow = false;
            this.abiData = null
        },
        search: function () {
            if (this.contractData && this.contractData.length && this.contractData.length < 20) {
                this.contractName = this.contractData;
                this.contractAddress = ""
            } else if (this.contractData && this.contractData.length && (this.contractData.length > 20 || this.contractData.length == 20)) {
                this.contractName = "";
                this.contractAddress = this.contractData;
            } else {
                this.contractName = "";
                this.contractAddress = ""
            }
            this.currentPage = 1
            this.getContracts();
        },
        send: function (val) {
            this.data = val;
            this.abiData = val.contractAbi;
            this.version = val.contractVersion;
            this.dialogVisible = true
        },
        sendClose: function () {
            this.dialogVisible = false
        },
        handleClose: function () {
            this.dialogVisible = false
        },
        sendSuccess: function (val) {
            this.sendConstant = val.constant;
            this.dialogVisible = false;
            this.editorShow = true;
            this.editorData = val.resData;
            this.editorInput = val.input;
            this.editorOutput = val.data.outputs;
        },
        handleSizeChange: function (val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getContracts();
        },
        handleCurrentChange: function (val) {
            this.currentPage = val;
            this.getContracts();
        },
        historySizeChange: function (val) {
            this.historyPageSize = val;
            this.historyCurrentPage = 1;
            ;
        },
        historyCurrentChange: function (val) {
            this.historyCurrentPage = val;
            ;
        },
        handleStatusBtn(val) {
            this.freezeThawVisible = true
            this.contractInfo = val
            if (val.handleType == 0) {
                this.handleFreezeThawType = 'freeze'
            } else if (val.handleType == 1) {
                this.handleFreezeThawType = 'unfreeze'
            }

        },
        freezeThawSuccess() {
            this.freezeThawVisible = false
            this.getContracts()

        },
        freezeThawClose() {
            this.freezeThawVisible = false
        },
        contractStatusZh(val) {
            switch (val) {
                case '0':   
                    return this.$t('contracts.normal')
                    break;
                case '1':
                    return this.$t('contracts.freeze')
                    break;
            }
        },
        handleContractStatusZh(val) {
            switch (val) {
                case 0:
                    return this.$t('contracts.unfreeze')
                    break;
                case 1:
                    return this.$t('contracts.freeze')
                    break;
            }
        },
        freezeThawBtn(val) {
            switch (val.handleType) {
                case '0':
                    return this.$t('contracts.freeze')
                    break;
                case '1':
                    return this.$t('contracts.unfreeze')
                    break;
            }
        },
        checkEvent: function (val) {
            this.contractInfo = val;
            this.$router.push({
                path: '/eventCheck',
                query: {
                    groupId: this.groupId,
                    type: 'abi',
                    contractAddress: val.contractAddress
                }
            })
        },
        checkEventSuccess(val) {
            this.checkEventResult = val
            this.checkEventResultVisible = true
        },
        checkEventClose() {
            this.checkEventVisible = false;
        },
        checkEventResultSuccess() {
            this.checkEventResultVisible = false
        },
        checkEventResultClose() {
            this.checkEventResultVisible = false
        },
        handleMgmtCns(item) {
            this.mgmtCnsVisible = true;
            this.mgmtCnsItem = item;
        },
        mgmtCnsResultSuccess() {
            this.mgmtCnsVisible = false;
        },
        mgmtCnsResultClose() {
            this.mgmtCnsVisible = false;
        },
        clearInput() {
            this.contractName = "";
            this.contractAddress = "";
            this.contractData = "";
            this.currentPage = 1;
            this.getContracts()
        }
    }
}
</script>
<style scoped>
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
.search-table >>> .el-tooltip__popper {
     max-width: 80%;
}
</style>
<style>
.el-tooltip__popper {
    max-width: 80%;
}
</style>


