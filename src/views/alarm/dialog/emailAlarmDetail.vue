<template>
    <div>
        <el-dialog :title="$t('alarm.emailAlarmDetail')" :visible.sync="dialogVisible" width="600px" :before-close="handleClose" :center="true">
            <div>
                <el-form  ref="alarmForm" label-width="130px" class="demo-ruleForm">
                    <el-form-item :label="$t('alarm.alarmEmailTile')" prop="ruleName">
                        <span>{{alarmDetail.ruleName}}</span>
                    </el-form-item>
                    <!-- <el-form-item label="告警类型" prop="ruleName">
                        <span>{{alarmDetail.alertType | Status}}</span>
                    </el-form-item> -->
                    <el-form-item :label="$t('alarm.alarmContent')" prop="ruleName">
                        <span>{{alarmDetail.alertContent}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('alarm.sendTime')" prop="ruleName">
                       <span>{{alarmDetail.alertIntervalSeconds}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('alarm.lastAlertTime')" prop="ruleName">
                       <span>{{alarmDetail.lastAlertTime}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('alarm.userList')" prop="ruleName">
                        <span>{{alarmDetail.userList}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('alarm.status')" prop="ruleName">
                        <span>{{alarmDetail.enable | Type}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('alarm.alarmLevel')" prop="ruleName">
                        <span>{{alarmDetail.alertLevel | Level}}</span>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
let that;
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
    beforeCreate: function () {
        that = this;
    },
    filters: {
        Type: function(row){
            if(row){
                return that.$t('alarm.start')
            }else{
                return that.$t('alarm.close')
            }
        },
        Status: function(value){
            switch (value) {
                case 1:
                    return that.$t('alarm.nodeAlarm');
                    break;
                case 2: 
                    return that.$t('alarm.auditAlert');
                    break;
                default:
                    return that.$t('alarm.certAlert');
                    break;
            }
        },
        Level: function(value){
            switch(value) {
                case 1: 
                    return that.$t('alarm.high');
                    break;
                case 2:
                    return that.$t('alarm.common');
                    break;
                default:
                    return that.$t('alarm.low');
                    break;
            }
        }
    }
}
</script>

<style>

</style>