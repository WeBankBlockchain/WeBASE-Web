<template>
<div class="module-wrapper">
    <div class="search-table">
        <el-table :data="userList" tooltip-effect="dark" v-loading="loading">
            <el-table-column prop="userName" :label='$t("privateKey.userName")' show-overflow-tooltip align="center">
            </el-table-column>
            <el-table-column prop="userId" :label='$t("privateKey.userId")' show-overflow-tooltip width="120" align="center">
            </el-table-column>
            <el-table-column prop="description" :label="$t('privateKey.description')" show-overflow-tooltip width="135" align="center">
                <!-- <template slot-scope="scope">
                    <span class="link" @click='openPath(scope.row)'>{{scope.row.contractPath}}</span>
                </template> -->
            </el-table-column>
            <el-table-column prop="address" :label="$t('privateKey.userAddress')" show-overflow-tooltip align="center">
                 <template slot-scope="scope">
                    <i class="wbs-icon-copy font-12 copy-public-key" v-if='scope.row.address' @click="copyPubilcKey(scope.row.signUserId)" :title="$t('privateKey.userAddress')"></i>
                    <span >{{scope.row.address}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="signUserId" :label="$t('privateKey.signUserId')" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                    <i class="wbs-icon-copy font-12 copy-public-key" v-if='scope.row.signUserId' @click="copyPubilcKey(scope.row.signUserId)" :title="$t('privateKey.signUserId')"></i>
                    <span>{{scope.row.signUserId}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" :label="$t('home.createTime')" show-overflow-tooltip width="150" align="center"></el-table-column>
            <el-table-column fixed="right" :label="$t('nodes.operation')" width="360">
                <template slot-scope="scope">
                  <el-button v-if="!(disabled || scope.row.userId > 0)"   @click="importData(scope.row)" type="text">{{$t("system.import")}}</el-button>
                  <el-button v-if="disabled || scope.row.userId > 0" type="text" size="small" :class="{'grayColor': disabled}" @click="modifyDescription(scope.row)">{{$t('text.update')}}</el-button>
                    <!-- <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="send(scope.row)" type="text" size="small">{{$t('contracts.sendTransaction')}}</el-button>
                    <el-button :disabled="!scope.row.contractAddress || !scope.row.haveEvent" :class="{'grayColor': !scope.row.contractAddress}" @click="checkEvent(scope.row)" type="text" size="small">{{$t('title.checkEvent')}}</el-button>
                    <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="handleStatusBtn(scope.row)" type="text" size="small">{{freezeThawBtn(scope.row)}}</el-button>
                    <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="handleMgmtCns(scope.row)" type="text" size="small">{{$t('text.cns')}}</el-button>
                    <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="updateAbi(scope.row)" type="text" size="small">{{$t('contracts.updateAbi')}}</el-button>
                    <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="deleteAbi(scope.row)" type="text" size="small">{{$t('contracts.deleteAbi')}}</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="total > 10" class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
    <el-dialog :visible.sync="$store.state.creatUserVisible" :title="$t('privateKey.createUser')" width="640px" :append-to-body="true" class="dialog-wrapper" v-if='$store.state.creatUserVisible' center>
        <creat-user @creatUserClose="creatUserClose" @bindUserClose="bindUserClose" ref="creatUser" :address='address'></creat-user>
    </el-dialog>
    <el-dialog :visible.sync="$store.state.importPrivateKey" :title="$t('privateKey.importPrivateKey')" width="640px" :append-to-body="true" class="dialog-wrapper" v-if='$store.state.importPrivateKey' center>
        <v-importKey @importPrivateKeySuccess="importPrivateKeySuccess" ref="importKey"></v-importKey>
    </el-dialog>
</div>
</template>

<script>
import { getAllUserList, getUserDescription } from "@/util/api"
import creatUser from "./components/creatUser.vue";
import importKey from "./components/importKey.vue";
export default {
    name: "totalContract",
    components: {
      creatUser,
      importKey,
    },
    data () {
        return {
            disabled: false,
            loading: false,
            userList: [],
            total: 0,
            pageNumber: 1,
            pageSize: 10,
            address: null
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
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
            getAllUserList(reqData, reqQuery)
                .then(res => {
                    if (res.data.code === 0) {
                        this.userList = res.data.data;
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
          console.log(val)
            this.address = val.address;
            this.$store.dispatch('switch_creat_user_dialog')
        },
         creatUserClose () {
            this.getList();
        },
        bindUserClose () {
            this.getList();
        },
        modifyDescription(params) {
            this.$prompt(this.$t("privateKey.inputDescription"), '', {
                confirmButtonText: this.$t("text.sure"),
                cancelButtonText: this.$t("text.cancel"),
            })
                .then(({ value }) => {
                    this.userDescriptionInfo(value, params);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: this.$t("text.cancel"),
                    });
                });
        },
        userDescriptionInfo(value, params) {
            let reqData = {
                userId: params.userId,
                description: value
            };
            getUserDescription(reqData)
                .then(res => {
                    if (res.data.code == 0) {
                        this.getList();
                        this.$message({
                            type: "success",
                            message: this.$t("privateKey.updateUserSuccess")
                        });
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
        importPrivateKeySuccess() {
            this.getList();
        },
    }
}
</script>

<style>

</style>