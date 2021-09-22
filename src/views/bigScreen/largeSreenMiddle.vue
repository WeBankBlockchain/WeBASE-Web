<template>
  <div id="largeSreenMiddle" class="middle">
    <section class="middleOne">
      <div class="column1">
        <div
          :class="'items item' + index"
          v-for="(item, index) in dataV_item"
          :key="item.title"
        >
          <p class="ml-3 colorBlue fw-b">{{ item.title }}</p>
          <dv-digital-flop :config="item.number" class="numData" />
        </div>
      </div>
      <div class="column2">
        <div class="data_group">
          <div class="group_left">test1</div>
          <div class="group_middle">
            <div class="middle1"></div>
            <div class="middleGroup">{{ groupMiddle }}</div>
            <div class="middle2"></div>
          </div>
          <div class="group_right">test2</div>
        </div>
        <div class="data_content">
          <div id="groupCanvas" ref="groupCanvas"></div>
        </div>
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
import { getNetworkStatistics, getChartData, getNodeList } from "@/util/api";
import { changWeek, getDay } from "@/util/util";
import { creatBall } from "@/util/largeScreen";
export default {
  name: "largeSreenMiddle",
  components: {},
  data() {
    return {
      dataV_item: [],
      tradeVar: null,
      groupId: localStorage.getItem("groupId"),
      groupVar: null,
      ballArr: [],
      balls: [],
      nodeVar: null,
      groupMiddle: localStorage.getItem("groupName"),
    };
  },
  mounted() {
    this.oneInit();
    this.oneReqUpdate();
    this.twoInit();
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
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgb(255, 255, 255,0.3)",
              width: 1,
            },
          },
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
          axisLine: {
            lineStyle: {
              color: "rgb(255, 255, 255,0.3)",
              width: 1,
            },
          },
          data: getDay(7).reverse(),
          type: "category",
          axisLabel: {
            color: "rgb(255, 255, 255,0.75)",
            fontFamily: "Noto Sans SC",
            fontWeight: "regular",
            fontSize: 12,
          },
        },
        series: [
          {
            type: "bar",
            itemStyle: {
              color: "#3371D0",
            },
            label: {
              show: true,
              position: "right",
              color: "#3371D0",
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
              order = 5;
              break;
            case 4:
              order = 0;
              break;
            case 5:
              order = 2;
              break;
            default:
          }
          if (order != 3) {
            this.$set(this.dataV_item[order], "number", item);
          }
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
        let todayVal = {
          number: [xData[6]],
          textAlign: "left",
          style: {
            fill: "#FFFFFF",
            fontFamily: "Helvetica Neue",
            fontSize: 30,
          },
          formatter: this.formatter,
        };
        this.$set(this.dataV_item[3], "number", todayVal);
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
    async twoInit() {
      let reqData = {
        groupId: this.groupId,
        pageNumber: 1,
        pageSize: 100,
      };
      let [err, res] = await to(getNodeList(reqData, {}));
      console.log(err, res);
      if (err) {
        console.log("twoReqError");
        return;
      } else {
        if (res.status != 200) {
          console.log(res.data.message);
          return;
        }
        let resData = res.data.data.map((item, index) => {
          return {
            agency: item.agency,
            nodeIp: item.nodeIp,
          };
        });
        console.log(resData);
        this.ballArr = resData;
      }
      // let canvas = document.getElementById("groupCanvas");
      // let ctx = canvas.getContext("2d");
      // // 画文字
      // function drawText(text, x, y) {
      //   ctx.font = "16px";
      //   ctx.textAlign = "center";
      //   ctx.fillStyle = "#4F94FF";
      //   ctx.fillText(text, x, y);
      // }
      // //画线
      // function drawLine(x1, y1, x2, y2, color, width) {
      //   // ctx.setLineDash([2, 2]);
      //   ctx.beginPath();
      //   ctx.moveTo(x1, y1);
      //   ctx.lineTo(x2, y2);
      //   ctx.strokeStyle = color;
      //   ctx.lineWidth = width;
      //   ctx.stroke();
      //   ctx.closePath();
      // }
      // //画圆
      // function drawCircle(x, y, r, color) {
      //   setInterval(function () {
      //     ctx.beginPath();
      //     ctx.arc(x, y, r, 0, Math.PI * 2);
      //     ctx.fillStyle = color || "#000";
      //     ctx.fill();
      //   }, 0);
      // }
      // //清除圆
      // function clearCircle(x, y, r) {
      //   for (var i = 0; i < Math.round(Math.PI * r); i++) {
      //     var angle = (i / Math.round(Math.PI * r)) * 360;
      //     ctx.clearRect(
      //       x,
      //       y,
      //       Math.sin(angle * (Math.PI / 180)) * r,
      //       Math.cos(angle * (Math.PI / 180)) * r
      //     );
      //   }
      // }
      // //画圆环
      // function drawCirque(x, y, r, color) {
      //   setInterval(function () {
      //     ctx.beginPath();
      //     ctx.strokeStyle = "rgba(51, 113, 208, " + 1 * Math.random() + ")";
      //     r += 5;
      //     if (r >= 25) {
      //       clearCircle(x, y, r);
      //       r = 10;
      //     }
      //     ctx.arc(x, y, r, 0, Math.PI * 2);
      //     ctx.stroke();
      //     ctx.closePath();
      //   }, 500);
      // }
      // function render(x1, y1, r1) {
      //   /*
      //    * createRadialGradient 圆形渐变效果
      //    * 参数 (x , y , r , x2 , y2 , r2)
      //    * 因为用的圆形渐变 所以有 开始 和 结束 两个圆连接为渐变过程路径
      //    * x y 与 x2 y2 设置为同心 与 不同心 效果差距会很大
      //    * addColorStop 渐变填充的节点
      //    * 可以插入多个 制作出吊炸天的效果（配合图形外发光的效果）性能是个问题 需要考虑 emmm...
      //    */
      //   var grid = ctx.createRadialGradient(x1, y1, r1, x1, y1, r1 + 3); //渐变填充器
      //   grid.addColorStop(0, "rgba(255,255,0,0)"); //渐变节点
      //   grid.addColorStop(1, "rgba(255,255,0,1)"); //渐变节点

      //   ctx.beginPath(); //新的圆必须要新的路径
      //   //画圆
      //   ctx.arc(x1, y1, r1 + 3, 0, Math.PI * 2);
      //   ctx.fillStyle = grid; //填充样式 放入 渐变填充器
      //   ctx.stroke(); //调用填充
      //   //context.stroke();
      // }

      // //   for(let i=0;i<this.ballArr.length;i++){
      // //   drawCircle(r(100)+50,r(100)+50, 10, "rgba(51, 113, 208, 1)");
      // // }
      // //随机半径
      // function r(num) {
      //   return parseInt(Math.random() * num);
      // }
      // //创建小球类
      // function Ball(text) {
      //   this.x = r(100) + 20;
      //   this.y = r(100) + 20;
      //   this.r = 10;
      //   this.color = "rgba(51, 113, 208, 1)";
      //   this.text = text;
      // }
      // Ball.prototype.show = function () {
      //   drawCircle(this.x, this.y, this.r, this.color);
      //   drawCirque(this.x, this.y, this.r, this.color);
      //   drawText(this.text, this.x, this.y + this.r * 2);
      //   //render(this.x,this.y,this.r)
      // };
      // let balls = [];
      // function creatBall(text) {
      //   const ball = new Ball(text);
      //   balls.push(ball);
      //   for (let i = 0; i < balls.length; i++) {
      //     drawLine(ball.x, ball.y, balls[i].x, balls[i].y, "#4F94FF", 1);
      //   }

      //   return ball;
      // }
      // this.ballArr.map((item, index) => {
      //   creatBall(item.agency).show();
      // });
      console.log(this.ballArr);

      if (this.ballArr.length == 0) {
        return false;
      }

      let showBalls = this.ballArr.map((item, index, arr) => {
        switch (arr.length) {
          case 1:
            return [
              Math.random() * 20 + 280,
              Math.random() * 150 + 40,
              item.agency,
              item.nodeIp,
            ];
          case 2:
            return [
              Math.random() * 20 + 120 * index + 40,
              Math.random() * 150 + 40,
              item.agency,
              item.nodeIp,
            ];
          case 3:
            return [
              Math.random() * 20 + 100 * index + 40,
              Math.random() * 150 + 40,
              item.agency,
              item.nodeIp,
            ];
          case 4:
            return [
              Math.random() * 30 + 90 * index + 40,
              Math.random() * 90 + 40,
              item.agency,
              item.nodeIp,
            ];
          case 5:
            return [
              Math.random() * 20 + 80 * index + 40,
              Math.random() * 150 + 40,
              item.agency,
              item.nodeIp,
            ];
          case 6:
            return [
              Math.random() * 20 + 60 * index + 40,
              Math.random() * 150 + 40,
              item.agency,
              item.nodeIp,
            ];

          default:
            return [
              Math.random() * 100 + 50 * index,
              Math.random() * 180 + 40,
              item.agency,
              item.nodeIp,
            ];
        }
      });
      let ballsPoint = showBalls.map((item, index) => {
        return [item[0], item[1]];
      });
      console.log(showBalls);
      let showPoint = [];
      for (let i = 0; i < showBalls.length - 1; i++) {
        for (let j = showBalls.length - 1; j > i; j--) {
          showPoint.push([
            {
              coord: showBalls[i],
            },
            {
              coord: showBalls[j],
            },
          ]);
        }
      }
      this.nodeVar = this.$echarts.init(this.$refs.groupCanvas);
      let option = {
        grid: {
          x: 0,
          y: 0,
          x2: 0,
          y2: 0,
          show: false,
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          show: false,
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            type: "effectScatter",
            coordinateSystem: "cartesian2d",
            data: showBalls,
            symbol: "circle",
            symbolSize: function (value) {
              return value[2] == "jinzhiwen" ? 40 : 30;
            },
            color: "#4F94FF",
            label: {
              color: "#4F94FF",
              position: "bottom",
              show: true,
              fontSize: 16,
              offset: [0, 10],
              fontFamily: "PingFang SC",
              fontWeight: "medium",
              formatter: function (p) {
                console.log(p);
                return p.value[2];
              },
            },
            tooltip: {
              // position: function (p) {
              //   //其中p为当前鼠标的位置
              //   return [0, 0];
              // },
              trigger: "item",
              formatter(params) {
                console.log(params);
                let arr = [params.value[2], "节点数：/s", params.value[3]];
                return (
                  "机构IP：" +
                  params.value[3] +
                  "<br/>" +
                  '<span style=" display: inline-block;margin-top:42px;">' +
                  params.value[2] +
                  "</span>"
                );
              },
              backgroundColor: "rgba(159,197,255, 0.15)",
              borderColor: "#3371D0",
              borderWidth: 1,
              extraCssText:
                "width:160px;height:73px;border-radius:0;border: 1px solid #3371D0;",
              padding: [12, 10],
              textStyle: {
                color: "#FFFFFF",
                fontFamily: "PingFang SC",
                fontWeight: "medium",
                fontSize: "16px",
              },
            },
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke",
              number: 2,
              scale: 2,
            },
            emphasis: {
              show: true,
              focus: "self",
              scale: true,
            },
            markLine: {
              data: showPoint,
              silent: true,
              symbol: "none",
            },
          },
        ],
      };

      this.nodeVar.setOption(option);
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
  color: rgba(255, 255, 255, 0.55);
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
  color: rgba(255, 255, 255, 0.9);
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
  color: rgba(255, 255, 255, 0.9);
  width: 1.425rem;
  height: 0.375rem;
  line-height: 0.375rem;
  top: calc(50% - 0.1875rem);
  left: calc(50% - 0.7125rem);
  position: absolute;
  background-image: linear-gradient(
    to right,
    #2e82ff 0%,
    #1959b9 50%,
    #0a1f3f 100%
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
  color: rgb(255, 255, 255, 0.55);
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
#groupCanvas {
  width: 100%;
  height: 100%;
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
  cursor: pointer;
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
  cursor: pointer;
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
  color: rgba(255, 255, 255, 0.75);
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
  box-sizing: border-box;
  background: rgba(51, 113, 208, 0.15);
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
.items {
  background: url("../../assets/largeScreen/data_bg.svg") no-repeat top center;
  background-size: 100% 100%;
  width: 3.225rem;
  height: 1.425rem;
  display: inline-block;
}
.items p {
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
.items div {
  margin-left: 0.3125rem;
  margin-top: 0.05rem;
  color: #ffffff;
  font-family: Helvetica Neue;
  font-weight: medium;
  font-size: 30px;
  line-height: 0.5rem;
  letter-spacing: 0px;
  text-align: left;
}
</style>
