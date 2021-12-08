<template>
  <json-viewer :value="details" :expand-depth='10' copyable boxed></json-viewer>

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
            if (res.data.data.nodeList.length >= 1) {
              res.data.data.nodeList.map((item, index) => {
                this.$set(this.details.nodeList, index, {
                  version: item.iniConfig.binaryInfo.version,
                  nodeID: item.iniConfig.nodeID,
                  smCryptoType: item.iniConfig.smCryptoType,
                  rpcServiceName: item.iniConfig.rpcServiceName,
                  gatewayServiceName: item.iniConfig.gatewayServiceName,
                  item: item.iniConfig.isWasm,
                });

                // nodeList[index].version=item.iniConfig.binaryInfo.version;
                // nodeList[index].nodeID=item.iniConfig.nodeID;
                // nodeList[index].smCryptoType=item.iniConfig.smCryptoType;
                // nodeList[index].rpcServiceName=item.iniConfig.rpcServiceName;
                // nodeList[index].gatewayServiceName=item.iniConfig.gatewayServiceName;
                // nodeList[index].isWasm=item.iniConfig.isWasm;
              });
            }
            this.details.chainID = res.data.data.chainID;
            this.details.groupID = res.data.data.groupID;
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
</style>
