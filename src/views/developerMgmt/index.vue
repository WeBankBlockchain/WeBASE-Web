<template>
    <div>
        <!-- <v-content-head :headTitle="$t('title.systemManager')" :headSubTitle="$t('title.developerMgmt')" @changGroup="changGroup"></v-content-head> -->
        <div>
            <div>
                <el-button type="primary" :disabled="disabled" @click="addDeveloper('add')">{{this.$t('devOpsMgmt.addDeveloper')}}</el-button>
            </div>
            <div>
                <el-table :data="devOpslist" tooltip-effect="dark" v-loading="loading">
                    <el-table-column v-for="head in devOpsHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <template v-if="head.enName!='operate'">
                                <span v-if="head.enName =='user'">{{userName(scope.row['address'])}}</span>
                                <span v-else>{{scope.row[head.enName]}}</span>
                            </template>
                            <template v-else>
                                <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="deleteDeveloper(scope.row,'delete')">{{$t('devOpsMgmt.deleteDeveloper')}}</el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout=" sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <el-dialog :visible.sync="devOpsVisible" :title="dialogTitle" width="510px" v-if='devOpsVisible' center>
                <developer-dialog @close="close" @addSuccess="addSuccess" :handleType="handleType" :devOpsAddress="devOpsAddress"></developer-dialog>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import developerDialog from "./components/developerDialog";
import { getUserList, operatorList } from "@/util/api";
export default {
    name: 'developerMgmt',

    components: {
        "v-content-head": contentHead,
        developerDialog
    },

    props: {
    },

    data() {
        return {
            disabled: false,
            loading: false,
            devOpsVisible: false,
            handleType: '',
            devOpsAddress: '',
            currentPage: 1,
            pageSize: 10,
            total: 0,
            rivateKeyList: [],
            devOpslist: [],
            devOpsHead: [
                {
                    enName: 'user',
                    name: this.$t("devOpsMgmt.user"),
                    width: ''
                },
                {
                    enName: 'address',
                    name: this.$t("devOpsMgmt.address"),
                    width: ''
                },
                {
                    enName: "operate",
                    name: this.$t("devOpsMgmt.operate"),
                    width: '80'
                }
            ],
            dialogTitle: ''
        }
    },

    computed: {
    },

    watch: {
    },

    created() {
    },

    mounted() {
        if (localStorage.getItem("root") === "admin" || localStorage.getItem("groupId")) {
            this.disabled = false
        } else {
            this.disabled = true
        }
        if (localStorage.getItem("groupId")) {
            this.queryOperatorList()
            this.getUserData()
        }
    },

    methods: {
        changGroup() {
            this.queryOperatorList()
            this.getUserData()
        },
        addDeveloper(handleType) {
            this.dialogTitle = this.$t('devOpsMgmt.addDeveloper')
            this.handleType = handleType;
            this.devOpsVisible = true
        },
        deleteDeveloper(val, handleType) {
            this.dialogTitle = this.$t('devOpsMgmt.deleteDev')
            this.devOpsVisible = true
            this.handleType = handleType
            this.devOpsAddress = val.address
        },
        close() {
            this.devOpsVisible = false
        },
        addSuccess() {
            this.devOpsVisible = false;
            this.queryOperatorList()
        },
        queryOperatorList() {
            let reqData = {
                groupId: localStorage.getItem('groupId'),
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            }
            operatorList(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        let data = res.data.data
                        this.devOpslist = data
                        this.total = res.data.totalCount
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
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.queryOperatorList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.queryOperatorList();
        },
        getUserData() {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: 1,
                pageSize: 1000
            };
            getUserList(reqData, {})
                .then(res => {
                    if (res.data.code === 0) {
                        this.rivateKeyList = [];
                        res.data.data.forEach(value => {
                            // if (value.hasPk === 1) {
                            this.rivateKeyList.push(value);
                            // }
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
        userName(val) {
            let name = ''
            this.rivateKeyList.forEach(item => {
                if (item.address === val) {
                    name = `${item.userName}`
                }
            })
            return name
        },
    }
}
</script>

<style scoped>
</style>
