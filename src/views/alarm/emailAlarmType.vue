<template>
    <div>
        <v-content-head :headTitle="'告警配置'" :headSubTitle="'邮件告警配置'" @changGroup="changGroup" :headTooltip="`系统配置管理说明：系统配置可以配置系统属性值（目前支持tx_count_limit和tx_gas_limit属性的设置）。`"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 20px 29px;">
            <div style="padding-bottom: 10px;">
                <span>是否启用告警</span>
                <el-switch
                    v-model="enable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                     @change='authChange($event)'>
                </el-switch>
            </div>
            <h3>告警配置列表</h3>
            <el-table :data="alarmList" tooltip-effect="dark" v-loading="loading" class="search-table-content" style="padding-bottom: 20px;">
                <el-table-column label="告警邮件标题"  show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span @click="link(scope.row)" class="link">{{scope.row.ruleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="邮件模板" prop='alertContent' show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="发送间隔时间" prop='alertIntervalSeconds' show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.alertIntervalSeconds | Second}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                        <el-button v-if='scope.row.enable' type="text" size="small" @click='startUp(scope.row)'>禁用</el-button>
                        <el-button v-if='!scope.row.enable' type="text" size="small" @click='startUp(scope.row)'>启用</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="module-wrapper" style="padding: 30px 29px 20px 29px;">
            <h3>告警日志列表</h3>
            <el-table :data="alarmLogList" tooltip-effect="dark"  class="search-table-content" style="padding-bottom: 20px;">
                <el-table-column label="告警类型" prop='alertType' show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.alertType | Type}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="告警级别" prop='alertLevel' show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span v-if='scope.row.alertLevel == 1' style="color: #f00">高</span>
                        <span v-if='scope.row.alertLevel == 2' style="color: #ffd700">一般</span>
                        <span v-if='scope.row.alertLevel == 3'>低</span>
                    </template>
                </el-table-column>
                <el-table-column label="告警内容" prop='alertContent' show-overflow-tooltip align="center"></el-table-column>
                 <el-table-column label="告警状态" prop='status' show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span v-if='scope.row.status' style="color: #3CB371">已处理</span>
                        <span v-else style="color: #f00">未处理</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="告警备注" prop='description' show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="创建时间" prop='createTime' show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="修改时间" prop='modifyTime' show-overflow-tooltip align="center"></el-table-column> -->
                <el-table-column label="操作" fixed="right" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <el-button v-if='scope.row.status' @click="handle(scope.row)" type="text" size="small" disabled>确认</el-button>
                        <el-button v-else @click="handle(scope.row)" type="text" size="small">确认</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout=" sizes, prev, pager, next, jumper" :total="total">
             </el-pagination>
        </div>
        <emailAlarmType-detail :show='emailAlarmTypeShow' v-if='emailAlarmTypeShow' :data="emailAlarmTypeData" @close='emailAlarmTypeClose'></emailAlarmType-detail>
        <emailAlarm-detail :show='emailAlarmShow' v-if='emailAlarmShow' :data='emailAlarmData' @close='emailAlarmClose'></emailAlarm-detail>
    </div>
</template>

<script>
import { getAlarmList,startAlarm,getEmailList,changeEmailConfig,getAlarmLogs,changeAlarmLog } from "@/util/api"
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
            emailAlarmData: null,
            enable: null,
            emailData: null,
            alarmLogList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0
        }
    },
    mounted: function(){
        this.getAlarms();
        this.getEmailConfig();
        this.getAlarmLogList()
    },
    methods: {
        handle: function(row){
            this.$confirm('确定处理?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.uploadAlarmLog(row)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
        },
        uploadAlarmLog: function(row){
            let data = {
                logId: row.logId,
                status: 1
            }
            changeAlarmLog(data).then(res => {
                if(res.data.code === 0){
                    this.$message({
                        type: "success",
                        message: "该日志已确认"
                    });
                    this.getAlarmLogList()
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
        getAlarmLogList: function(){
            let data = {
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            }
            getAlarmLogs(data,{}).then(res => {
                if(res.data.code === 0){
                    this.alarmLogList = res.data.data;
                    this.total = res.data.totalCount
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
        getEmailConfig: function(){
            getEmailList().then(res => {
                if(res.data && res.data.code === 0){
                    if(res.data.data.length) {
                        this.emailData = res.data.data[0];
                        this.enable = this.emailData.enable
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
        authChange: function(val){
            let data = {
                serverId: this.emailData.serverId,
                enable: val
            }
            changeEmailConfig(data).then(res => {
                if(res.data && res.data.code === 0){
                    this.$message({
                        type: "success",
                        message: "修改告警邮箱配置成功！"
                    });
                    this.getEmailConfig();
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
                    if(res.data.data && res.data.data.length && res.data.data[0].enable) {
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
        },
        handleSizeChange: function(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getAlarmLogList();
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            this.getAlarmLogList();
        },
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
        },
        Second: function(value){
            if(value > 1799) {
                return (value/3600) + "小时"
            }else {
                return (value/60) + "分钟"
            }
        }
    }
}
</script>

<style>

</style>