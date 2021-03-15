<template>
    <div>
        <v-content-head :headTitle="'链上用户'" :icon="true" @changGroup="changGroup"></v-content-head>
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
                <el-table :data="accountList" class="block-table-content" v-loading="loading" ref="refTable">
                   <el-table-column prop="address" :label="'公钥地址'"  align="center">
                    </el-table-column>
                    <el-table-column prop="createTime" :label="'创建时间'"  align="center">
                    </el-table-column>
                     <el-table-column fixed="right" :label="$t('nodes.operation')" width="300">
                        <template slot-scope="scope">
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="importData(scope.row)" type="text" size="small">导入</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout=" sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog :visible.sync="$store.state.creatUserVisible" :title="$t('privateKey.createUser')" width="640px" :append-to-body="true" class="dialog-wrapper" v-if='$store.state.creatUserVisible' center>
            <v-creatUser @creatUserClose="creatUserClose" @bindUserClose="bindUserClose" ref="creatUser" :address='address'></v-creatUser>
        </el-dialog>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { externalAccountList } from "@/util/api";
import { numberFormat } from "@/util/util";
import creatUser from "../privateKeyManagement/components/creatUser.vue";

export default {
    name: "externalAccount",
    components: {
        "v-content-head": contentHead,
        "v-creatUser": creatUser,
    },
    data () {
        return {
            accountList: [],
            numberFormat: numberFormat,
            loading: false,
            pageNumber: 1,
            pageSize: 10,
            total: 0,
            address: null,
            disabled: false
        }
    },
    mounted() {
      this.$nextTick(() => {
        this.getExternalAccountList()
      })
    },
    methods: {
        getExternalAccountList() {
            const reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
            }
            externalAccountList(reqData).then(res => {
                if (res.data.code === 0) {
                    this.accountList = res.data.data;
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
            this.getExternalAccountList();
        },
        handleCurrentChange: function (val) {
            this.pageNumber = val;
            this.getExternalAccountList();
        },
        changGroup(val) {
            this.getExternalAccountList()
        },
        importData(val) {
            this.address = val.address;
            this.$store.dispatch('switch_creat_user_dialog')
        },
        creatUserClose () {
            this.getExternalAccountList();
        },
        bindUserClose () {
            this.getExternalAccountList();
        }
    }
}
</script>

<style>

</style>