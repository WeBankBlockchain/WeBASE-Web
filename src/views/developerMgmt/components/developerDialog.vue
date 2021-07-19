<template>
    <div>
        <el-form :model="addDevForm" :rules="rules" ref="addDevForm" label-width="142px" class="demo-ruleForm">
            <el-form-item :label="$t('devOpsMgmt.fromUser')" prop="fromAddress">
                <el-select v-model="addDevForm.fromAddress" :placeholder="$t('text.select')">
                    <el-option v-for="item in permissionAdminList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
                <span v-if="isPermissionAdminShow" class="contract-code-done"   @click="$store.dispatch('switch_creat_user_dialog')" style="float:right;margin-right:40px">
                     <span target="_blank" style="cursor:pointer;font-size:12px;text-decoration:underline;">{{this.$t("privateKey.addUser")}}</span>
               </span>
            </el-form-item> 
            <el-form-item :label="$t('devOpsMgmt.devAddress')" prop="address" v-if="handleType =='add'">
                <el-select v-model="addDevForm.address" :placeholder="$t('text.select')">
                    <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option> 
                </el-select> 
            </el-form-item>
            <el-form-item label="运维" v-if="handleType =='delete'">
                <el-input v-model="devOpsAddress" disabled></el-input>
            </el-form-item>
        </el-form>
        <p style="padding-left: 50px" v-if="handleType =='add'">{{$t('govCommittee.dialogTips')}}</p>
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="close">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="submit('addDevForm')" :loading="loading">{{this.$t('text.sure')}}</el-button>
        </div>
         <el-dialog :visible.sync="$store.state.creatUserVisible" :title="$t('privateKey.createUser')" width="640px" :append-to-body="true" class="dialog-wrapper" v-if='$store.state.creatUserVisible' center>
            <v-creatUser @creatUserClose="creatUserClose" :disablePub='true'  ref="creatUser"></v-creatUser>
        </el-dialog>	
    </div>
</template>

<script>
import { addDevOps, getUserList, deleteDevOps, committeeList } from "@/util/api";
import creatUser from "@/views/privateKeyManagement/components/creatUser";
export default {
    name: 'developerDialog',

    components: {
          "v-creatUser": creatUser
    },

    props: ['handleType', 'devOpsAddress'],

    data() {
        return {
            loading: false,
            adminRivateKeyList: [],
            permissionAdminList: [],
            fullList: [],

            addDevForm: {
                fromAddress: '',
                address: ''
            },
            isPermissionAdminShow: false

        }
    },

    computed: {
        rules() {
            let data = {
                fromAddress: [
                    {
                        required: true,
                        message: this.$t("rule.fromUserRule"),
                        trigger: "blur"
                    }
                ],
                address: [
                    {
                        required: true,
                        message: this.$t("rule.userRule"),
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
        this.getUserData();
        this.getAdminAddress()
    },

    methods: {
        close() {
            this.$emit("close");
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    switch (this.handleType) {
                        case 'add':
                            this.sureAddDevOps()
                            break;

                        case 'delete':
                            this.sureDeleteDevOps()
                            break;
                    }

                } else {
                    return false;
                }
            });

        },
        sureAddDevOps() {
            this.loading = true
            let reqData = {
                groupId: localStorage.getItem('groupId'),
                fromAddress: this.addDevForm.fromAddress,
                address: this.addDevForm.address,
            }
            addDevOps(reqData)
                .then(res => {
                    this.loading = false
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: this.$t("govCommittee.success")
                        })
                        this.$emit('addSuccess')
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        sureDeleteDevOps() {
            this.loading = true
            let reqData = {
                groupId: localStorage.getItem('groupId'),
                fromAddress: this.addDevForm.fromAddress,
                address: this.devOpsAddress,
            }
            deleteDevOps(reqData)
                .then(res => {
                    this.loading = false
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: this.$t("govCommittee.success")
                        })
                        this.$emit('addSuccess')
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
                        message: err.data || this.$t('text.systemError'),
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
            this.$axios.all([committeeList(reqAdminData), getUserList(reqUserData, {})])
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
                        // if (this.permissionAdminList.length) {
                        //     this.permissionForm.adminRivateKey = this.permissionAdminList[0].address;
                        // } else {
                        //     this.permissionForm.adminRivateKeyAddress = "";
                        // }
                    } else {
                        this.permissionAdminList = userList;
                        // this.permissionForm.adminRivateKey = this.permissionAdminList[0].address;
                    }
                     if(this.permissionAdminList.length === 0){
                            this.isPermissionAdminShow = true;
                    }else{
                            this.isPermissionAdminShow = false;
                    }
                }));
        },
          creatUserClose() {
            this.getAdminAddress();
        },
    }
}
</script>

<style scoped>
</style>
