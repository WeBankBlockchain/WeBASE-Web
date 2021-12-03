<template>
  <div id="LargeSreenLoad" class="load">
    <div class="header">
      <div class="nav">
        <div class="navLeft"></div>
        <div class="leftLine"></div>
        <div class="navMiddle">
          <span>WeBASE数据大屏</span>
        </div>
        <div class="rightLine"></div>
        <div class="navRight"></div>
      </div>
    </div>
    <div class="loading">
      <div class="loadContent">
        <ul class="loadStyle">
          <li
            class="cellStyle"
            :class="{ loadColor: item > 1 }"
            v-for="(item, index) in loadCell"
            :key="index"
          ></li>
        </ul>
        <div class="loadTip">数据加载中...</div>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
export default {
  name: "LargeSreenLoad",
  components: {},
  data() {
    return {
      loadCell: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
      ],
    };
  },
  mounted() {
    this.fillStyle();
  },
  methods: {
    fillStyle() {
      let _this = this;
      let num = 0;
      setInterval(function () {
        if (_this.loadCell.includes(1)) {
          _this.$set(_this.loadCell, num, 2);
          num++;
        } else {
          _this.loadCell = [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1,
          ];
          num = 0;
        }
      }, 50);
    },
  },
};
</script>

<style scoped less>
#LargeSreenLoad {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000000;
  min-height: 720px;
  min-width: 1280px;
}
.header {
  position: absolute;
  top: 12px;
  width: 100%;
  height: 70px;
  /* background: url("../../assets/largeScreen/nav_middle_bg.svg") no-repeat top center;
  background-size: 100% 100%; */
  color: #4f94ff;
  font-family: PingFang SC;
  font-weight: semibold;
  font-size: 28px;
  line-height: normal;
  letter-spacing: 0px;
  text-align: center;
}
.nav {
  width: 100%;
  height: 100%;
  position: relative;
}
.navLeft {
  background: url("../../assets/largeScreen/nav_left_bg.svg") no-repeat top
    center;
  background-size: 100% 100%;
  height: 70px;
  width: 293px;
  position: absolute;
  top: 0;
  left: 0;
}
.navRight {
  background: url("../../assets/largeScreen/nav_right_bg.svg") no-repeat top
    center;
  background-size: 100% 100%;
  height: 70px;
  width: 293px;
  position: absolute;
  top: 0;
  right: 0;
}
.navMiddle {
  background: url("../../assets/largeScreen/nav_middle_bg.svg") no-repeat top
    center;
  background-size: 100% 100%;
  height: 71px;
  width: 695px;
  margin: 0 auto;
}
.leftLine {
  width: calc(50% - 640px);
  height: 2px;
  background-color: #3371d0;
  position: absolute;
  left: 293px;
  top: 50%;
}
.rightLine {
  width: calc(50% - 640px);
  height: 2px;
  background-color: #3371d0;
  position: absolute;
  right: 293px;
  top: 50%;
}
.header span {
  line-height: 57px;
}
.footer {
  background: url("../../assets/largeScreen/footer_bg.svg") no-repeat top center;
  background-size: 100% 100%;
  width: 100%;
  height: 68px;
  position: absolute;
  bottom: 12px;
  left: 0;
}
.loading {
  position: absolute;
  top: 80px;
  width: 100%;
  height: calc(100% - 143.5px);
  /* background-color: pink; */
}
.loadContent {
  width: 100%;
  height: 100%;
  /* background-color: royalblue; */
  position: relative;
  /* display: none; */
}
.loadStyle {
  list-style: none;
  position: absolute;
  top: 37.5%;
  left: calc(50% - 210px);
}
.cellStyle {
  width: 8px;
  height: 24px;
  display: inline-block;
  box-sizing: border-box;
  /* background-color:slateblue; */
  border: 1px solid #3371d0;
  margin-right: 6px;
}
.loadTip {
  width: 94px;
  height: 22px;
  position: absolute;
  top: calc(37.5% + 48px);
  left: calc(50% - 45px);
  color: #4f94ff;
  font-family: PingFang SC;
  font-weight: semibold;
  font-size: 16px;
  line-height: normal;
  letter-spacing: 0px;
}
.loadColor {
  background: #4f94ff;
}
</style>
