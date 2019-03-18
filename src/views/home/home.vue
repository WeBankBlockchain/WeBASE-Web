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
    <div class="over-view-wrapper">
        <v-content-head :headTitle="'区块链概览'"></v-content-head>
        <div class="module-wrapper">
            <ul class="part1-content">
                <li class="part1-details" v-for="(item, index) in detailsList" :style="{'padding-top':index>2?'0':'' }">
                    <div>
                        <a v-if="item.name === 'latestBlock'|| item.name === 'transactionCount'" class="font-16 cursor-pointer" @click="goDetailRouter(item)">{{item.value}}个</a>
                        <span v-else class="font-16">{{item.value}}个</span>
                    </div>
                    <div>
                        <span class="font-12">{{item.label}}</span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="module-wrapper">
            <div class="part2-title">
                <span class="part2-title-left">关键监控指标</span>
                <span class="part2-title-right">最近有交易的7天交易量</span>
            </div>
            <div class="chart" ref="chart">
                <v-chart ref="linechart" :id="'homeId'" v-if="chartStatistics.show" :data="chartStatistics.date" :transactionDataArr="chartStatistics.dataArr" :size="chartStatistics.chartSize"></v-chart>
            </div>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import charts from "./components/chart";
import { getChartData, getNetworkStatistics } from "@/util/api";
import { changWeek } from "@/util/util";
import router from "@/router";
import errcode from "@/util/errcode";

export default {
    name: "home",
    components: {
        "v-content-head": contentHead,
        "v-chart": charts
    },
    data: function() {
        return {
            detailsList: [
                {
                    label: "机构个数",
                    name: "orgCount",
                    value: 0
                },
                {
                    label: "节点个数",
                    name: "nodeCount",
                    value: 0
                },
                {
                    label: "已部署的智能合约",
                    name: "contractCount",
                    value: 0
                },
                {
                    label: "区块数量",
                    name: "latestBlock",
                    value: 0
                },
                {
                    label: "交易数量",
                    name: "transactionCount",
                    value: 0
                }
            ],
            networkDetails: null,
            chartStatistics: {
                show: false,
                date: [],
                dataArr: [],
                chartSize: {
                    width: 0,
                    height: 0
                }
            },
            reloadNumber: true,
            networkId: localStorage.getItem("networkId")
        };
    },
    mounted: function() {
        this.networkId = localStorage.getItem("networkId");
        this.getNetworkDetails();
        this.$nextTick(function() {
            this.chartStatistics.chartSize.width = this.$refs.chart.offsetWidth;
            this.chartStatistics.chartSize.height = this.$refs.chart.offsetHeight;
            this.getChart();
        });
    },
    destroyed() {},
    methods: {
        getNetworkDetails: function() {
            let networkId = this.networkId;
            getNetworkStatistics(networkId)
                .then(res => {
                    if (res.data.code === 0) {
                        this.detailsList.forEach(function(value, index) {
                            for (let i in res.data.data) {
                                if (value.name === i) {
                                    value.value = res.data.data[i];
                                }
                            }
                        });
                    } else {
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
        getChart: function() {
            this.chartStatistics.show = false;
            this.chartStatistics.date = [];
            this.chartStatistics.dataArr = [];
            let networkId = localStorage.getItem("networkId");
            getChartData(networkId)
                .then(res => {
                    if (res.data.code === 0) {
                        let resData = changWeek(res.data.data);
                        for (let i = 0; i < resData.length; i++) {
                            this.chartStatistics.date.push(resData[i].day);
                            this.chartStatistics.dataArr.push(
                                resData[i].transCount
                            );
                        }
                        this.$set(this.chartStatistics, "show", true);
                    } else {
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
        goDetailRouter(item) {
            if(item.name === 'latestBlock'){
                router.push('blockInfo')
            }else if(item.name === 'transactionCount'){
                router.push('transactionInfo')
            }
        }
    }
};
</script>
<style scoped>
.over-view-wrapper {
    background: #f7f7f7;
    padding-bottom: 30px;
}

.font-16 {
    font-size: 24px;
    color: #2d5f9e;
}
.font-12 {
    font-size: 12px;
    color: #9da2ab;
}
.part1-details {
    display: inline-block;
    font-size: 14px;
    width: 20%;
    text-align: center;
    padding: 27px 0 28px 0;
}
.part2-title {
    padding: 30px 31px 38px 32px;
}
.part2-title::after {
    display: block;
    content: "";
    clear: both;
}
.part2-title-left {
    float: left;
    font-size: 16px;
    color: #36393d;
    font-weight: bold;
}
.part2-title-right {
    float: right;
    font-size: 12px;
    color: #000e1f;
}
.part3-title {
    padding: 40px 60px 40px 40px;
}
.part3-title::after {
    display: block;
    content: "";
    clear: both;
}
.more-content {
    font-size: 14px;
    color: #2d5f9e;
    cursor: pointer;
}
.part3-table-content {
    width: 100%;
    padding: 0 39px 48px 40px;
    font-size: 12px;
}
.part3-table-content>>>th,
.part3-table-content>>>td {
    padding: 8px 0;
}
</style>