<template>
    <div>
        <v-content-head :headTitle="$t('title.contractTitle')" :headSubTitle="$t('title.CNSmanager')" @changGroup="changGroup" :headTooltip="$t('title.CNSTips')"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 0 29px;">
            <!-- <span class="instructions bg-efefef"></span> -->
            <el-form :model="cnsForm" :rules="rules" ref="cnsForm" class="demo-ruleForm">
                <el-form-item :label="$t('contracts.contractName')" prop="contractName" class="item-form">
                    <el-input v-model.trim="cnsForm.contractName" :placeholder="$t('text.input')" class="select-32" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item :label="$t('contracts.contractVersion')" prop="contractVersion" class="item-form">
                    <el-input v-model.trim="cnsForm.contractVersion" :placeholder="$t('text.input')" class="select-32" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="searchCns('cnsForm')" class="modify-btn" :disabled="disabled" :loading="loading">{{this.$t('text.search')}}</el-button>
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
        }
    },

    computed: {
        cnsHead() {
            let data = [
                {
                    enName: "name",
                    name: this.$t('contracts.contractName'),
                    width: '120'
                },
                {
                    enName: "version",
                    name: this.$t('contracts.contractVersion'),
                    width: ''
                },
                {
                    enName: "address",
                    name: this.$t('contracts.contractAddress'),
                    width: ''
                },
                {
                    enName: "abi",
                    name: this.$t('contracts.contractAbi'),
                    width: ''
                },
            ]
            return data
        },
        rules() {
            let data = {
                contractName: [
                    {
                        required: true,
                        message: this.$t('rule.contractName'),
                        trigger: "blur"
                    }
                ]
            }
            return data
        }
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
                            message: this.$t('text.selectSuccess')
                        })
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
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getCnsList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getCnsList();
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
    padding: 10px 10px;
    color: #2e384d;
    border-radius: 10px;
    display: inline-block;
}
.search-table-content >>> th {
    background: #fafafa;
}

</style>
