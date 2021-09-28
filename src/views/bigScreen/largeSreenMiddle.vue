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
          <div class="group_left"></div>
          <div class="group_middle">
            <div class="middle1"></div>
            <div class="middleGroup">{{ groupMiddle }}</div>
            <div class="middle2"></div>
          </div>
          <div class="group_right"></div>
        </div>
        <div class="data_content">
          <div id="groupCanvas" ref="groupCanvas"></div>
        </div>
        <!-- <div class="leftArr"></div> -->
        <!-- <div class="rightArr"></div> -->
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
      renderOne:null
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
    this.reRender();
  },
  destroyed() {
    window.removeEventListener("resize", this.threeAdapter);
    clearInterval(this.renderOne)
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
            agency: item.agency?item.agency:'-',
            nodeIp: item.nodeIp?item.nodeIp:'-',
          };
        });
        console.log(resData);
        //this.ballArr = resData.slice(2);
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
              Math.random() * 20 + 110 * index + 40,
              Math.random() * 100 + 30 ,
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
              Math.random() * 30 + 90 * index + 30,
              Math.random() * 80 + 10,
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
          x: '5%',
          y: '10%',
          x2: '5%',
          y2: '5%',
          show: false,
        },
        xAxis: {
          show: false,
        //data:[0,100,200,300,400,500,600]
        },
        yAxis: {
          show: false,
          //type: 'value',
         // data:[0,100,200,300]
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            type: "effectScatter",
            coordinateSystem: "cartesian2d",
            data: showBalls,
            symbol:
              "image://data:image/png;base64,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",
            symbolSize: function (value) {
              return value[2] == "jinzhiwen" ? 40 : 30;
            },
            rippleEffect: {
              brushType: "stroke",
            },
            color: "rgba(51, 113, 208, 1)",
            //          symbol: "path://M0.5404999852180481,31C0.5404999852180481,14.171546936035156,14.171546936035156,0.5404999852180481,31,0.5404999852180481C47.828453063964844,0.5404999852180481,61.45949935913086,14.171546936035156,61.45949935913086,31C61.45949935913086,47.828453063964844,47.828453063964844,61.45949935913086,31,61.45949935913086C14.171546936035156,61.45949935913086,0.5404999852180481,47.828453063964844,0.5404999852180481,31Z M23.774900436401367,17.646099090576172L23.774900436401367,17.64620018005371L23.783000946044922,17.641700744628906L32.07780075073242,13.019800186157227C32.152400970458984,12.980600357055664,32.23720169067383,12.959500312805176,32.32429885864258,12.959500312805176C32.411399841308594,12.959500312805176,32.49620056152344,12.980600357055664,32.570899963378906,13.019800186157227L40.8656005859375,17.641700744628906L40.8656005859375,17.641799926757812L40.87379837036133,17.646099090576172C40.94449996948242,17.683799743652344,41.00090026855469,17.738000869750977,41.03889846801758,17.801000595092773C41.076698303222656,17.863800048828125,41.095401763916016,17.933700561523438,41.094600677490234,18.003599166870117L41.09450149536133,18.003599166870117L41.09450149536133,18.00979995727539L41.09450149536133,27.253799438476562C41.09280014038086,27.326499938964844,41.071998596191406,27.398799896240234,41.03269958496094,27.463899612426758L41.460899353027344,27.722200393676758L41.03269958496094,27.463899612426758C40.993099212646484,27.529699325561523,40.93539810180664,27.586599349975586,40.86349868774414,27.62779998779297C40.862998962402344,27.62809944152832,40.86249923706055,27.628400802612305,40.86199951171875,27.628700256347656L32.570899963378906,32.24850082397461C32.49620056152344,32.28770065307617,32.411399841308594,32.308799743652344,32.32429885864258,32.308799743652344C32.237300872802734,32.308799743652344,32.152400970458984,32.28770065307617,32.07780075073242,32.24850082397461L23.78660011291504,27.628700256347656C23.78619956970215,27.628400802612305,23.78569984436035,27.62809944152832,23.785200119018555,27.62779998779297C23.713300704956055,27.586700439453125,23.65559959411621,27.529699325561523,23.61590003967285,27.463899612426758C23.57659912109375,27.398799896240234,23.55590057373047,27.326499938964844,23.554100036621094,27.253700256347656L23.554100036621094,18.00979995727539L23.55419921875,18.00979995727539L23.554100036621094,18.003599166870117C23.553199768066406,17.933700561523438,23.5718994140625,17.863800048828125,23.609800338745117,17.801000595092773C23.64780044555664,17.738000869750977,23.704200744628906,17.683799743652344,23.774900436401367,17.646099090576172Z M31.896900177001953,16.101600646972656L26.428300857543945,19.10930061340332C26.3302001953125,19.160900115966797,26.248699188232422,19.236799240112305,26.192399978637695,19.32900047302246C26.13599967956543,19.421100616455078,26.10700035095215,19.526100158691406,26.108299255371094,19.63279914855957L26.108299255371094,25.648099899291992C26.11009979248047,25.754100799560547,26.140399932861328,25.857999801635742,26.196399688720703,25.949600219726562C26.252399444580078,26.04129981994629,26.332300186157227,26.117700576782227,26.428300857543945,26.171600341796875L31.896900177001953,29.17919921875C31.994800567626953,29.230899810791016,32.10490036010742,29.257999420166016,32.216800689697266,29.257999420166016C32.328800201416016,29.257999420166016,32.438899993896484,29.230899810791016,32.53670120239258,29.17919921875L38.005401611328125,26.171600341796875C38.10139846801758,26.117700576782227,38.18119812011719,26.04129981994629,38.237300872802734,25.949600219726562C38.29330062866211,25.857999801635742,38.32360076904297,25.754100799560547,38.32529830932617,25.648099899291992L38.32529830932617,19.63279914855957C38.326698303222656,19.526100158691406,38.29759979248047,19.421100616455078,38.24129867553711,19.32900047302246C38.185001373291016,19.236799240112305,38.10340118408203,19.160900115966797,38.005401611328125,19.10930061340332L32.53670120239258,16.101600646972656C32.438899993896484,16.04990005493164,32.328800201416016,16.02280044555664,32.216800689697266,16.02280044555664C32.10490036010742,16.02280044555664,31.994800567626953,16.04990005493164,31.896900177001953,16.101600646972656Z M32.09830093383789,31.904600143432617L32.09830093383789,22.56329917907715L23.958499908447266,17.88610076904297 M40.23789978027344,17.88610076904297L32.09809875488281,22.56329917907715L32.09809875488281,31.904600143432617 M48.21620178222656,45.003299713134766L48.21620178222656,39.057701110839844C48.217498779296875,38.952301025390625,48.1890983581543,38.8484992980957,48.13420104980469,38.75740051269531C48.079200744628906,38.66630172729492,47.999698638916016,38.59130096435547,47.90409851074219,38.54029846191406L42.56890106201172,35.567501068115234M48.21620178222656,45.003299713134766L47.71620178222656,44.99530029296875C47.71620178222656,44.99599838256836,47.71620178222656,44.99679946899414,47.71620178222656,44.997501373291016M48.21620178222656,45.003299713134766C48.214500427246094,45.10810089111328,48.184898376464844,45.21070098876953,48.13019943237305,45.30139923095703C48.075599670410156,45.391998291015625,47.99769973754883,45.467498779296875,47.90409851074219,45.52069854736328M48.21620178222656,45.003299713134766L47.71620178222656,45.003299713134766L47.71620178222656,44.997501373291016M47.71620178222656,44.997501373291016L47.71620178222656,39.057701110839844L47.71620178222656,39.05149841308594L47.71620178222656,39.05149841308594C47.716400146484375,39.040199279785156,47.713401794433594,39.027801513671875,47.70600128173828,39.01570129394531C47.69860076904297,39.003299713134766,47.6864013671875,38.99089813232422,47.668800354003906,38.98149871826172L47.66059875488281,38.97710037231445L47.660701751708984,38.97710037231445L42.33060073852539,36.00709915161133M47.71620178222656,44.997501373291016C47.715599060058594,45.01250076293945,47.71120071411133,45.028099060058594,47.70209884643555,45.04309844970703C47.69269943237305,45.05870056152344,47.678199768066406,45.073699951171875,47.658199310302734,45.08530044555664M42.33060073852539,36.00709915161133C42.33140182495117,36.00749969482422,42.332298278808594,36.007999420166016,42.333099365234375,36.008399963378906L42.56890106201172,35.567501068115234M42.33060073852539,36.00709915161133L42.32550048828125,36.00429916381836L42.56890106201172,35.567501068115234M42.33060073852539,36.00709915161133C42.308799743652344,35.99599838256836,42.28340148925781,35.989601135253906,42.25680160522461,35.989601135253906C42.230098724365234,35.989601135253906,42.2047004699707,35.99599838256836,42.182899475097656,36.00709915161133M42.56890106201172,35.567501068115234C42.4734001159668,35.51639938354492,42.36600112915039,35.489601135253906,42.25680160522461,35.489601135253906C42.14759826660156,35.489601135253906,42.040199279785156,35.51639938354492,41.94459915161133,35.567501068115234M41.94459915161133,35.567501068115234L42.1879997253418,36.00429916381836L42.182899475097656,36.00709915161133M41.94459915161133,35.567501068115234L36.609500885009766,38.54029846191406C36.51380157470703,38.59130096435547,36.43429946899414,38.66630172729492,36.37929916381836,38.75740051269531C36.32440185546875,38.8484992980957,36.29600143432617,38.952301025390625,36.297298431396484,39.057701110839844L36.297298431396484,45.003299713134766M41.94459915161133,35.567501068115234L42.18040084838867,36.008399963378906C42.18119812011719,36.007999420166016,42.182098388671875,36.00749969482422,42.182899475097656,36.00709915161133M42.182899475097656,36.00709915161133L36.85279846191406,38.97710037231445L36.84469985961914,38.98160171508789L36.84469985961914,38.98149871826172C36.82709884643555,38.99089813232422,36.81489944458008,39.00339889526367,36.807498931884766,39.01570129394531L36.385101318359375,38.76089859008789L36.807498931884766,39.01570129394531C36.80009841918945,39.027801513671875,36.79719924926758,39.040199279785156,36.797298431396484,39.05149841308594L36.797401428222656,39.057701110839844L36.797298431396484,39.057701110839844L36.797298431396484,44.997501373291016M36.797298431396484,44.997501373291016C36.797298431396484,44.99679946899414,36.797298431396484,44.99599838256836,36.797298431396484,44.99530029296875L36.297298431396484,45.003299713134766M36.797298431396484,44.997501373291016L36.797298431396484,45.003299713134766L36.297298431396484,45.003299713134766M36.797298431396484,44.997501373291016C36.79800033569336,45.01250076293945,36.802398681640625,45.028099060058594,36.8114013671875,45.04309844970703L36.38330078125,45.30139923095703M36.297298431396484,45.003299713134766C36.29899978637695,45.10810089111328,36.3286018371582,45.21070098876953,36.38330078125,45.30139923095703M36.38330078125,45.30139923095703L36.8114013671875,45.04309844970703C36.82080078125,45.05870056152344,36.83539962768555,45.073699951171875,36.85530090332031,45.08530044555664M36.38330078125,45.30139923095703C36.43790054321289,45.391998291015625,36.51580047607422,45.467498779296875,36.609500885009766,45.52069854736328M36.85530090332031,45.08530044555664L42.182899475097656,48.05390167236328M36.85530090332031,45.08530044555664C36.8557014465332,45.08549880981445,36.85609817504883,45.08580017089844,36.85649871826172,45.08599853515625L36.609500885009766,45.52069854736328M36.85530090332031,45.08530044555664L36.85279846191406,45.083900451660156L36.609500885009766,45.52069854736328M36.609500885009766,45.52069854736328L41.94459915161133,48.493499755859375M41.94459915161133,48.493499755859375C42.040199279785156,48.54460144042969,42.14759826660156,48.5713996887207,42.25680160522461,48.5713996887207C42.36600112915039,48.5713996887207,42.4734001159668,48.54460144042969,42.56890106201172,48.493499755859375M41.94459915161133,48.493499755859375L42.1879997253418,48.05670166015625L42.182899475097656,48.05390167236328M41.94459915161133,48.493499755859375L42.18040084838867,48.0526008605957C42.18119812011719,48.053001403808594,42.182098388671875,48.05350112915039,42.182899475097656,48.05390167236328M42.56890106201172,48.493499755859375L47.90409851074219,45.52069854736328M42.56890106201172,48.493499755859375L42.333099365234375,48.0526008605957C42.332298278808594,48.053001403808594,42.33140182495117,48.05350112915039,42.33060073852539,48.05390167236328M42.56890106201172,48.493499755859375L42.32550048828125,48.05670166015625L42.33060073852539,48.05390167236328M47.90409851074219,45.52069854736328L47.65700149536133,45.08599853515625C47.65739822387695,45.08580017089844,47.657798767089844,45.08549880981445,47.658199310302734,45.08530044555664M47.90409851074219,45.52069854736328L47.660701751708984,45.083900451660156L47.658199310302734,45.08530044555664M47.658199310302734,45.08530044555664L42.33060073852539,48.05390167236328M42.33060073852539,48.05390167236328C42.308799743652344,48.064998626708984,42.28340148925781,48.0713996887207,42.25680160522461,48.0713996887207C42.230098724365234,48.0713996887207,42.2047004699707,48.064998626708984,42.182899475097656,48.05390167236328 M42.06959915161133,38.642799377441406L38.868499755859375,40.26789855957031C38.811100006103516,40.295799255371094,38.76340103149414,40.33679962158203,38.73040008544922,40.386600494384766C38.6973991394043,40.4364013671875,38.68040084838867,40.493099212646484,38.68119812011719,40.55080032348633L38.68119812011719,43.80099868774414C38.68220138549805,43.858299255371094,38.70000076293945,43.914398193359375,38.7327995300293,43.9640007019043C38.76559829711914,44.01350021362305,38.81230163574219,44.0547981262207,38.868499755859375,44.083900451660156L42.06959915161133,45.70899963378906C42.12689971923828,45.736900329589844,42.19139862060547,45.7515983581543,42.256900787353516,45.7515983581543C42.3223991394043,45.7515983581543,42.38679885864258,45.736900329589844,42.44409942626953,45.70899963378906L45.645301818847656,44.083900451660156C45.70140075683594,44.0547981262207,45.748199462890625,44.01350021362305,45.78099822998047,43.9640007019043C45.81380081176758,43.914398193359375,45.83150100708008,43.858299255371094,45.83250045776367,43.80099868774414L45.83250045776367,40.55080032348633C45.83330154418945,40.493099212646484,45.81629943847656,40.4364013671875,45.78329849243164,40.386600494384766C45.75040054321289,40.33679962158203,45.702598571777344,40.295799255371094,45.645301818847656,40.26789855957031L42.44409942626953,38.642799377441406C42.38679885864258,38.614898681640625,42.3223991394043,38.60020065307617,42.256900787353516,38.60020065307617C42.19139862060547,38.60020065307617,42.12689971923828,38.614898681640625,42.06959915161133,38.642799377441406Z M42.11140060424805,47.989601135253906L42.11140060424805,41.98460006713867L36.878700256347656,38.97779846191406 M47.344200134277344,38.97779846191406L42.11149978637695,41.98460006713867L42.11149978637695,47.989601135253906 M14.409799575805664,35.26020050048828L14.409799575805664,35.26020050048828L14.417900085449219,35.255699157714844L21.092100143432617,31.536800384521484C21.137800216674805,31.51300048828125,21.190099716186523,31.5,21.24410057067871,31.5C21.298099517822266,31.5,21.350400924682617,31.51300048828125,21.39620018005371,31.536800384521484L28.07040023803711,35.255699157714844L28.07029914855957,35.25579833984375L28.078500747680664,35.26020050048828C28.12019920349121,35.28239822387695,28.15239906311035,35.31380081176758,28.1737003326416,35.349098205566406C28.194900512695312,35.38420104980469,28.204999923706055,35.42259979248047,28.204500198364258,35.46049880981445L28.204500198364258,35.46049880981445L28.204500198364258,35.46670150756836L28.204500198364258,42.904598236083984C28.20330047607422,42.945701599121094,28.191499710083008,42.986900329589844,28.168699264526367,43.024600982666016C28.145599365234375,43.06290054321289,28.111600875854492,43.096900939941406,28.068099975585938,43.12189865112305L21.39620018005371,46.839599609375C21.350400924682617,46.863399505615234,21.298099517822266,46.876399993896484,21.24410057067871,46.876399993896484C21.190099716186523,46.876399993896484,21.137800216674805,46.863399505615234,21.092100143432617,46.839599609375L14.42020034790039,43.12189865112305C14.376700401306152,43.096900939941406,14.342599868774414,43.06290054321289,14.319499969482422,43.024600982666016C14.296799659729004,42.986900329589844,14.28499984741211,42.945701599121094,14.28380012512207,42.904598236083984L14.28380012512207,35.46670150756836L14.283900260925293,35.46670150756836L14.28380012512207,35.46049880981445C14.283300399780273,35.42259979248047,14.293399810791016,35.38420104980469,14.314599990844727,35.349098205566406C14.33590030670166,35.31380081176758,14.3681001663208,35.28239822387695,14.409799575805664,35.26020050048828Z M20.900100708007812,33.93090057373047L16.499099731445312,36.35139846801758C16.42020034790039,36.39289855957031,16.35460090637207,36.45399856567383,16.30929946899414,36.5281982421875C16.263999938964844,36.60240173339844,16.2406005859375,36.6869010925293,16.24169921875,36.772701263427734L16.24169921875,41.61360168457031C16.243099212646484,41.69889831542969,16.267499923706055,41.782501220703125,16.312599182128906,41.856300354003906C16.35759925842285,41.93000030517578,16.421899795532227,41.99150085449219,16.499099731445312,42.0349006652832L20.900100708007812,44.455299377441406C20.978900909423828,44.49689865112305,21.0674991607666,44.518699645996094,21.15760040283203,44.518699645996094C21.247600555419922,44.518699645996094,21.336200714111328,44.49689865112305,21.415000915527344,44.455299377441406L25.81599998474121,42.0349006652832C25.893199920654297,41.99150085449219,25.957500457763672,41.93000030517578,26.002599716186523,41.856300354003906C26.047700881958008,41.782501220703125,26.072099685668945,41.69889831542969,26.073400497436523,41.61360168457031L26.073400497436523,36.772701263427734C26.074499130249023,36.6869010925293,26.05120086669922,36.60240173339844,26.005800247192383,36.5281982421875C25.960500717163086,36.45399856567383,25.894899368286133,36.39289855957031,25.81599998474121,36.35139846801758L21.415000915527344,33.93090057373047C21.336200714111328,33.889400482177734,21.247600555419922,33.86759948730469,21.15760040283203,33.86759948730469C21.0674991607666,33.86759948730469,20.978900909423828,33.889400482177734,20.900100708007812,33.93090057373047Z M21.062299728393555,46.64860153198242L21.062299728393555,39.131099700927734L14.511699676513672,35.36709976196289 M27.612600326538086,35.36709976196289L21.062000274658203,39.131099700927734L21.062000274658203,46.64860153198242",
            // rippleEffect: {
            //   brushType: "stroke",
            //   color: "rgba(45, 164, 21, 1)",
            //   scale: 3
            // },
            // itemStyle: {
            //   borderCap: "round",
            //   color: "rgba(241, 240, 238, 0.04)"
            // },
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
                  '<span style=" display: inline-block;margin-top:10px;">' +
                  params.value[2] +
                  "</span>"
                );
              },
              backgroundColor: "rgba(159,197,255, 0.15)",
              borderColor: "#3371D0",
              borderWidth: 1,
              extraCssText: "border-radius:0;border: 1px solid #3371D0;",
              padding: [10, 10],
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
    reRender() {
      let _this = this;
     this.renderOne = setInterval(function () {
        //_this.oneInit();
        _this.oneReqUpdate();
        _this.twoInit();
        _this.threeReqUpdate();
      }, 10000);
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
    #0a1f3f 0%,
    #0a1f3f 50%,
    #2e82ff 100%
  );
  animation: gradualChange 2s infinite linear;
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
  margin: .125rem 0.45rem;
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
  border: 1px solid rgba(51, 113, 208, 0.5);
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
