<template>
  <div id="largeSreenMiddle" class="middle">
    <section class="middleOne">
      <div class="column1">
        <div
          :class="'item item' + index"
          v-for="(item, index) in dataV_item"
          :key="item.title"
        >
          <p class="ml-3 colorBlue fw-b">{{ item.title }}</p>
          <dv-digital-flop :config="item.number" class="numData" />
        </div>
      </div>
      <div class="column2">
        <div class="data_group">
          <div class="group_left">group1</div>
          <div class="group_middle">
            <div class="middle1"></div>
            <div class="middleGroup">group2</div>
            <div class="middle2"></div>
          </div>
          <div class="group_right">group3</div>
        </div>
        <div class="data_content"></div>
        <div class="leftArr"></div>
        <div class="rightArr"></div>
      </div>
      <div class="column3">
        <div class="tradeTip">
          <div class="tradeImg"></div>
          <span>近七天交易量</span>
        </div>
        <div class="tradeShow">
          <div class="trade1">
            <div class="trade2" ref="trade"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import to from "await-to-js";
import {
  getNetworkStatistics,
  getChartData,
} from "@/util/api";
import { changWeek, getDay } from "@/util/util";
export default {
  name: "largeSreenMiddle",
  components: {},
  data() {
    return {
      dataV_item: [],
      tradeVar: null,
      groupId: localStorage.getItem("groupId"),
    };
  },
  mounted() {
    this.oneInit();
    this.oneReqUpdate();
    this.threeInit();
    this.threeReqUpdate();
    this.threeAdapter();
    window.addEventListener("resize", this.threeAdapter);
  },
  destroyed() {
    window.removeEventListener("resize", this.threeAdapter);
  },
  methods: {
    formatter(number) {
      const numbers = number.toString().split("").reverse();
      const segs = [];
      while (numbers.length) segs.push(numbers.splice(0, 3).join(""));
      return segs.join(",").split("").reverse().join("");
    },
    oneInit() {
      this.dataV_item = [
        {
          title: "块高",
          number: {
            number: [0],
            textAlign: "left",
            style: {
              fill: "#FFFFFF",
            },
          },
        },
        {
          title: "节点数",
          number: {
            number: [0],
            textAlign: "left",
            style: {
              fill: "#FFFFFF",
            },
          },
        },
        {
          title: "总交易量",
          number: {
            number: [0],
            textAlign: "left",
            style: {
              fill: "#FFFFFF",
            },
          },
        },
        {
          title: "今日交易量",
          number: {
            number: [0],
            textAlign: "left",
            style: {
              fill: "#FFFFFF",
            },
          },
        },
        {
          title: "账户数",
          number: {
            number: [0],
            textAlign: "left",
            style: {
              fill: "#FFFFFF",
            },
          },
        },
        {
          title: "部署合约量",
          number: {
            number: [0],
            textAlign: "left",
            style: {
              fill: "#FFFFFF",
            },
          },
        },
      ];
    },
    threeInit() {
      this.tradeVar = this.$echarts.init(this.$refs.trade);
      var option = {
        grid: {
          containLabel: true,
          top: "0",
          left: "0",
          bottom: "1px",
        },
        xAxis: {
          type: "value",
          nameTextStyle: {
            color: "#FFFFFF",
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          axisTick: {
            show: false,
          },
          data: getDay(7).reverse(),
          type: "category",
          nameTextStyle: {
            color: "#FFFFFF",
            fontFamily: "Noto Sans SC",
            fontWeight: "regular",
          },
        },
        series: [
          {
            type: "bar",
            itemStyle: {
              color: "darkblue",
            },
            label: {
              show: true,
              position: "right",
              color: "#70A8FF",
              fontFamily: "Helvetica Neue",
              fontWeight: " bold",
              formatter: (num) => {
                return num.value > 0 ? num.value : "";
              },
            },
          },
        ],
      };
      this.tradeVar.setOption(option);
      this.tradeVar.resize();
    },
    async oneReqUpdate() {
      let groupId = this.groupId;
      let [err, res] = await to(getNetworkStatistics(groupId));
      console.log(err, res);
      if (err) {
        console.log("oneReqError");
        return;
      } else {
        if (res.status != 200) {
          console.log(res.data.message);
          return;
        }
        let allData = Object.values(res.data.data);
        console.log(allData);
        let replaceData = allData.map((item, index) => {
          return {
            number: [item],
            textAlign: "left",
            style: {
              fill: "#FFFFFF",
              fontFamily: "Helvetica Neue",
              fontSize: 30,
            },
            formatter: this.formatter,
          };
        });
        console.log(replaceData);
        replaceData.forEach((item, index) => {
          let order = 0;
          switch (index) {
            case 0:
              order = 4;
              break;
            case 1:
              order = 3;
              break;
            case 2:
              order = 1;
              break;
            case 3:
              order = 2;
              break;
            case 4:
              order = 0;
              break;
            case 5:
              order = 5;
              break;
            default:
          }
          this.$set(this.dataV_item[order], "number", item);
        });
      }
    },
    async threeReqUpdate() {
      let groupId = this.groupId;
      let [err, res] = await to(getChartData(groupId));
      console.log(err, res);
      if (err) {
        console.log("twoReqError");
        return;
      } else {
        if (res.status != 200) {
          console.log(res.data.message);
          return;
        }
        let resData = changWeek(res.data.data);
        console.log(resData);
        let yData = resData.map((item) => {
          return item.day.substr(5);
        });
        let xData = resData.map((item) => {
          return item.transCount;
        });
        let option = {
          yAxis: {
            data: yData,
          },
          series: [
            {
              data: xData,
            },
          ],
        };
        this.tradeVar.setOption(option);
      }
    },
    threeAdapter() {
      let _this = this;
      setTimeout(function () {
        console.log(_this.$refs.trade.offsetWidth);
        let dataSize = _this.$refs.trade.offsetWidth / 489;
        console.log(_this.$refs.trade.offsetWidth);
        let adapterOption = {
          grid: {
            bottom: 1 * dataSize,
          },
          yAxis: {
            nameTextStyle: {
              fontsize: 12 * dataSize,
            },
          },
          series: [
            {
              label: {
                fontSize: 12 * dataSize,
              },
              barMaxWidth: 20 * dataSize,
            },
          ],
        };
        _this.tradeVar.setOption(adapterOption);
        _this.tradeVar.resize();
      }, 300);
    },
  },
};
</script>

<style>
#largeSreenMiddle {
  width: 100%;
  height: 5.425rem;
  /* background-color: pink; */
  padding: 0.525rem 0.6rem 0 0.6rem;
}
.middleOne {
  width: 100%;
  height: 100%;
  display: flex;
}
.numData {
  height: 0.5rem;
  width: 100%;
}
.column2 {
  width: 7.975rem;
  height: 4.9rem;
  background: url("../../assets/largeScreen/group_corner.svg") no-repeat top
    center;
  background-size: 100% 100%;
  /* background-color: seagreen; */
  padding: 0 0.675rem;
  position: relative;
}
.column2 .data_group {
  width: 100%;
  height: 0.9375rem;
  /* background-color: red; */
  position: relative;
  display: flex;
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
  background-image: linear-gradient(
    to right,
    #3371d0 0%,
    #4f94ff 50%,
    #3371d0 100%
  );
  animation: gradualChange 1s infinite linear;
  background-size: 200% 100%;
}
@keyframes gradualChange {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -200% 0;
  }
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
.column3 {
  width: 6.7375rem;
  height: 4.9rem;
  /* background-color: rebeccapurple; */
  position: relative;
}
.tradeTip {
  width: 100%;
  height: 0.35rem;
}
.tradeTip span {
  color: #ffffff;
  font-family: PingFang SC;
  font-weight: medium;
  font-size: 0.25rem;
  line-height: normal;
  letter-spacing: 0px;
  text-align: left;
  vertical-align: middle;
}
.tradeImg {
  background: url("../../assets/largeScreen/title_sel.svg") no-repeat top center;
  background-size: 100% 100%;
  width: 0.3rem;
  height: 0.225rem;
  vertical-align: middle;
  display: inline-block;
}
.tradeShow {
  width: 100%;
  height: 4.3rem;
  position: absolute;
  bottom: 0;
  opacity: 0.3;
  box-sizing: border-box;
  background: #3371d0;
  border: 1px solid #3371d0;
}
.trade1 {
  width: 100%;
  height: 100%;
  position: relative;
}
.trade2 {
  width: 6.1125rem;
  height: 3.9rem;
  position: absolute;
  top: 0.2rem;
  left: 0.3rem;
}
.column1 {
  width: 6.7375rem;
  height: 4.9rem;
  position: relative;
  /* display: flex;
    flex-wrap: wrap; */
  /* justify-content: space-around; */
  /* flex-direction: column; */
}
.item0 {
  position: absolute;
  top: 0;
  left: 0;
}
.item1 {
  position: absolute;
  top: 0;
  right: 0;
}
.item2 {
  position: absolute;
  top: calc(50% - 0.7125rem);
  left: 0;
}
.item3 {
  position: absolute;
  top: calc(50% - 0.7125rem);
  right: 0;
}
.item4 {
  position: absolute;
  left: 0;
  bottom: 0;
}
.item5 {
  position: absolute;
  right: 0;
  bottom: 0;
}
.item {
  background: url("../../assets/largeScreen/data_bg.svg") no-repeat top center;
  background-size: 100% 100%;
  width: 3.225rem;
  height: 1.425rem;
  display: inline-block;
}
.item p {
  margin-top: 0.3125rem;
  margin-left: 0.3125rem;
  color: #4f94ff;
  font-family: PingFang SC;
  font-weight: semibold;
  font-size: 16px;
  line-height: normal;
  letter-spacing: 0px;
  text-align: left;
}
.item div {
  margin-left: 0.3125rem;
  color: #ffffff;
  font-family: Helvetica Neue;
  font-weight: medium;
  font-size: 30px;
  line-height: normal;
  letter-spacing: 0px;
  text-align: left;
}
</style>
