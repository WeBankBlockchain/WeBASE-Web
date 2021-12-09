<template>
  <div>
    <el-form class='detail'>
      <el-row>
        <el-col :span="12">
          <label>chainID：</label>{{details.chainID}}
        </el-col>
        <el-col :span="12">
          <label>groupID：</label>{{details.groupID}}
        </el-col>
      </el-row>
      <el-table :data="details.nodeList" border style="width: 100%" max-height="500px">
        <el-table-column v-for="head in nodeHead" :label="head.name" :key="head.enName" show-overflow-tooltip :width='head.width'>
          <template slot-scope="scope">
            <template>
              <span v-if="head.enName === 'nodeID'">
                <i class="wbs-icon-copy font-12" @click="copyNodeIdKey(scope.row[head.enName])" :title="$t('text.copy')"></i>
                {{scope.row[head.enName]}}
              </span>
              <span v-else>{{scope.row[head.enName]}}</span>
            </template>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="nodeID" label="nodeID" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="gatewayServiceName" label="gatewayServiceName" width="180">
        </el-table-column>
        <el-table-column prop="item" label="item" width="80">
        </el-table-column>
        <el-table-column prop="rpcServiceName" label="rpcServiceName" width="180">
        </el-table-column>
        <el-table-column prop="smCryptoType" label="smCryptoType" width="180">
        </el-table-column>
        <el-table-column prop="version" label="version">
        </el-table-column> -->
      </el-table>
    </el-form>
    <!-- <div class="text-right send-btn">
            <el-button @click="close">{{this.$t("text.cancel")}}</el-button>
            <el-button type="primary" @click="submit('abiForm')" :loading="loading">{{this.$t("text.sure")}}</el-button>
        </div> -->
  </div>
</template>

<script>
import { getDetail } from "@/util/api";
export default {
  name: "detailPage",

  components: {},

  props: {
    detailParam: {
      type: Object,
    },
  },

  data() {
    return {
      chainId: "",
      groupId: "",
      nodeList: [],
      details: {
        nodeList: [],
      },
      groupId: localStorage.getItem("groupId"),
      nodeHead: [
        {
          enName: "nodeID",
          name: "nodeID",
          width: "",
        },
        {
          enName: "gatewayServiceName",
          name: "gatewayServiceName",
          width: 180,
        },
        {
          enName: "isWasm",
          name: "isWasm",
          width: 80,
        },
        {
          enName: "rpcServiceName",
          name: "rpcServiceName",
          width: 180,
        },
        {
          enName: "smCryptoType",
          name: "smCryptoType",
          width: 180,
        },
        {
          enName: "version",
          name: "version",
          width: 80,
        },
      ],
    };
  },
  computed: {},

  watch: {},

  created() {},

  mounted() {
    this.getDetails();
  },

  methods: {
    getDetails() {
      let reqData = {
        groupId: this.groupId,
        frontId: this.detailParam.frontId,
      };
      getDetail(reqData)
        .then((res) => {
          if (res.status == 200) {
            let nodeList = [];
            this.details.chainID = res.data.data.chainID;
            this.details.groupID = res.data.data.groupID;
            if (res.data.data.nodeList.length >= 1) {
              res.data.data.nodeList.map((item, index) => {
                this.$set(this.details.nodeList, index, {
                  version: item.iniConfig.binaryInfo.version,
                  nodeID: item.iniConfig.nodeID,
                  smCryptoType: item.iniConfig.smCryptoType,
                  rpcServiceName: item.iniConfig.rpcServiceName,
                  gatewayServiceName: item.iniConfig.gatewayServiceName,
                  isWasm: item.iniConfig.isWasm,
                  name: item.name,
                });
              });
            }
            console.log(this.details);
          }
        })
        .catch((err) => {
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
  },
};
</script>

<style scoped>
.sure-btn >>> .el-button {
  padding: 9px 16px;
}
.info {
  padding-left: 30px;
  color: #f00;
}
.detail >>> .el-input__inner {
  border: 0;
  pointer-events: none;
}
</style>
