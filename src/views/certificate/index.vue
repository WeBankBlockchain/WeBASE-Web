<template>
    <div>
        <v-content-head :headTitle="'系统管理'" :headSubTitle="'证书管理'" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper">
            <div class="search-part">
                <div class="search-part-left">
                    <el-upload ref="upload" multiple action :limit="10" accept=".crt,.cer,.der" :http-request="uploadCrt" :before-upload="onBeforeUpload" :on-exceed="onUploadExceed">
                        <el-button size="small" type="primary">导入证书</el-button>
                        <!-- <div slot="tip">只能上传crt文件，且不超过500kb</div> -->
                    </el-upload>
                </div>
            </div>
            <el-table :data="certificateList" tooltip-effect="dark" v-loading="loading" class="search-table-content">
                <el-table-column v-for="head in certificateHead" :label="head.name" :key="head.enName" :width="head.width" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <template v-if="head.enName!='operate'">
                            <template v-if="scope.row[head.enName]">
                                <el-button v-if=" head.enName==='certName'" :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" title="导出" @click="sureExportCert(scope.row)">{{scope.row[head.enName]}}</el-button>
                                <span v-else-if="head.enName==='fingerPrint'">
                                    <i class="wbs-icon-copy font-12" @click="copyFingerPrint(scope.row[head.enName])" title="复制"></i>
                                    {{scope.row[head.enName]}}
                                </span>
                                <span v-else-if="head.enName==='validityFrom'">
                                    {{format(scope.row['validityFrom'],'yyyy-MM-dd HH:mm:ss')}} 至 {{format(scope.row['validityTo'],'yyyy-MM-dd HH:mm:ss')}}
                                </span>
                                <span v-else>
                                    {{scope.row[head.enName]}}
                                </span>
                            </template>
                            <template v-else>-</template>
                        </template>
                        <template v-else>
                            <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="deteleCert(scope.row)">删除</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { deleteCert, certList, exportCert, importCert } from "@/util/api";
import { format } from "@/util/util";
export default {
    name: 'Certificate',

    components: {
        "v-content-head": contentHead,
    },

    props: {
    },

    data() {
        return {
            disabled: false,
            loading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            certificateHead: [
                {
                    enName: 'certName',
                    name: '证书名称',
                    width: ''
                },
                {
                    enName: 'certType',
                    name: '证书类型',
                    width: ''
                },
                {
                    enName: 'fingerPrint',
                    name: '指纹',
                    width: ''
                },
                {
                    enName: 'address',
                    name: '地址',
                    width: ''
                },
                {
                    enName: 'publicKey',
                    name: 'NodeId',
                    width: ''
                },
                {
                    enName: 'validityFrom',
                    name: '有效期',
                    width: '280'
                },
                {
                    enName: 'operate',
                    name: '操作',
                    width: ''
                },
            ],
            certificateList: [],
            format: format
        }
    },

    computed: {
    },

    watch: {
    },

    created() {
    },

    mounted() {
        if (localStorage.getItem("root") === "admin") {
            this.disabled = false
        } else {
            this.disabled = true
        }
        this.getCertList()
    },

    methods: {
        changGroup() {

        },
        importCert() {

        },
        sureExportCert(row) {
            let list = {
                fingerPrint: row.fingerPrint
            }
            exportCert(list).then(res => {
                const { data } = res;
                if (data.code === 0) {
                    const content = data.data.content;
                    const blob = new Blob([content], { type: 'application/x-x509-ca-cert' });
                    const fileName = data.data.certName;
                    if ('download' in document.createElement('a')) { // 非IE下载
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = URL.createObjectURL(blob)
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href) // 释放URL 对象
                        document.body.removeChild(elink)
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName)
                    }
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
            this.$confirm('确认删除？')
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
                        message: '删除成功',
                    })
                    this.getCertList()
                } else {
                    this.$message({
                        type: 'error',
                        message: data.data,
                        duration: 2500
                    })
                }
            })
        },
        onBeforeUpload(file) {
            const isLt1M = Math.ceil(file.size / 1024) < 100;
            if (!isLt1M) {
                this.$message.error('上传文件大小不能超过 100kb!');
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
                        message: '导入成功',
                    })
                    this.getCertList()
                } else {
                    this.$message({
                        type: 'error',
                        message: data.data,
                        duration: 2500
                    })
                }
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
            this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        copyFingerPrint(val) {
            if (!val) {
                this.$message({
                    type: "fail",
                    showClose: true,
                    message: "key为空，不复制。",
                    duration: 2000
                });
            } else {
                this.$copyText(val).then(e => {
                    this.$message({
                        type: "success",
                        showClose: true,
                        message: "复制成功",
                        duration: 2000
                    });
                });
            }
        },
    }
}
</script>

<style scoped>
.search-table-content {
    padding: 0 40px 0 41px;
}
.search-table-content >>> td,
.search-table-content >>> th {
    padding: 8px 0;
    font-size: 12px;
}
</style>
