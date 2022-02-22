<template>
  <div class="navMenu">
    <div class="content-head-title">
      <span class="content-head-icon" v-if="icon" @click="skip">
        <i class="wbs-icon-back"></i>
      </span>
      <span :class="{ 'font-color-9da2ab': headSubTitle }">{{ title }}</span>
      <span v-show="headSubTitle" class="font-color-9da2ab">/</span>
      <span>{{ headSubTitle }}</span>
      <el-tooltip
        effect="dark"
        placement="bottom-start"
        v-if="headTooltip"
        offset="0"
      >
        <div slot="content">{{ headTooltip }}</div>
        <i class="el-icon-info contract-icon font-15"></i>
      </el-tooltip>
      <a
        v-if="headHref"
        target="_blank"
        :href="headHref.href"
        class="font-color-fff font-12"
        >{{ headHref.content }}</a
      >
    </div>
    <div :class="['guideLine',{'guideCheck':navContentShow}]" v-if="noShow">
      <el-button
        size="small"
        type=""
        icon="el-icon-tickets"
        @click="navShow"
      ></el-button>
    </div>
  </div>
</template>

<script>
import Bus from "@/bus";
export default {
  props: {
    icon: {
      type: Boolean,
    },
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
  watch: {
    headTitle: function (val) {
      this.title = val;
    },
    updateGroup: function (val) {
      this.getGroupList();
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
      navContentShow: false,
      noShow:true
    };
  },
  watch: {
    navContentShow(newNav, oldNav) {
      Bus.$emit("navIfShow", newNav);
    },
  },
  mounted(){
       let that = this;
    Bus.$on("closeContent", () => {
      that.navContentShow = false;
    });
     this.currentRoute=this.$route.path;
   let pre=this.currentRoute.substring(1)
   if(pre=='contractWarehouse'||pre=='appManagement'||pre=='contract'||pre=='hostMetric'||pre=='nodesMetric'){
     this.noShow=false
   }
  },
  methods: {
    skip: function () {
      if (this.route) {
        this.$router.push(this.way);
      } else {
        this.$router.go(-1);
      }
    },
    navShow() {
      this.navContentShow = !this.navContentShow;
    },
  },
};
</script>

<style scoped>
.navMenu {
  width: 100%;
  line-height: 54px;
  height: 54px;
  display: inline-block;
  /* background-color: pink; */
  position: relative;
}
.content-head-title {
  display: inline-block;
  font-size: 16px;
  color: black;
  font-weight: bold;
}
.guideLine {
  position: absolute;
  right: 0;
  top: 0;
}
.guideLine button{
    color: rgb(96, 98, 102);
    border-color: #DCDFE6;
    background-color: #FFF;
}
.guideCheck button{
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
}
</style>