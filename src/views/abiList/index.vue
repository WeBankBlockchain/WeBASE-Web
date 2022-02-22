<template>
    <div>
        <!-- <content-head :headTitle="$t('title.abiList')" @changGroup="changGroup"></content-head> -->
        <div class="module-wrapper">
            <div class="search-table">
                <div class="search-part-left" style="padding-top: 20px;">
                    <el-button type="primary" class="search-part-left-btn" @click="generateAbi">{{this.$t("nodes.addAbi")}}</el-button>
                </div>
                <el-table :data="abiList" class="search-table-content" v-loading="loading">
                    <el-table-column v-for="head in abiHead" :label="head.name" :key="head.enName" :prop="head.enName" :width="head.width" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if='head.enName === "contractAbi"'>
                                <i class="wbs-icon-copy font-12 copy-public-key" @click="copyPubilcKey(scope.row.contractAbi)" :title="$t('contracts.copyContractAbi')"></i>
                                <span class="link" @click='openAbi(scope.row)'>{{scope.row.contractAbi}}</span>
                            </span>
                            <span v-else-if='head.enName === "contractAddress"'>
                                <i class="wbs-icon-copy font-12 copy-public-key" @click="copyPubilcKey(scope.row.contractAddress)" :title="$t('contracts.copyContractAddress')"></i>
                                <span>{{scope.row.contractAddress}}</span>
                            </span>
                            <span v-else-if='head.enName === "contractBin"'>
                                <i class="wbs-icon-copy font-12 copy-public-key" @click="copyPubilcKey(scope.row.contractBin)" :title="$t('contracts.copyContractBin')"></i>
                                <span>{{scope.row.contractBin}}</span>
                            </span>
                            <span v-else>{{scope.row[head.enName]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" :label="$t('nodes.operation')" width="280">
                        <template slot-scope="scope">
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="send(scope.row)" type="text" size="small">{{$t('contracts.sendTransaction')}}</el-button>
                            <el-button :disabled="!scope.row.contractAddress || !scope.row.haveEvent" :class="{'grayColor': !scope.row.contractAddress}" @click="checkEvent(scope.row)" type="text" size="small">{{$t('title.checkEvent')}}</el-button>
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="updateAbi(scope.row)" type="text" size="small">{{$t('contracts.updateAbi')}}</el-button>
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="deleteAbi(scope.row)" type="text" size="small">{{$t('contracts.deleteAbi')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <abi-dialog :show="abiDialogShow" v-if="abiDialogShow" :data='abiData' @close="abiClose"></abi-dialog>
        <el-dialog :title="$t('contracts.sendTransaction')" :visible.sync="dialogVisible" width="580px" :before-close="sendClose" v-if="dialogVisible" center class="send-dialog">
            <send-transation @success="sendSuccess($event)" @close="handleClose" ref="send" :data="data" :abi='abiData' :version='version'></send-transation>
        </el-dialog>
        <editor v-if='editorShow' :show='editorShow' :data='editorData' :input='editorInput' :editorOutput="editorOutput" @close='editorClose'></editor>
        <el-dialog :title="$t('nodes.addAbi')" :visible.sync="importVisibility" width="580px" v-if="importVisibility" center class="send-dialog">
            <import-abi @importSuccess="importSuccess" @closeImport="closeImport"></import-abi>
        </el-dialog>
        <el-dialog :title="$t('nodes.addAbi')" :visible.sync="updateVisibility" width="580px" v-if="updateVisibility" center class="send-dialog">
            <update-abi @updateSuccess="updateSuccess" @closeUpdate="closeUpdate" :updateItem="updateItem"></update-abi>
        </el-dialog>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import abiDialog from "@/components/abiDialog";
import sendTransation from "@/components/sendTransaction";
import editor from "@/components/editor"
import importAbi from "./components/importAbi"
import updateAbi from "./components/updateAbi"
import { getAbiList, deleteImportAbi } from "@/util/api"
export default {
    name: 'nodeList',

    components: {
        contentHead,
        abiDialog,
        sendTransation,
        editor,
        importAbi,
        updateAbi
    },

    props: {
    },

    data() {
        return {
            loading: false,
            abiDialogShow: false,
            dialogVisible: false,
            editorShow: false,
            disabled: false,
            abiList: [],
            abiData: null,
            data: null,
            version: '',
            importVisibility: false,
            updateVisibility: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            updateItem: {},
            editorInput: null,
            editorOutput: null,
            groupId: localStorage.getItem('groupId')
        }
    },

    computed: {
        abiHead() {
            let data = [
                {
                    enName: "contractName",
                    name: this.$t("contracts.contractName"),
                    width: '170'
                },
                {
                    enName: "contractAddress",
                    name: this.$t("contracts.contractAddress"),
                    width: '330'
                },
                {
                    enName: "contractAbi",
                    name: this.$t("contracts.contractAbi"),
                    width: ''
                },
                // {
                //     enName: "contractBin",
                //     name: this.$t("contracts.runtimeBin"),
                //     width: ''
                // }
            ];
            return data
        }
    },

    watch: {

    },

    created() {
    },

    mounted() {
        if ((localStorage.getItem("root") === "admin" || localStorage.getItem("root") === "developer") || localStorage.getItem("groupId")) {
            this.disabled = false
        } else {
            this.disabled = true
        }
        if (localStorage.getItem('groupId') || (localStorage.getItem("configData") == 3 || localStorage.getItem("deployType") == 0)) {
            this.queryAbiList()
        }
    },

    methods: {
        changGroup(data) {
            this.groupId = data
            this.queryAbiList()
        },
        closeImport() {
            this.importVisibility = false
        },
        importSuccess() {
            this.importVisibility = false;
            this.queryAbiList()
        },
        closeUpdate() {
            this.updateVisibility = false
        },
        updateSuccess() {
            this.updateVisibility = false;
            this.queryAbiList()
        },
        generateAbi() {
            this.importVisibility = true;
        },
        queryAbiList() {
            let reqData = {
                groupId: localStorage.getItem('groupId'),
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            },

                reqQuery = {
                    account: ""
                };
            if (localStorage.getItem("root") === 'developer') {
                reqQuery.account = localStorage.getItem('user')
            }
            getAbiList(reqData, reqQuery)
                .then(res => {
                    if (res.data.code === 0) {
                        var dataArray = [];
                        dataArray = res.data.data;
                        console.time("耗时");
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
                        console.timeEnd("耗时");
                        this.abiList = dataArray;
                        this.total = res.data.totalCount;
                        this.total = res.data.totalCount;
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
        openAbi(val) {
            this.abiData = val.contractAbi;
            this.abiDialogShow = true
        },
        abiClose() {
            this.abiDialogShow = false;
            this.abiData = null
        },
        send(val) {
            this.data = val;
            this.abiData = val.contractAbi;
            this.version = val.contractVersion;
            this.dialogVisible = true
        },
        sendClose() {
            this.dialogVisible = false
        },
        handleClose() {
            this.dialogVisible = false
        },
        sendSuccess(val) {
            this.dialogVisible = false;
            this.editorShow = true;
            this.editorData = val.resData;
            console.log(val)
            this.editorInput = val.input;
            this.editorOutput = val.data.outputs;
        },
        editorClose() {
            this.editorShow = false;
        },
        copyPubilcKey(val) {
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
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.queryAbiList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.queryAbiList();
        },
        updateAbi(val) {
            this.updateItem = val;
            this.updateVisibility = true;
        },
        deleteAbi(val) {
            this.$confirm(this.$t('text.confirmDelete'))
                .then(_ => {
                    this.sureDeleteAbi(val)
                })
                .catch(_ => { });

        },
        sureDeleteAbi(val) {
            this.loading = true
            deleteImportAbi(val.abiId)
                .then(res => {
                    this.loading = false
                    if (res.data.code === 0) {
                        this.$message({
                            type: "success",
                            message: this.$t('text.resetSuccess')
                        })
                        this.queryAbiList()
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
        checkEvent: function (val) {
            this.$router.push({
                path: '/eventCheck',
                query: {
                    groupId: this.groupId,
                    type: 'abi',
                    contractAddress: val.contractAddress
                }
            })
        },

    }
}
</script>

<style scoped>
.search-part-left-btn {
    border-radius: 20px;
}
</style>
