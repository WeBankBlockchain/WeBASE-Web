<template>
    <div>
        <el-form :model="freezeThawFrom" :rules="rules" ref="freezeThawFrom" label-width="165px" class="demo-ruleForm">
            <el-form-item :label="$t('govCommittee.committeeAndDeploy')" prop="fromAddress">
                <el-select v-model="freezeThawFrom.fromAddress" :placeholder="$t('text.select')">
                    <el-option v-for="(item,index) in chainCommitteeList" :key="index" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span>{{item.address}}</span>
                        <!-- <span class="font-12">{{item.address}}...</span> -->
                        <!-- <span class="font-12">{{item | splitString}}...</span> -->
                    </el-option>
                </el-select>
                <i class="el-icon-info" :title="$t('contracts.freezeDes')"></i>
            </el-form-item>
            <el-form-item :label="$t('contracts.contractAddress')">
                <el-input v-model="contractAddress" disabled class="contract-address"></el-input>
            </el-form-item>
        </el-form>
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="close">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="submit('freezeThawFrom')" :loading="loading">{{this.$t('text.sure')}}</el-button>
        </div>
    </div>
</template>

<script>
import { getContractStatus, listManagerList, getUserList } from "@/util/api"
export default {
    name: 'freezeThaw',

    components: {
    },

    props: ['contractInfo', 'handleFreezeThawType'],

    data() {
        return {
            loading: false,
            chainCommitteeList: [],
            adminRivateKeyList: [],
            freezeThawFrom: {
                fromAddress: '',
            },
            contractAddress: this.contractInfo.contractAddress,
            deployAddress: this.contractInfo.deployAddress,
            deployUserName: [this.contractInfo.deployUserName]
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
                ]
            }
            return data
        },
        committeeAndDeploy() {
            var listManagerList = [];
            let privateKeyList = this.adminRivateKeyList
            listManagerList = this.chainCommitteeList
            privateKeyList.forEach(item => {
                listManagerList.forEach(it => {
                    if (item.address == it.address) {
                        it.userName = item.userName
                    }
                })
            })

            return listManagerList
        }
    },

    watch: {
    },

    created() {
    },

    mounted() {
        this.queryCommitteeList()
        // this.getUserData()
    },

    methods: {
        addDeployUserName(item){
            return this.deployUserName+' '+item.address
        },
        close() {
            this.$emit("freezeThawClose");
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.queryContractStatus()
                } else {
                    return false;
                }
            });

        },
        queryContractStatus() {
            this.loading = true
            let reqData = {
                groupId: localStorage.getItem('groupId'),
                fromAddress: this.freezeThawFrom.fromAddress,
                contractAddress: this.contractAddress,
                handleType: this.handleFreezeThawType
            }
            getContractStatus(reqData)
                .then(res => {
                    console.log(res.data)
                    this.loading = false
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: this.$t("govCommittee.success")
                        })
                        this.$emit('freezeThawSuccess')
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
        queryCommitteeList() {
            
            let reqData = {
                groupId: localStorage.getItem('groupId'),
                contractAddress:this.contractAddress,
               
            }
            listManagerList(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        let data = res.data.data;
                        let deployList = []
                        deployList.push({
                            userName: this.deployUserName,
                            address: this.deployAddress,
                        })
                        this.chainCommitteeList = []
                        //this.chainCommitteeList = data.concat(deployList);
                       this.chainCommitteeList=data;
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
        getUserData() {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: 1,
                pageSize: 1000
            };
            getUserList(reqData, {})
                .then(res => {
                    if (res.data.code === 0) {
                        let arr = res.data.data;
                        this.adminRivateKeyList = []
                        this.adminRivateKeyList = arr;
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
        }
    }
}
</script>

<style scoped>
.contract-address >>> .el-input__inner {
    width: 214px;
}
</style>
