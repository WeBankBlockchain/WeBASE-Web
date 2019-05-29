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
        <v-content-head :headTitle="'数据概览'" @changGroup="changGroup"></v-content-head>
        <div style="margin-bottom:12px;">
            <el-row>
                <el-col :xs='24' :sm="24" :md="11" :lg="10" :xl="8" v-loading="loadingNumber">
                    <el-row style="padding:0 20px 20px 0;margin: 8px;"  class="module-box-shadow bg-fff">
                        <el-col v-for="(item, index) in detailsList" :key="index" :xs='12' :sm="12" :md="12" :lg="12" :xl="12">
                            <div class="overview-number cursor-pointer" :style="{'background': `${item.color}`}"  @click="goDetailRouter(item)">
                                <div class="part1-content-amount">
                                    <span class="font-14">{{item.label}}</span>
                                </div>
                                <div class="font-color-8798ad text-right" style="margin-top: 10px;">
                                    <span class="font-color-2e384d font-24">{{numberFormat(item.value, 0, ".", ",")}}</span>
                                </div>
                            </div>
                            <!-- <hr class="split-line"></hr> -->
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :xs='24' :sm="24" :md="13" :lg="14" :xl="16" >
                    <div style="margin: 8px 8px 0 8px;" class="module-box-shadow bg-fff">
                        <div class="part2-title">
                            <span class="part2-title-left">关键监控指标</span>
                            <span class="part2-title-right">最近有交易的7天交易量（笔）</span>
                        </div>
                        <div class="chart" ref="chart">
                            <v-chart ref="linechart" :id="'homeId'" v-if="chartStatistics.show" :data="chartStatistics.date" :transactionDataArr="chartStatistics.dataArr" :size="chartStatistics.chartSize" v-loading="loadingCharts"></v-chart>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="module-wrapper-small" style="padding: 30px 31px 26px 32px;">
            <el-table :data="nodeData" class="search-table-content" v-loading="loadingNodes">
                <el-table-column v-for="head in nodeHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="" :width='head.width'>
                    <template slot-scope="scope">
                        <template>
                            <span v-if="head.enName ==='nodeActive'">
                                <i :style="{'color': textColor(scope.row[head.enName])}" class="wbs-icon-radio font-6"></i> {{nodesStatus(scope.row[head.enName])}}
                            </span>
                            <span v-else>{{scope.row[head.enName]}}</span>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="min-width: 540px;margin: 8px 8px 0px 9px;">
            <el-row :gutter="16">
                <el-col :xs='24' :sm="24" :md="12" :lg="12" :xl="12">
                    <div class="overview-wrapper">
                        <p>
                            <span class="overview-title">区块</span>
                            <span class="overview-more cursor-pointer" @click="goRouter('blocks')">更多</span>
                        </p>
                        <div class="overview-item-base" v-loading="loadingBlock">
                            <div class="block-item font-color-2e384d" v-for="item in blockData" :key='item.blockNumber'>
                                <div class="block-amount">
                                    <span>
                                        <router-link :to="{'path': 'blockInfo', 'query': {blockNumber: item.blockNumber}}" class="node-ip">块高 {{item.blockNumber}}</router-link>
                                    </span>
                                    <span class="font-color-8798ad">{{item.blockTimestamp}}</span>
                                </div>
                                <div>
                                    <div class="block-miner">
                                        <span>出块者</span>
                                        <p :title="`${item.sealer}`">{{item.sealer}}</p>
                                    </div>
                                    <div class="text-right">
                                        <span class="block-trans" @click="linkRouter(item.blockNumber)">
                                            <!-- <router-link :to="{'path': 'blockInfo', 'query': {blockNumber: item.blockNumber}}" class="node-ip"> -->
                                                <span>{{item.transCount}}</span>
                                                <span>txns</span>
                                            <!-- </router-link> -->
                                        </span>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :xs='24' :sm="24" :md="12" :lg="12" :xl="12">
                    <div class="overview-wrapper">
                        <p>
                            <span class="overview-title">交易</span>
                            <span class="overview-more cursor-pointer" @click="goRouter('transactions')">更多</span>
                        </p>
                        <div class="overview-item-base" v-loading="loadingTransaction">
                            <div class="block-item font-color-2e384d" v-for="item in transactionList" :key='item.transHash'>
                                <div class="block-amount">
                                    <p class="trans-hash" :title="`${item.transHash}`">
                                        <router-link :to="{'path': 'transactionInfo', 'query': {blockNumber: item.transHash}}" class="node-ip">{{item.transHash}}</router-link>
                                    </p>
                                    <p class="trans-address">
                                        <span :title='item.transFrom'>{{item.transFrom}}</span>
                                        <img :src="sRight" alt="箭头">
                                        <span :title='item.transTo'>{{item.transTo}}</span>
                                    </p>
                                    
                                </div>
                                <p class="font-color-8798ad text-right">{{item.blockTimestamp}}</p>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import charts from "./components/chart";
import {
    getChartData,
    getNetworkStatistics,
    getNodeList,
    getBlockPage,
    getTransactionList
} from "@/util/api";
import { changWeek, numberFormat } from "@/util/util";
import router from "@/router";
import errcode from "@/util/errcode";
import sRight from "@/../static/image/s-right.png";

export default {
    name: "home",
    components: {
        "v-content-head": contentHead,
        "v-chart": charts
    },
    data: function() {
        return {
            sRight: sRight,
            loadingNumber: false,
            loadingCharts: false,
            loadingNodes: false,
            loadingBlock: false,
            loadingTransaction: false,
            numberFormat: numberFormat,
            detailsList: [
                // {
                //     label: "机构个数",
                //     name: "orgCount",
                //     value: 0
                // },
                {
                    label: "节点个数",
                    name: "nodeCount",
                    value: 0,
                    color: "#8693f3"
                },
                {
                    label: "已部署的智能合约",
                    name: "contractCount",
                    value: 0,
                    color: "#bc8dee"
                },
                {
                    label: "区块数量",
                    name: "latestBlock",
                    value: 0,
                    color: "#ffa897"
                },
                {
                    label: "交易数量",
                    name: "transactionCount",
                    value: 0,
                    color: "#89c3f8"
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
            groupId: localStorage.getItem("groupId"),
            nodeHead: [
                // {
                //     enName: "orgName",
                //     name: "机构名称"
                // },
                {
                    enName: "nodeId",
                    name: "节点Id",
                    width: ""
                },
                {
                    enName: "blockNumber",
                    name: "块高",
                    width: 180
                },
                {
                    enName: "pbftView",
                    name: "pbftView",
                    width: 180
                },
                // {
                //     enName: "nodeIp",
                //     name: "ip"
                // },
                // {
                //     enName: "p2pPort",
                //     name: "p2p端口"
                // },
                // {
                //     enName: "rpcPort",
                //     name: "rpc端口"
                // },
                {
                    enName: "nodeActive",
                    name: "状态",
                    width: 150
                }
            ],
            nodeData: [],
            blockData: [],
            transactionList: []
        };
    },
    mounted: function() {
        this.groupId = localStorage.getItem("groupId");
        this.getNetworkDetails();
        this.getNodeTable();
        this.getBlockList();
        this.getTransaction();
        this.$nextTick(function() {
            this.chartStatistics.chartSize.width = this.$refs.chart.offsetWidth;
            this.chartStatistics.chartSize.height = this.$refs.chart.offsetHeight;
            this.getChart();
        });
    },
    destroyed() {},
    methods: {
        changGroup(val){
            this.groupId = val
            this.getNetworkDetails();
            this.getNodeTable();
            this.getBlockList();
            this.getTransaction();
            this.$nextTick(function() {
                this.chartStatistics.chartSize.width = this.$refs.chart.offsetWidth;
                this.chartStatistics.chartSize.height = this.$refs.chart.offsetHeight;
                this.getChart();
            });
        },
        linkRouter: function(val){
            router.push({
                path: "/blockInfo",
                query: {
                    blockNumber: val
                }
            })
        },
        getNetworkDetails: function() {
            this.loadingNumber = true;
            let groupId = this.groupId;
            getNetworkStatistics(groupId)
                .then(res => {
                    this.loadingNumber = false;
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
            this.loadingCharts = true;
            this.chartStatistics.show = false;
            this.chartStatistics.date = [];
            this.chartStatistics.dataArr = [];
            let groupId = localStorage.getItem("groupId");
            getChartData(groupId)
                .then(res => {
                    this.loadingCharts = false;
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
        getNodeTable: function() {
            this.loadingNodes = true;
            let groupId = localStorage.getItem("groupId");
            let reqString = `${groupId}/1/100`;
            let reqData = {
                    groupId: groupId,
                    pageNumber: 1,
                    pageSize: 200
                },
                reqQuery = {};
            getNodeList(reqData, reqQuery)
                .then(res => {
                    this.loadingNodes = false;
                    if (res.data.code === 0) {
                        this.total = res.data.totalCount;
                        this.nodeData = res.data.data || [];
                        this.nodeData.forEach((value, index) => {
                            if (value.status === 0) {
                                value.value = "运行";
                            } else if (value.status === 1) {
                                value.value = "异常";
                            }
                        });
                    } else {
                        this.$message({
                            message: errcode.errCode[res.data.code].cn,
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: "查询失败！",
                        type: "error",
                        duration: 2000
                    });
                });
        },
        getBlockList: function() {
            this.loadingBlock = true;
            let groupId = localStorage.getItem("groupId");
            let reqData = {
                    groupId: groupId,
                    pageNumber: 1,
                    pageSize: 6
                },
                reqQuery = {};
            getBlockPage(reqData, reqQuery)
                .then(res => {
                    this.loadingBlock = false;
                    if (res.data.code === 0) {
                        this.blockData = res.data.data;
                    } else {
                        this.$message({
                            message: errcode.errCode[res.data.code].cn,
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: "系统错误！",
                        type: "error",
                        duration: 2000
                    });
                });
        },
        getTransaction: function() {
            this.loadingTransaction = true;
            let groupId = localStorage.getItem("groupId");
            let reqData = {
                    groupId: groupId,
                    pageNumber: 1,
                    pageSize: 6
                },
                reqQuery = {};
            getTransactionList(reqData, reqQuery)
                .then(res => {
                    this.loadingTransaction = false;
                    if (res.data.code === 0) {
                        this.transactionList = res.data.data;
                    } else {
                        this.$message({
                            message: errcode.errCode[res.data.code].cn,
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message.error("系统错误");
                });
        },
        goDetailRouter(item) {
            let name = item.name;
            switch (name) {
                case "latestBlock":
                    router.push("blockInfo");
                    break;
                case "transactionCount":
                    router.push("transactionInfo");
                    break;
                case "nodeCount":
                    router.push({ path: "front", query: { from: "home" } });
                    break;
                case "contractCount":
                    router.push({ path: "oldContract", query: { from: "home" } });
                    break;
            }
        },
        bindSvg(item) {
            var str = "";
            switch (item.name) {
                case "orgCount":
                    str = "#wbs-icon-h-group";
                    break;

                case "nodeCount":
                    str = "#wbs-icon-h-nodes";
                    break;
                case "contractCount":
                    str = "#wbs-icon-h-deploy";
                    break;
                case "latestBlock":
                    str = "#wbs-icon-h-block";
                    break;
                case "transactionCount":
                    str = "#wbs-icon-transaction";
                    break;
            }
            return str;
        },
        textColor: function(val) {
            let colorString = "";
            switch (val) {
                case 1:
                    colorString = "#58cb7d";
                    break;
                case 2:
                    colorString = "#ed5454";
                    break;
            }
            return colorString;
        },
        nodesStatus: function(val) {
            let transString = "";
            switch (val) {
                case 1:
                    transString = "运行";
                    break;
                case 2:
                    transString = "异常";
                    break;
            }
            return transString;
        },
        goRouter: function(val) {
            switch (val) {
                case "blocks":
                    router.push("blockInfo");
                    break;

                case "transactions":
                    router.push("transactionInfo");
                    break;
            }
        }
    }
};
</script>
<style scoped>
.over-view-wrapper {
    background: #f7f7f7;
}
.amount-wrapper {
    margin: 30px 30px 0 31px;
}
.font-12 {
    font-size: 12px;
    color: #9da2ab;
}
.part1-content {
    display: flex;
    background: #f7f7f7;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
}
.split-line {
    margin-left: 22px;
    margin-top: 10px;
    margin-bottom: 5px;
    margin-right: 20px;
    opacity: 0.25;
}
.overview-number {
    margin-top: 20px;
    margin-left: 20px;
    padding: 20px;
}
.part1-content-amount {
    overflow: auto;
    min-width: 112px;
}
.part2-title {
    padding: 22px 31px 26px 32px;
}
.part2-title::after {
    display: block;
    content: "";
    clear: both;
}
.part2-title-left {
    float: left;
    font-size: 16px;
    color: #000e1f;
    font-weight: bold;
}
.part2-title-right {
    float: right;
    font-size: 12px;
    color: #727476;
    padding: 2px 12px;
    border-radius: 20px;
    background: #f6f6f6;
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
.part1-details-bottom {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
}
.part1-details-arrow-right {
    position: relative;
    top: 4px;
}
.search-table-content {
    width: 100%;
}
.search-table-content>>>th {
    background: #fafafa;
    color: #00122c;
}
.search-table-content>>>th,
.search-table-content>>>td {
    font-size: 14px;
}
.overview-wrapper {
    background: #fff;
    font-size: 15px;
    box-shadow: 0 4px 12px 0 #dfe2e9;
    border-radius: 2px;
}
.overview-wrapper > p {
    padding: 26px 18px 0px 22px;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    justify-content: space-between;
}
.overview-title {
    font-size: 15px;
    color: #2e384d;
    padding-bottom: 22px;
    border-bottom: 2px solid #2e384d;
}
.overview-more {
    font-size: 14px;
    color: #2fcdd1;
}
.block-item {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    padding-bottom: 10px;
}
.block-amount {
    display: flex;
    flex-flow: column;
}
.overview-item-base {
    margin: 26px 18px 30px 22px;
}
.block-miner {
    display: flex;
    flex-flow: row wrap;
}
.block-miner > p {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 10px;
}
.trans-hash {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.node-ip {
    color: #2d5f9e;
}
.block-trans{
    display: inline-block;
    padding: 0 2px;
    background-color: #2d5f9e;
    color: #fff;
    cursor: pointer;
}
.trans-address span{
    display: inline-block;
    max-width: 150px; 
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
}
</style>