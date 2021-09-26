<template>
    <div>
        <el-dialog :title="$t('text.newHost')" :visible.sync="dialogVisible" :before-close="modelClose" class="dialog-wrapper" width="450px" :center="true" :show-close='true'>
            <el-form :model="hostFrom" :rules='rules' ref="hostFrom" label-width="148px" class="demo-ruleForm">
                <el-form-item label='IP' prop='ip'>
                    <el-input v-model.trim="hostFrom.ip" :placeholder="$t('rule.ipName')" style="width: 240px;" maxlength="16"></el-input>
                </el-form-item>
                <el-form-item :label='$t("text.installDirectory")' prop='sshPath'>
                    <el-input v-model="hostFrom.sshPath" :placeholder="$t('text.select') + $t('text.installDirectory')" style="width: 240px;" maxlength="26"></el-input>
                </el-form-item>
            </el-form>
            <div class="text-right sure-btn" style="margin-top:10px">
                <el-button @click="modelClose">{{this.$t("text.cancel")}}</el-button>
                <el-button type="primary" :loading="loading" @click="submit('hostFrom')">{{this.$t("text.sure")}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { addHost } from "@/util/api"
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dialogVisible: this.show,
            hostFrom: {
                ip: "",
                sshPath: "/home/opt"
            },
            loading: false
        }
    },
    computed: {
        rules() {
            let data = {
                ip: [
                    { required: true, message: this.$t('rule.ipName'), trigger: 'blur' },
                    { pattern: /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/, message: this.$t('nodes.ipError'), trigger: 'blur' }
                ],
                sshUser: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' },
                ],
                sshPort: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' },
                ],
                dockerPort: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' },
                ],
                sshPath: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' },
                    { pattern: /^\//, message: this.$t('nodes.sshPathError'), trigger: 'blur' }
                ]
            }
            return data
        }
    },
    methods: {
        modelClose() {
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
        add() {
            let data = {
                sshIp: this.hostFrom.ip,
                rootDir: this.hostFrom.sshPath,
            }
            addHost(data).then(res => {
                this.loading = false
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t("text.addHostSuccess")
                    });
                    this.modelClose()
                } else {
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    this.loading = false
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    });
                });
        }
    }
}
</script>

<style>
</style>