<template>
  <div id="largeSreenFooter" class="footer">
    <section class="footers">
      <div class="column4">
        <div
          :class="['tradeList', { chooseList: listChange == 1 }]"
          @click="changeList"
        >
          <div class="tradeImg"></div>
          <span>区块列表</span>
        </div>
        <div
          :class="['tradeList', { chooseList: listChange == 0 }]"
          @click="changeList"
        >
          <div class="tradeImg"></div>
          <span>交易列表</span>
        </div>
        <div class="tradeNav">
          <span>交易哈希</span>
          <span>交易时间</span>
        </div>
        <div class="listData">
          <dv-scroll-board
            :config="listData"
            class="listClass"
            ref="scrollBoard"
          />
        </div>
      </div>
      <div class="column5">
        <div class="tradeList">
          <div class="tradeImg"></div>
          <span>主机监控</span>
        </div>
        <div class="ip">
          <el-select
            v-model="choose.frontIp"
            placeholder="请选择"
            class="ipSelect"
          >
            <el-option
              v-for="item in nodesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="pie">
          <div class="pieUp" ref="pieUp"></div>
          <div class="pieDown">
            <div class="lineChart" ref="line"></div>
          </div>
        </div>
      </div>
      <div class="column6">
        <div class="tradeTip">
          <div class="tradeImg"></div>
          <span>节点城市分布</span>
        </div>
        <div class="cityShow">
          <div class="city1">
            <div class="city2" ref="cityShow"></div>
          </div>
        </div>
      </div>
    </section>
    <div class="foot">
      <div class="footImg"></div>
    </div>
  </div>
</template>

<script>
import "@/util/china.js";
import {
  getBlockPage,
  getTransactionList,
  metricInfo,
  getFronts,
} from "@/util/api";
import to from "await-to-js";
import { format, formatData } from "@/util/util.js";
export default {
  name: "largeSreenFooter",
  components: {},
  data() {
    return {
      tradeVar: null,
      cityVar: null,
      lineVar: null,
      groupId: localStorage.getItem("groupId"),
      listData: {},
      blockList: [],
      transList: [],
      listChange: 0,
      nodeId: this.$root.$route.query.nodeId || "",
      pieVar: null,
      chartParam: {
        gap: 60,
        beginDate: `${format(new Date().getTime(), "yyyy-MM-dd")}T${format(
          new Date(new Date().getTime() - 12 * 60 * 60 * 1000),
          "HH:mm:ss"
        )}`,
        endDate: `${format(new Date().getTime(), "yyyy-MM-dd")}T${format(
          new Date().getTime(),
          "HH:mm:ss"
        )}`,
        contrastBeginDate: "",
        contrastEndDate: "",
        groupId: localStorage.getItem("groupId")
          ? localStorage.getItem("groupId")
          : "1",
      },
      nodesOptions: [],
      choose: {
        frontIp: "",
      },
    };
  },
  mounted() {
    this.cityShow();
    window.addEventListener("resize", this.cityAdapter);

    this.fourReqUpdate();
    this.fiveInit();
    this.fiveReqUpdate();
  },
  destroyed() {
    window.removeEventListener("resize", this.cityAdapter);
  },
  watch: {
    listChange() {
      let switchList = this.listChange == 0 ? this.transList : this.blockList;
      this.listData = {
        columnWidth: [356, 183],
        align: "center",
        fontSize: "12",
        rowNum: 7,
        oddRowBGC: "rgba(51, 113, 208, 0.3)",
        evenRowBGC: "rgba(51, 113, 208, 0.3)",
        data: switchList,
      };
    },
    $route: function () {
      this.nodeId = this.$root.$route.query.nodeId;
    },
  },
  methods: {
    async fourReqUpdate() {
      let reqData = {
        groupId: this.groupId,
        pageNumber: 1,
        pageSize: 10,
      };
      let [getBlockPageErr, getBlockPageRes] = await to(
        getBlockPage(reqData, {})
      );
      let [getTransactionListErr, getTransactionListRes] = await to(
        getTransactionList(reqData, {})
      );
      console.log(getBlockPageErr, getBlockPageRes);
      console.log(getTransactionListErr, getTransactionListRes);
      if (getBlockPageErr || getTransactionListErr) {
        console.log("fourReqError");
        return;
      } else {
        if (
          getBlockPageRes.status != 200 ||
          getTransactionListRes.status != 200
        ) {
          console.log(getBlockPageRes.data.message);
          console.log(getTransactionListRes.data.message);
          return;
        }
        let blockList = getBlockPageRes.data.data;
        let transList = getTransactionListRes.data.data;
        console.log(blockList);
        console.log(transList);
        this.blockList = blockList.map((item, index) => {
          return [item.pkHash, item.createTime];
        });
        this.transList = transList.map((item, index) => {
          return [item.transHash, item.createTime];
        });
        // this.$set(this.listData,'data',replaceData);
        this.listData = {
          columnWidth: [356, 183],
          align: "center",
          fontSize: "12",
          rowNum: 7,
          oddRowBGC: "rgba(51, 113, 208, 0.3)",
          evenRowBGC: "rgba(51, 113, 208, 0.3)",
          data: this.blockList,
        };
      }
    },
    changeList() {
      this.listChange == 0 ? (this.listChange = 1) : (this.listChange = 0);
    },
    listAdapter() {
      let _this = this;
      setTimeout(function () {
        console.log(_this.$refs.scrollBoard.offsetWidth);
        let dataSize = _this.$refs.scrollBoard.offsetWidth / 537;
        let switchList = this.listChange == 0 ? this.transList : this.blockList;
        this.listData = {
          columnWidth: [356 * dataSize, 183 * dataSize],
          align: "center",
          fontSize: 12 * dataSize,
          rowNum: 7,
          oddRowBGC: "#3371D0",
          evenRowBGC: "#3371D0",
          data: switchList,
        };
      }, 300);
    },
    fiveInit() {
      this.pieVar = this.$echarts.init(this.$refs.pieUp);
      this.lineVar = this.$echarts.init(this.$refs.line);
      let titleStyle = {
        fontSize: 16,
        color: "#4F94FF",
        fontFamily: "PingFang SC",
      };
      var pieOption = {
        title: [
          {
            text: "CPU",
            left: "20%",
            bottom: "13%",
            textAlign: "center",
            textStyle: titleStyle,
          },
          {
            text: "内存",
            left: "50%",
            bottom: "13%",
            textAlign: "center",
            textStyle: titleStyle,
          },
          {
            text: "硬盘",
            left: "80%",
            bottom: "13%",
            textAlign: "center",
            textStyle: titleStyle,
          },
        ],
        series: [
          {
            type: "pie",
          },
          {
            type: "pie",
          },
          {
            type: "pie",
          },
        ],
      };
      this.pieVar.setOption(pieOption);
      var lineOption = {
        // backgroundColor: "rgba(51, 113, 208, 0.3)",
        color: ["#93CC77", "#4F94FF"],
        tooltip: {
          trigger: false,
        },
        legend: {
          data: ["上行宽带", "下行宽带"],
          textStyle: {
            color: "rgba(255, 255, 255, 0.75)",
            fontSize: 12,
          },
          top: 0,
          icon: "circle",
          itemWidth: 6,
        },
        grid: {
          left: "0",
          top: "24px",
          bottom: "0",
          right: "6px",
          containLabel: true,
        },
        xAxis: {
          axisTick: {
            show: false,
          },
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.3)",
            },
          },
          axisLabel: {
            //  color: "rgba(255, 255, 255, 0.75)",
            fontSize: "12",
            fontFamily: "Noto Sans SC",
            fontWeight: "regular",
            // width:"31px",
            // height:"20px"
          },
        },
        yAxis: {
          axisTick: {
            show: false,
          },
          type: "value",
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.3)",
            },

            axisLabel: {
              // color: "rgba(255, 255, 255, 0.75)",
              fontSize: "12",
              fontFamily: "Noto Sans SC",
              fontWeight: "regular",
              // width:"31px",
              // height:"20px"
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(255, 255, 255, 0.3)",
              width: 1,
              type: "solid",
            },
          },
        },
        series: [
          {
            name: "上行宽带",
            type: "line",
            smooth: "true",
            showSymbol: false,
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#93CC77", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#4F94FF ", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          {
            name: "下行宽带",
            smooth: "true",
            type: "line",
            showSymbol: false,

            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#4F94FF", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#4F94FF", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      };
      this.pieVar.resize();
      this.lineVar.setOption(lineOption);
      this.lineVar.resize();
    },
    async fiveReqUpdate() {
      let [getFrontsErr, getFrontsRes] = await to(getFronts({}));
      console.log(getFrontsErr, getFrontsRes);
      if (getFrontsErr) {
        console.log("fiveGetFrontReqError");
        return;
      } else {
        if (getFrontsRes.status != 200) {
          console.log(getFrontsRes.data.message);
          return;
        }
        if (getFrontsRes.data.totalCount != 0) {
          this.nodesOptions = getFrontsRes.data.data.map((item) => {
            return {
              value: item.frontId,
              label: item.frontIp,
            };
          });
          this.nodeId = this.nodesOptions[0]["value"];
          this.$set(
            this.choose,
            "frontIp",
            "节点IP：" + this.nodesOptions[0].label
          );
        } else {
          this.$message({
            message: this.$t("monitor.addFrontInfo"),
            type: "error",
            duration: 2500,
          });
        }
      }
      var reqData = {
        nodeId: this.nodeId,
      };
      let [getHostMonitorErr, getHostMonitorRes] = await to(
        metricInfo(reqData, this.chartParam)
      );
      console.log(getHostMonitorErr, getHostMonitorRes);
      if (getHostMonitorErr) {
        console.log("fiveReqError");
        return;
      } else {
        if (getHostMonitorRes.status != 200) {
          console.log(getHostMonitorRes.data.message);
          return;
        }
        let timestampList =
          getHostMonitorRes.data.data[0]["data"]["lineDataList"][
            "timestampList"
          ];
        let positions = [
          ["20%", "41%"],
          ["50%", "41%"],
          ["80%", "41%"],
        ];
        let pie = [0, 1, 2];
        let lastVal = pie.map((item, index) => {
          return getHostMonitorRes.data.data[index]["data"]["lineDataList"][
            "valueList"
          ].slice(-1)[0];
        });
        let color = function (item) {
          if (item > 75) {
            return "#953F2D";
          }
          if (item > 50) {
            return "#9C7131";
          }
          return "#4B7AC2";
        };
        let pieList = lastVal.map((item, index) => {
          return {
            type: "pie",
            center: positions[index],
            startAngle: 90,
            radius: [52.5, 49.5],
            hoverAnimation: false,
            labelLine: {
              normal: {
                show: false,
              },
            },
            label: {
              normal: {
                position: "center",
              },
            },
            data: [
              {
                value: item,
                itemStyle: {
                  normal: {
                    color: color(item),
                  },
                },
                label: {
                  formatter: "{c}%",
                  position: "center",
                  show: true,
                  textStyle: {
                    fontSize: 16,
                    fontFamily: "PingFang SC",
                    color: "#FFFFFF",
                  },
                },
              },
              {
                value: 100 - item,
                itemStyle: {
                  color: "#FFFFFF",
                },
                label: {
                  show: false,
                },
              },
            ],
          };
        });
        let pieOption = {
          series: pieList,
        };
        this.pieVar.setOption(pieOption);
        this.pieVar.resize();
        let xList = timestampList.map((item) => {
          return format(new Date(item).getTime(), "HH:mm:ss").substr(0, 2);
        });
        let txBps =
          getHostMonitorRes.data.data[3]["data"]["lineDataList"]["valueList"];
        let rxBps =
          getHostMonitorRes.data.data[4]["data"]["lineDataList"]["valueList"];
        let bpsOption = {
          xAxis: {
            data: Array.from(new Set(xList)),
          },
          series: [{ data: txBps }, { data: rxBps }],
        };
        this.lineVar.setOption(bpsOption);
        this.lineVar.resize();
      }
    },
    cityShow() {
      this.cityVar = this.$echarts.init(this.$refs.cityShow);
      var data = [
        {
          name: "北京市",
          value: 12,
        },
        {
          name: "广东",
          value: 30,
        },
      ];
      var geoCoordMap = {
        台湾: [121.5135, 25.0308],
        黑龙江: [127.9688, 45.368],
        内蒙古: [110.3467, 41.4899],
        吉林: [125.8154, 44.2584],
        北京市: [116.4551, 40.2539],
        辽宁: [123.1238, 42.1216],
        河北: [114.4995, 38.1006],
        天津: [117.4219, 39.4189],
        山西: [112.3352, 37.9413],
        陕西: [109.1162, 34.2004],
        甘肃: [103.5901, 36.3043],
        宁夏: [106.3586, 38.1775],
        青海: [101.4038, 36.8207],
        新疆: [87.9236, 43.5883],
        西藏: [91.11, 29.97],
        四川: [103.9526, 30.7617],
        重庆: [108.384366, 30.439702],
        山东: [117.1582, 36.8701],
        河南: [113.4668, 34.6234],
        江苏: [118.8062, 31.9208],
        安徽: [117.29, 32.0581],
        湖北: [114.3896, 30.6628],
        浙江: [119.5313, 29.8773],
        福建: [119.4543, 25.9222],
        江西: [116.0046, 28.6633],
        湖南: [113.0823, 28.2568],
        贵州: [106.6992, 26.7682],
        云南: [102.9199, 25.4663],
        广东: [113.12244, 23.009505],
        广西: [108.479, 23.1152],
        海南: [110.3893, 19.8516],
        上海: [121.4648, 31.2891],
      };
      function convertData(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value),
            });
          }
        }
        return res;
      }
      var option = {
        // backgroundColor: '#3371D0',
        geo: {
          top: 0,
          left: 0,
          bottom: 0,
          show: false,
          map: "china",
          //   label: {
          //     emphasis: {
          //       show: true,
          //       color: "#081D3E",
          //     },
          //   },
          //   roam: false,
          //   itemStyle: {
          //     normal: {},
          //     emphasis: {
          //       areaColor: "#01215c",
          //     },
          //   },
        },
        tooltip: {
          trigger: "item",
          // 			formatter: function(params) {
          //return params.name + ' : ' + params.value[2];
          // var info =' <div class="yqmcbEct-cont">'+
          // 				'<h1>公司名称公司名称公司名称</h1>'+
          // 				'<h6>异常情况：</h6>'+
          // 				'<h4 class="quezhen">确诊：<span>1234</span><var>较昨日<span>+123</span></var></h4>'+
          // 				'<h4 class="yisi">疑似：<span>1234</span><var>较昨日<span>+123</span></var></h4>'+
          // 				'<h4 class="geli">隔离：<span>1234</span><var>较昨日<span>+123</span></var></h4>'+
          // 				'<h6>复工情况：</h6>'+
          // 				'<h4 class="jiandang">入厂上班：<var>1234</var></h4>'+
          // 				'<h4 class="jiandang">&nbsp;&nbsp;&nbsp;复工率：<var>70%</var></h4>'+
          // 				'<h4 class="wuzi">物资情况：<var>充足</var></h4>'+
          // 				'<h5>其他详情</h5>'+
          // 			'</div>'
          // return info;
          // 			}
        },
        series: [
          {
            type: "map",
            map: "china",
            top: 0,
            left: 0,
            bottom: 0,
            showLegendSymbol: false, // 存在legend时显示
            tooltip: {
              show: false,
            },
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            roam: false,
            itemStyle: {
              normal: {
                areaColor: "#081D3E",
                borderColor: "#3371D0",
                borderWidth: 1,
              },
              emphasis: {
                areaColor: "#081D3E",
              },
            },
          },
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            data: convertData(data),
            symbolSize: 10,
            symbol: "circle",
            // 			symbolSize: function (val) {
            // 				return val[2];
            // 			},
            tooltip: {
              position: function (p) {
                //其中p为当前鼠标的位置
                return [p[0] + 20, p[1] - 37];
              },
              formatter(params) {
                console.log(params);
                let arr = [params.name, "节点数：/s", params.value[2]];
                return (
                  params.name +
                  "<br/>" +
                  '<span style="margin-top:42px; display: inline-block;">节点数：</span>' +
                  '<span style=" display: inline-block;margin-top:42px;margin-left:24px;">' +
                  params.value[2] +
                  "</span>"
                );
              },
              backgroundColor: "#9FC5FF",
              extraCssText: "width:125px;height:73px;border-radius:0",
              padding: 10,
              textStyle: {
                color: "#FFFFFF",
                fontFamily: "PingFang SC",
                fontWeight: "medium",
                fontSize: "16px",
              },
            },
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke",
            },
            itemStyle: {
              normal: {
                color: {
                  type: "radial",
                  x: 0.5,
                  y: 0.5,
                  r: 0.5,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#70A8FF",
                    },
                    {
                      offset: 0.8,
                      color: "#70A8FF",
                    },
                    {
                      offset: 1,
                      color: "#70A8FF",
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
          },
        ],
      };
      this.cityVar.setOption(option);
    },
    cityAdapter() {
      let _this = this;
      setTimeout(function () {
        console.log(_this.$refs.cityShow.offsetWidth);
        let dataSize = _this.$refs.cityShow.offsetWidth / 489;
        console.log(_this.$refs.cityShow.offsetWidth);
        let adapterOption = {
          series: [
            {
              itemStyle: {
                normal: {
                  borderWidth: dataSize,
                },
              },
            },
            {
              symbolSize: 10 * dataSize,
              // 			symbolSize: function (val) {
              // 				return val[2];
              // 			},
              tooltip: {
                position: function (p) {
                  //其中p为当前鼠标的位置
                  return [p[0] + 20 * dataSize, p[1] - 37 * dataSize];
                },
                formatter(params) {
                  console.log(params);
                  let arr = [params.name, "节点数：/s", params.value[2]];
                  return (
                    params.name +
                    "<br/>" +
                    '<span style="margin-top:' +
                    32 * dataSize +
                    'px; display: inline-block;">节点数：</span>' +
                    '<span style=" display: inline-block;margin-top:' +
                    32 * dataSize +
                    'px; margin-left:24px;">' +
                    params.value[2] +
                    "</span>"
                  );
                },
                extraCssText:
                  "width:" +
                  125 * dataSize +
                  "px;height:" +
                  73 * dataSize +
                  "px;border-radius:0",
                padding: 10 * dataSize,
                textStyle: {
                  fontSize: 16 * dataSize + "px",
                },
              },
            },
          ],
        };
        _this.cityVar.setOption(adapterOption);
        _this.cityVar.resize();
      }, 300);
    },
    lineAdapter() {
      let _this = this;
      setTimeout(function () {
        console.log(_this.$refs.cityShow.offsetWidth);
        let dataSize = _this.$refs.cityShow.offsetWidth / 489;
        console.log(dataSize);
        let adapterOption = {
          legend: {
            textStyle: {
              fontSize: 12 * dataSize,
            },
            itemWidth: 6 * dataSize,
          },
          grid: {
            top: 24 * dataSize,
            right: 10 * dataSize,
          },
          xAxis: {
            axisLabel: {
              fontSize: 12 * dataSize,
            },
          },
          yAxis: {
            axisLabel: {
              fontSize: 12 * dataSize,
            },
          },
        };
        _this.lineVar.setOption(adapterOption);
        _this.lineVar.resize();
      }, 300);
    },
  },
};
</script>

<style >
#largeSreenFooter {
  width: 100%;
  height: 7.1rem;
  background-color: #000000;
  padding: 0.725rem 0.6rem 0 0.6rem;
}
.foot {
  width: 100%;
  height: 1.25rem;

  position: relative;
}
.footImg {
  width: 100%;
  height: 0.8rem;
  position: absolute;
  background: url("../../assets/largeScreen/footer_bg.svg") no-repeat top center;
  background-size: 100% 100%;
  left: 0;
  bottom: 0.15rem;
}
.footers {
  width: 100%;
  height: 4.925rem;
  display: flex;
}
.tradeNav {
  width: 100%;
  height: 0.45rem;
  background: rgba(51, 113, 208, 0.3);
  border: 1px solid #3371d0;
  margin-top: 0.3rem;
  line-height: 0.45rem;
  box-sizing: border-box;
}
.tradeNav span:nth-child(1) {
  margin-left: 0.30625rem;
  color: #4f94ff;
  font-family: PingFang SC;
  font-weight: medium;
  font-size: 16px;
}
.tradeNav span:nth-child(2) {
  margin-left: 3.70625rem;
  color: #4f94ff;
  font-family: PingFang SC;
  font-weight: medium;
  font-size: 16px;
}
.pie {
  width: 7.9625rem;
  height: 4.475rem;
  margin-top: 0.3rem;
  box-sizing: border-box;
  /* background-color: red; */
  background: rgba(51, 113, 208, 0.3);
  border: 1px solid #3371d0;
}
.pieUp {
  width: 7.9625rem;
  height: 2.2375rem;
  position: relative;
  overflow: hidden;
}
.pieDown {
  width: 7.9625rem;
  height: 2.2375rem;
  /* background-color: chartreuse; */
  position: relative;
  /* background: rgba(51, 113, 208, 0.3); */
}
.lineChart {
  width: 7.0875rem;
  height: 2.025rem;
  left: 0.425rem;
  top: 0;
  position: absolute;
}
.pieUp .cpu {
  width: 1.3125rem;
  height: 1.6625rem;
  position: absolute;
  left: 0.95rem;
  top: 0;
}
.pieUp .ram {
  width: 1.3125rem;
  height: 1.6625rem;
  position: absolute;
  left: 3.325rem;
  top: 0.2625rem;
}
.pieUp .disk {
  width: 1.3125rem;
  height: 1.6625rem;
  position: absolute;
  right: 0.95rem;
  top: 0.2625rem;
}
.listData {
  width: 6.7375rem;
  height: 3.9rem;
  border: 1px solid #3371d0;
  margin-top: 0.125rem;
  box-sizing: border-box;
}
.listData .rows .row-item {
  color: rgba(255, 255, 255, 0.75);
  font-family: PingFang SC;
  font-weight: medium;
  text-align: center;
  font-size: 12px;
}
.listClass {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.column1 {
  /* background-color: royalblue; */
}
.column5 {
  width: 7.975rem;
  height: 4.925rem;
  /* background: url("../../assets/largeScreen/group_corner.svg") no-repeat top
    center; */
  background-size: 100% 100%;
  /* background-color: seagreen; */
  padding: 0 0.675rem;
  position: relative;
}
.column5 .data_group {
  width: 100%;
  height: 0.9375rem;
  /* background-color: red; */
  position: relative;
  display: flex;
}

.column5 .ip {
  width: 2.35rem;
  height: 0.45rem;
  position: absolute;
  top: 0;
  right: 0.6875rem;
}
.group_left {
  color: #ffffff;
  font-family: Helvetica Neue;
  font-weight: bold;
  font-size: 0.25rem;
  line-height: normal;
  letter-spacing: 0px;
  text-align: center;
  line-height: 0.9375rem;
  display: inline-block;
  flex: 1;
}
.group_middle {
  color: #ffffff;
  font-family: Helvetica Neue;
  font-weight: bold;
  font-size: 0.3rem;
  letter-spacing: 0px;
  text-align: center;
  height: 100%;
  text-align: center;

  display: inline-block;
  vertical-align: middle;
  flex: 2;
  position: relative;
}
.group_middle .middleGroup {
  display: inline-block;
  width: 1.425rem;
  height: 0.375rem;
  top: calc(50% - 0.1875rem);
  left: calc(50% - 0.7125rem);
  position: absolute;
}
.group_right {
  flex: 1;
  color: #ffffff;
  font-family: Helvetica Neue;
  font-weight: bold;
  font-size: 0.25rem;
  line-height: normal;
  letter-spacing: 0px;
  text-align: center;
  line-height: 0.9375rem;
  display: inline-block;
}
.middle1 {
  width: 0.0875rem;
  height: 0.6rem;
  top: calc(50% - 0.3rem);
  left: 1.19375rem;
  position: absolute;
  background: url("../../assets/largeScreen/bracket_left.svg") no-repeat top
    center;
  background-size: 100% 100%;
  display: inline-block;
}
.middle2 {
  width: 0.0875rem;
  height: 0.6rem;
  top: calc(50% - 0.3rem);
  position: absolute;
  right: 1.19375rem;
  background: url("../../assets/largeScreen/bracket_right.svg") no-repeat top
    center;
  background-size: 100% 100%;
  display: inline-block;
}
.data_content {
  background: url("../../assets/largeScreen/group_bg.svg") no-repeat top center;
  background-size: 100% 100%;
  width: 7.075rem;
  height: 3.525rem;
  margin: 0.3125rem 0.45rem;
}
.leftArr {
  background: url("../../assets/largeScreen/group_previous.svg") no-repeat top
    center;
  background-size: 100% 100%;
  position: absolute;
  width: 0.1125rem;
  height: 1.1rem;
  top: calc(50% - 0.05625rem);
  left: 0.675rem;
}
.rightArr {
  background: url("../../assets/largeScreen/group_next.svg") no-repeat top
    center;
  background-size: 100% 100%;
  position: absolute;
  width: 0.1125rem;
  height: 1.1rem;
  top: calc(50% - 0.05625rem);
  right: 0.675rem;
}
.column4 {
  width: 6.7375rem;
  height: 4.925rem;
  /* background-color: rebeccapurple; */
  position: relative;
}
.column4 .tradeList {
  cursor: pointer;
}
.column4 .chooseList span {
  color: #3371d0;
}
.chooseList .tradeImg {
  background: url("../../assets/largeScreen/title_nor.svg") no-repeat top center;
  background-size: 100% 100%;
  width: 0.3rem;
  height: 0.225rem;
  vertical-align: middle;
  display: inline-block;
}
.column6 {
  width: 6.7375rem;
  height: 4.925rem;
  position: relative;
}
.tradeList {
  height: 0.35rem;
  display: inline-block;
}
.ipSelect .el-input .el-input__inner {
  width: 2.35rem;
  height: 0.45rem;
  background: rgba(51, 113, 208, 0.3);
  border: 1px solid #3371d0;
  border-radius: 0;
  color: #4f94ff;
  font-family: PingFang SC;
  font-weight: medium;
  font-size: 16px;
  line-height: normal;
  letter-spacing: 0px;
  text-align: left;
}
/* .ipSelect .el-input .el-input__suffix-inner .el-input__icon::before{
width: .15rem;
height: .075rem;
} */
.tradeList span {
  color: rgba(255, 255, 255, 0.75);
  font-family: PingFang SC;
  font-weight: medium;
  font-size: 0.25rem;
  line-height: normal;
  letter-spacing: 0px;
  text-align: left;
  vertical-align: middle;
}
.tradeList:nth-child(2) {
  margin-left: 0.2375rem;
}
.tradeImg {
  background: url("../../assets/largeScreen/title_sel.svg") no-repeat top center;
  background-size: 100% 100%;
  width: 0.3rem;
  height: 0.225rem;
  vertical-align: middle;
  display: inline-block;
}
.cityShow {
  width: 100%;
  height: 4.475rem;
  margin-top: 0.3rem;
  background: rgba(51, 113, 208, 0.3);
  box-sizing: border-box;
  border: 1px solid #3371d0;
}
.city1 {
  width: 100%;
  height: 100%;
  position: relative;
}
.city2 {
  width: 5.4875rem;
  height: 4.05rem;
  position: absolute;
  top: 0.1875rem;
  left: 0.625rem;
}
.column1 {
  width: 6.7375rem;
  height: 4.9rem;

  /* display: flex;
    flex-wrap: wrap; */
  /* justify-content: space-around; */
  /* flex-direction: column; */
}
</style>
