<template>
  <div class="navContent" :class="{ contentShows: contentShow }">
    <div class="content-head-title">
      <span>操作指引</span>
      <el-button
        icon="el-icon-close"
        class="closeNav"
        @click="closeContent"
      ></el-button>
    </div>
    <div class="contents">
      <el-collapse
        v-model="activeNames"
        v-for="(item, index) in contents"
        :key="index"
      >
        <el-collapse-item :title="item.title" :name="index">
          <div v-html="item.content"></div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import Bus from "@/bus";
import navContent from "../../../static/navContents/zh.js";
export default {
  props: {
    headTitle: {
      type: String,
    },
    headSubTitle: {
      type: String,
    },
    headTooltip: {
      type: String,
    },
    headHref: {
      type: Object,
    },
  },
  mounted() {
    let that = this;
    Bus.$on("navIfShow", () => {
      //console.log(that.contentShow);
      that.contentShow = !that.contentShow;
    });
    Bus.$on("closeNav", () => {
      that.contentShow = true;
    });
    //console.log(navContent);
    this.getContents();
  },
  watch: {
    headTitle: function (val) {
      this.title = val;
    },
    updateGroup: function (val) {
      this.getGroupList();
    },
    $route: function () {
      this.getContents();
    },
  },
  data: function () {
    return {
      title: this.headTitle,
      groupName: "-",
      accountName: "-",
      dialogShow: false,
      path: "",
      headIcon: this.icon || false,
      way: this.route || "",
      changePasswordDialogVisible: false,
      groupList: [],
      abnormalList: [],
      root: localStorage.getItem("root"),
      groupVisible: false,
      versionInfoVisible: false,
      contentShow: true,
      activeNames: [],
      contents: [],
      currentRoute: "",
    };
  },
  methods: {
    getContents() {
      this.currentRoute = this.$route.path;
      let pre = this.currentRoute.substring(1);
      this.contents = navContent[pre];
      if (this.$route.path == "/front") {
        if (localStorage.getItem("deployType1")==0) {
          this.contents = navContent["newNodes"];
        } else {
          this.contents = navContent["newNode"];
        }
      }
      if (this.contents) {
        this.contents.map((item, index) => {
          this.activeNames.push(index);
        });
      }
    },
    skip: function () {
      if (this.route) {
        this.$router.push(this.way);
      } else {
        this.$router.go(-1);
      }
    },
    closeContent() {
      Bus.$emit("closeContent", true);
    },
  },
};
</script>

<style scoped>
.navContent {
  line-height: 100%;
  display: inline-block;
  background-color: white;
  width: 320px;
  box-sizing: border-box;
    transition: width 0.5s;
  /* transition: 'display' 10s linear; */
}
.content-head-title {
  display: inline-block;
  font-size: 16px;
  color: black;
  font-weight: bold;
  width: 272px;
  line-height: 54px;
  position: relative;
  padding: 0 24px 0 24px;
}
.contents {
  width: 272px;
  height: 95%;
  overflow: scroll;
  padding: 0 24px 0 24px;
  border-top: 1px solid #f7f7f7;
  /* background-color: gray; */
  /* padding: 24px 24px 0 24px; */
}
.closeNav {
  position: absolute;
  top: 15px;
  right: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
}
.closeNav:hover {
  background-color: white;
}
.contentShows {
  width: 0;
  display: none;
  transition: width 0.5s;
}
</style>