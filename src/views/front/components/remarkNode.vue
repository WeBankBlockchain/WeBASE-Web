<template>
  <div>
    <el-form
      :model="remarkForm"
      :rules="rules"
      ref="remarkForm"
      label-width="110px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('nodes.nodeIp')" prop="nodeIp" style="width: 320px">
        <el-input v-model="remarkForm.nodeIp"></el-input>
      </el-form-item>
      <el-form-item :label="$t('text.org')" prop="agency" style="width: 320px">
        <el-input v-model="remarkForm.agency"></el-input>
      </el-form-item>
      <!-- <p class="info" v-if="deployType == 1">{{ $t("nodes.notice") }}</p> -->
      <el-form-item
        :label="$t('system.address')"
        prop="city"
        class="el-form-item"
      >
        <el-cascader
          size="large"
          :options="options"
          v-model="remarkForm.city"
          @change="handleChange"
          @blur="addressBlur"
        />
      </el-form-item>
    </el-form>
    <div class="text-right sure-btn" style="margin-top: 10px">
      <el-button @click="close">{{ this.$t("text.cancel") }}</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="submit('remarkForm')"
        >{{ this.$t("text.sure") }}</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode,
} from "element-china-area-data";
import { getUserList, consensusNodeId, putCityIpAengcy,getNodeInfo } from "@/util/api";
export default {
  name: "remarkNodeType",

  components: {},

  props: {
    remarkNode: {
      type: Object,
    },
  },

  data() {
    return {
      loading: false,
      adminRivateKeyList: [],
      options: provinceAndCityData,
      selectedCity: ["140000", "140200"],
      nodeTypeList: [
        {
          type: "sealer",
          name: this.$t("nodes.sealer"),
        },
        {
          type: "observer",
          name: this.$t("nodes.observer"),
        },
        {


          type: "remove",
          name: this.$t("nodes.remove"),
        },
      ],
      remarkForm: {
        nodeIp: this.remarkNode.frontIp,
        agency: this.remarkNode.agency,
        city: this.remarkNode.city
          ? [this.remarkNode.city.substr(0, 3) + "000", this.remarkNode.city]
          : "",
      },
      nodeId: this.remarkNode.nodeId,
      groupId: localStorage.getItem("groupId"),
      deployType: null,
      ruleTest: this.$t("rule.adminRule"),
      rules: {
        nodeIp: [
          { required: true, message: this.$t("rule.ipName"), trigger: "blur" },
          {
            pattern:
              /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/,
            message: this.$t("nodes.ipError"),
            trigger: "blur",
          },
        ],
        agency: [
          {
            required: true,
            message: this.$t("system.agency"),
            trigger: "blur",
          },
          {
            min: 1,
            max: 12,
            message: this.$t("rule.folderLong"),
            trigger: "blur",
          },
          {
            pattern: /^[A-Za-z0-9]+$/,
            message: this.$t("rule.accountRule"),
            trigger: "blur",
          },
        ],
        city: {
          type: "array",
          required: true,
          message: this.$t("system.city"),
          trigger: "change",
        },
      },
    };
  },
  computed: {},

  watch: {},

  created() {},

  mounted() {

    if (localStorage.getItem("deployType")) {
      this.deployType = localStorage.getItem("deployType");
    } else {
      this.deployType = 0;
    }
    this.getNodeInfo();
  },

  methods: {
    addressBlur() {
      this.$refs.remarkForm.validateField("city");
    },
    handleChange(value) {
      console.log(value);
      this.remarkForm.city = value;
    },
    close() {
      this.$emit("nodeRemarkClose");
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateDesc();
        } else {
          return false;
        }
      });
    },
    updateDesc() {
      this.loading = true;
      let reqData = {
        nodeIp: this.remarkForm.nodeIp,
        agency: this.remarkForm.agency,
        city: this.remarkForm.city[1],
        nodeId: this.nodeId,
      };
      putCityIpAengcy(reqData)
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: this.$t("text.updateSuccessMsg"),
            });
            this.$emit("nodeRemarkSuccess");
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    changeRivateKey(val) {
      this.adminRivateKey = val;
    },
    getNodeInfo: function () {
      getNodeInfo(this.groupId, this.nodeId)
        .then((res) => {
          if (res.data.code === 0) {
            this.remarkForm.nodeIp=res.data.data.nodeIp
            this.remarkForm.agency=res.data.data.agency
            this.remarkForm.city=res.data.data.city
            // if (res.data.data.length === 0) {
            //   this.ruleTest = this.$t("text.ruleAddUser");
            // }
            // this.adminRivateKeyList = [];
            // res.data.data.forEach((value) => {
            //   if (value.hasPk === 1) {
            //     this.adminRivateKeyList.push(value);
            //   }
            // });
            // if (this.adminRivateKeyList.length)
            //   this.remarkForm.adminRivateKey =
            //     this.adminRivateKeyList[0]["address"];
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        }).catch((err) => {
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
