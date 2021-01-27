<template>
    <div>
        <el-dialog :title="$t('text.upgradeNode')" :visible.sync="dialogVisible" :before-close="modelClose" class="dialog-wrapper" width="500px" :center="true" :show-close='true'>
            <el-form :model="nodeFrom" :rules='rules' ref="nodeFrom" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="$t('nodes.selectVersion')" prop="newTagId">
                    <el-select v-model="nodeFrom.newTagId" :placeholder="$t('nodes.selectVersionInfo')" style="width: 250px;">
                        <el-option v-for="(item,index) in configList" :key="index" :label="item.configValue" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button type="primary" icon='el-icon-refresh-right' style="margin-left: 20px;" @click='refresh'></el-button>
                </el-form-item>
            </el-form>
            <div class="text-right sure-btn" style="margin-top:10px">
                <el-button @click="modelClose">{{this.$t("text.cancel")}}</el-button>
                <el-button type="primary" :loading="loading" @click="submit('nodeFrom')">{{this.$t("text.sure")}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getConfigList, upgradeNode } from "@/util/api"
export default {
    name: "updateNode",
    props: ['show'],
    data: function () {
        return {
            dialogVisible: this.show,
            update: false,
            configList: [],
            type: 1,
            loading: false,
            nodeFrom: {
                newTagId: ""
            },
        }
    },
    computed: {
        rules() {
            let data = {
                ip: [
                    { required: true, message: this.$t('nodes.selectVersionInfo'), trigger: 'blur' }
                ]
            }
            return data
        }
    },
    mounted: function () {
        this.getConfigs()
    },
    methods: {
        modelClose: function () {
            this.$emit("close")
        },
        getConfigs: function () {
            let reqData = {
                type: this.type,
                update: this.update
            }
            getConfigList(reqData).then(res => {
                if (res.data.code === 0) {
                    this.configList = res.data.data
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
        refresh: function () {
            this.update = true;
            this.getConfigs();
        },
        submit: function (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.updating()
                } else {
                    return false
                }
            })
        },
        updating: function () {
            let reqData = {
                newTagId: this.nodeFrom.newTagId
            }
            upgradeNode(reqData).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: "info",
                        message: this.$t('nodes.upgraded')
                    })
                    this.$emit("success")
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
        }
    }
}
</script>

<style>
</style>