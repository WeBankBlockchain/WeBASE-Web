<template>
  <div id="largeSreenHeader" class="header">
    <div class="header">
      <div class="nav">
        <div class="navLeft">
          <div class="leftContent" @click="backHome">
            <img src="../../assets/largeScreen/back_home.svg" />
            <span>返回首页</span>
          </div>
        </div>
        <div class="leftLine"></div>
        <div class="navMiddle">
          <span>{{ groupName }}</span>
        </div>
        <div class="rightLine"></div>
        <div class="navRight">
          <span class="time1">{{ nowTime1 }}</span>
          <span class="time2">{{ nowTime2 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import backHome from '@/assets/logo.png'
import { getGroupName } from "@/util/api";
import { format } from "@/util/util";
import to from "await-to-js";
export default {
  name: "largeSreenHeader",
  components: {},
  data() {
    return {
      nowTime1: "",
      nowTime2: "",
      groupId: localStorage.getItem("groupId"),
      groupName: "WeBASE数据大屏",
    };
  },
  mounted() {
    this.getTime();
    this.getGroupNames();
  },
  methods: {
    getTime() {
      setInterval(() => {
        let time = new Date();
        let nowTime1 = format(time, "yyyy-MM-dd");
        let nowTime2 = format(time, "HH:mm:ss");
        // console.log(nowTime1);
        // console.log(nowTime2);
        this.nowTime1 = nowTime1;
        this.nowTime2 = nowTime2;
      }, 1000);
    },
    backHome() {
      //this.$emit('cancelfullScreen');
      this.$router.replace("/home");
    },
    async getGroupNames() {
      let groupId = this.groupId;
      let [err, res] = await to(getGroupName(groupId));
      if (err) {
        console.log("getgroupReqError");
        return;
      } else {
        if (res.status != 200) {
          console.log(res.data.message);
          return;
        }
        if (
          res.data.data.description == "" ||
          res.data.data.description == null ||
          res.data.data.description == "synchronous"
        ) {
          this.groupName = "WeBASE数据大屏";
        } else {
          this.groupName = res.data.data.description;
        }
      }
    },
  },
};
</script>

<style>
.header {
  /* position: absolute;
  top: 12px; */
  /* padding-top: 12px; */
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
.navLeft img {
  width: 34px;
  height: 20px;
  position: absolute;
  left: 0;
  top: 4px;
}
.navLeft span {
  width: 80px;
  height: 28px;
  color: #3371d0;
  font-family: PingFang SC;
  font-weight: medium;
  font-size: 20px;
  line-height: normal;
  position: absolute;
  left: 45px;
  top: 0;
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
.navMiddle span {
  line-height: 57px;
}
.leftContent {
  width: 125px;
  height: 28px;
  position: relative;
  margin-top: 16px;
  margin-left: 48px;
  cursor: pointer;
}
.time1 {
  color: #3371d0;
  font-family: PingFang SC;
  font-weight: medium;
  font-size: 16px;
  line-height: normal;
  letter-spacing: 0px;
  text-align: center;
  display: inline-block;
  margin-left: 42px;
  margin-top: 18px;
}
.time2 {
  color: #3371d0;
  font-family: DIN;
  font-weight: bold;
  font-size: 20px;
  line-height: normal;
  letter-spacing: 0px;
  text-align: center;
  display: inline-block;
  margin-left: 12px;
  margin-top: 18px;
}
</style>
