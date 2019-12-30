<template>
    <div>
        <v-content-head :headTitle="$t('title.systemManager')" :headSubTitle="$t('title.configManager')" @changGroup="changGroup" :headTooltip="$t('title.configManagerTips')"></v-content-head>
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
                            <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="modifyItemConfig(scope.row)">{{$t('text.update')}}</el-button>
                            <el-tooltip effect="dark" placement="top-start">
                                <span slot="content">
                                    {{$t('system.configContent1')}}：<br>
                                    {{$t('system.configContent2')}}
                                    <br>
                                    {{$t('system.configContent3')}}
                                </span>
                                <i class="el-icon-info contract-icon font-12"></i>
                            </el-tooltip>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="$t('system.updateConfig')" :visible.sync="modifyDialogVisible" width="387px" v-if="modifyDialogVisible" center>
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
            configKeyList: [],
        }
    },

    computed: {
        configHead() {
            let data = [
                {
                    enName: "configKey",
                    name: this.$t('system.configKey')
                },
                {
                    enName: "configValue",
                    name: this.$t('system.configValue')
                },
                {
                    enName: "operate",
                    name: this.$t('nodes.operation'),
                }
            ]
            return data
        },
        rules() {
            let data = {
                adminRivateKey: [
                    {
                        required: true,
                        message: this.$t('rule.adminRule'),
                        trigger: "blur"
                    }
                ],
                configKey: [
                    {
                        required: true,
                        message: this.$t('rule.configName'),
                        trigger: "blur"
                    }
                ],
                configValue: [
                    {
                        required: true,
                        message: this.$t('rule.configValue'),
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
                                    item.tips = this.$t('system.gasLimit')
                                    break;

                                case "tx_count_limit":
                                    item.tips = this.$t('system.countLimit')
                                    break;
                            }
                        })
                        this.configList = res.data.data;
                        this.total = res.data.totalCount;
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
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                        this.$message.closeAll();
                    }
                })
                .catch(err => {
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
                            message: this.$t('text.updateSuccessMsg')
                        })
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                        this.$message.closeAll()
                    }
                })
                .catch(err => {
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
