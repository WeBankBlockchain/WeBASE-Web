<template>
    <div>
        <div class="text-center" style="margin-bottom:20px">{{this.$t('system.dialogTips')}}</div>
        <el-form :model="permissionForm" :rules="rules" ref="permissionForm" label-width="110px" class="demo-ruleForm">
            <el-form-item :label="$t('nodes.admin')" prop="adminRivateKey">
                <el-select v-model="permissionForm.adminRivateKey" :placeholder="$t('text.select')">
                    <el-option v-for="item in permissionAdminList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('system.outUserAddress')" prop="otherRivateKey"  v-if="btnType==='addBtn'">
                <el-select v-model.trim="permissionForm.otherRivateKey" :placeholder="$t('system.inputUser')" filterable>
                    <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('system.outUserAddress')"  v-if="btnType==='deleteBtn'">
                <span :title="deleteParam.address" class="delete-address">{{deleteParam.address}}</span>
            </el-form-item>
        </el-form>
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="close">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" :loading="loading" @click="submit('permissionForm')">{{this.$t('text.sure')}}</el-button>
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
            authorType: 'permission',
        }
    },

    computed: {
        rules() {
            let data = {
                adminRivateKey: [
                    {
                        required: true,
                        message: this.$t("rule.adminRule"),
                        trigger: "blur"
                    }
                ],
                otherRivateKey: [
                    {
                        required: true,
                        message: this.$t("rule.outUserAddress"),
                        trigger: "blur"
                    }
                ]
            }
            return data
        }
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
                            message: this.$t("system.authorizedSuccess")
                        })
                        this.$emit('authorizeSuccess')
                    } else {
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
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
                            message: this.$t("system.deleteSuccess") 
                        })
                        this.$emit('authorizeSuccess')
                    } else {
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
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
                                message: this.$t("system.deleteSuccess")
                            }); 
                        }
                        res.data.data.forEach(value => {
                            // if (value.hasPk === 1) {
                                this.adminRivateKeyList.push(value);
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
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
