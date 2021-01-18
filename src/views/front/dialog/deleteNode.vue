<template>
    <div>
        <el-dialog :title="$t('nodes.deleteNode')" :visible.sync="dialogVisible" :before-close="modelClose" class="dialog-wrapper" width="500px" :center="true" :show-close='true'>
            <el-form :model="nodeFrom" ref="nodeFrom" label-width="340px" class="demo-ruleForm">
                <el-form-item :label='$t("nodes.deleteErrorInfo1")'>
                    <el-switch v-model="nodeFrom.host" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item :label='$t("nodes.deleteErrorInfo2")'>
                    <el-switch v-model="nodeFrom.org" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
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
import { deleteNode } from "@/util/api"
export default {
    name: "deleteNode",
    props: ['show', 'data'],
    data: function () {
        return {
            nodeFrom: {
                host: true,
                org: true
            },
            dialogVisible: this.show,
            nodeData: this.data,
            loading: false
        }
    },
    methods: {
        modelClose: function () {
            this.$emit("close")
        },
        submit: function (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.deteted()
                } else {
                    return false
                }
            })
        },
        deteted: function () {
            let reqData = {
                nodeId: this.nodeData.nodeId,
                deleteHost: this.nodeFrom.host,
                deleteAgency: this.nodeFrom.org
            }
            deleteNode(reqData).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t("nodes.dleteNodeSuccess")
                    })
                    this.modelClose()
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