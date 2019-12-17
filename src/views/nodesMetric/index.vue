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
    <div>
        <v-content-head :headTitle="$t('title.systemMonitor')" :headSubTitle="$t('title.nodesMonitor')" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper">
            <div class="search-nodes-list">
                <div class="serch-nodes">
                    <span>{{$t('monitor.node')}}</span>
                    <el-select v-model="nodeId" @change="changeNodes" style="width: 220px;">
                        <el-option v-for="item in nodesOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="more-search-table" style="padding-top:10px;">
                <div class="search-item">
                    <span>{{$t('monitor.showDate')}}</span>
                    <el-date-picker v-model="currentDate" type="date" :placeholder="$t('monitor.selectDate')" :picker-options="pickerOption" 
                   :format="$t('monitor.dateLabel')" :value-format="$t('monitor.dateFormat')" :default-value="`${Date()}`" class=" select-32" @change="changeCurrentDate">
                    </el-date-picker>
                </div>
                <div class="search-item">
                    <span>{{$t('monitor.contrastDate')}}</span>
                    <el-date-picker v-model="contrastDate" type="date" :placeholder="$t('monitor.selectDate')" :picker-options="pickerOption" 
                    :format="$t('monitor.dateLabel')" :value-format="$t('monitor.dateFormat')" class=" select-32" @change="changeContrastDate">
                    </el-date-picker>
                </div>
                <div class="search-item">
                    <span>{{$t('monitor.startEndTime')}}</span>
                    <el-time-picker is-range v-model="startEndTime" 
                    :range-separator="$t('system.to')" :start-placeholder="$t('monitor.startTime')" 
                    :end-placeholder="$t('monitor.endTime')" :placeholder="$t('monitor.timeRange')" class="time-select-32">
                    </el-time-picker>
                </div>
                <div class="search-item">
                    <span>{{$t('monitor.dataGranularity')}}</span>
                    <el-radio-group v-model="timeGranularity">
                        <el-radio :label="60">5{{$t('monitor.minute')}}</el-radio>
                        <el-radio :label="12">1{{$t('monitor.minute')}}</el-radio>
                        <el-radio :label="1">5{{$t('monitor.second')}}</el-radio>
                    </el-radio-group>
                    <el-button type="primary" @click="confirmParam()" size="small" style="margin-left: 12px;" :loading="sureing">{{$t('monitor.confirm')}}</el-button>
                </div>
            </div>
            <div class="metric-content">
                <div class="metric-split-line"></div>
                <el-row v-loading="loadingInit">
                    <template v-for="item in nodesHealthData">
                        <el-col :xs='24' :sm="24" :md="24" :lg="12" :xl="12">
                            <v-metric-chart :chartOption="item" :reload="nodesReloadNum" v-loading="loading" :metricName="'nodes'"></v-metric-chart>
                        </el-col>
                    </template>
                </el-row>
            </div>
        </div>

    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import metricChart from "@/components/metricChart";
import { metricInfo, nodesHealth, getFronts } from "@/util/api";
import { format, numberFormat,formatData } from "@/util/util.js";
import errcode from "@/util/errcode";
import Bus from "@/bus"
export default {
    name: "nodesMetric",
    components: {
        "v-content-head": contentHead,
        "v-metric-chart": metricChart
    },

    data() {
        return {
            sureing: false,
            loading: false,
            loadingInit: false,
            currentDate: format(new Date().getTime(), "yyyy-MM-dd"),
            contrastDate: null,
            startEndTime: [
                new Date(formatData()),
                new Date()
            ],
            timeGranularity: 60,
            pickerOption: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;
                }
            },
            chartParam: {
                gap: 60,
                beginDate: `${format(
                    new Date().getTime(),
                    "yyyy-MM-dd"
                )}T${format(
                    new Date(formatData()).getTime(),
                    "HH:mm:ss"
                )}`,
                endDate: `${format(
                    new Date().getTime(),
                    "yyyy-MM-dd"
                )}T${format(new Date().getTime(), "HH:mm:ss")}`,
                contrastBeginDate: "",
                contrastEndDate: "",
                groupId: localStorage.getItem('groupId') ? localStorage.getItem('groupId') : '1'
            },
            nodesReloadNum: 1,
            nodesHealthData: [],
            nodesOptions: [],
            nodeId: this.$root.$route.query.nodeId || ""
        };
    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
        Bus.$off("chooselanguage")
    },
    mounted() {
        this.getFrontTable();
        Bus.$on("changeGroup", data => {
            this.changGroup()
        })
        Bus.$on("chooselanguage", data => {
            this.changGroup()
        })
    },
    methods: {
        changGroup(){
            this.getFrontTable()
        },
        changeNodes() {
            this.confirmParam();
        },
        getFrontTable() {
            let data = {
                groupId: localStorage.getItem("groupId")
            }
            getFronts(data)
                .then(res => {
                    if (res.data.code === 0) {
                        if (res.data.totalCount != 0) {
                            this.nodesOptions = res.data.data.map(item => {
                                return {
                                    value: item.frontId,
                                    label: item.frontIp
                                };
                            });
                            if (this.nodeId) {
                                this.confirmParam();
                            } else {
                                this.nodeId = this.nodesOptions[0]["value"];
                                this.confirmParam();
                            }
                        } else {
                            this.$message({
                                message: this.$t('monitor.addFrontInfo'),
                                type: "error",
                                duration: 2500
                            });
                        }
                    } else {
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
        changeCurrentDate($event) {
            this.startEndTime = [
                new Date(formatData()),
                new Date()
            ];
        },
        changeContrastDate($event) {},
        getHealthData() {
            if (this.nodesReloadNum === 1) {
                this.loadingInit = true;
            }
            this.loading = true;
            this.sureing = true;
            var reqData = {
                    nodeId: this.nodeId
                },
                reqQurey = {};
            reqQurey = this.chartParam;
            nodesHealth(reqData, reqQurey)
                .then(res => {
                    this.loading = false;
                    this.sureing = false;
                    this.loadingInit = false;
                    if (res.data.code === 0) {
                        var data = res.data.data || [];
                            if (
                                data[0]["data"]["lineDataList"]["timestampList"]
                                    .length > 0
                            ) {
                                var timestampList =
                                    data[0]["data"]["lineDataList"][
                                        "timestampList"
                                    ] || [];
                            } else {
                                var timestampList =
                                    data[0]["data"]["contrastDataList"][
                                        "timestampList"
                                    ] || [];
                            }
                            this.nodesHealthData = data;
                            this.nodesHealthData.forEach(item => {
                                if (item.metricType === "blockHeight") {
                                    item.metricName = this.$t('monitor.blockHeight');
                                } else if (item.metricType === "pbftView") {
                                    item.metricName = "pbftView";
                                } else if (item.metricType === "pendingCount") {
                                    item.metricName = this.$t('monitor.pendingCount');
                                }
                                if(this.chartParam.contrastBeginDate){
                                    item.data.contrastDataList.contractDataShow = true
                                }else{
                                    item.data.contrastDataList.contractDataShow = false
                                }
                                item.data.contrastDataList.timestampList = timestampList;
                                item.data.lineDataList.timestampList = timestampList;
                            });
                            this.nodesReloadNum++;
                    } else {
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
        confirmParam() {
            this.timeParam();
            this.getHealthData();
        },
        timeParam() {
            let initStartTime = format(
                    new Date(this.startEndTime[0]).getTime(),
                    "HH:mm:ss"
                ),
                initEndTime = format(
                    new Date(this.startEndTime[1]).getTime(),
                    "HH:mm:ss"
                );
            if (this.currentDate) {
                this.beginDate = `${this.currentDate}T${initStartTime}`;
                this.endDate = `${this.currentDate}T${initEndTime}`;
            }
            if (this.currentDate && this.contrastDate) {
                this.beginDate = `${this.currentDate}T${initStartTime}`;
                this.endDate = `${this.currentDate}T${initEndTime}`;
                this.contrastBeginDate = `${this
                    .contrastDate}T${initStartTime}`;
                this.contrastEndDate = `${this.contrastDate}T${initEndTime}`;
            }
            if (!this.contrastDate) {
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
            this.chartParam.groupId = localStorage.getItem('groupId') ? localStorage.getItem('groupId') : '1';
        }
    }
};
</script>
<style scoped>
.serch-nodes {
    display: inline-block;
    margin-left: 58px;
    margin-top: 29px;
}
.serch-nodes > span {
    margin-right: 5px;
}
.serch-nodes /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
}
.serch-nodes /deep/ .el-input__icon {
    line-height: 32px;
}
.search-item {
    display: inline-block;
    margin-bottom: 8px;
    margin-right: 12px;
}
.search-item > span {
    margin-right: 5px;
}
.metric-content {
    min-height: 700px;
}
.metric-split-line {
    margin: 0 30px;
    border-top: 2px dashed #f6f6f6;
}
</style>
