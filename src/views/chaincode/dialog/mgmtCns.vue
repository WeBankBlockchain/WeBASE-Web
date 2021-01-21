<template>
    <div>
        <el-form ref="cnsVersionFrom" :model="cnsVersionFrom" :rules="rules" class="" size="medium" label-width="135px">
            <el-form-item :label="$t('contracts.user')" prop="userId">
                <el-select v-model="cnsVersionFrom.userId" :placeholder="placeholderText" @change="changeId" style="width: 240px;">
                    <el-option :label="item.address" :value="item.address" :key="item.address" v-for='item in userList'>
                        <span class="font-12">{{item.userName}}</span>
                        <span>{{item.address}}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('text.cnsName')" prop="cnsName">
                <el-input v-model="cnsVersionFrom.cnsName" style="width: 240px;">
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('text.version')" prop="cnsVersion">
                <el-input v-model="cnsVersionFrom.cnsVersion" style="width: 240px;">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
            <el-button @click="modelClose">{{$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="submit('cnsVersionFrom')">{{$t('text.register')}}</el-button>
        </div>
    </div>
</template>

<script>
import { getUserList, findCnsInfo, registerCns } from "@/util/api"
export default {
    name: 'mgmtCns',

    components: {
    },

    props: ['mgmtCnsItem'],

    data() {
        return {
            userName: "",
            userList: [],
            userId: null,
            placeholderText: this.$t('placeholder.selectedAccountAddress'),
            loading: false,
            cnsList: [],
            cnsVersionFrom: {
                userId: "",
                cnsVersion: this.mgmtCnsItem.version,
                cnsName: this.mgmtCnsItem.contractName
            },
            reqVersion: ""
        }
    },

    computed: {
        cnsHead() {
            var arr = [
                {
                    enName: "contractName",
                    name: this.$t('table.contractName'),
                    tdWidth: '115px'
                },
                {
                    enName: "version",
                    name: this.$t('table.cnsVersion'),
                    tdWidth: "200px"
                },
                {
                    enName: "contractAddress",
                    name: this.$t('table.contractAddress'),
                    tdWidth: ''
                }
            ]
            return arr
        },
        rules() {
            var obj = {
                cnsVersion: [
                    {
                        required: true,
                        message: this.$t('dialog.cnsVersion'),
                        trigger: "change"
                    },
                    {
                        pattern: /^[A-Za-z0-9.]+$/,
                        message: this.$t('dialog.cnsVersionPattern'),
                        trigger: "blur"
                    }
                ],
                userId: [
                    {
                        required: true,
                        message: this.$t('placeholder.selectedAccountAddress'),
                        trigger: "change"
                    },
                ],
                cnsName: [
                    {
                        required: true,
                        message: this.$t('dialog.cnsName'),
                        trigger: "change"
                    },
                    {
                        pattern: /^[A-Za-z0-9.]+$/,
                        message: this.$t('dialog.cnsVersionPattern'),
                        trigger: "blur"
                    }
                ],
            }
            return obj
        },
    },

    watch: {
    },

    created() {
    },

    mounted() {
        this.getLocalKeyStores()
        this.queryFindCnsInfo()
    },

    methods: {
        getLocalKeyStores() {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: 1,
                pageSize: 1000
            };
            let query = {}
            if (localStorage.getItem('root') === 'developer') {
                query.account = localStorage.getItem("user")
            }
            getUserList(reqData, query)
                .then(res => {
                    if (res.data.code === 0) {
                        res.data.data.forEach(value => {
                            if (value.hasPk === 1) {
                                this.userList.push(value);
                            }
                        });
                        if (this.userList.length) {
                            this.cnsVersionFrom.userId = this.userList[0].address;
                        } else {
                            this.placeholderText = this.$t('placeholder.selectedNoUser')
                        }
                    } else {
                        console.log(4444);
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
        },
        changeId() {

        },
        submit() {
            this.$refs['cnsVersionFrom'].validate((valid) => {
                if (valid) {
                    if (this.reqVersion) {
                        if (this.reqVersion == this.cnsVersionFrom.cnsVersion) {
                            this.$message({
                                type: 'warning',
                                message: this.$t('text.registered')
                            })
                            return
                        } else {
                            this.$confirm(this.$t('text.updateRegister'), {
                                type: 'warning'
                            }).then(() => {
                                this.queryRegisterCns()
                            }).catch(() => {

                            });

                        }
                    }else {
                        this.queryRegisterCns()
                    }

                } else {
                    return false;
                }
            });

        },
        queryRegisterCns() {
            let param = {
                groupId: localStorage.getItem('groupId'),
                contractName: this.mgmtCnsItem.contractName,
                version: this.cnsVersionFrom.cnsVersion,
                contractAbi: this.mgmtCnsItem.contractAbi,
                userAddress: this.cnsVersionFrom.userId,
                saveEnabled: true,
                contractAddress: this.mgmtCnsItem.contractAddress,
                cnsName: this.cnsVersionFrom.cnsName,
                contractPath: this.mgmtCnsItem.contractPath
            }
            registerCns(param)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: this.$t('text.registerSuccess')
                        })
                        this.$emit('mgmtCnsResultSuccess')
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error"
                        });
                    }
                })
        },
        modelClose() {
            this.$emit('mgmtCnsResultClose')
        },
        queryFindCnsInfo() {
            let param = {
                groupId: localStorage.getItem('groupId'),
                contractAddress: this.mgmtCnsItem.contractAddress
            }
            findCnsInfo(param)
                .then(res => {
                    if (res.data.code === 0) {
                        if (res.data.data) {
                            this.reqVersion = res.data.data.version
                            this.cnsVersionFrom.cnsVersion = res.data.data.version
                        }
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        });
                    }
                })
        }
    }
}
</script>

<style scoped>
</style>

