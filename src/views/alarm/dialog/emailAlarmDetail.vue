<template>
    <div>
        <el-dialog title="告警配置详情" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
            <div>
                <el-form  ref="alarmForm" label-width="130px" class="demo-ruleForm">
                    <el-form-item label="告警邮件标题" prop="ruleName">
                        <span>{{alarmDetail.ruleName}}</span>
                    </el-form-item>
                    <!-- <el-form-item label="告警类型" prop="ruleName">
                        <span>{{alarmDetail.alertType | Status}}</span>
                    </el-form-item> -->
                    <el-form-item label="告警内容" prop="ruleName">
                        <span>{{alarmDetail.alertContent}}</span>
                    </el-form-item>
                    <el-form-item label="发送邮件间隔" prop="ruleName">
                       <span>{{alarmDetail.alertIntervalSeconds}}</span>
                    </el-form-item>
                    <el-form-item label="上次告警时间" prop="ruleName">
                       <span>{{alarmDetail.lastAlertTime}}</span>
                    </el-form-item>
                    <el-form-item label="发送告警邮件邮箱" prop="ruleName">
                        <span>{{alarmDetail.userList}}</span>
                    </el-form-item>
                    <el-form-item label="状态" prop="ruleName">
                        <span>{{alarmDetail.enable | Type}}</span>
                    </el-form-item>
                    <el-form-item label="告警等级" prop="ruleName">
                        <span>{{alarmDetail.alertLevel}}</span>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "emailAlarmDetail",
    props: ['show','data'],
    data: function(){
        return {
            dialogVisible: this.show,
            alarmDetail: this.data
        }
    },
    methods: {
        handleClose: function(){
            this.$emit("close")
        }
    },
    filters: {
        Type: function(row){
            if(row){
                return "启动"
            }else{
                return "关闭"
            }
        },
        Status: function(value){
            switch (value) {
                case 1:
                    return "节点告警";
                    break;
                case 2: 
                    return "审计告警";
                    break;
                default:
                    return "证书告警";
                    break;
            }
        }
    }
}
</script>

<style>

</style>