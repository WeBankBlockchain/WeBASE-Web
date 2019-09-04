<template>
    <div>
        <el-form :model="modifyForm" :rules="rules" ref="modifyForm" label-width="110px" class="demo-ruleForm">
            <el-form-item label="配置名称"  style="width: 320px;">
                <span>{{configKey}}</span>
            </el-form-item>
            <el-form-item label="管理员账号" prop="adminRivateKey" style="width: 320px;">
                <el-select v-model="modifyForm.adminRivateKey" placeholder="请选择">
                    <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="配置值" prop="configValue" style="width: 320px;">
                <el-input v-model.number="modifyForm.configValue" :placeholder="configKey ==='tx_gas_limit'? '范围从100000到2147483647' : ''"></el-input>
            </el-form-item>
        </el-form>
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" :loading="loading" @click="submit('modifyForm')">确定</el-button>
        </div>
    </div>
</template>

<script>
import { getUserList, querySysConfig } from "@/util/api";
export default {
    name: 'SystemConfig',

    components: {
    },

    props: {
        configKey: {
            type: String
        }
    },

    data() {
        return {
            loading: false,
            adminRivateKeyList: [],
            modifyForm: {
                adminRivateKey: '',
                configValue: ''
            },
            rules: {
                adminRivateKey: [
                    {
                        required: true,
                        message: "请选择管理员账号",
                        trigger: "blur"
                    }
                ],
                configValue: [
                    {
                        required: true,
                        message: "请输入配置值",
                        trigger: "blur"
                    },
                    {
                        type: 'number',
                        message: '配置值必须为数字'
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
            this.$emit("close");
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.queryquerySysConfig()
                } else {
                    return false;
                }
            });

        },
        queryquerySysConfig() {
            this.loading = true;
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                configKey: this.configKey,
                configValue: this.modifyForm.configValue,
                fromAddress: this.modifyForm.adminRivateKey,
            }
            querySysConfig(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$emit('modifySuccess')
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
                        if(this.adminRivateKeyList.length) this.modifyForm.adminRivateKey = this.adminRivateKeyList[0]['address'];
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
