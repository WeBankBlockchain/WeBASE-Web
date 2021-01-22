<template>
    <div>
        <el-form :model="groupFrom" :rules="rules" ref="groupFrom" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="$t('nodes.groupId')" prop="generateGroupId" style="width:330px">
                <el-input v-model.number="groupFrom.generateGroupId" min="1" max="32767" show-word-limit></el-input>
            </el-form-item>
        </el-form>
        <el-table ref="multipleTable" :data="nodeList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column v-for="head in frontHead" :label="head.name" :key="head.enName" :prop="head.enName" :width="head.width" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="head.enName === 'nodeId'">
                        <i class="wbs-icon-copy font-12" @click="copyNodeIdKey(scope.row[head.enName])" :title="$t('text.copy')"></i>
                        {{scope.row[head.enName]}}
                    </span>
                    <span v-else>
                        {{scope.row[head.enName]}}
                    </span>
                </template>
            </el-table-column>

        </el-table>
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="close" :disabled='loading'>{{this.$t("text.cancel")}}</el-button>
            <el-button type="primary" :loading="loading" @click="submit('groupFrom')">{{this.$t("text.sure")}}</el-button>
        </div>
    </div>
</template>

<script>
import { createGroup, getFronts, batchStartGroup } from "@/util/api"
export default {
    name: '',

    components: {
    },

    props: {
    },

    data() {
        let validateGroupId = (rule, value, callback) => {
            if (!Number.isInteger(value)) {
                callback(new Error(this.$t('rule.number')));
            } else {
                if (+value > 32767) {
                    callback(new Error(this.$t('rule.textLong1_32767')));
                } else {
                    callback();
                }
            }
        }
        return {
            loading: false,
            groupFrom: {
                generateGroupId: ''
            },
            nodeList: [],
            nodeIdParam: [],
            rules: {
                generateGroupId: [
                    {
                        required: true,
                        message: this.$t('rule.groupId')
                    },
                    { validator: validateGroupId, trigger: 'blur' },
                ]
            },
            description: ''
        }
    },

    computed: {
        frontHead() {
            let data = [
                {
                    enName: "frontId",
                    name: this.$t("nodes.frontId"),
                    width: ''
                },
                {
                    enName: "nodeId",
                    name: this.$t("nodes.nodeId"),
                    width: '400'
                },
                {
                    enName: "frontIp",
                    name: this.$t("nodes.frontIp"),
                    width: ''
                },
                {
                    enName: "frontPort",
                    name: this.$t("nodes.frontPort"),
                    width: ''
                },
                {
                    enName: "agency",
                    name: this.$t("nodes.agency"),
                    width: ''
                },
            ];
            return data
        }
    },

    watch: {
    },

    created() {
    },

    mounted() {
        this.queryFrontList()
    },

    methods: {
        queryFrontList() {
            getFronts({ frontStatus: 1 })
                .then(res => {
                    if (res.data.code === 0) {
                        this.nodeList = res.data.data
                    }
                })
                .catch(error => {

                })
        },

        handleSelectionChange(val) {
            this.nodeIdParam = [];
            if (val && val.length) {
                for (let i = 0; i < val.length; i++) {
                    this.nodeIdParam.push(val[i].nodeId)
                }
            }
        },
        close() {
            this.$emit('close')
        },
        submit(groupFrom) {
            this.$refs[groupFrom].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.queryCreateGroup(this.queryBatchStartGroup)
                } else {
                    return false;
                }
            });
        },
        queryCreateGroup(callback) {
            let data = {
                generateGroupId: this.groupFrom.generateGroupId,
                timestamp: (new Date()).getTime(),
                nodeList: this.nodeIdParam,
                description: this.description,

            }
            createGroup(data, "").then(res => {
                if (res.data.code === 0) {
                    let array = res.data.data
                    array.forEach(item => {
                        if (item.code != 0) {
                            this.$message({
                                type: 'error',
                                message: this.$t('nodes.nodeFront') + `${item.frontId}` + this.$t('nodes.failCreatGroup'),
                                duration: 4500
                            })
                        }
                    });
                    this.$nextTick(_ => {
                        callback()
                    })
                } else {
                    this.loading = false;
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    })
                }
            }).catch(err => {
                this.loading = false;
                this.$message({
                    type: "error",
                    message: err.data || this.$t('text.systemError')
                })
            })
        },
        queryBatchStartGroup() {
            let data = {
                generateGroupId: this.groupFrom.generateGroupId,
                nodeList: this.nodeIdParam
            }
            batchStartGroup(data).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    let array = res.data.data
                    array.forEach(item => {
                        if (item.code != 0) {
                            this.$message({
                                type: 'error',
                                message: this.$t('nodes.nodeFront') + `${item.frontId}` + this.$t('nodes.failStartGroup'),
                                duration: 4500
                            })
                        }
                    });
                    this.$emit('generateSuccess')
                } else {
                    this.loading = false;
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    })
                }
            }).catch(err => {
                this.loading = false;
                this.$message({
                    type: "error",
                    message: err.data || this.$t('text.systemError')
                })
            })
        },
        copyNodeIdKey(val) {
            if (!val) {
                this.$message({
                    type: "fail",
                    showClose: true,
                    message: this.$t("text.copyErrorMsg"),
                    duration: 2000
                });
            } else {
                this.$copyText(val).then(e => {
                    this.$message({
                        type: "success",
                        showClose: true,
                        message: this.$t("text.copySuccessMsg"),
                        duration: 2000
                    });
                });
            }
        },
    }
}
</script>

<style scoped>
</style>
