<template>
    <div>
        <v-content-head :headTitle="$t('alarm.alarmCofig')" :headSubTitle="$t('alarm.alarmTypeConfig')" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 20px 29px;">
            <div style="padding-bottom: 10px;">
                <span>{{$t('alarm.enableAlarm')}}</span>
                <el-switch
                    v-model="enable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                     @change='authChange($event)'>
                </el-switch>
            </div>
            <h3>{{$t('alarm.alarmCofigList')}}</h3>
            <el-table :data="alarmList" tooltip-effect="dark" v-loading="loading" class="search-table-content" style="padding-bottom: 20px;">
                <el-table-column :label="$t('alarm.alarmEmailTile')"  show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span @click="link(scope.row)" class="link">{{scope.row.ruleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('alarm.emailContent')" prop='alertContent' show-overflow-tooltip align="center"></el-table-column>
                <el-table-column :label="$t('alarm.sendTime')" prop='alertIntervalSeconds' show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span v-if='scope.row.alertIntervalSeconds > 1799'>{{scope.row.alertIntervalSeconds/3600}}{{$t("alarm.hours")}}</span>
                        <span v-else>{{scope.row.alertIntervalSeconds/60}}{{$t("alarm.minute")}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('alarm.operation')" fixed="right" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">{{$t('alarm.update')}}</el-button>
                        <el-button v-if='scope.row.enable' type="text" size="small" @click='startUp(scope.row)'>{{$t('alarm.disable')}}</el-button>
                        <el-button v-if='!scope.row.enable' type="text" size="small" @click='startUp(scope.row)'>{{$t('alarm.enable')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="module-wrapper" style="padding: 30px 29px 20px 29px;">
            <h3>{{$t('alarm.alarmLogList')}}</h3>
            <el-table :data="alarmLogList" tooltip-effect="dark"  class="search-table-content" style="padding-bottom: 20px;">
                <el-table-column :label="$t('alarm.alarmType')" prop='alertType' show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span v-if='scope.row.alertType == 1'>{{$t('alarm.nodeAlarm')}}</span>
                        <span v-if='scope.row.alertType == 2'>{{$t('alarm.auditAlert')}}</span>
                        <span v-if='scope.row.alertType == 3'>{{$t('alarm.certAlert')}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('alarm.alarmLevel')" prop='alertLevel' show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span v-if='scope.row.alertLevel == 1' style="color: #f00">{{$t('alarm.high')}}</span>
                        <span v-if='scope.row.alertLevel == 2' style="color: #ffd700">{{$t('alarm.common')}}</span>
                        <span v-if='scope.row.alertLevel == 3'>{{$t('alarm.low')}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('alarm.alarmContent')" prop='alertContent' show-overflow-tooltip align="center" width="400"></el-table-column>
                 <el-table-column :label="$t('alarm.alarmStatus')" prop='status' show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span v-if='scope.row.status' style="color: #3CB371">{{$t('alarm.processed')}}</span>
                        <span v-else style="color: #f00">{{$t('alarm.unprocessed')}}</span>
                    </template>
                </el-table-column>
                 <el-table-column :label="$t('alarm.alarmTime')" prop='createTime' show-overflow-tooltip align="center"></el-table-column>
                <el-table-column :label="$t('alarm.modifyTime')" prop='modifyTime' show-overflow-tooltip align="center"></el-table-column>
                <el-table-column :label="$t('alarm.operation')" fixed="right" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <el-button v-if='scope.row.status' @click="handle(scope.row)" type="text" size="small" disabled>{{$t('alarm.confirm')}}</el-button>
                        <el-button v-else @click="handle(scope.row)" type="text" size="small">{{$t('alarm.confirm')}}</el-button>
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
            buttonText: this.$t('alarm.start'),
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
            this.$confirm(this.$t('alarm.sureHandle'), this.$t('alarm.tip'), {
                    confirmButtonText: this.$t('alarm.sure'),
                    cancelButtonText: this.$t('alarm.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.uploadAlarmLog(row)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t("alarm.cancelEnter")
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
                        message: this.$t('alarm.logsSure')
                    });
                    this.getAlarmLogList()
                }else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
            .catch(err => {
                this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
            .catch(err => {
                this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
                        message: this.$t('alarm.updateEmailAlarmConfigSuccess')
                    });
                    this.getEmailConfig();
                }else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
                this.$confirm(this.$t('alarm.enableAlarm'), this.$t('alarm.tip'), {
                    confirmButtonText: this.$t('alarm.sure'),
                    cancelButtonText: this.$t('alarm.cnacel'),
                    type: 'warning'
                }).then(() => {
                    this.start(row,1)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t("alarm.cancelEnter")
                    });          
                });
            }else if(row.userList){
                this.$confirm(this.$t("alarm.disableAlarm"), this.$t('alarm.tip'), {
                    confirmButtonText: this.$t('alarm.sure'),
                    cancelButtonText: this.$t('alarm.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.start(row,0)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t("alarm.cancelEnter")
                    });          
                });
            }else{
                this.$message({
                        type: 'info',
                        message: this.$t("alarm.addEmail")
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
                            message: this.$t("alarm.noAlarmEmail")
                        });
                    }
                }else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
                            message: this.$t("alarm.disableAlarmSuccess")
                        });
                        this.buttonText = this.$t("alarm.start")
                    }else{
                         this.$message({
                            type: "success",
                            message: this.$t("alarm.enableAlarmSuccess")
                        });
                        this.buttonText = this.$t("alarm.cancel")
                    }
                    this.getAlarms();
                }else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
}
</script>

<style>

</style>