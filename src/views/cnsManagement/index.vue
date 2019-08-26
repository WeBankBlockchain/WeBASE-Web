<template>
    <div>
        <v-content-head :headTitle="'系统管理'" :headSubTitle="'CNS管理'" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 0 29px;">
            <span class="instructions bg-efefef">CNS管理说明：合约命名服务CNS通过提供链上合约名称与合约地址映射关系的记录及相应的查询功能，方便调用者通过记忆简单的合约名来实现对链上合约的调用。</span>
            <el-form :model="cnsForm" :rules="rules" ref="cnsForm" class="demo-ruleForm">
                <el-form-item label="合约名称" prop="contractName" class="item-form">
                    <el-input v-model.trim="cnsForm.contractName" placeholder="请输入" class="select-32"></el-input>
                </el-form-item>
                <el-form-item label="合约版本" prop="contractVersion" class="item-form">
                    <el-input v-model.trim="cnsForm.contractVersion" placeholder="请输入" class="select-32"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="searchCns('cnsForm')" class="modify-btn" :disabled="disabled" :loading="loading">查询</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="cnsList" tooltip-effect="dark" v-loading="loading" class="search-table-content">
                <el-table-column v-for="head in cnsHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center" :width="head.width">
                    <template slot-scope="scope">
                        <span>{{scope.row[head.enName]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { queryCnsList } from "@/util/api";
export default {
    name: 'ConfigManagement',

    components: {
        "v-content-head": contentHead,
    },

    props: {
    },

    data() {
        return {
            disabled: false,
            loading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            cnsForm: {
                contractVersion: '',
                contractName: '',
            },
            cnsList: [],
            cnsHead: [
                {
                    enName: "name",
                    name: "合约名称",
                    width: '100'
                },
                {
                    enName: "version",
                    name: "合约版本",
                    width: ''
                },
                {
                    enName: "address",
                    name: "合约地址",
                    width: ''
                },
                {
                    enName: "abi",
                    name: "合约Abi",
                    width: ''
                },
            ],
            rules: {
                // contractVersion: [
                //     {
                //         required: true,
                //         message: "请输入合约版本号",
                //         trigger: "blur"
                //     }
                // ],
                contractName: [
                    {
                        required: true,
                        message: "请输入合约名",
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
    },

    methods: {
        changGroup() {
            this.getCnsList()
        },
        searchCns(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.getCnsList()
                } else {
                    return false;
                }
            });

        },
        getCnsList() {
            this.loading = true;
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: this.currentPage,
                pageSize: this.pageSize,
            }
            if(this.cnsForm.contractVersion){
                reqData.contractNameAndVersion = `${this.cnsForm.contractName}:${this.cnsForm.contractVersion}`
            }else {
                reqData.contractNameAndVersion = `${this.cnsForm.contractName}`
            }
            queryCnsList(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.cnsList = res.data.data;
                        this.total = res.data.totalCount
                        this.$message({
                            type: 'success',
                            message: '查询成功'
                        })
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
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.queryConsensusNodeId();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.queryConsensusNodeId();
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
.modify-btn {
    margin-left: 10px;
}
.instructions {
    margin-bottom: 16px;
    padding: 2px 5px;
    color: #2e384d;
    border-radius: 10px;
    display: inline-block;
}
.search-table-content >>> th {
    background: #fafafa;
}

</style>
