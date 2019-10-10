<template>
    <div>
        <v-content-head :headTitle="'系统管理'" :headSubTitle="'权限管理'" @changGroup="changGroup" :headTooltip="`管理权限说明：权限控制是基于外部账户(tx.origin)的访问机制，对包括合约部署，表的创建，表的写操作（插入、更新和删除）进行权限控制，表的读操作不受权限控制。`" :headHref="headHref">
        </v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 0 29px;">
            <el-tabs @tab-click="handleClick" v-model="activeName">
                <el-tab-pane label="链管理权限">
                    <el-button type="text" :disabled="disabled" @click="addAuthor">添加链管理权限</el-button>
                    <el-table :data="authorRivateKeyList" tooltip-effect="dark" v-loading="loading">
                        <el-table-column v-for="head in preRivateKeyHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center">
                            <template slot-scope="scope">
                                <template v-if="head.enName!='operate'">
                                    <span v-if="head.enName==='address'"><i class="wbs-icon-copy font-12 copy-key" @click="copyAddress(scope.row['address'])" title="复制地址"></i>{{scope.row[head.enName]}}</span>
                                    <span v-else-if="head.enName==='userName'">
                                        <span v-if="scope.row[head.enName]">
                                            {{scope.row[head.enName]}}
                                        </span>
                                        <span v-else>---</span>
                                    </span>
                                    <span v-else>{{scope.row[head.enName]}}</span>
                                </template>
                                <template v-else>
                                    <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="deleteUser(scope.row)">删除</el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="普通管理权限">
                    链管理员
                    <el-select v-model="chainAdmin">
                        <el-option v-for="item in authorRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                        </el-option>
                    </el-select>
                    <el-table :data="updatePermissionList" tooltip-effect="dark" v-loading="loading" class="search-table-content">
                        <el-table-column v-for="head in permissionHead" :label="head.name" :key="head.enName" :width="head.width" show-overflow-tooltip align="center">
                            <template slot-scope="scope">
                                <template v-if="head.enName!='operate'">
                                    <span v-if="head.enName ==='address'">{{formatUserName(scope.row[head.enName])}}</span>
                                    <span v-else-if="head.enName ==='otherAddress'">
                                        <i class="wbs-icon-copy font-12" @click="copyAddress(scope.row[head.enName])" title="复制"></i>
                                        {{scope.row[head.enName]}}
                                    </span>
                                    <el-checkbox v-else :disabled="disabled" v-model="scope.row[head.enName]"></el-checkbox>
                                </template>
                                <template v-else>
                                    <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="updatePermission(scope.row)">提交</el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="page" @size-change="handleSizeChangeSorted" @current-change="handleCurrentChangeSorted" :current-page="sortedCurrentPage" :page-sizes="[10, 20, 30, 50]" :page-size="sortedPageSize" layout="total, sizes, prev, pager, next, jumper" :total="sortedTotal">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog title="添加链管理权限" :visible.sync="authDialogVisible" width="387px" v-if="authDialogVisible" center>
            <authorization-rivateKey @close="close" @authorizeSuccess="authorizeSuccess" :btnType="btnType" :deleteParam="deleteParam"></authorization-rivateKey>
        </el-dialog>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import authorizationRivateKey from "./components/authorizationRivateKey";
import { getUserList, getPermission, postPermission, deletePermission, getPermissionSorted, postPermissionSorted } from "@/util/api";
import { unique } from "@/util/util";
export default {
    name: 'Permission',

    components: {
        "v-content-head": contentHead,
        authorizationRivateKey
    },

    props: {
    },

    data() {
        return {
            headHref: {
                href: "https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/design/security_control/permission_control.html",
                content: "具体可见文档：[权限控制]"
            },
            loading: false,
            disabled: false,
            authDialogVisible: false,
            btnType: '',
            currentPage: 1,
            pageSize: 10,
            total: 0,
            preRivateKeyList: [],
            adminRivateKeyList: [],
            authorType: 'permission',
            preRivateKeyHead: [
                {
                    enName: "table_name",
                    name: "表名称"
                },
                {
                    enName: "address",
                    name: "账号地址"
                },
                {
                    enName: "userName",
                    name: "账号名称"
                },
                {
                    enName: "operate",
                    name: "操作"
                }
            ],
            deleteParam: {},
            activeName: 0,
            chainAdmin: '',
            sortedCurrentPage: 1,
            sortedPageSize: 10,
            sortedTotal: 0,
            permissionList: [],
            permissionHead: [
                {
                    enName: 'address',
                    name: '用户',
                    width: ''
                },
                {
                    enName: 'otherAddress',
                    name: '地址',
                    width: ''
                },
                {
                    enName: 'deployAndCreate',
                    name: '系统与建表权限',
                    width: ''
                },
                {
                    enName: 'cns',
                    name: 'CNS权限',
                    width: ''
                },
                {
                    enName: 'sysConfig',
                    name: '系统配置权限',
                    width: ''
                },
                {
                    enName: 'node',
                    name: '节点权限',
                    width: ''
                },
                {
                    enName: "operate",
                    name: "操作",
                    width: '80'
                }
            ]
        }
    },

    computed: {
        authorRivateKeyList() {
            let arr = [];
            this.preRivateKeyList.forEach(item => {
                this.adminRivateKeyList.forEach(it => {
                    if (item.address === it.address) {
                        item.userName = it.userName
                    }
                })
            });

            arr = this.preRivateKeyList;
            if (arr.length > 0) {
                this.chainAdmin = arr[0]['address']
            } else {
                this.chainAdmin = ''
            }
            return arr
        },
        updatePermissionList() {
            var list = this.permissionList;
            list.forEach(item => {
                for (let key in item) {
                    switch (item[key]) {
                        case 0:
                            item[key] = false;
                            break;
                        case 1:
                            item[key] = true;
                            break;
                    }
                }
            })
            return list
        }
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
        this.getUserData()
        this.queryGetPermission();//链管理列表
    },

    methods: {
        changGroup() {
            this.adminRivateKeyList = []
            this.getUserData()
            this.queryGetPermission()
            this.getPermissionInfo()
        },
        queryGetPermission() {
            this.loading = true;
            let reqData = {
                permissionType: this.authorType,
                pageNumber: this.currentPage,
                pageSize: this.pageSize,
                groupId: localStorage.getItem("groupId")
            }
            if (this.authorType === 'userTable') {
                reqData.tableName = this.tableName
            } else {
                reqData.tableName = ''
            }
            getPermission(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.preRivateKeyList = res.data.data;
                        this.total = res.data.totalCount
                    } else {
                        this.preRivateKeyList = []
                        if (201102 === res.data.code) {
                            this.$message({
                                type: "info",
                                message: this.errcode.errCode[res.data.code].cn
                            });
                        } else {
                            this.$message({
                                type: "error",
                                message: this.errcode.errCode[res.data.code].cn
                            });
                        }

                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.preRivateKeyList = []
                    this.$message({
                        type: "error",
                        message: "系统错误！"
                    });
                });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.queryGetPermission();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.queryGetPermission();
        },
        handleSizeChangeSorted(val) {
            this.sortedPageSize = val;
            this.sortedCurrentPage = 1;
            this.getPermissionInfo();
        },
        handleCurrentChangeSorted(val) {
            this.sortedCurrentPage = val;
            this.getPermissionInfo();
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
                        this.adminRivateKeyList = res.data.data;
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode[res.data.code].cn
                        });
                        this.$message.closeAll();
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "系统错误！"
                    });
                    this.$message.closeAll();
                });
        },
        close() {
            this.authDialogVisible = false

        },
        authorizeSuccess() {
            this.authDialogVisible = false;
            this.queryGetPermission()
        },
        deleteUser(param) {
            this.btnType = 'deleteBtn';
            this.authDialogVisible = true;
            this.deleteParam = Object.assign({}, param, { tableName: '' });
        },
        addAuthor() {
            this.$confirm("添加第一个管理员权限的时候，管理员将启动权限，请确认账号是否正确。误操作可能导致服务不可用。", 'Tips', {
                center: true,
                type: 'warning',
            })
                .then(_ => {
                    this.btnType = 'addBtn';
                    this.authDialogVisible = true;
                })
                .catch(_ => {

                });
        },
        handleClick(tab, event) {
            if (tab.label === "普通管理权限") {
                this.getPermissionInfo();
            }
        },
        getPermissionInfo() {
            this.loading = true;
            let list = {
                pageNumber: this.sortedCurrentPage,
                pageSize: this.sortedPageSize,
                groupId: localStorage.getItem("groupId")
            }
            getPermissionSorted(list).then(res => {
                this.loading = false;
                const { data } = res;
                if (data.code === 0) {
                    var arr = [];
                    data.data.forEach(item => {
                        arr.push(Object.assign({}, { address: item.key },{ otherAddress: item.key }, item.data))
                    })
                    this.permissionList = arr;
                    this.sortedTotal = data.totalCount;
                }
            })
        },
        updatePermission(row) {
            this.$confirm("添加第一个管理员权限的时候，管理员将启动权限，请确认账号是否正确。误操作可能导致服务不可用。", 'Tips', {
                center: true,
                type: 'warning',
            })
                .then(_ => {
                    this.loading = true;
                    this.postUpdatePermission(row)
                })
                .catch(_ => {

                });

        },
        postUpdatePermission(row) {
            let param = {
                groupId: localStorage.getItem("groupId"),
                fromAddress: this.chainAdmin ? this.chainAdmin : row.address,
                address: row.address,
                permissionState: {
                    deployAndCreate: this.formatPermissionStatus(row.deployAndCreate),
                    node: this.formatPermissionStatus(row.node),
                    sysConfig: this.formatPermissionStatus(row.sysConfig),
                    cns: this.formatPermissionStatus(row.cns)
                }
            }
            postPermissionSorted(param).then(res => {
                this.loading = false;
                const { data } = res;
                if (data.code === 0) {
                    this.getPermissionInfo()
                } else {
                    this.getPermissionInfo()
                    this.$message({
                        type: 'error',
                        message: this.errcode.errCode[data.code].cn,
                    })
                }
            })
        },
        formatPermissionStatus(key) {
            var val = '';
            switch (key) {
                case false:
                    return val = 0
                    break;

                case true:
                    return val = 1
                    break;
                default:
                    return key
                    break;
            }
        },
        formatUserName(address) {
            var userName = '';
            this.adminRivateKeyList.forEach(item => {
                if (item.address === address) {
                    userName = item.userName
                }
            })
            return userName
        },
        copyAddress(val) {
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
/* .search-table-content >>> .el-table__row > td:nth-last-child(1) > div {
    visibility: hidden;
}
.search-table-content >>> .el-table__row:hover > td:nth-last-child(1) > div {
    visibility: visible;
} */
</style>
