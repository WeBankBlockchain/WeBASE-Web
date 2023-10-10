<template>
  <div style="height: 100%">
    <newMain v-if="deployType == 0"></newMain>
    <mains v-if="deployType == 1"></mains>
  </div>
</template>

<script>
import newMain from "./newMain";
import mains from "./main";
import { getDeployType } from "@/util/api";
export default {
  name: "index",
  components: {
    newMain,
    mains,
  },
  data: function () {
    return {
      deployType: null,
    };
  },
  created: function () {
    localStorage.removeItem("selectData");
    sessionStorage.setItem("accountStatus", 2);
    this.getConfigType();
  },
  methods: {
    getConfigType: function () {
      getDeployType()
        .then((res) => {
          if (res.data.code == 0) {
            localStorage.setItem("deployType", res.data.data);
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              // type: "error",
              duration: 2000,
            });
          }

          if (localStorage.getItem("deployType")) {
            this.deployType = localStorage.getItem("deployType");
          } else {
            this.deployType = 0;
          }
        })
        .catch((err) => {
          this.$message({
            message: this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
          this.deployType = 0;
        });
    },
  },
};
</script>

<style></style>
