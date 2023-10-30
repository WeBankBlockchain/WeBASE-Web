<template>
  <div class="front-module">
    <v-content-head
      :headTitle="$t('text.chainTitle')"
      :headSubTitle="$t('text.chainTitle')"
      ref="heads"
    ></v-content-head>
    <div class="module-wrapper">
      <div class="search-part" style="padding-top: 30px" v-if="!disabled">
        <div class="search-part-left">
          <el-button
            type="primary"
            class="search-part-left-btn"
            :disabled="disabled"
            @click="onClickAddChain"
            >{{ $t("text.addChain") }}</el-button
          >
          <!-- <el-button type="primary" class="search-part-left-btn" :disabled='!(configData && (configData.chainStatus == 3 || configData.chainStatus == 2))' @click="reset">{{$t('text.reset')}}</el-button> -->
        </div>
      </div>
    </div>
    <div class="module-wrapper" style="margin-top: 10px; padding-bottom: 20px">
      <div class="search-table">
        <el-table
          :data="chainList"
          class="search-table-content"
          v-loading="loading"
        >
          <el-table-column
            :label="$t('text.chainName')"
            prop="chainName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            :label="$t('text.chainVersion')"
            prop="version"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            :label="$t('text.chainType')"
            prop="encryptType"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.encryptType === 0">{{
                $t("text.sha256")
              }}</span>
              <span v-if="scope.row.encryptType === 1">{{
                $t("text.sm3")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('text.chainStatus')"
            prop="chainStatus"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.chainStatus != 2">{{
                ChainStatus(scope.row.chainStatus)
              }}</span>
              <span v-if="scope.row.chainStatus == 2"
                >{{ ChainStatus(scope.row.chainStatus) }}-<span
                  class="cursor-pointer"
                  style="color: #f00"
                  @click="openHostInfo"
                  >{{ $t("text.errInfo") }}</span
                ></span
              >
            </template>
          </el-table-column>

          <el-table-column :label="$t('devOpsMgmt.operate')">
            <template slot-scope="scope">
              <el-button
                :disabled="disabled"
                type="text"
                size="small"
                :style="{ color: disabled ? '#666' : '' }"
                @click="reset(scope.row)"
                >{{ $t("dialog.delete") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import modifyNodeType from "./components/modifyNodeType";
import {
  getChainList,
  deleteChain,
  getPermissionManagementStatus,
} from "@/util/api";
import setFront from "../index/dialog/setFront.vue";
import setConfig from "../index/dialog/setConfig";
import addNode from "./dialog/addNode";
import newNode from "./dialog/newNode";
import updateNode from "./dialog/updateNode";
import hostInfo from "./dialog/hostInfo";
export default {
  name: "node",
  components: {
    "v-content-head": contentHead,
    "v-setFront": setFront,
    modifyNodeType,
    "add-node": addNode,
    "new-node": newNode,
    "update-node": updateNode,
    "set-config": setConfig,
    "host-info": hostInfo,
  },
  watch: {
    $route() {
      this.urlQuery = this.$root.$route.query;
    },
  },
  data() {
    return {
      loadingNodes: false,
      disabled: false,
      chainList: [],
      isAuthEnable: false,
      loading: false,
    };
  },
  computed: {},
  mounted() {
    if (localStorage.getItem("root") === "admin") {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
    this.checkAuth();
    this.getChainTable();
  },
  methods: {
    getChainTable() {
      this.loading = true;
      getChainList()
        .then((res) => {
          if (res.data.code === 0) {
            if (res.data.data) {
              this.chainList = res.data.data;
            } else {
              this.chainList = [];
            }
          } else {
            this.chainList = [];
          }
          this.loading = false;
        })
        .catch((err) => {
          this.chainList = [];
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
          this.loading = false;
        });
    },
    /**
     * @method  重置链
     */
    reset(row) {
      const reqData = {
        chainName: row.chainName,
      };
      this.$confirm(this.$t("text.deleteChain"), this.$t("text.delete"), {
        confirmButtonText: this.$t("text.sure"),
        cancelButtonText: this.$t("text.cancel"),
        type: "warning",
      })
        .then(() => {
          this.loadingNodes = true;
          this.loading = true;
          deleteChain(reqData)
            .then((res) => {
                console.log("!!delete chain res:", res);
              if (res.data.code === 0) {
                this.$message({
                  type: "success",
                  message: this.$t("text.resetSuccess"),
                  duration: 2000,
                });

                console.log("!!!!!del cur chain");

                // 如果本地存储中保存的链数据是当前链，则需要重新获取群组列表，设置正确的链、群组
                if (localStorage.getItem("chainId") == row.chainId) {
                    console.log("!!!!!del cur chain");
                    localStorage.setItem("groupName", "");
                    localStorage.setItem("groupId", "");
                    localStorage.setItem("chainId", "");
                    localStorage.setItem("chainName", "");
                }
                console.log("!!!e3mit");
                Bus.$emit("changeHeadGroup");
                this.getChainTable();
              } else {
                this.$message({
                  type: "error",
                  message: this.$chooseLang(res.data.code),
                  duration: 2000,
                });
              }
              this.loading = false;
            })
            .catch((err) => {
              this.$message({
                message: err.data || this.$t("text.systemError"),
                type: "error",
                duration: 2000,
              });
              this.loading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("text.cancelDelete"),
          });
        });
    },
    checkAuth() {
      getPermissionManagementStatus(localStorage.getItem("groupId"))
        .then((res) => {
          if (res.data.data == true) {
            this.isAuthEnable = true;
          } else {
            this.isAuthEnable = false;
          }
        })
        .catch((err) => {});
    },
    ChainStatus(val) {
      let str = "";
      switch (val) {
        case 0:
          str = this.$t("nodes.initialize");
          break;
        case 1:
          str = this.$t("text.deploying");
          break;
        case 2:
          str = this.$t("text.deployFail");
          break;
        case 3:
          str = this.$t("text.running");
          break;
        case 4:
          str = this.$t("text.restarting");
          break;
        case 5:
          str = this.$t("nodea.upgrading");
          break;
        case 6:
          str = this.$t("text.upgradeFailed");
          break;
        case 7:
          str = this.$t("text.addingNode");
          break;
      }
      return str;
    },
    onClickAddChain() {
      this.$router.push({
        path: "/node/chain",
        query: {
          chainCount: this.chainList.length,
        },
      });
    },
  },
};
</script>
<style scoped>
.module-wrapper {
  height: 100%;
}
.search-part {
  padding: 30px 41px 18px 42px;
  overflow: hidden;
}
.search-part::after {
  display: block;
  content: "";
  clear: both;
}
.search-part-left {
  float: left;
}
.search-part-left-btn {
  border-radius: 20px;
}
.search-part-right {
  float: right;
}
.search-table {
  padding: 0 40px 0 41px;
}
.search-table-content {
  width: 100%;
}
.search-table-content >>> td,
.search-table-content >>> th {
  padding: 8px 0;
  font-size: 12px;
}
/* .search-table-content>>>th {
    color: #8598b0;
}
.search-table-content>>>td {
    color: #737a86;
} */
.search-table-detail {
  width: 91%;
  float: right;
}
.search-table-detail >>> td,
.search-table-detail >>> th {
  color: #737a86;
}
</style>
