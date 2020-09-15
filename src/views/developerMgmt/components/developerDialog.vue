<template>
    <div>
        <el-form :model="addDevForm" :rules="rules" ref="addDevForm" label-width="110px" class="demo-ruleForm">
            <el-form-item :label="$t('devOpsMgmt.fromUser')" prop="fromAddress">
                <el-select v-model="addDevForm.fromAddress" :placeholder="$t('text.select')">
                    <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
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
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="close">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="submit('addDevForm')" :loading="loading">{{this.$t('text.sure')}}</el-button>
        </div>
    </div>
</template>

<script>
import { addDevOps, getUserList, deleteDevOps } from "@/util/api";
export default {
    name: 'developerDialog',

    components: {
    },

    props: ['handleType', 'devOpsAddress'],

    data() {
        return {
            loading: false,
            adminRivateKeyList: [],
            addDevForm: {
                fromAddress: '',
                address: ''
            }

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
        this.getUserData()
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
                        message: this.$t('text.systemError'),
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
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
    }
}
</script>

<style scoped>
</style>
