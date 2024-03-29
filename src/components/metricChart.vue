/*
 * Copyright 2014-2020 the original author or authors.
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
    <div style="position: relative">
        <div :id="chartId" style="height: 350px; margin: 0 auto;"></div>
        <div class="noData" style="color: #c23531" v-if="chartOption.data.lineDataList.valueList.length === 0">暂无数据</div>
        <div class="noData" style="color: #2f4554" v-if="chartOption.data.contrastDataList.valueList.length === 0 && chartOption.data.contrastDataList.contractDataShow">暂无数据</div>
    </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/grid");
require("echarts/lib/component/legend");
require("echarts/lib/component/dataZoom");
require("echarts/lib/component/toolbox");
import { format, numberFormat } from "@/util/util.js";
export default {
    name: "metricChart",
    components: {},
    props: {
        chartOption: {
            type: Object
        },
        reload: {
            type: Number
        },
        metricName: {
            type: String
        }
    },
    watch: {
        reload: function () {
            this.getChartData();
        }
    },
    data() {
        return {
            chartId: this.chartOption.metricType,
            chart: "",
            showContrast: false
        };
    },
    beforeDestroy: function () {
        window.onresize = null;
    },
    mounted() {
        this.$nextTick(() => {
            this.getChartData();
        });
    },
    methods: {
        getChartData() {
            this.chart = echarts.init(document.getElementById(this.chartId));
            let xList = [],
                yList = [],
                yContrastList = [],
                yContrastTitle = "";
            
            xList = this.chartOption.data.lineDataList.timestampList.map(
                item => {
                    return format(new Date(item).getTime(), "HH:mm:ss");
                }
            );
            yList = this.chartOption.data.lineDataList.valueList.map(item => {
                return item;
            });
            for (let i = 0; i < yList.length; i++) {
                if (yList[i] === null) {
                    yList[i] = 0
                }
            }
            yContrastList = this.chartOption.data.contrastDataList.valueList.map(
                item => {
                    return item;
                }
            );
            for (let i = 0; i < yList.length; i++) {
                if (yContrastList[i] === null) {
                    yContrastList[i] = 0
                }
            }
            if (this.chartOption.data.contrastDataList.valueList.length > 0) {
                yContrastTitle = this.$t('monitor.contrastDateData');
                this.showContrast = true;
            } else {
                this.showContrast = false
            }
            let _this = this;
            let option = {
                title: {
                    text:
                        this.metricName === "nodes"
                            ? `${this.chartOption.metricName}`
                            : `${this.chartOption.metricName}${this.chartOption
                                .metricUint}(${this.chartOption.metricU})`,
                    textStyle: {
                        color: "#1e53a4",
                        fontStyle: "normal",
                        fontWeight: "bold",
                        fontSize: 14
                    },
                    left: 28,
                    top: 20
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        animation: false,
                        label: {
                            backgroundColor: "#505765"
                        }
                    },
                    formatter: function (data) {
                        let str = ''
                        if (data.length === 2) {
                            if (data[0]['data'] && data[1]['data']) {
                                str = `
                                <span>${data[0]['name']}</span><br/>
                                <span>${data[0]['seriesName']}:${data[0]['data']}</span><br/>
                                <span>${data[1]['seriesName']}:${data[1]['data']}</span>
                                `
                            } else if (data[0]['data'] === 0 && data[1]['data'] != 0) {
                                str = `
                                <span>${data[0]['name']}</span><br/>
                                <span>${data[0]['seriesName']}:${_this.$t('monitor.noData')}</span><br/>
                                <span>${data[1]['seriesName']}:${data[1]['data']}</span><br/>
                                `
                            } else if (data[0]['data'] != 0 && data[1]['data'] === 0) {
                                str = `
                                <span>${data[0]['name']}</span><br/>
                                <span>${data[0]['seriesName']}:${data[0]['data']}</span><br/>
                                <span>${data[1]['seriesName']}:${_this.$t('monitor.noData')}</span><br/>
                                `
                            } else {
                                str = `
                                <span>${data[0]['name']}</span><br/>
                                <span>${_this.$t('monitor.noData')}</span><br/>
                                `
                            }
                        } else if (data.length === 1) {
                            if (data[0]['data']) {

                                str = `
                                <span>${data[0]['name']}</span><br/>
                                <span>${data[0]['seriesName']}:${data[0]['data']}</span><br/>
                                `
                            } else {
                                str = `
                                <span>${data[0]['name']}</span><br/>
                                <span>${data[0]['seriesName']}:${_this.$t('monitor.noData')}</span><br/>
                                `
                            }
                        }
                        return str
                    }
                },
                legend: {
                    data: [this.$t('monitor.showDateData'), yContrastTitle],
                    y: 20
                },
                dataZoom: [
                    {
                        type: "inside"
                    }
                ],
                grid: {
                    left: 33,
                    right: 33,
                    bottom: 17,
                    containLabel: true
                },
                toolbox: {
                    right: "30",
                    top: "16",
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none',
                            title: {
                                zoom: this.$t('title.zoom'),
                                back: this.$t('title.back')
                            }
                        },
                        restore: {
                            title: this.$t('title.restore')
                        },
                        magicType: {
                            show: this.showContrast ? true : false,
                            type: ['stack', 'tiled'],
                            title: {
                                stack: this.$t('title.stack'),
                                tiled: this.$t('title.tiled'),
                            }
                        }
                    }
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: xList,
                    axisLabel: {
                        interval: "auto",
                        formatter: function (value, index) {
                            return value.substr(0, 5);
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: "dashed"
                        }
                    }
                },
                yAxis: {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#333"
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: { type: "dashed", color: "#e9e9e9" }
                    },
                    axisTick: { show: false },
                    axisLabel: {
                        textStyle: {
                            color: "rgba(0,14,31,0.62)"
                        }
                    },
                    scale: this.metricName === "nodes" ? true : false
                },
                series: [
                    {
                        name: this.$t('monitor.showDateData'),
                        type: "line",
                        data: yList,
                        smooth: true
                    },
                    {
                        name: yContrastTitle,
                        type: "line",
                        data: yContrastList,
                        smooth: true
                    }
                ]
            };
            this.chart.setOption(option, true);
            setTimeout(() => {
                window.onresize = () => {
                    if (this.metricName === "nodes") {
                        echarts
                            .init(document.getElementById("pbftView"))
                            .resize();
                        echarts
                            .init(document.getElementById("blockHeight"))
                            .resize();
                        echarts
                            .init(document.getElementById("pendingCount"))
                            .resize();
                        echarts
                            .init(document.getElementById("blockSize"))
                            .resize();
                        echarts
                            .init(document.getElementById("blockCycle"))
                            .resize();
                    } else {
                        echarts.init(document.getElementById("cpu")).resize();
                        echarts
                            .init(document.getElementById("memory"))
                            .resize();
                        echarts.init(document.getElementById("disk")).resize();
                        echarts.init(document.getElementById("txbps")).resize();
                        echarts.init(document.getElementById("rxbps")).resize();
                    }
                };
            }, 200);
        },
        formatNodesMetric(val) {
            let num;
            if (val === 0) {
                return str = this.$t('monitor.nullData')
            }
        }
    }
};
</script>

<style scoped>
.noData {
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 46%;
}
</style>
