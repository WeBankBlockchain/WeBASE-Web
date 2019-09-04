<template>
    <div>
        <v-content-head :headTitle="'系统管理'" :headSubTitle="'配置管理'" @changGroup="changGroup" :headTooltip="`系统配置管理说明：系统配置可以配置系统属性值（目前支持tx_count_limit和tx_gas_limit属性的设置）。`"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 0 29px;">
            <el-table :data="configList" tooltip-effect="dark" v-loading="loading" class="search-table-content" style="padding-bottom: 20px;">
                <el-table-column v-for="head in configHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <template v-if="head.enName!='operate'">
                            <template v-if="head.enName==='configKey'">
                                <span>{{scope.row[head.enName]}}</span>
                                <el-tooltip effect="dark" :content="scope.row['tips']" placement="top-start">
                                    <i class="el-icon-info contract-icon font-12"></i>
                                </el-tooltip>
                            </template>
                            <template v-else>
                                <span>{{scope.row[head.enName]}}</span>
                            </template>
                        </template>
                        <template v-else>
                            <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="modifyItemConfig(scope.row)">修改</el-button>
                            <el-tooltip effect="dark" placement="top-start">
                                <span slot="content">
                                    不建议随意修改tx_count_limit和tx_gas_limit，如下情况可修改这些参数：</br>
                                    机器网络或CPU等硬件性能有限：调小tx_count_limit，或降低业务压力；
                                    </br>
                                    业务逻辑太复杂，执行区块时gas不足：调大tx_gas_limit。
                                </span>
                                <i class="el-icon-info contract-icon font-12"></i>
                            </el-tooltip>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="修改配置值" :visible.sync="modifyDialogVisible" width="387px" v-if="modifyDialogVisible" center>
            <system-config @close="close" @modifySuccess="modifySuccess" :configKey="configkey"></system-config>
        </el-dialog>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import systemConfig from "./components/systemConfig";
import { getUserList, querySysConfig, querySysConfigList } from "@/util/api";
export default {
    name: 'ConfigManagement',

    components: {
        "v-content-head": contentHead,
        systemConfig
    },

    props: {
    },

    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            disabled: false,
            loading: false,
            modifyDialogVisible: false,
            configForm: {
                adminRivateKey: '',
                configKey: '',
                configValue: '',
            },
            configkey: '',
            adminRivateKeyList: [],
            configList: [],
            configHead: [
                {
                    enName: "configKey",
                    name: "配置名称"
                },
                {
                    enName: "configValue",
                    name: "配置值"
                },
                {
                    enName: "operate",
                    name: "操作"
                }
            ],
            configKeyList: [],
            rules: {
                adminRivateKey: [
                    {
                        required: true,
                        message: "请选择管理员账号",
                        trigger: "blur"
                    }
                ],
                configKey: [
                    {
                        required: true,
                        message: "请选择配置名称",
                        trigger: "blur"
                    }
                ],
                configValue: [
                    {
                        required: true,
                        message: "请输入配置值",
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
        this.getSysConfigList()
    },

    methods: {
        changGroup() {
            this.getUserData()
            this.getSysConfigList()
        },
        getSysConfigList() {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: this.currentPage,
                pageSize: this.pageSize,
            }
            querySysConfigList(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        var list = res.data.data;
                        list.forEach(item => {
                            switch (item.configKey) {
                                case "tx_gas_limit":
                                    item.tips = '一个区块最大gas限制'
                                    break;

                                case "tx_count_limit":
                                    item.tips = '一个区块中可打包的最大交易数目'
                                    break;
                            }
                        })
                        this.configList = res.data.data;
                        this.total = res.data.totalCount;
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
                        this.$message.closeAll();
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "系统错误！"
                    });
                    this.$message.closeAll();
                });
        },
        modifyConfig(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.suremodifyConfig()
                } else {
                    return false;
                }
            });
        },
        suremodifyConfig() {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                configKey: this.configForm.configKey,
                configValue: this.configForm.configValue,
                fromAddress: this.configForm.adminRivateKey,
            }
            querySysConfig(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.getSysConfigList()
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode[res.data.code].cn
                        });
                        this.$message.closeAll()
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "系统错误！"
                    });
                    this.$message.closeAll()
                });
        },
        modifyItemConfig(item) {
            this.configkey = item.configKey;
            this.modifyDialogVisible = true;
        },
        close() {
            this.modifyDialogVisible = false
        },
        modifySuccess() {
            this.modifyDialogVisible = false
            this.getSysConfigList()
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.queryGetPermission();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.queryGetPermission();
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
    margin-bottom: 30px;
    padding: 10px 10px;
    color: #2e384d;
    border-radius: 10px;
    display: inline-block;
}

.search-table-content >>> th {
    background: #fafafa;
}
</style>
