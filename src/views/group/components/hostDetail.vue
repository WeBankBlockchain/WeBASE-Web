/*
 * Copyright 2014-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
<template>
    <div class="module-wrapper" v-loading="loading">
        <div class="more-search-table">
            <div class="search-item">
                <span>显示日期</span>
                <el-date-picker v-model="currentDate" type="date" placeholder="选择日期" :picker-options="pickerOption" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :default-value="`${Date()}`" class=" select-32" @change="changeCurrentDate">
                </el-date-picker>
            </div>
            <div class="search-item">
                <span>对比日期</span>
                <el-date-picker v-model="contrastDate" type="date" placeholder="选择日期" :picker-options="pickerOption" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" class=" select-32" @change="changeContrastDate">
                </el-date-picker>
            </div>
            <div class="search-item">
                <span>起止时间</span>
                <el-time-picker is-range v-model="startEndTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" class="time-select-32" value-format="HH:mm:ss">
                </el-time-picker>
            </div>
            <div class="search-item">
                <span>数据粒度</span>
                <el-radio-group v-model="timeGranularity">
                    <el-radio :label="1">5秒钟</el-radio>
                    <el-radio :label="12">1分钟</el-radio>
                    <el-radio :label="60">5分钟</el-radio>
                </el-radio-group>
                <el-button type="primary" @click="confirmParam" size="small" style="margin-left: 12px;" :loading="sureing">确认</el-button>
            </div>
        </div>
        <el-row>
            <template v-for="item in metricData">
                <el-col :xs='24' :sm="24" :md="24" :lg="12" :xl="12">
                    <v-metric-chart :chartOption="item" :reload="reloadNum"></v-metric-chart>
                </el-col>
            </template>
        </el-row>
    </div>
</template>

<script>
import metricChart from "./components/metricChart";
import { metricInfo, nodesHostInfo } from "@/util/api";
import { format, numberFormat } from "@/util/util.js";
export default {
    name: "hostDetail",
    props: {
        nodeIp: {
            type: String
        },
        nodeId: {
            type: Number
        }
    },
    components: {
        "v-metric-chart": metricChart
    },
    watch: {
        nodeIp: function() {
            this.getNodeIpDetail();
        }
    },
    data() {
        return {
            loading: false,
            sureing: false,
            currentDate: null,
            contrastDate: null,
            startEndTime: null,
            beginDate: "",
            endDate: "",
            contrastBeginDate: "",
            contrastEndDate: "",
            timeGranularity: 1,
            chartType: "",
            reloadNum: 1,
            colNum: 12,
            chartParam: {
                gap: 1,
                beginDate: "",
                endDate: "",
                contrastBeginDate: "",
                contrastEndDate: ""
            },
            chartTypeList: [
                {
                    type: "cpu",
                    name: "cpu"
                },
                {
                    type: "ram",
                    name: "ram"
                },
                {
                    type: "hd",
                    name: "硬盘"
                }
            ],
            pickerOption: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;
                }
            },
            metricData: [],
            hostInfo: []
        };
    },
    mounted() {
        this.getChartData();
    },
    methods: {
        getNodesHostData() {
            var reqData = {
                nodeId: this.nodeId
            };
            nodesHostInfo(reqData, {})
                .then(res => {
                    if (res.data.code === 0) {
                        var obj = {},
                            alasObj = {};
                        obj = res.data.data;
                        let {
                            cpuAmount,
                            cpuSize,
                            memoryTotalSize,
                            memoryUsedSize,
                            diskTotalSize,
                            diskUsedSize
                        } = obj;
                        alasObj = {
                            cpuAmount: cpuAmount,
                            cpuSize: cpuSize,
                            memoryTotalSize: memoryTotalSize,
                            memoryUsedSize: memoryUsedSize,
                            diskTotalSize: diskTotalSize,
                            diskUsedSize: diskUsedSize
                        };
                        for (let key in alasObj) {
                            if (key === "memoryTotalSize") {
                                this.hostInfo.push({
                                    name: "内存总容量",
                                    val: `${alasObj[key]}kb`
                                });
                            } else if (key === "memoryUsedSize") {
                                this.hostInfo.push({
                                    name: "内存使用量",
                                    val: `${alasObj[key]}kb`
                                });
                            } else if (key === "diskTotalSize") {
                                this.hostInfo.push({
                                    name: "硬盘总容量",
                                    val: `${alasObj[key]}kb`
                                });
                            } else if (key === "diskUsedSize") {
                                this.hostInfo.push({
                                    name: "硬盘使用量",
                                    val: `${alasObj[key]}kb`
                                });
                            } else if (key === "cpuAmount") {
                                this.hostInfo.push({
                                    name: "CPU",
                                    val: `${alasObj[key]}核`
                                });
                            } else if (key === "cpuSize") {
                                this.hostInfo.push({
                                    name: "CPU容量",
                                    val: `${alasObj[key]}Mhz`
                                });
                            }
                        }
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message:
                            this.errcode.errCode[err.data.code].cn || "系统错误"
                    });
                });
        },
        getChartData() {
            this.loading = true;
            this.sureing = true;
            var reqData = {
                    nodeId: this.nodeId
                },
                reqQurey = {};
            reqQurey = this.chartParam;
            metricInfo(reqData, reqQurey)
                .then(res => {
                    this.loading = false;
                    this.sureing = false;
                    if (res.data.code === 0) {
                        var data = res.data.data;
                        if (data[0]["data"]["lineDataList"]["timestampList"].length > 0) {
                            var timestampList = data[0]["data"]["lineDataList"]["timestampList"] || [];
                        } else {
                            var timestampList = data[0]["data"]["contrastDataList"]["timestampList"] || [];
                        }
                        this.metricData = data;
                        this.metricData.forEach(item => {
                            item.gap = this.timeGranularity;
                            if (item.metricType === "cpu") {
                                item.metricName = "cpu";
                                item.metricUint = "利用率";
                                item.metricU = "%";
                            } else if (item.metricType === "memory") {
                                item.metricName = "内存";
                                item.metricUint = "利用率";
                                item.metricU = "%";
                            } else if (item.metricType === "disk") {
                                item.metricName = "硬盘";
                                item.metricUint = "利用率";
                                item.metricU = "%";
                            } else if (item.metricType === "txbps") {
                                item.metricName = "上行";
                                item.metricUint = "带宽";
                                item.metricU = "KB/s";
                            } else if (item.metricType === "rxbps") {
                                item.metricName = "下行";
                                item.metricUint = "带宽";
                                item.metricU = "KB/s";
                            }
                            item.data.contrastDataList.timestampList = timestampList;
                            item.data.lineDataList.timestampList = timestampList;
                        });
                        this.reloadNum++;
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message:this.errcode.errCode[err.data.code].cn || "系统错误"
                    });
                });
        },
        changeCurrentDate($event) {
            var nowTime = format(new Date().getTime(), "HH:mm:ss");
            this.startEndTime = ["00:00:00", nowTime];
        },
        changeContrastDate($event) {
        },
        confirmParam() {
            if(!this.startEndTime || !this.currentDate){
                this.$message({
                    type: "error",
                    message: '请选择显示日期和时间'
                });
                return 
            }
            if(!this.contrastDate && !this.startEndTime){
                this.$message({
                    type: "error",
                    message: '请选择显示日期和时间'
                });
                return
            }
            let initStartTime = this.startEndTime[0],
                initEndTime = this.startEndTime[1];
            if (this.currentDate) {
                this.beginDate = `${this.currentDate}T${initStartTime}`;
                this.endDate = `${this.currentDate}T${initEndTime}`;
            }
            if (this.currentDate && this.contrastDate) {
                this.beginDate = `${this.currentDate}T${initStartTime}`;
                this.endDate = `${this.currentDate}T${initEndTime}`;
                this.contrastBeginDate = `${this.contrastDate}T${initStartTime}`;
                this.contrastEndDate = `${this.contrastDate}T${initEndTime}`;
            }
            if(!this.contrastDate){
                this.beginDate = `${this.currentDate}T${initStartTime}`;
                this.endDate = `${this.currentDate}T${initEndTime}`;
                this.contrastBeginDate = "";
                this.contrastEndDate = "";
            }
            this.chartParam.beginDate = this.beginDate;
            this.chartParam.endDate = this.endDate;
            this.chartParam.contrastBeginDate = this.contrastBeginDate;
            this.chartParam.contrastEndDate = this.contrastEndDate;
            this.chartParam.gap = this.timeGranularity;
            this.getChartData();
        }
    }
};
</script>

<style scoped>
.search-item {
    display: inline-block;
    margin-bottom: 8px;
    margin-right: 12px;
}
.search-item > span {
    margin-right: 5px;
}
.more-search-table>>>.el-radio + .el-radio {
    margin-left: 10px;
}
</style>
