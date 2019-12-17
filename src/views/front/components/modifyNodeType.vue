<template>
    <div>
        <el-form :model="modifyForm" :rules="rules" ref="modifyForm" label-width="110px" class="demo-ruleForm">
            <el-form-item :label="$t('nodes.admin')" prop="adminRivateKey" style="width: 320px;">
                <el-select v-model="modifyForm.adminRivateKey" :placeholder="$t('text.select')">
                    <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('nodes.nodeStyle')" prop="adminRivateKey" style="width: 320px;">
                <el-select v-model="modifyForm.nodeType" :placeholder="$t('text.select')">
                    <el-option v-for="item in nodeTypeList" :key="item.type" :label="item.name" :value="item.type">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="close">{{this.$t("text.cancel")}}</el-button>
            <el-button type="primary" :loading="loading" @click="submit('modifyForm')">{{this.$t("text.sure")}}</el-button>
        </div>
    </div>
</template>

<script>
import { getUserList, consensusNodeId } from "@/util/api";
export default {
    name: 'ModifyNodeType',

    components: {
    },

    props: {
        modifyNode: {
            type: Object
        }
    },

    data() {
        return {
            loading: false,
            adminRivateKeyList: [],
            nodeTypeList: [
                {
                    type: 'observer',
                    name: this.$t("nodes.observer")
                },
                {
                    type: 'sealer',
                    name: this.$t("nodes.sealer")
                },
                {
                    type: 'remove',
                    name: this.$t("nodes.remove")
                },
            ],
            modifyForm: {
                adminRivateKey: '',
                nodeType: ''
            },
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
                nodeType: [
                    {
                        required: true,
                        message: this.$t("rule.nodeType"),
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
            this.$emit("nodeModifyClose");
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.modifyNode.nodeType === 'sealer' && this.modifyForm.nodeType === 'observer') {
                        this.$confirm(this.$t("nodes.observerText"), this.$t("text.tips"), {
                            confirmButtonText: this.$t("text.sure"),
                            cancelButtonText: this.$t("text.cancel"),
                            type: 'warning'
                        }).then(() => {
                            this.queryConsensusNodeId()
                        }).catch(() => {
                            console.log('close')
                        });
                    }else if((this.modifyNode.nodeType === 'sealer' && this.modifyForm.nodeType === 'remove') || (this.modifyNode.nodeType === 'observer' && this.modifyForm.nodeType === 'remove')){
                        this.$confirm(this.$t("nodes.removeText"), this.$t("text.tips"), {
                            confirmButtonText: this.$t("text.sure"),
                            cancelButtonText: this.$t("text.cancel"),
                            type: 'warning'
                        }).then(() => {
                            this.queryConsensusNodeId()
                        }).catch(() => {
                            console.log('close')
                        });
                    }else if((this.modifyNode.nodeType === 'observer' && this.modifyForm.nodeType === 'sealer') || (this.modifyNode.nodeType === 'remove' && this.modifyForm.nodeType === 'sealer')){
                        this.$confirm(this.$t("nodes.sealerText"), this.$t("text.tips"), {
                            confirmButtonText: this.$t("text.sure"),
                            cancelButtonText: this.$t("text.cancel"),
                            type: 'warning'
                        }).then(() => {
                            this.queryConsensusNodeId()
                        }).catch(() => {
                            console.log('close')
                        });
                    }else {
                        this.queryConsensusNodeId()
                    }
                    
                } else {
                    return false;
                }
            });

        },
        queryConsensusNodeId() {
            this.loading = true;
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                nodeType: this.modifyForm.nodeType,
                nodeId: this.modifyNode.nodeId,
                fromAddress: this.modifyForm.adminRivateKey,
            }
            consensusNodeId(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: this.$t("text.updateSuccessMsg")
                        })
                        this.$emit('nodeModifySuccess')
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
                        res.data.data.forEach(value => {
                            if (value.hasPk === 1) {
                                this.adminRivateKeyList.push(value);
                            }
                        });
                        if (this.adminRivateKeyList.length) this.modifyForm.adminRivateKey = this.adminRivateKeyList[0]['address'];
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
.sure-btn /deep/ .el-button {
    padding: 9px 16px;
}
</style>
