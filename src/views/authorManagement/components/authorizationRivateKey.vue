<template>
    <div>
        <el-form :model="permissionForm" :rules="rules" ref="permissionForm" label-width="110px" class="demo-ruleForm">
            <el-form-item label="管理员账号" prop="adminRivateKey" style="width: 320px;">
                <el-select v-model="permissionForm.adminRivateKey" placeholder="请选择">
                    <el-option v-for="item in permissionAdminList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="权限类型" prop="authorType" class="item-form" style="width: 320px;">
                <el-select v-model="permissionForm.authorType" placeholder="请选择" :disabled="btnType==='deleteBtn'? true: false">
                    <el-option v-for="item in authorList" :key="item.type" :label="item.name" :value="item.type">
                    </el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="表名" prop="tableName" class="item-form" v-if="permissionForm.authorType==='userTable'" style="width: 320px;">
                <el-input v-model.trim="permissionForm.tableName" v-if="permissionForm.authorType==='userTable'"></el-input>
            </el-form-item>
            <el-form-item label="外部账号地址" prop="otherRivateKey" style="width: 320px;" v-if="btnType==='addBtn'">
                <el-select v-model.trim="permissionForm.otherRivateKey" placeholder="请输入帐号" filterable>
                    <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="外部账号地址" style="width: 320px;" v-if="btnType==='deleteBtn'">
                <span :title="deleteParam.address" class="delete-address">{{deleteParam.address}}</span>
            </el-form-item>
        </el-form>
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" :loading="loading" @click="submit('permissionForm')">确定</el-button>
        </div>
    </div>
</template>

<script>
import { getUserList, postPermission, getPermissionFull ,deletePermission} from "@/util/api";
import { constants } from 'crypto';
import { truncate, truncateSync } from 'fs';
import { debuglog } from 'util';
export default {
    name: 'AuthorizationRivateKey',

    components: {
    },

    props: {
        btnType: {
            type: String
        },
        deleteParam: {
            type: Object
        },
        authorType: {
            type: String
        }
    },

    data() {
        return {
            loading: false,
            adminRivateKeyList: [],
            permissionAdminList: [],
            permissionForm: {
                adminRivateKey: '',
                otherRivateKey: '',
                authorType: this.btnType==='deleteBtn' ? this.deleteParam.authorType : this.authorType,
                tableName: this.btnType==='deleteBtn' ? this.deleteParam.tableName : '',
            },
            rules: {
                adminRivateKey: [
                    {
                        required: true,
                        message: "请选择管理员账号",
                        trigger: "blur"
                    }
                ],
                otherRivateKey: [
                    {
                        required: true,
                        message: "请选择外部账号地址",
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
        }
    },

    computed: {

    },

    watch: {

    },

    created() {

    },

    mounted() {
        this.getUserData()
        this.getAdminAddress()
    },

    methods: {
        close() {
            this.$emit("close");
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    switch (this.btnType) {
                        case 'addBtn':
                            this.queryPostPermission()
                            break;
                    
                        case 'deleteBtn':
                            this.sureDeleteUser()
                            break;  
                    }
                    
                } else {
                    return false;
                }
            });

        },
        queryPostPermission() {
            this.loading = true;
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                permissionType: this.permissionForm.authorType,
                tableName: this.permissionForm.tableName && this.permissionForm.authorType === 'userTable' ? this.permissionForm.tableName : '',
                fromAddress: this.permissionForm.adminRivateKey,
                address: this.permissionForm.otherRivateKey
            }
            postPermission(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '授权成功'
                        })
                        this.$emit('authorizeSuccess')
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.$message({
                        type: "error",
                        message: "系统错误！"
                    });
                });
        },
        sureDeleteUser(param) {
            this.loading = true;
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                permissionType: this.permissionForm.authorType,
                tableName: this.permissionForm.tableName && this.permissionForm.authorType === 'userTable' ? this.permissionForm.tableName : '',
                fromAddress: this.permissionForm.adminRivateKey,
                address: this.deleteParam.address
            }
            deletePermission(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        this.$emit('authorizeSuccess')
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.$message({
                        type: "error",
                        message: "系统错误！"
                    });
                });


        },
        changeRivateKey(val) {
            this.adminRivateKey = val
        },
        getUserData: function () {
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
        getAdminAddress() {
            let reqAdminData = {
                groupId: localStorage.getItem("groupId"),
                permissionType: this.authorType
            };
            let reqUserData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: 1,
                pageSize: 1000
            };
            this.$axios.all([getPermissionFull(reqAdminData), getUserList(reqUserData, {})])
                .then(this.$axios.spread((acct, perms) => {
                    var fullList = acct.data.data, userList = perms.data.data, userRivateKeyList = [];
                    userList.map(value => {
                            if (value.hasPk === 1) {
                                userRivateKeyList.push(value)
                            }
                        });
                    this.permissionAdminList = []
                    if (fullList.length) {
                        userRivateKeyList.forEach(item => {
                            fullList.forEach(it => {
                                if (it.address === item.address) {
                                    this.permissionAdminList.push(item)
                                }
                            })
                        })
                        if (this.permissionAdminList.length) {
                            this.permissionForm.adminRivateKey = this.permissionAdminList[0].address;
                        } else {
                            this.permissionForm.adminRivateKeyAddress = "";
                        }
                    } else {
                        this.permissionAdminList = userList;
                        this.permissionForm.adminRivateKey = this.permissionAdminList[0].address;
                    }
                }));
        }
    }
}
</script>

<style scoped>
.sure-btn >>> .el-button {
    padding: 9px 16px;
}
.delete-address {
    display: inline-block;
    width: 210px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
