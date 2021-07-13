<template>
    <div>
        <el-form :model="modifyForm" :rules="rules" ref="modifyForm" label-width="90px" class="demo-ruleForm">
            <el-form-item :label="$t('system.configKey')">
                <span>{{configKey}}</span>
            </el-form-item>
            <el-form-item :label="$t('nodes.admin')" prop="adminRivateKey">
                <el-select v-model="modifyForm.adminRivateKey" :placeholder="$t('text.select')" style="width: 245px;">
                    <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
                <span v-if="isAdminRivateKeyShow" class="contract-code-done"   @click="$store.dispatch('switch_creat_user_dialog')" style="float:right">
                     <span target="_blank" style="cursor:pointer;font-size:12px;text-decoration:underline;">{{this.$t("privateKey.addUser")}}</span>
               </span>
            </el-form-item>
            <el-form-item :label="$t('system.configValue')" prop="configValue">
                <el-input v-model.number="modifyForm.configValue" :placeholder="configKey ==='tx_gas_limit'? $t('system.gasLong') : ''"></el-input>
            </el-form-item>
        </el-form>
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="close">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" :loading="loading" @click="submit('modifyForm')">{{this.$t('text.sure')}}</el-button>
        </div>

        <el-dialog :visible.sync="$store.state.creatUserVisible" :title="$t('privateKey.createUser')" width="640px" :append-to-body="true" class="dialog-wrapper" v-if='$store.state.creatUserVisible' center>
            <v-creatUser @creatUserClose="creatUserClose" :disablePub='true'  ref="creatUser"></v-creatUser>
        </el-dialog>
    </div>
</template>

<script>
import { getUserList, querySysConfig } from "@/util/api";
import creatUser from "@/views/privateKeyManagement/components/creatUser";
export default {
    name: 'SystemConfig',

    components: {
        "v-creatUser": creatUser
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
            isAdminRivateKeyShow: false
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
                configValue: [
                    {
                        required: true,
                        message: this.$t("rule.configValue"),
                        trigger: "blur"
                    },
                    {
                        type: 'number',
                        message: this.$t("rule.configValueNumber"),
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
                groupId: localStorage.getItem("groupId"),
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
                        if (res.data.data.length == 0) {
                            this.$message({
                                type: "info",
                                message: this.$t("contracts.addPrivateKeyInfo")
                            });
                        }
                        res.data.data.forEach(value => {
                            if (value.hasPk === 1) {
                                this.adminRivateKeyList.push(value);
                            }
                        });
                        if (this.adminRivateKeyList.length) {
                            this.modifyForm.adminRivateKey = this.adminRivateKeyList[0]['address'];
                             this.isAdminRivateKeyShow = false;
                        }else{
                            this.isAdminRivateKeyShow = true;
                        }
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
        creatUserClose() {                              
            this.getUserData();
        },
    }
}
</script>

<style scoped>
.sure-btn >>> .el-button {
    padding: 9px 16px;
}
</style>
