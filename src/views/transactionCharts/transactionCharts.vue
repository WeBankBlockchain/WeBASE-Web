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
        <v-content-head :headTitle="$t('title.transactionAudit')" :headSubTitle="headSubTitle" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper">
            <div class="more-search-table search-min-width">
                <div class="text-left">
                    <div class="text-left-label">
                        <span>{{this.$t('contracts.user')}}：</span>
                        <el-select v-model="userName" @change="changeUserName" class="select-32" clearable>
                            <el-option v-for="item in userList" :key="item.userName" :label="item.userName" :value="item.userName">
                                <span v-if="item.userType==0">{{item.userName}}</span>
                                <span v-else class="font-color-ed5454">{{item.userName}}</span>
                            </el-option>
                        </el-select>
                    </div>
                    <div class="text-left-label">
                        <span class="text-left-label-title">{{this.$t('transaction.time')}}：</span>
                        <el-date-picker @change="changeDate" v-model="transDate" type="datetimerange" :picker-options="transPickerOptions" 
                        :range-separator="$t('system.to')" :start-placeholder="$t('transaction.startTime')" :end-placeholder="$t('transaction.endTime')" align="left" value-format="yyyy-MM-dd HH:mm:ss" class="date-select-32">
                        </el-date-picker>
                    </div>
                    <div class="text-left-label1">
                        <span class="text-left-label1-title">{{this.$t('transaction.interface')}}：</span>
                        <el-select v-model="interfaceName" @change="changeInterfaceName" class="select-32" clearable>
                            <el-option v-for="item in interfaceList" :key="item.interfaceName" :label="item.interfaceName" :value="item.interfaceName">
                                <span v-if="item.transUnusualType==0">{{item.interfaceName}}</span>
                                <span v-else class="font-color-ed5454">{{item.interfaceName}}</span>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="divide-line"></div>
            </div>

            <div class="chart" ref="chart">
                <v-chart ref="linechart" :id="'transId'" v-if="chartStatistics.show" :chartStatistics="chartStatistics" v-bind:reload="reloadNum"   v-loading="loading"></v-chart>
            </div>
        </div>
    </div>
</template>

<script>
import charts from "./components/chart";
import contentHead from "@/components/contentHead";
import { format, completionDateData } from "@/util/util";
import {
    monitorUserList,
    monitorUserInterfaceList,
    monitorTransactionInfo
} from "@/util/api";
export default {
    name: "transactionCharts",
    components: {
        "v-content-head": contentHead,
        "v-chart": charts
    },
    data() {
        return {
            loading: false,
            groupId: localStorage.getItem("groupId"),
            reloadNum: 1,
            chartStatistics: {
                show: true,
                data: [],
                transactionDataArr: [],
                chartSize: {
                    width: 0,
                    height: 0
                },
                totalCount: ""
            },
            userList: [],
            interfaceList: [],
            userName: "",
            interfaceName: "",
            transDate: [],
        }
    },
    computed: {
        transPickerOptions() {
            let data = {
                shortcuts: [
                    {
                        text: this.$t('transaction.week'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            let startTime = start.getTime();
                            start.setTime(startTime - 3600 * 1000 * 24 * 7);
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: this.$t('transaction.month'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            let startTime = start.getTime();
                            start.setTime(startTime - 3600 * 1000 * 24 * 30);
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: this.$t('transaction.threeMonth'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            let startTime = start.getTime();
                            start.setTime(startTime - 3600 * 1000 * 24 * 90);
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ],
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;
                }
            }
            return data
        },
        headSubTitle() {
            let data = this.$t('title.userTransaction');
            return data
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.chartStatistics.chartSize.width = this.$refs.chart.offsetWidth;
            this.chartStatistics.chartSize.height = this.$refs.chart.offsetHeight;
            this.getMonitorTransactionInfo();
            this.getMonitorUserList();
        });
    },
    methods: {
        changGroup(val){
            this.groupId = val
            this.userName = ""
            this.$nextTick(() => {
                this.chartStatistics.chartSize.width = this.$refs.chart.offsetWidth;
                this.chartStatistics.chartSize.height = this.$refs.chart.offsetHeight;
                this.getMonitorTransactionInfo();
                this.getMonitorUserList();
            });
        },
        getMonitorTransactionInfo() {
            this.loading = true
            let reqData = {
                    groupId: this.groupId
                },
                reqQurey = {};
            reqQurey = {
                userName: this.userName,
                interfaceName: this.interfaceName
            };
            if (this.transDate) {
                reqQurey.startDate = this.transDate[0];
                reqQurey.endDate = this.transDate[1];
            }
            monitorTransactionInfo(reqData, reqQurey)
                .then(res => {
                    this.loading = false;
                    if (res.data.code == 0) {
                        let transInfoList = res.data.data.transInfoList;
                        var len = transInfoList.length;
                        if (len === 0) {
                            this.$set(this.chartStatistics, "data", []);
                            this.$set(
                                this.chartStatistics,
                                "transactionDataArr",
                                []
                            );
                            this.$set(this.chartStatistics, "totalCount", 0);
                        } else {
                            var startDate = format(
                                    new Date(
                                        transInfoList[0]["time"]
                                    ).getTime(),
                                    "yyyy-MM-dd"
                                ),
                                endDate = format(
                                    new Date(
                                        transInfoList[len - 1]["time"]
                                    ).getTime(),
                                    "yyyy-MM-dd"
                                );

                            transInfoList.forEach(item => {
                                item.time = format(
                                    new Date(item.time).getTime(),
                                    "MM-dd"
                                );
                            });
                            var productSenceMap = {};
                            transInfoList.forEach(item => {
                                var transCount = productSenceMap[item.time];
                                if (!transCount) {
                                    transCount = item.transCount;
                                } else {
                                    transCount = transCount + item.transCount;
                                }
                                productSenceMap[item.time] = transCount;
                            });
                            var arr = [],
                                obj = {};

                            for (var key in productSenceMap) {
                                obj = {
                                    transCount: productSenceMap[key],
                                    time: key
                                };
                                arr.push(obj);
                            }
                            arr = completionDateData(startDate, endDate, arr);
                            let dateList = arr.map(item => {
                                return item.time;
                            });
                            let transactionData = arr.map(item => {
                                return item.transCount;
                            });
                            this.$set(this.chartStatistics, "data", dateList);
                            this.$set(
                                this.chartStatistics,
                                "transactionDataArr",
                                transactionData
                            );
                            this.$set(
                                this.chartStatistics,
                                "totalCount",
                                res.data.data.totalCount
                            );
                        }
                        this.reloadNum++;
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
                    this.$message.closeAll()
                });
        },
        getMonitorUserList() {
            let reqData = {
                groupId: this.groupId
            };
            monitorUserList(reqData, {})
                .then(res => {
                    if (res.data.code == 0) {
                        this.userList = res.data.data;
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                        this.$message.closeAll()
                    }
                })
                .catch(err => {
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                    this.$message.closeAll()
                });
        },
        getMonitorUserInterfaceList(val) {
            let reqData = {
                    groupId: this.groupId
                },
                reqQurey = {};
            reqQurey = {
                userName: val
            };
            monitorUserInterfaceList(reqData, reqQurey)
                .then(res => {
                    if (res.data.code == 0) {
                        this.interfaceList = res.data.data;
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
                    this.$message.closeAll()
                });
        },
        changeUserName(val) {
            this.getMonitorUserInterfaceList(val);
            this.getMonitorTransactionInfo();
        },
        changeDate() {
            this.getMonitorTransactionInfo();
        },
        changeInterfaceName() {
            this.getMonitorTransactionInfo();
        }
    }
};
</script>

<style scoped>
.divide-line {
    border: 1px solid #e7ebf0;
    margin-top: 30px;
}
.text-left-label {
    display: inline;
}
.text-left-label1 {
    display: inline;
}
.text-left-label-title {
    margin-left: 50px;
}
.text-left-label1-title {
    margin-left: 50px;
}
@media only screen and (max-width: 1240px) {
    .text-left-label1 {
        display: block;
        padding: 5px 0;
    }
    .text-left-label1-title {
        margin-left: 0;
    }
}
@media only screen and (max-width: 1000px) {
    .text-left-label {
        display: block;
        padding: 5px 0;
    }
    .text-left-label-title {
        margin-left: 0;
    }
    .text-left-label1 {
        display: block;
        padding: 5px 0;
    }
    .text-left-label1-title {
        margin-left: 0;
    }
}
</style>
