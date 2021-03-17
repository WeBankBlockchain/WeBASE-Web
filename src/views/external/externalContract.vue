<template>
    <div>
        <v-content-head :headTitle="'链上合约列表'" :icon="true" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper">
            <div class="search-part">
                <div class="search-part-left-bg">
                    <span>{{this.$t("text.total")}}</span>
                    <span>{{numberFormat(total, 0, ".", ",")}}</span>
                    <span>{{this.$t("text.tiao")}}</span>
                </div>
                <!-- <div class="search-part-right">
                    <el-input :placeholder="$t('inputText.blockInput')" v-model="searchKey.value" class="input-with-select" @clear="clearText">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div> -->
            </div>
            <div class="search-table">
                <el-table :data="contractList" class="block-table-content" v-loading="loading"  ref="refTable">
                    <el-table-column prop="contractAddress" :label="'合约地址'" align="center">
                    </el-table-column>
                    <el-table-column prop="deployTxHash" :label="'哈希'" align="center">
                    </el-table-column>
                    <el-table-column prop="deployTime" :label="'部署时间'" align="center">
                    </el-table-column>
                    <el-table-column fixed="right" :label="$t('nodes.operation')" width="300">
                        <template slot-scope="scope">
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="importData(scope.row)" type="text" size="small">导入ABI</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout=" sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog :title="$t('nodes.addAbi')" :visible.sync="importVisibility" width="500px" v-if="importVisibility" center class="send-dialog">
            <import-abi @importSuccess="importSuccess" @closeImport="closeImport" :address='address'></import-abi>
        </el-dialog>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { externalContractList } from "@/util/api";
import { numberFormat } from "@/util/util";
import importAbi from "../abiList/components/importAbi"

export default {
    name: "externalContract",
    components: {
        "v-content-head": contentHead,
        importAbi
    },
    data () {
        return {
            contractList: [],
            numberFormat: numberFormat,
            loading: false,
            pageNumber: 1,
            pageSize: 10,
            total: 0,
            disabled: false,
            importVisibility: false,
            address: null
        }
    },
    mounted() {
      this.$nextTick(() => {
        this.getExternalContractList()
      })
    },
    methods: {
        getExternalContractList() {
            const reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
            }
            externalContractList(reqData).then(res => {
                if (res.data.code === 0) {
                    this.contractList = res.data.data;
                    this.total = res.data.totalCount;
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                }
            }).catch(error => {
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            })
        },
        handleSizeChange: function (val) {
            this.pageSize = val;
            this.pageNumber = 1;
            this.getExternalContractList();
        },
        handleCurrentChange: function (val) {
            this.pageNumber = val;
            this.getExternalContractList();
        },
        changGroup(val) {
            this.getExternalAccountList()
        },
        importData(val) {
            this.importVisibility = true;
            this.address = val.contractAddress
        },
        importSuccess () {
            this.importVisibility = false;
            this.getExternalContractList();
        },
        closeImport () {
            this.importVisibility = false;
            this.getExternalContractList();
        }
    }
}
</script>

<style>

</style>