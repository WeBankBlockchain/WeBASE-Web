<template>
    <div style="position: relative;">
        <!-- <div style="position: absolute;right: 20px;" @click="copyInfo">
            <span>
                <i class="el-icon-copy-document"></i>
            </span>
        </div> -->
        <p style="color: #F56C6C;padding-bottom: 5px">{{$t('text.appInfo1')}}</p>
        <div class="register-item">
            <span class="item-key">IP：</span>
            <span>{{registerDialogInfo.ip}}</span>
        </div>
        <div class="register-item">
            <span class="item-key">Port：</span>
            <span>{{registerDialogInfo.port}}</span>
        </div>
        <div class="register-item">
            <span class="item-key">appKey：</span>
            <span>{{registerDialogInfo.appKey}}</span>
        </div>
        <div class="register-item">
            <span class="item-key">appSecret：</span>
            <span>{{registerDialogInfo.appSecret}}</span>
        </div>
        <p style="color: #F56C6C;padding-bottom: 5px">{{$t('text.appInfo2')}}</p>
        <div class="dialog-footer">
            <el-button type="primary" @click="copyInfo">{{this.$t('text.copyInfo')}}</el-button>
        </div>
    </div>
</template>

<script>

export default {
    name: 'registerDialog',

    components: {
    },

    props: ['registerDialogInfo'],

    data() {
        return {

        }
    },

    computed: {
    },

    watch: {
    },

    created() {
    },

    mounted() {
    },

    methods: {
        copyInfo() {
            let val = `${this.registerDialogInfo.ip}:${this.registerDialogInfo.port},${this.registerDialogInfo.appKey},${this.registerDialogInfo.appSecret}`
            if (!val) {
                this.$message({
                    type: "fail",
                    showClose: true,
                    message: this.$t("text.copyErrorMsg"),
                    duration: 2000
                });
            } else {
                this.$copyText(val).then(e => {
                    this.$message({
                        type: "success",
                        showClose: true,
                        message: this.$t("text.copySuccessMsg"),
                        duration: 2000
                    });
                });
            }
        }
    }
}
</script>

<style scoped>
.register-item {
    display: flex;
    height: 22px;
    line-height: 22px;
    font-size: 14px;
    color: #333333;
    font-weight: 400;
}
.item-key {
    display: inline-block;
    min-width: 90px;
    color: #666666;
}
.dialog-footer {
    text-align: right;
    padding-top: 12px;
}
</style>
