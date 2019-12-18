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
        <v-content-head :headTitle="$t('title.dataOverview')" @changGroup="changGroup"></v-content-head>
        <div style="margin: 5px;">
            <div style="margin:10px 10px 6px 10px;">
                <el-row>
                    <el-col :xs='24' :sm="24" :md="11" :lg="10" :xl="8" v-loading="loadingNumber">
                        <div class="overview-item" style="font-size:0" v-for="item in detailsList" :key='item.label' @click="goDetailRouter(item)" :class="item.bg">
                            <div class="overview-item-img">
                                <svg class="overview-item-svg" aria-hidden="true" v-if='item.icon == "#wbs-icon-node1"'>
                                    <use xlink:href="#wbs-icon-node1"></use>
                                </svg>
                                <svg class="overview-item-svg" aria-hidden="true" v-else-if='item.icon == "#wbs-icon-contract"'>
                                    <use xlink:href="#wbs-icon-contract"></use>
                                </svg>
                                <svg class="overview-item-svg" aria-hidden="true" v-else-if='item.icon == "#wbs-icon-block"'>
                                    <use xlink:href="#wbs-icon-block"></use>
                                </svg>
                                <svg class="overview-item-svg" aria-hidden="true" v-else-if='item.icon == "#wbs-icon-transation"'>
                                    <use xlink:href="#wbs-icon-transation"></use>
                                </svg>
                            </div>
                            <div class="overview-item-content">
                                <div class="overview-item-number">{{item.value}}</div>
                                <div class="overview-item-title">{{item.label}}</div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :xs='24' :sm="24" :md="13" :lg="14" :xl="16">
                        <div style="margin: 8px 0px 0 0px;" class="module-box-shadow bg-fff">
                            <div class="part2-title">
                                <span class="part2-title-left">{{this.$t('home.chartTitle')}}</span>
                                <span class="part2-title-right">{{this.$t('home.chartExplain')}}</span>
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
                                <span v-else-if="head.enName === 'nodeId'">
                                    <i class="wbs-icon-copy font-12" @click="copyNodeIdKey(scope.row[head.enName])" title="复制"></i>
                                    {{scope.row[head.enName]}}
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
                                <span class="overview-title">{{this.$t("home.block")}}</span>
                                <span class="overview-more cursor-pointer" @click="goRouter('blocks')">{{this.$t("home.more")}}</span>
                            </p>
                            <div class="overview-item-base" v-loading="loadingBlock">
                                <div class="block-item font-color-2e384d" v-for="item in blockData" :key='item.blockNumber'>
                                    <div class="block-amount" style="padding-bottom: 7px;">
                                        <span>
                                            <router-link :to="{'path': 'blockInfo', 'query': {blockNumber: item.blockNumber}}" class="node-ip">
                                                <span>{{$t("home.blockHeight")}}</span> {{item.blockNumber}}</router-link>
                                        </span>
                                        <span class="color-8798AD">{{item.blockTimestamp}}</span>
                                    </div>
                                    <div>
                                        <div class="block-miner">
                                            <span>{{$t("home.tranfer")}}</span>
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
                                <span class="overview-title">{{this.$t("home.transaction")}}</span>
                                <span class="overview-more cursor-pointer" @click="goRouter('transactions')">{{this.$t("home.more")}}</span>
                            </p>
                            <div class="overview-item-base" v-loading="loadingTransaction">
                                <div class="block-item font-color-2e384d" v-for="item in transactionList" :key='item.transHash'>
                                    <div class="block-amount">
                                        <p class="trans-hash" :title="`${item.transHash}`">
                                            <i class="wbs-icon-copy font-12" @click="copyNodeIdKey(item.transHash)" :title="$t('text.copy')"></i>
                                            <router-link :to="{'path': 'transactionInfo', 'query': {blockNumber: item.transHash}}" class="node-ip">
                                                {{item.transHash}}
                                            </router-link>
                                        </p>
                                        <p class="trans-address color-8798AD">
                                            <span>
                                                <i class="wbs-icon-copy font-12" @click="copyNodeIdKey(item.transFrom)" :title="$t('text.copy')"></i>
                                                {{splitAddress(item.transFrom)}}
                                            </span>
                                            <img :src="sRight" :alt="$t('text.arrow')">
                                            <span>
                                                <i class="wbs-icon-copy font-12" @click="copyNodeIdKey(item.transTo)" :title="$t('text.copy')"></i>
                                                {{splitAddress(item.transTo)}}
                                            </span>
                                        </p>

                                    </div>
                                    <p class="color-8798AD text-right">{{item.blockTimestamp}}</p>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
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
    getTransactionList,
    getConsensusNodeId
} from "@/util/api";
import { changWeek, numberFormat, unique } from "@/util/util";
import router from "@/router";
import errcode from "@/util/errcode";
import sRight from "@/../static/image/s-right.png";
import artboard from "@/../static/image/artboard.png"
export default {
    name: "home",
    components: {
        "v-content-head": contentHead,
        "v-chart": charts
    },
    computed: {
        detailsList() {
            let data  = [
                {
                    label: this.$t("home.nodes"),
                    name: "nodeCount",
                    value: 0,
                    icon: "#wbs-icon-node1",
                    bg: 'node-bg'
                },
                {
                    label: this.$t("home.contracts"),
                    name: "contractCount",
                    value: 0,
                    icon: "#wbs-icon-contract",
                    bg: 'contract-bg'
                },
                {
                    label: this.$t("home.blocks"),
                    name: "latestBlock",
                    value: 0,
                    icon: "#wbs-icon-block",
                    bg: "block-bg"
                },
                {
                    label: this.$t("home.transactions"),
                    name: "transactionCount",
                    value: 0,
                    icon: "#wbs-icon-transation",
                    bg: 'transation-bg'
                }
            ]
            return data
        },
        nodeHead() {
            let data = [
                {
                    enName: "nodeId",
                    name: this.$t("home.nodeId"),
                    width: ""
                },
                {
                    enName: "blockNumber",
                    name: this.$t('home.blockHeight'),
                    width: 180
                },
                {
                    enName: "pbftView",
                    name: this.$t("home.pbftView"),
                    width: 180
                },
                {
                    enName: "nodeActive",
                    name: this.$t("home.status"),
                    width: 150
                }
            ]
            return data
        }
    },
    data: function () {
        return {
            sRight: sRight,
            loadingNumber: false,
            loadingCharts: false,
            loadingNodes: false,
            loadingBlock: false,
            loadingTransaction: false,
            numberFormat: numberFormat,
            artboard: artboard,
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
            nodeData: [],
            blockData: [],
            transactionList: []
        };
    },
    mounted: function () {
        this.groupId = localStorage.getItem("groupId");
        this.getNetworkDetails();
        this.getNodeTable();
        this.getBlockList();
        this.getTransaction();
        this.$nextTick(function () {
            this.chartStatistics.chartSize.width = this.$refs.chart.offsetWidth;
            this.chartStatistics.chartSize.height = this.$refs.chart.offsetHeight;
            this.getChart();
        });
    },
    destroyed() { },
    methods: {
        changGroup(val) {
            this.groupId = val
            this.getNetworkDetails();
            this.getNodeTable();
            this.getBlockList();
            this.getTransaction();
            this.$nextTick(function () {
                this.chartStatistics.chartSize.width = this.$refs.chart.offsetWidth;
                this.chartStatistics.chartSize.height = this.$refs.chart.offsetHeight;
                this.getChart();
            });
        },
        linkRouter: function (val) {
            router.push({
                path: "/blockInfo",
                query: {
                    blockNumber: val
                }
            })
        },
        getNetworkDetails: function () {
            this.loadingNumber = true;
            let groupId = this.groupId;
            getNetworkStatistics(groupId)
                .then(res => {
                    this.loadingNumber = false;
                    if (res.data.code === 0) {
                        this.detailsList.forEach(function (value, index) {
                            for (let i in res.data.data) {
                                if (value.name === i) {
                                    value.value = res.data.data[i];
                                }
                            }
                        });
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                        // this.$message.closeAll()
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
        getChart: function () {
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
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                        // this.$message.closeAll()
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
        getNodeTable: function () {
            this.loadingNodes = true;
            let groupId = localStorage.getItem("groupId");
            let reqData = {
                groupId: groupId,
                pageNumber: 1,
                pageSize: 100
            },
                reqQuery = {},

                reqParam = {
                    groupId: groupId,
                    pageNumber: 1,
                    pageSize: 100
                };
            this.$axios.all([getNodeList(reqData, reqQuery), getConsensusNodeId(reqParam)])
                .then(this.$axios.spread((acct, perms) => {
                    this.loadingNodes = false;
                    if (acct.data.code === 0 && perms.data.code === 0) {
                        var nodesStatusList = acct.data.data, nodesAuthorList = perms.data.data;
                        var nodesStatusIdList = nodesStatusList.map(item => {
                            return item.nodeId
                        })
                        this.nodeData = [];
                        nodesAuthorList.forEach((item, index) => {
                            if (item.nodeType != 'remove') {
                                nodesStatusList.forEach(it => {
                                    if (nodesStatusIdList.includes(item.nodeId)) {
                                        if (item.nodeId === it.nodeId) {
                                            this.nodeData.push(Object.assign({}, item, it))
                                        }
                                    } else {
                                        this.nodeData.push(item)
                                    }
                                })
                            }

                        })
                        this.nodeData.forEach(item => {
                            if (item.nodeType === "observer") {
                                item.pbftView = '--';
                            }
                        });
                        this.nodeData = unique(this.nodeData, 'nodeId')
                    } else {
                        this.nodeData = [];
                    }


                }))
        },
        getBlockList: function () {
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
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                        // this.$message.closeAll()
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
        getTransaction: function () {
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
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                        // this.$message.closeAll()
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
                    router.push({ path: "contractList", query: { from: "home" } });
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
        textColor: function (val) {
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
        nodesStatus: function (val) {
            let transString = "";
            switch (val) {
                case 1:
                    transString = this.$t("home.run");
                    break;
                case 2:
                    transString = this.$t("home.unusual");
                    break;
            }
            return transString;
        },
        goRouter: function (val) {
            switch (val) {
                case "blocks":
                    router.push("blockInfo");
                    break;

                case "transactions":
                    router.push("transactionInfo");
                    break;
            }
        },
        copyNodeIdKey: function (val) {
            if (!val) {
                this.$message({
                    type: "fail",
                    showClose: true,
                    message: this.$t("text.copyErrorMsg"),
                    duration: 2000
                });
            } else {
                this.$copyText(val).then(e => {
                    this.$message({
                        type: "success",
                        showClose: true,
                        message: this.$t("text.copySuccessMsg"),
                        duration: 2000
                    });
                });
            }
        },
        splitAddress(val) {
            if (!val) return;
            var startStr = '', endStr = '', str = '';
            startStr = val.substring(0, 8);
            endStr = val.substring(val.length - 4);
            str = `${startStr}...${endStr}`;
            return str;
        }
    }
};
</script>
<style scoped>
.node-bg {
    background: linear-gradient(to top right, #47befa, #37eef2);
}
.contract-bg {
    background: linear-gradient(to top right, #466dff, #30a7ff);
}
.block-bg {
    background: linear-gradient(to top right, #736aff, #b287ff);
}
.transation-bg {
    background: linear-gradient(to top right, #ff6e9a, #ffa895);
}
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
    color: #0db1c1;
    cursor: pointer;
}
.part3-table-content {
    width: 100%;
    padding: 0 39px 48px 40px;
    font-size: 12px;
}
.part3-table-content >>> th,
.part3-table-content >>> td {
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
.search-table-content >>> th {
    background: #fafafa;
    color: #2e384d;
}
.search-table-content >>> th,
.search-table-content >>> td {
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
    white-space: nowrap;
}
.node-ip {
    color: #0db1c1;
}
.block-trans {
    display: inline-block;
    padding: 0 2px;
    background-color: #f6f7f8;
    color: #0db1c1;
    cursor: pointer;
}
.trans-address span {
    display: inline-block;
    max-width: 150px;
}
.trans-address img {
    vertical-align: middle;
}
.overview-item {
    display: inline-block;
    width: calc(49% - 15px);
    max-width: 300px;
    height: 120px;
    padding: 28px 16px;
    margin: 8px 15px 16px 0;
    background-color: #fff;
    box-shadow: 0 4px 12px 0 #dfe2e9;
    border-radius: 2px;
    box-sizing: border-box;
    cursor: pointer;
}
.overview-item-img {
    display: inline-block;
    width: 50px;
}
.overview-item-content {
    font-size: 12px;
    display: inline-block;
    padding-left: 10px;
    width: calc(100% - 60px);
}
.overview-item-number {
    font-size: 24px;
    color: #fff;
}
.overview-item-title {
    width: 100%;
    color: #fff;
}
.overview-item-svg {
    width: 50px;
    height: 50px;
}
@media screen and (max-width: 1142px) {
    .overview-item {
        display: inline-block;
        width: calc(49% - 15px);
        max-width: 300px;
        height: 120px;
        padding: 28px 12px;
        margin: 8px 15px 16px 0;
        background-color: #fff;
        box-shadow: 0 4px 12px 0 #dfe2e9;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .overview-item-img {
        display: inline-block;
        width: 40px;
    }
    .overview-item-svg {
        width: 40px;
        height: 40px;
    }
    .overview-item-content {
        font-size: 12px;
        display: inline-block;
        padding-left: 5px;
        width: calc(100% - 45px);
    }
}
@media screen and (max-width: 1042px) {
    .overview-item {
        display: inline-block;
        width: calc(49% - 15px);
        max-width: 300px;
        height: 120px;
        padding: 28px 6px;
        margin: 8px 15px 16px 0;
        background-color: #fff;
        box-shadow: 0 4px 12px 0 #dfe2e9;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .overview-item-img {
        display: inline-block;
        width: 35px;
    }
    .overview-item-svg {
        width: 35px;
        height: 35px;
    }
    .overview-item-content {
        font-size: 12px;
        display: inline-block;
        padding-left: 5px;
        width: calc(100% - 40px);
    }
}
@media screen and (max-width: 991px) {
    .overview-item {
        display: inline-block;
        width: calc(49% - 8px);
        max-width: 385px;
        height: 120px;
        padding: 28px 16px;
        margin: 8px 15px 16px 0;
        background-color: #fff;
        box-shadow: 0 4px 12px 0 #dfe2e9;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .overview-item-img {
        display: inline-block;
        width: 50px;
    }
    .overview-item-svg {
        width: 50px;
        height: 50px;
    }
    .overview-item-content {
        font-size: 12px;
        display: inline-block;
        padding-left: 10px;
        width: calc(100% - 60px);
    }
    /* .el-col:nth-child(2){
        margin: 8px 16px 16px 0;
    } */
    .overview-item:nth-child(2) {
        margin: 8px 15px 16px 0;
    }
}
</style>