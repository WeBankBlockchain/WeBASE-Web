<template>
    <div>
        <v-content-head :headTitle="'告警配置'" :headSubTitle="'邮件告警配置'" @changGroup="changGroup" :headTooltip="`系统配置管理说明：系统配置可以配置系统属性值（目前支持tx_count_limit和tx_gas_limit属性的设置）。`"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 20px 29px;">
            <el-table :data="alarmList" tooltip-effect="dark" v-loading="loading" class="search-table-content" style="padding-bottom: 20px;">
                <!-- <el-table-column label="类型"  show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.alertType | Type}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column label="告警邮件标题"  show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span @click="link(scope.row)" class="link">{{scope.row.ruleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="邮件模板" prop='alertContent' show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="发送间隔时间（秒）" prop='alertIntervalSeconds' show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                        <el-button v-if='scope.row.enable' type="text" size="small" @click='startUp(scope.row)'>禁用</el-button>
                        <el-button v-if='!scope.row.enable' type="text" size="small" @click='startUp(scope.row)'>启用</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <emailAlarmType-detail :show='emailAlarmTypeShow' v-if='emailAlarmTypeShow' :data="emailAlarmTypeData" @close='emailAlarmTypeClose'></emailAlarmType-detail>
        <emailAlarm-detail :show='emailAlarmShow' v-if='emailAlarmShow' :data='emailAlarmData' @close='emailAlarmClose'></emailAlarm-detail>
    </div>
</template>

<script>
import { getAlarmList,startAlarm,getEmailList } from "@/util/api"
import errcode from "@/util/errcode"
import contentHead from "@/components/contentHead";
import emailAlarmTypeDetail from "./dialog/emailAlarmTypeDetail"
import emailAlarmDetail from "./dialog/emailAlarmDetail"
export default {
    name: "emailAlarmType",
    components: {
        "v-content-head": contentHead,
        "emailAlarmType-detail": emailAlarmTypeDetail,
        "emailAlarm-detail": emailAlarmDetail
    },
    data: function(){
        return {
            alarmList: [],
            loading: false,
            emailAlarmTypeShow: false,
            emailAlarmTypeData: null,
            buttonText: "启动",
            emailAlarmShow: false,
            emailAlarmData: null
        }
    },
    mounted: function(){
        this.getAlarms()
    },
    methods: {
        getAlarms: function(){
            this.loading = true
            getAlarmList().then(res => {
                this.loading = false
                if(res.data && res.data.code === 0){
                    this.alarmList = res.data.data
                }else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.$message({
                        type: "error",
                        message: "系统错误！"
                    });
                });
        },
        handleClick: function(row){
            this.emailAlarmTypeData = row;
            this.emailAlarmTypeShow = true
        },
        changGroup: function(){

        },
        emailAlarmTypeClose: function(){
            this.emailAlarmTypeShow = false;
            this.getAlarms()
        },
        emailAlarmClose: function(){
            this.emailAlarmShow = false
        },
        link: function(row){
            this.emailAlarmData = row
            this.emailAlarmShow = true
        },
        startUp: function(row){
            if(!row.enable && row.userList){
                this.$confirm('启用告警, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.start(row,1)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
            }else if(row.userList){
                this.$confirm('禁用告警, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.start(row,0)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
            }else{
                this.$message({
                        type: 'info',
                        message: '请添加接收邮箱！'
                    }); 
            }
            
        },
        start: function(row,index){
            getEmailList().then(res => {
                if(res.data && res.data.code === 0){
                    if(res.data.data && res.data.data.length && res.data.data[0].status) {
                        this.startUpAlarm(row,index)
                    }else{
                        this.$message({
                            type: "error",
                            message: "告警邮箱未设置！"
                        });
                    }
                }else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
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
        startUpAlarm: function(row,index){
            let data = {
                ruleId: row.ruleId,
                enable: index
            }
            startAlarm(data).then(res => {
                if(res.data &&res.data.code === 0){
                    if(!index){
                        this.$message({
                            type: "success",
                            message: "禁用告警成功！"
                        });
                        this.buttonText = '启动'
                    }else{
                         this.$message({
                            type: "success",
                            message: "启用告警成功！"
                        });
                        this.buttonText = '关闭'
                    }
                    this.getAlarms();
                }else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "系统错误！"
                    });
                });
        }
    },
    filters: {
        Type: function(value){
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