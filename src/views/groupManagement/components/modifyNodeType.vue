<template>
    <div>
        <el-form :model="modifyForm" :rules="rules" ref="modifyForm" label-width="110px" class="demo-ruleForm">
            <el-form-item :label="$t('nodes.groupId')" prop="groupId" style="width: 320px;">
                <span>{{itemNodeData.groupId}}</span>
            </el-form-item>
            <el-form-item :label="$t('nodes.admin')" prop="adminRivateKey" style="width: 320px;">
                <el-select v-model="modifyForm.adminRivateKey" :placeholder="$t('text.select')">
                    <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('nodes.nodeStyle')" prop="nodeStyle" style="width: 320px;">
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
        itemNodeData: {
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
                }
            ],
            modifyForm: {
                adminRivateKey: '',
                nodeType: 'observer'
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
                    this.queryConsensusNodeId()
                } else {
                    return false;
                }
            });

        },
        queryConsensusNodeId() {
            this.loading = true;
            let reqData = {
                groupId: this.itemNodeData.groupId,
                nodeType: this.modifyForm.nodeType,
                nodeId: this.itemNodeData.nodeId,
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
                        message: err.data || this.$t('text.systemError'),
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
                groupId: this.itemNodeData.groupId,
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
                        this.adminRivateKeyList = [];
                        res.data.data.forEach(value => {
                            if (value.hasPk === 1) {
                                this.adminRivateKeyList.push(value);
                            }
                        });
                        if (!this.adminRivateKeyList.length) {
                            this.$message({
                                type: "info",
                                message: this.$t('nodes.groupId') + ' ' + this.itemNodeData.groupId + ', ' + this.$t('contracts.addPrivateKeyInfo'),
                            });
                            return
                        }
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
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
    }
}
</script>

<style scoped>
.sure-btn >>> .el-button {
    padding: 9px 16px;
}
</style>
