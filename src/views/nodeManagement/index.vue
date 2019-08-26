<template>
    <div>
        <v-content-head :headTitle="'系统管理'" :headSubTitle="'节点管理'" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 0 29px;">
            <span class="instructions bg-efefef">节点管理说明：节点类型配置以设置节点类型。
                包括：1、根据节点NodeID设置对应节点为共识节点。
                2、 根据节点NodeID设置对应节点为观察节点。
                3、根据节点NodeID设置对应节点为游离节点。</span>
            <el-form :model="nodeForm" :rules="rules" ref="nodeForm" class="demo-ruleForm">
                <el-form-item label="管理员账号" prop="adminRivateKey" class="item-form">
                    <el-select v-model="nodeForm.adminRivateKey" placeholder="请选择" class="select-32">
                        <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                            <span>{{item.userName}}</span>
                            <span class="font-12 text-float-right">{{item.publicKey | splitString}}...</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="节点类型" prop="nodeType" class="item-form">
                    <el-select v-model="nodeForm.nodeType" placeholder="请选择" class="select-32">
                        <el-option v-for="item in nodeTypeList" :key="item.type" :label="item.name" :value="item.type">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="节点ID" prop="nodeId" class="item-form">
                    <el-input v-model.trim="nodeForm.nodeId" placeholder="请输入" class="select-32"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="addNodeId('nodeForm')" class="add-btn" :disabled="disabled">添加</el-button>
                </el-form-item>
            </el-form>
            
            <el-table :data="nodeIdList" tooltip-effect="dark" v-loading="loading">
                <el-table-column v-for="head in nodeIdHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <template v-if="head.enName!='operate'">
                            <span v-if="head.enName==='nodeType'">{{nodeText(scope.row[head.enName])}}</span>
                            <span v-else><i class="wbs-icon-copy font-12 copy-key" @click="copyNodeId(scope.row['nodeId'])" title="复制哈希"></i>{{scope.row[head.enName]}}</span>
                        </template>
                        <template v-else>
                            <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="modifyNodeType(scope.row)">修改</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="修改节点类型" :visible.sync="modifyDialogVisible" width="20%" v-if="modifyDialogVisible" center>
            <modify-node-type @close="close" @modifySuccess="modifySuccess" :modifyNode="modifyNode"></modify-node-type>
        </el-dialog>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import modifyNodeType from "./components/modifyNodeType";
import { getUserList, consensusNodeId, getConsensusNodeId } from "@/util/api";
export default {
    name: 'NodeManagement',

    components: {
        "v-content-head": contentHead,
        modifyNodeType
    },

    props: {
    },

    data() {
        return {
            modifyDialogVisible: false,
            disabled: false,
            loading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            modifyNode: '',
            nodeForm: {
                adminRivateKey: '',
                nodeType: '',
                nodeId: '',
            },
            adminRivateKeyList: [],
            nodeIdList: [],
            nodeIdHead: [
                {
                    enName: "nodeId",
                    name: "节点Id"
                },
                {
                    enName: "nodeType",
                    name: "节点类型"
                },
                {
                    enName: 'operate',
                    name: '操作'
                }
            ],
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
                }
            ],
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
                ],
                nodeId: [
                    {
                        required: true,
                        message: "请输入节点ID",
                        trigger: "blur"
                    }
                ]
            }
        }
    },

    computed: {
    },

    mounted() {
        if (localStorage.getItem("root") === "admin") {
            this.disabled = false
        } else {
            this.disabled = true
        }
        this.getUserData()
        this.queryConsensusNodeId()
    },

    methods: {
        changGroup() {
            this.getUserData()
            this.queryConsensusNodeId()
        },

        queryConsensusNodeId() {
            this.loading = true;
            let reqData = {
                groupId:localStorage.getItem("groupId"),
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            }
            getConsensusNodeId(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.nodeIdList = res.data.data;
                        this.total = res.data.totalCount;
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.$message({
                        type: "error",
                        message: "系统错误！"
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
        addNodeId(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.sureAddNodeId()
                } else {
                    return false;
                }
            });
        },
        sureAddNodeId() {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                nodeType: this.nodeForm.nodeType,
                nodeId: this.nodeForm.nodeId,
                fromAddress: this.nodeForm.adminRivateKey,
            }
            consensusNodeId(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.queryConsensusNodeId()
                        this.$message({
                            type: 'success',
                            message: '添加成功'
                        })
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
        modifyNodeType(param) {
            this.modifyNode = param.nodeId
            this.modifyDialogVisible = true;
        },
        close() {
            this.modifyDialogVisible = false
        },
        modifySuccess() {
            this.modifyDialogVisible = false
            this.queryConsensusNodeId()
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.queryConsensusNodeId();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.queryConsensusNodeId();
        },
        nodeText(key){
            var str = '';
            switch (key) {
                case 'sealer':
                    str = '共识';
                    break;
                case 'observer':
                    str = '观察';
                    break;
                case 'remove':
                    str = '游离';
                    break;
            }
            return str;
        },
        copyNodeId(val) {
            if (!val) {
                this.$message({
                    type: "fail",
                    showClose: true,
                    message: "key为空，不复制。",
                    duration: 2000
                });
            } else {
                this.$copyText(val).then(e => {
                    this.$message({
                        type: "success",
                        showClose: true,
                        message: "复制成功",
                        duration: 2000
                    });
                });
            }
        },
    }
}
</script>

<style scoped>
.demo-ruleForm {
    display: flex;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: -moz-flex;
}
.item-form {
    display: flex;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: -moz-flex;
    margin-left: 10px;
}
.item-form:first-child {
    margin-left: 0px;
}
.add-btn {
    margin-left: 10px;
}
.instructions {
    margin-bottom: 16px;
    padding: 2px 5px;
    color: #2e384d;
    border-radius: 10px;
    display: inline-block;
}
</style>
