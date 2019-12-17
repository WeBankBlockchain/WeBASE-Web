<template>
    <div>
        <v-content-head 
            :headTitle="'系统管理'" 
            :headSubTitle="'权限管理'" 
            @changGroup="changGroup" 
            :headTooltip="`管理权限说明：权限控制是基于外部账户(tx.origin)的访问机制，对包括合约部署，表的创建，表的写操作（插入、更新和删除）进行权限控制，表的读操作不受权限控制。`"
            :headHref="headHref">
            </v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 0 29px;">
            <el-form :model="permissionForm" :rules="rules" ref="permissionForm" class="demo-ruleForm">
                <!-- <el-form-item label="管理员账号" prop="adminRivateKeyAddress" class="item-form">
                    <el-select v-model="permissionForm.adminRivateKeyAddress" placeholder="请选择" class="select-32">
                        <el-option v-for="item in rivateKeyAddressList" :key="item.address" :label="item.userName" :value="item.address">
                            <span>{{item.userName}}</span>
                            <span class="font-12">{{item.address | splitString}}...</span>
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="权限类型" prop="authorType" class="item-form">
                    <el-select v-model="permissionForm.authorType" placeholder="请选择" class="select-32" @change="selectAuthorType">
                        <el-option v-for="item in authorList" :key="item.type" :label="item.name" :value="item.type">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="表名" prop="tableName" class="item-form" v-if="permissionForm.authorType==='userTable'">
                    <el-input v-model.trim="permissionForm.tableName" class="select-32" v-if="permissionForm.authorType==='userTable'"></el-input>
                </el-form-item>
                <!-- <el-form-item label="外部账号地址" prop="otherRivateKey" class="item-form">
                    <el-select v-model.trim="permissionForm.otherRivateKey" placeholder="请输入帐号" class="select-32" filterable >
                        <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                            <span>{{item.userName}}</span>
                            <span class="font-12">{{item.address | splitString}}...</span>
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item v-if="permissionForm.authorType==='userTable'">
                    <el-button size="small" type="primary" :disabled="disabled" class="add-btn" @click="searchTable">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" :disabled="disabled" class="add-btn" @click="addAuthor">添加</el-button>
                    <el-tooltip effect="dark" content="Tips: 添加第一个管理员权限的时候，管理员将启动权限，请确认账号是否正确。误操作可能导致服务不可用。" placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
            </el-form>
            <el-table :data="authorRivateKeyList" tooltip-effect="dark" v-loading="loading" class="search-table-content">
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
        </div>

        <el-dialog :title="titieText" :visible.sync="authDialogVisible" width="387px" v-if="authDialogVisible" center>
            <authorization-rivateKey @close="close" @authorizeSuccess="authorizeSuccess" :btnType="btnType" :deleteParam="deleteParam" :authorType="permissionForm.authorType"></authorization-rivateKey>
        </el-dialog>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import authorizationRivateKey from "./components/authorizationRivateKey";
import { getUserList, getPermission, postPermission, deletePermission } from "@/util/api";
export default {
    name: 'AuthorManagement',

    components: {
        "v-content-head": contentHead,
        authorizationRivateKey
    },

    props: {
    },

    data() {
        return {
            rules: {
                adminRivateKeyAddress: [
                    {
                        required: true,
                        message: "请选择管理员账号",
                        trigger: "blur"
                    }
                ],
                authorType: [
                    {
                        required: true,
                        message: "请选择权限类型",
                        trigger: "blur"
                    }
                ],
                otherRivateKey: [
                    {
                        required: true,
                        message: "请输入外部账号地址",
                        trigger: "blur"
                    }
                ],
                tableName: [
                    {
                        required: true,
                        message: "请输入表名",
                        trigger: "blur"
                    }
                ]
            },
            authorList: [
                {
                    type: 'permission',
                    name: '链管理权限'
                },
                {
                    type: 'userTable',
                    name: '表权限'
                },
                {
                    type: 'cns',
                    name: 'CNS权限'
                },
                {
                    type: 'node',
                    name: '节点权限'
                },
                {
                    type: 'sysConfig',
                    name: '系统参数权限'
                },
                {
                    type: 'deployAndCreate',
                    name: '部署和建表权限'
                },
            ],
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
            permissionForm: {
                adminRivateKeyAddress: "",
                authorType: "permission",
                tableName: "",
                otherRivateKey: ""
            },
            adminRivateKeyList: [],
            preRivateKeyList: [],
            authDialogVisible: false,
            disabled: false,
            loading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            titieText: '',
            btnType: '',
            deleteParam: {},
            headHref: {
                href: "https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/design/security_control/permission_control.html",
                content: "具体可见文档：[权限控制]"
            }
        }
    },
    computed: {
        authorRivateKeyList() {
            let arr = [];
            this.preRivateKeyList.forEach(item => {
                this.adminRivateKeyList.forEach(it => {
                    if(item.address === it.address){
                        item.userName = it.userName
                    }
                })
            });
            arr = this.preRivateKeyList;
            return arr
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
        this.queryGetPermission()
    },

    methods: {
        changGroup() {
            this.adminRivateKeyList = []
            this.permissionForm = {
                adminRivateKeyAddress: "",
                authorType: "permission",
                tableName: "",
                otherRivateKey: ""
            }
            this.getUserData()
            this.queryGetPermission()
        },
        changeType() { },
        addDialog() {
            this.authDialogVisible = true
        },
        close() {
            this.authDialogVisible = false

        },
        authorizeSuccess() {
            this.authDialogVisible = false;
            this.queryGetPermission()
        },
        searchTable() {
            this.queryGetPermission()
        },
        translationZh(val) {
            var str = '';
            switch (val) {
                case 'permission':
                    str = '链管理'
                    break;
                case 'userTable':
                    str = '表'
                    break;
                case 'cns':
                    str = 'CNS'
                    break;
                case 'node':
                    str = '节点'
                    break;
                case 'sysConfig':
                    str = '系统参数'
                    break;
                case 'deployAndCreate':
                    str = '部署和建表'
                    break;
            }
            return str;
        },
        addAuthor() {
            this.$confirm("添加第一个管理员权限的时候，管理员将启动权限，请确认账号是否正确。误操作可能导致服务不可用。", 'Tips', {
                center: true,
                type: 'warning',
            })
                .then(_ => {
                    this.btnType = 'addBtn';
                    this.titieText = `添加${this.translationZh(this.permissionForm.authorType)}权限`;
                    this.authDialogVisible = true;
                })
                .catch(_ => {

                });
        },
        sureAddAuthor() {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                permissionType: this.permissionForm.authorType,
                tableName: this.permissionForm.tableName && this.permissionForm.authorType === 'userTable' ? this.permissionForm.tableName : '',
                fromAddress: this.permissionForm.adminRivateKeyAddress,
                address: this.permissionForm.otherRivateKey
            }
            postPermission(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '授权成功'
                        })
                        this.queryGetPermission()
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
                    this.$message.closeAll()
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
        deleteUser(param) {
            this.btnType = 'deleteBtn';
            this.titieText = '删除权限';
            this.authDialogVisible = true;
            this.deleteParam = Object.assign({}, param, { authorType: this.permissionForm.authorType, tableName: this.permissionForm.tableName });
        },
        sureDeleteUser(param) {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                permissionType: this.permissionForm.authorType,
                tableName: this.permissionForm.tableName && this.permissionForm.authorType === 'userTable' ? this.permissionForm.tableName : '',
                fromAddress: this.permissionForm.adminRivateKeyAddress,
                address: this.permissionForm.otherRivateKey
            }
            deletePermission(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        this.queryGetPermission()
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "系统错误！"
                    });
                });


        },
        selectAuthorType(val) {
            this.permissionForm.authorType = val;
            this.$refs['permissionForm'].clearValidate()
            this.queryGetPermission()
        },
        queryGetPermission() {
            this.loading = true;
            let reqData = {
                permissionType: this.permissionForm.authorType,
                pageNumber: this.currentPage,
                pageSize: this.pageSize,
                groupId: localStorage.getItem("groupId")
            }
            if (this.permissionForm.authorType === 'userTable') {
                reqData.tableName = this.permissionForm.tableName
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
        getUserData() {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: 1,
                pageSize: 1000
            };
            getUserList(reqData, {})
                .then(res => {
                    if (res.data.code === 0) {
                        this.adminRivateKeyList = [];
                        res.data.data.forEach(value => {
                            if (value.hasPk === 1) {
                                this.adminRivateKeyList.push(value);
                            }
                        });
                        if (this.adminRivateKeyList.length) this.permissionForm.otherRivateKey = this.adminRivateKeyList[0]['address'];
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
.demo-ruleForm {
    display: flex;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: -moz-flex;
}
.item-form {
    display: flex;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: -moz-flex;
    margin-left: 10px;
}
.select-module {
    margin-right: 4px;
    margin-bottom: 14px;
}
.select-item-text {
    padding-right: 4px;
    color: #2e384d;
}
.add-btn {
    margin-left: 6px;
}
.table-name {
    margin-left: 6px;
}
.instructions {
    margin-bottom: 30px;
    padding: 10px 10px;
    color: #2e384d;
    border-radius: 10px;
    display: inline-block;
}
.search-table-content >>> th {
    background: #fafafa;
}
</style>
