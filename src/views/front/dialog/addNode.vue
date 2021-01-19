<template>
    <div>
        <el-dialog :title="$t('nodes.frontConfig')" :visible.sync="dialogVisible" :before-close="modelClose" class="dialog-wrapper" width="450px" :center="true" :show-close='true'>
            <div>
                <el-form :model="nodeFrom" :rules='rules' ref="nodeFrom" label-width="100px" class="demo-ruleForm">
                    <el-form-item label='IP' prop='ip'>
                        <el-input v-model="nodeFrom.ip" :placeholder="$t('rule.ipName')" style="width: 140px;" maxlength="16"></el-input>
                    </el-form-item>
                    <el-form-item :label='$t("nodes.agency")'>
                        <el-input v-model="nodeFrom.agencyName" :placeholder="$t('nodes.inputAgency')" style="width: 140px;" maxlength="16"></el-input>
                    </el-form-item>
                    <el-form-item :label='$t("nodes.nodeCount")'>
                        <el-input v-model="nodeFrom.num" :placeholder="$t('nodes.inputNodes')" style="width: 140px;" maxlength="16"></el-input>
                    </el-form-item>
                </el-form>
                <div class="text-right sure-btn" style="margin-top:10px">
                    <el-button @click="modelClose">{{this.$t("text.cancel")}}</el-button>
                    <el-button type="primary" :loading="loading" @click="submit('nodeFrom')">{{this.$t("text.sure")}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { newNode } from "@/util/api"
export default {
    name: "addNode",
    props: ['show'],
    computed: {
        rules() {
            let data = {
                ip: [
                    { required: true, message: this.$t('rule.ipName'), trigger: 'blur' },
                    { pattern: /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/, message: this.$t('nodes.ipError'), trigger: 'blur' }
                ]
            }
            return data
        }
    },
    data() {
        return {
            nodeFrom: {
                ip: "",
                agencyName: "",
                num: 1
            },
            dialogVisible: this.show,
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
                    this.add()
                } else {
                    return false
                }
            })
        },
        add: function () {
            let reqData = {
                IP: this.nodeFrom.ip,
                agencyName: this.nodeFrom.agencyName,
                num: this.nodeFrom.num
            }
            newNode(reqData).then(res => {
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t('nodes.addNodeSuccess')
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