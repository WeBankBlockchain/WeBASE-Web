<template>
    <div>
        <!-- <v-content-head :headTitle="$t('text.chainTitle')" :headSubTitle="$t('text.hostMgrTitle')" @changeGroup="changeGroup"></v-content-head> -->
        <nav-menu :headTitle="$t('text.chainTitle')" :headSubTitle="$t('text.hostMgrTitle')"></nav-menu>
        <div class="module-wrapper">
            <div class="search-part">
                <!-- <div class="search-part-left" v-if='!disabled'>
                    <span>sshkey: </span>
                    <el-input style="width: 250px" :placeholder="'请输入sshkey'" v-model="searchKey.value" class="input-with-select" @clear="clearText">
                        <el-button slot="append" @click="search">添加</el-button>
                    </el-input>
                </div> -->
                <!-- <div class="link guide" @click='openGuide'>{{$t("text.noviceGuide")}}</div> -->
                <div style="padding: 20px 0" v-if='!disabled'>
                    <el-button type="primary" class="search-part-left-btn" @click="add">{{$t("text.addHost")}}</el-button>
                </div>
            </div>
            <div class="search-table" style="padding-bottom: 20px">
                <el-table :data="hostList" class="search-table-content" v-loading="loading">
                    <el-table-column :label="'IP'" prop="ip" show-overflow-tooltip></el-table-column>
                    <el-table-column :label="$t('text.installDirectory')" prop="rootDir" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column :label="'主机状态'" prop="status" show-overflow-tooltip></el-table-column> -->
                    <el-table-column  :label="$t('nodes.operation')" width="100">
                        <template slot-scope="scope">
                            <!-- <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="check(scope.row)" type="text" size="small">ping</el-button> -->
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="deleteData(scope.row.id)" type="text" size="small">{{$t('text.delete')}}</el-button>
                        </template>
                    </el-table-column>
                    <div slot="empty" class="table-no-date">
                        请添加主机
                    </div>
                </el-table>
            </div>
        </div>
        <add-host v-if="addHostShow" :show="addHostShow" @close='addHostClose'></add-host>
    </div>
</template>

<script>
// import contentHead from "@/components/contentHead";
import NavMenu from '../../components/navs/navMenu.vue';
import addHost from "./dialog/addHost"
import { getHosts, checkHost, getAnsible, pingHostData, deleteHost } from "@/util/api"
export default {
    data() {
        return {
            searchKey: {
                value: ""
            },
            hostList: [],
            loading: false,
            disabled: false,
            currentPage: 1,
            pageSize: 10,
            total: 2,
            addHostShow: false
        }
    },
    components: {
        // "v-content-head": contentHead,
        "add-host": addHost,
        'nav-menu': NavMenu
    },
    mounted() {
        this.checkAnsible()
        this.getHostList()
    },
    methods: {
        openGuide() {
            this.$router.push("/guide")
        },
        changeGroup() {

        },
        clearText() {
            this.searchKey.value = ""
        },
        search() {

        },
        add() {
            this.addHostShow = true
        },
        /**
         * 检测ansible
         */
        checkAnsible() {
            getAnsible().then(res => {
                if (res.data.code === 0) {
                    console.log(res.data)
                } else {
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    this.loading = false
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    });
                });
        },
        check(val) {
            this.$confirm(this.$t('text.checkHostInfo'), this.$t('text.tips'), {
                confirmButtonText: this.$t("text.sure"),
                cancelButtonText: this.$t("text.cancel"),
                type: 'warning'
            }).then(() => {
                try {
                    this.checkdata(val)
                } catch (error) {
                    console.log(error)
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t("text.Cancelled")
                });
            });
        },
        /**
         * 检测主机
         */
        checkdata(val) {
            let data = {
                sshIp: val.ip,
                rootDir: val.rootDir
            }
            this.loading = true
            pingHostData(data).then(res => {
                this.loading = false
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: '主机ping成功'
                    });
                    this.getHostList()
                } else {
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    this.loading = false
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    });
                });
        },
        handleSizeChange() {

        },
        handleCurrentChange() {

        },
        addHostClose() {
            this.addHostShow = false;
            this.getHostList()
        },
        getHostList() {
            this.loading = true
            getHosts().then(res => {
                this.loading = false
                if (res.data.code === 0 || res.data.code === 200) {
                    this.hostList = res.data.rows
                } else {
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    this.loading = false
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    });
                });
        },
        deleteData(val) {
            this.$confirm(this.$t('text.deleteHostInfo'), this.$t('text.tips'), {
                confirmButtonText: this.$t("text.sure"),
                cancelButtonText: this.$t("text.cancel"),
                type: 'warning'
            }).then(() => {
                try {
                    this.deletedHost(val)
                } catch (error) {
                    console.log(error)
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t("text.Cancelled")
                });
            });
        },
        deletedHost(val) {
            deleteHost(val).then(res => {
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t('text.deleteHostSuccess')
                    });
                    this.getHostList()
                } else {
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    this.loading = false
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    });
                });
        },
    }
}
</script>

<style scoped>
.guide {
    position: absolute;
    right: 40px;
    top: 90px;
}
.table-no-date {
    text-align: center;
}
</style>