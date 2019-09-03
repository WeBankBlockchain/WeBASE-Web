<template>
    <div>
        <el-form :model="modifyForm" :rules="rules" ref="modifyForm" label-width="110px" class="demo-ruleForm">
            <el-form-item label="管理员账号" prop="adminRivateKey" style="width: 320px;">
                <el-select v-model="modifyForm.adminRivateKey" placeholder="请选择">
                    <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="节点类型" prop="adminRivateKey" style="width: 320px;">
                <el-select v-model="modifyForm.nodeType" placeholder="请选择">
                    <el-option v-for="item in nodeTypeList" :key="item.type" :label="item.name" :value="item.type">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" :loading="loading" @click="submit('modifyForm')">确定</el-button>
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
            type: String
        }
    },

    data() {
        return {
            loading: false,
            adminRivateKeyList: [],
            nodeTypeList: [
                {
                    type: 'observer',
                    name: '观察'
                },
                {
                    type: 'sealer',
                    name: '共识'
                },
                {
                    type: 'remove',
                    name: '游离'
                },
            ],
            modifyForm: {
                adminRivateKey: '',
                nodeType: ''
            },
            rules: {
                adminRivateKey: [
                    {
                        required: true,
                        message: "请选择管理员账号",
                        trigger: "blur"
                    }
                ],
                nodeType: [
                    {
                        required: true,
                        message: "请选择节点类型",
                        trigger: "blur"
                    }
                ]
            }
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
                groupId: localStorage.getItem("groupId"),
                nodeType: this.modifyForm.nodeType,
                nodeId: this.modifyNode,
                fromAddress: this.modifyForm.adminRivateKey,
            }
            consensusNodeId(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '授权成功'
                        })
                        this.$emit('nodeModifySuccess')
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
    }
}
</script>

<style scoped>
.sure-btn /deep/ .el-button {
    padding: 9px 16px;
}
</style>
