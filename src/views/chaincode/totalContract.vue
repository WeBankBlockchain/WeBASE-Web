<template>
    <div class="module-wrapper">
        <div class="search-part">

            <div class="search-part-right">
                <el-input :placeholder="$t('contracts.contractAddressInput')" v-model="contractData" class="input-with-select" clearable @clear="clearInput">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </div>
        </div>
        <div class="search-table">
            <el-table :data="ContractList" tooltip-effect="dark" v-loading="loading">
                <el-table-column prop="contractAddress" :label="$t('contracts.contractAddress')" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <i class="wbs-icon-copy font-12 copy-public-key" @click="copyPubilcKey(scope.row.contractAddress)" :title="$t('contracts.copyContractAddress')"></i>
                        <span>{{scope.row.contractAddress}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="contractName" :label="$t('contracts.contractName')" show-overflow-tooltip width="120" align="center">
                </el-table-column>
                <!-- <el-table-column prop="contractPath" :label="$t('contracts.contractCatalogue')" show-overflow-tooltip width="135" align="center">
                <template slot-scope="scope">
                    <span class="link" @click='openPath(scope.row)'>{{scope.row.contractPath}}</span>
                </template>
            </el-table-column> -->
                <!-- <el-table-column prop="handleType" :label="$t('contracts.contractStatus')" show-overflow-tooltip width="135" align="center">
                <template slot-scope="scope">
                    <span>{{contractStatusZh(scope.row.handleType) }}</span>
                </template>
            </el-table-column> -->
                <el-table-column prop="contractAbi" :label="$t('contracts.contractAbi')" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <i class="wbs-icon-copy font-12 copy-public-key" v-if='scope.row.contractAbi' @click="copyPubilcKey(scope.row.contractAbi)" :title="$t('contracts.copyContractAbi')"></i>
                        <span class="link" @click='openAbi(scope.row)'>{{scope.row.contractAbi}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="contractBin" :label="$t('contracts.contractBin')" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                    <i class="wbs-icon-copy font-12 copy-public-key" v-if='scope.row.contractBin' @click="copyPubilcKey(scope.row.contractBin)" :title="$t('contracts.copyContractBin')"></i>
                    <span>{{scope.row.contractBin}}</span>
                </template>
            </el-table-column> -->
                <el-table-column prop="createTime" :label="$t('home.createTime')" show-overflow-tooltip width="150" align="center"></el-table-column>
                <el-table-column fixed="right" :label="$t('nodes.operation')" width="240">
                    <template slot-scope="scope">
                        <el-button v-if="!(disabled || scope.row.abiId > 0 || scope.row.abiId === 0)" @click="importData(scope.row)" type="text" size="small">{{$t('nodes.addAbi')}}</el-button>
                        <el-button v-if='!disabled && (scope.row.abiId > 0 || scope.row.abiId === 0)' @click="send(scope.row)" type="text" size="small">{{$t('contracts.sendTransaction')}}</el-button>
                        <!-- <el-button v-if="!disabled &&scope.row.contractAddress && scope.row.haveEvent" @click="checkEvent(scope.row)" type="text" size="small">{{$t('title.checkEvent')}}</el-button> -->
                        <!-- <el-button v-if="!disabled" @click="handleStatusBtn(scope.row)" type="text" size="small">{{freezeThawBtn(scope.row)}}</el-button> -->
                        <!-- <el-button v-if="!disabled && (scope.row.abiId > 0 || scope.row.abiId === 0)" @click="handleMgmtCns(scope.row)" type="text" size="small">{{$t('text.cns')}}</el-button> -->
                        <el-button v-if='!disabled && (scope.row.abiId > 0 || scope.row.abiId === 0)' @click="updateAbi(scope.row)" type="text" size="small">{{$t('contracts.updateAbi')}}</el-button>
                        <!-- <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="deleteAbi(scope.row)" type="text" size="small">{{$t('contracts.deleteAbi')}}</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-if="total > 10" class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
            <abi-dialog :show="abiDialogShow" v-if="abiDialogShow" :data='abiData' @close="abiClose"></abi-dialog>
            <el-dialog :title="$t('nodes.addAbi')" :visible.sync="importVisibility" width="500px" v-if="importVisibility" center class="send-dialog">
                <import-abi @importSuccess="importSuccess" @closeImport="closeImport" :address='address'></import-abi>
            </el-dialog>
            <el-dialog :title="$t('contracts.sendTransaction')" :visible.sync="dialogVisible" width="580px" :before-close="sendClose" v-if="dialogVisible" center class="send-dialog">
                <send-transation @success="sendSuccess($event)" @close="handleClose" ref="send"   :liquidChecks='liquidCheck' :data="data" :abi='abiData' :version='version'></send-transation>
            </el-dialog>
            <editor v-if='editorShow' :show='editorShow' :data='editorData' :input='editorInput' :editorOutput="editorOutput" :sendConstant="sendConstant" @close='editorClose'></editor>
            <el-dialog title="" :visible.sync="freezeThawVisible" width="500px" v-if="freezeThawVisible" center>
                <freeze-thaw @freezeThawSuccess="freezeThawSuccess" @freezeThawClose="freezeThawClose" :contractInfo="contractInfo" :handleFreezeThawType="handleFreezeThawType"></freeze-thaw>
            </el-dialog>
            <el-dialog v-if="mgmtCnsVisible" :title="$t('text.cns')" :visible.sync="mgmtCnsVisible" width="470px" center class="send-dialog">
                <mgmt-cns :mgmtCnsItem="mgmtCnsItem" :contractName="contractName" @mgmtCnsResultSuccess="mgmtCnsResultSuccess($event)" @mgmtCnsResultClose="mgmtCnsResultClose"></mgmt-cns>
            </el-dialog>
            <el-dialog :title="$t('nodes.updateAbi')" :visible.sync="updateVisibility" width="500px" v-if="updateVisibility" center class="send-dialog">
                <update-abi @updateSuccess="updateSuccess" @closeUpdate="closeUpdate" :updateItem="updateItem"></update-abi>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { getAllContractList,getFronts,checkIsWasm } from "@/util/api"
import abiDialog from "./dialog/abiDialog"
import importAbi from "../abiList/components/importAbi"
import editor from "@/components/editor"
import sendTransation from "@/components/sendTransaction";
import freezeThaw from "./dialog/freezeThaw"
import mgmtCns from "./dialog/mgmtCns"
import updateAbi from "../abiList/components/updateAbi"
export default {
    name: "totalContract",
    components: {
        abiDialog,
        importAbi,
        editor,
        sendTransation,
        freezeThaw,
        mgmtCns,
        updateAbi
    },
    data() {
        return {
            disabled: false,
            loading: false,
            ContractList: [],
            total: 0,
            pageNumber: 1,
            pageSize: 10,
            abiData: null,
            abiDialogShow: false,
            importVisibility: false,
            address: null,
            dialogVisible: false,
            editorShow: false,
            editorData: null,
            editorInput: null,
            editorOutput: null,
            sendConstant: null,
            data: null,
            abiData: null,
            version: '',
            contractInfo: null,
            freezeThawVisible: false,
            handleFreezeThawType: null,
            mgmtCnsVisible: false,
            mgmtCnsItem: null,
            updateVisibility: false,
            updateItem: null,
            contractData: "",
            liquidCheck: false,

        }
    },
    mounted() {
        if ((localStorage.getItem("root") === "admin" || localStorage.getItem("root") === "developer") && localStorage.getItem("groupId")) {
            this.disabled = false
        } else {
            this.disabled = true
        }
        if (localStorage.getItem("groupId") && (localStorage.getItem("configData") == 3 || localStorage.getItem("deployType") == 0)) {
            this.getList()
        }
        this.getfrontList()

    },
    methods: {
    getfrontList() {
      let reqData = {
        // frontId: this.frontId,
        groupId: localStorage.getItem("groupId")
      };
      getFronts(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            this.frontList = res.data.data || [];
            this.frontId = this.frontList[0].frontId;
            this.loading = false;
            this.liquidCheckMethod();
          } else {
            this.loading = false;
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    liquidCheckMethod() {
      let groupId = localStorage.getItem("groupId");
      checkIsWasm(this.frontId,groupId)
        .then((res) => {
          if (res.data.data == true) {
            this.liquidCheck = true;
          } 
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: err.data || this.$t("text.systemError"),
          });
        });
    },
        getList() {
            this.loading = true;
            let groupId = localStorage.getItem("groupId");
            let reqData = {
                groupId: groupId,
                pageNumber: this.pageNumber,
                pageSize: this.pageSize
            },
                reqQuery = {};
            reqQuery = {
                type: 1
            };
            if (this.contractData) {
                reqQuery['contractAddress'] = this.contractData;
            }
            getAllContractList(reqData, reqQuery)
                .then(res => {
                    if (res.data.code === 0) {
                        this.ContractList = res.data.data;
                        this.total = res.data.totalCount;
                        this.loading = false;
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
        openAbi: function (val) {
            this.abiData = val.contractAbi;
            this.abiDialogShow = true
        },
        abiClose: function () {
            this.abiDialogShow = false;
            this.abiData = null
        },
        open: function (val) {
            this.$router.push({
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
        handleSizeChange: function (val) {
            this.pageSize = val;
            this.pageNumber = 1;
            this.getList();
        },
        handleCurrentChange: function (val) {
            this.pageNumber = val;
            this.getList();
        },
        importData(val) {
            this.importVisibility = true;
            this.address = val.contractAddress
        },
        importSuccess() {
            this.importVisibility = false;
            this.getList();
        },
        closeImport() {
            this.importVisibility = false;
            this.getList();
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
        editorClose: function () {
            this.editorShow = false;
        },
        checkEvent: function (val) {
            this.contractInfo = val;
            this.$router.push({
                path: '/eventCheck',
                query: {
                    groupId: localStorage.getItem("groupId"),
                    type: 'contract',
                    contractAddress: val.contractAddress
                }
            })
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
            this.getList()

        },
        freezeThawClose() {
            this.freezeThawVisible = false
            this.getList()
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
        closeUpdate() {
            this.updateVisibility = false
        },
        updateAbi(val) {
            this.updateItem = val;
            this.updateVisibility = true;
        },
        updateSuccess() {
            this.updateVisibility = false;
            this.getList()
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
        search: function () {
            this.pageNumber= 1
            this.getList();
        },
        clearInput() {
            this.contractName = "";
            this.contractAddress = "";
            this.contractData = "";
            this.currentPage = 1;
            this.getList()
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
</style>