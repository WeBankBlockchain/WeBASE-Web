<template>
    <div>
        <div class="text-center" style="margin-bottom:5px">tips: 公钥用户无法授权其它用户</div>
        <el-form :model="permissionForm" :rules="rules" ref="permissionForm" label-width="110px" class="demo-ruleForm">
            <el-form-item label="管理员账号" prop="adminRivateKey" style="width: 320px;">
                <el-select v-model="permissionForm.adminRivateKey" placeholder="请选择">
                    <el-option v-for="item in permissionAdminList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
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
import { getUserList, postPermission, getPermissionFull, deletePermission } from "@/util/api";
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
        }
    },

    data() {
        return {
            loading: false,
            adminRivateKeyList: [],
            permissionAdminList: [],
            permissionForm: {
                adminRivateKey: '',
                otherRivateKey: ''
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
                ]
            },
            authorType: 'permission',
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
                permissionType: this.authorType,
                tableName: '',
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
                permissionType: this.authorType,
                tableName: '',
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
                        if(res.data.data.length == 0){
                            this.$message({
                                type: "info",
                                message: "请添加私钥用户！"
                            }); 
                        }
                        res.data.data.forEach(value => {
                            // if (value.hasPk === 1) {
                                this.adminRivateKeyList.push(value);
                            // }
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
                        // if (value.hasPk === 1) {
                            userRivateKeyList.push(value)
                        // }
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
