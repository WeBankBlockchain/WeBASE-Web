<template>
    <div>
        <!-- <v-content-head :headTitle="$t('title.systemManager')" :headSubTitle="$t('title.certificate')" @changGroup="changGroup"></v-content-head> -->
        <nav-menu :headTitle="$t('title.systemManager')" :headSubTitle="$t('title.certificate')"></nav-menu>
        <div class="module-wrapper">
            <div class="search-part" style="display: flex;padding:20px 40px">
                <div class="search-part-left">
                    <el-upload ref="upload" multiple action :limit="10" accept=".crt,.cer,.der" :http-request="uploadCrt" :before-upload="onBeforeUpload" :on-exceed="onUploadExceed">
                        <el-button size="small" type="primary" :disabled="disabled">{{this.$t('system.addCertificate')}}</el-button>
                        <!-- <div slot="tip">只能上传crt文件，且不超过500kb</div> -->
                    </el-upload>

                </div>
                <div style="margin-left: 20px;">
                    <el-button type="primary" :disabled="disabled" @click="exportSdk()" size="small">{{$t('text.exportSdk')}}</el-button>
                </div>
            </div>
            <div class="search-table">
                <el-table :data="certificateList" tooltip-effect="dark" v-loading="loading" class="search-table-content">
                    <el-table-column v-for="head in certificateHead" :label="head.name" :key="head.enName" :width="head.width" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <template v-if="head.enName!='operate'">
                                <template v-if="scope.row[head.enName]">
                                    <el-button v-if=" head.enName==='certName'" :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" title="导出" @click="sureExportCert(scope.row)">{{scope.row[head.enName]}}</el-button>
                                    <span v-else-if="head.enName==='fingerPrint'">
                                        <i class="wbs-icon-copy font-12" @click="copyFingerPrint(scope.row[head.enName])" :title="$t('text.copy')"></i>
                                        {{scope.row[head.enName]}}
                                    </span>
                                    <span v-else-if="head.enName==='father'">
                                        <i class="wbs-icon-copy font-12" @click="copyFingerPrint(scope.row[head.enName])" :title="$t('text.copy')"></i>
                                        {{scope.row[head.enName]}}
                                    </span>
                                    <span v-else-if="head.enName==='address'">
                                        <i class="wbs-icon-copy font-12" @click="copyFingerPrint(scope.row[head.enName])" :title="$t('text.copy')"></i>
                                        {{scope.row[head.enName]}}
                                    </span>
                                    <span v-else-if="head.enName==='publicKey'">
                                        <i class="wbs-icon-copy font-12" @click="copyFingerPrint(scope.row[head.enName])" :title="$t('text.copy')"></i>
                                        {{scope.row[head.enName]}}
                                    </span>
                                    <span v-else-if="head.enName==='validityFrom'">
                                        {{format(scope.row['validityFrom'],'yyyy-MM-dd HH:mm:ss')}} {{$t('system.to')}} {{format(scope.row['validityTo'],'yyyy-MM-dd HH:mm:ss')}}
                                    </span>
                                    <span v-else>
                                        {{scope.row[head.enName]}}
                                    </span>
                                </template>
                                <template v-else>-</template>
                            </template>
                            <template v-else>
                                <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="deteleCert(scope.row)">{{$t('text.delete')}}</el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination> -->
            </div>
        </div>
        <el-dialog :visible.sync="frontDialogVisible" :title="frontDialogTitle" width="433px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="frontDialogVisible">
            <front-dialog @close="close" @submit="submit"></front-dialog>
        </el-dialog>

    </div>
</template>

<script>
import NavMenu from '../../components/navs/navMenu.vue';
import contentHead from "@/components/contentHead";
import frontDialog from "./components/frontDialog";
import { deleteCert, certList, exportCert, importCert, exportCertSdk, getFronts } from "@/util/api";
import { format } from "@/util/util";
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import Bus from "@/bus"

export default {
    name: 'Certificate',

    components: {
        "v-content-head": contentHead,
        frontDialog,
        'nav-menu':NavMenu,
    },

    props: {
    },

    data() {
        return {
            disabled: false,
            loading: false,
            currentPage: 1,
            pageSize: 100,
            total: 0,
            certificateList: [],
            format: format,
            frontDialogVisible: false,
            frontDialogTitle: '',
            frontId: ''
        }
    },

    computed: {
        certificateHead() {
            let data = [
                {
                    enName: 'certName',
                    name: this.$t('system.certName'),
                    width: ''
                },
                {
                    enName: 'certType',
                    name: this.$t('system.certType'),
                    width: ''
                },
                {
                    enName: 'fingerPrint',
                    name: this.$t('system.fingerPrint'),
                    width: ''
                },
                {
                    enName: 'father',
                    name: this.$t('system.father'),
                    width: ''
                },
                {
                    enName: 'address',
                    name: this.$t('system.address'),
                    width: ''
                },
                {
                    enName: 'publicKey',
                    name: 'NodeId',
                    width: ''
                },
                {
                    enName: 'validityFrom',
                    name: this.$t('system.validityFrom'),
                    width: '280'
                },
                {
                    enName: 'operate',
                    name: this.$t('nodes.operation'),
                    width: ''
                },

            ]
            return data
        }
    },

    watch: {
    },

    created() {
    },

    mounted() {
        if (localStorage.getItem("root") === "admin"||localStorage.getItem("groupId")) {
            this.disabled = false
        } else {
            this.disabled = true
        }
        if (localStorage.getItem("groupId") || (localStorage.getItem("configData") == 3 || localStorage.getItem("deployType") == 0)) {
            this.getCertList()
        }
        this.queryFronts()
    Bus.$on("changGroup", (item) => {
    if (localStorage.getItem("groupId") || (localStorage.getItem("configData") == 3 || localStorage.getItem("deployType") == 0)) {
            this.getCertList()
        }
        this.queryFronts()
    })
    },
     destroyed() {
     Bus.$off("changGroup");
  },
    methods: {
        changGroup() {

        },
        importCert() {

        },
        queryFronts() {
            getFronts({})
                .then(res => {
                    if (res.data.code === 0) {
                        const { data } = res.data
                        if (data.length) {

                            this.frontId = data[0]['frontId']
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
        sureExportCert(row) {
            let list = {
                fingerPrint: row.fingerPrint
            }
            exportCert(list).then(res => {
                const { data } = res;
                if (data.code === 0) {
                    let fileDownload = require('js-file-download');
                    fileDownload(data.data.content, `${data.data.certName}.crt`);
                } else {
                    this.$message({
                        type: 'error',
                        message: data.data,
                        duration: 2500
                    })
                }
            })
        },
        deteleCert(row) {
            this.$confirm(this.$t('text.confirmDelete'))
                .then(_ => {
                    this.sureDeleteCert(row)
                })
                .catch(_ => { });
        },
        sureDeleteCert(row) {
            let param = {
                fingerPrint: row.fingerPrint
            }
            deleteCert(param).then(res => {
                const { data } = res;
                if (data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('system.deleteSuccess'),
                    })
                    this.getCertList()
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
        onBeforeUpload(file) {
            const isLt1M = Math.ceil(file.size / 1024) < 100;
            if (!isLt1M) {
                this.$message.error(this.$t('system.fileSize'));
            }
            return isLt1M;
        },
        uploadCrt(param) {
            var reader = new FileReader(), self = this;
            reader.readAsText(param.file, "UTF-8");
            reader.onload = function (e) {
                var fileString = e.target.result;
                self.postCrt(fileString)
            }
            this.$refs.upload.clearFiles()
        },
        postCrt(fileString) {
            let param = {
                content: fileString
            }
            importCert(param).then(res => {
                const { data } = res;
                if (data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('system.importSuccess'),
                    })
                    this.getCertList()
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
            this.getCertList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getCertList();
        },
        getCertList() {
            this.loading = true;
            let list = {
                pageNumber: this.currentPage,
                pageSize: this.pageSize,
                groupId: localStorage.getItem("groupId")
            }
            certList(list).then(res => {
                this.loading = false;
                const { data } = res;
                if (data.code === 0) {
                    this.certificateList = data.data;
                    this.total = data.totalCount;
                }
            })
        },
        onUploadExceed(files, fileList) {
            this.$message.warning(this.$t('system.uploadWarning1') + files.length + this.$t('system.uploadWarning2')(files.length + fileList.length) + this.$t('system.uploadWarning3'));
        },
        close() {
            this.frontDialogVisible = false
        },
        submit(val) {
            this.frontDialogVisible = false
            this.sureExportSdk(val)
        },
        exportSdk() {
            // this.frontDialogVisible = true
            this.sureExportSdk()
        },
        sureExportSdk() {
            // const zip = new JSZip()
            exportCertSdk(this.frontId).then(res => {
                const { status } = res;
                if (status === 200) {
                    const blob = new Blob([res.data])
                    const fileName = `sdk.zip`
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
                } else {
                    this.$message({
                        type: 'error',
                        message: this.$t('text.haveCertSdk')
                    })
                }

            })
        },
        copyFingerPrint(val) {
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
.search-table {
    padding: 0 40px 20px 41px;
}
.search-table-content >>> td,
.search-table-content >>> th {
    padding: 8px 0;
    font-size: 12px;
}
</style>
