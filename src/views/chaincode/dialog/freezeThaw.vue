<template>
    <div>
        <el-form :model="freezeThawFrom" :rules="rules" ref="freezeThawFrom" label-width="110px" class="demo-ruleForm">
            <el-form-item :label="$t('govCommittee.fromUser')" prop="fromAddress">
                <el-select v-model="freezeThawFrom.fromAddress" :placeholder="$t('text.select')">
                    <el-option v-for="item in chainCommitteeList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
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
import { getContractStatus, committeeList,  getUserList} from "@/util/api"
export default {
    name: 'freezeThaw',

    components: {
    },

    props: ['contractInfo', 'handleFreezeThawType'],

    data() {
        return {
            loading: false,
            chainCommitteeList: [],
            freezeThawFrom: {
                fromAddress: '',
            },
            contractAddress: this.contractInfo.contractAddress,
        }
    },

    computed: {
        rules(){
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
        }
    },

    watch: {
    },

    created() {
    },

    mounted() {
        // this.queryCommitteeList()
        this.getUserData()
    },

    methods: {
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
        queryContractStatus(){
            this.loading = true
            let reqData = {
                groupId: localStorage.getItem('groupId'),
                fromAddress: this.freezeThawFrom.fromAddress,
                contractAddress: this.contractAddress,
                handleType: this.handleFreezeThawType
            }
            getContractStatus(reqData)
                .then(res => {
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
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        queryCommitteeList() {
            let reqData = {
                groupId: localStorage.getItem('groupId'),
                pageNumber: 1,
                pageSize: 1000
            }
            committeeList(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        let data = res.data.data
                        this.getUserData(data)
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
                        // arr.forEach(item => {
                        //     data.forEach(it=>{
                        //         if(item.address == it.address){
                        //             it.userName = item.userName
                        //         }
                        //     })
                        // });
                        this.chainCommitteeList = arr;
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
        }
    }
}
</script>

<style scoped>
.contract-address>>>.el-input__inner {
    width: 214px;
}
</style>
