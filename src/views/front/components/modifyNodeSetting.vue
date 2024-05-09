<template>
  <div>
    <el-form
      :model="modifyForm"
      :rules="rules"
      ref="modifyForm"
      label-width="90px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('nodes.cpus')" prop="cpus">
        <el-input
          v-model="modifyForm.cpus"
          :placeholder="$t('text.input')"
          type="number"
          maxlength="16"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('nodes.memory')" prop="memory">
        <el-input
          v-model="modifyForm.memory"
          :placeholder="$t('text.input')"
          type="number"
          maxlength="16"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="text-right sure-btn" style="margin-top: 10px">
      <el-button @click="close">{{ this.$t("text.cancel") }}</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="submit('modifyForm')"
        >{{ this.$t("text.sure") }}</el-button
      >
    </div>
  </div>
</template>

<script>
import { setResource } from "@/util/api";
export default {
  name: "ModifyNodeSetting",
  components: {},
  props: {
    modifyNodeSetting: {
      type: Object,
    },
  },
  data() {
    return {
      loading: false,
      modifyForm: {
        cpus: this.modifyNodeSetting.cpus,
        memory: this.modifyNodeSetting.memory,
      },
      settingData: this.modifyNodeSetting,
    };
  },
  computed: {
    rules() {
      let data = {
        cpus: [
          {
            required: true,
            message: this.$t("rule.inputCPU"),
            trigger: "blur",
          },
        ],
        memory: [
          {
            required: true,
            message: this.$t("rule.inputMemory"),
            trigger: "blur",
          },
        ],
      };
      return data;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    close() {
      this.$emit("nodeModifyClose");
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.settingData);
        if (valid) {
          const data = {
            frontId: this.settingData.frontId,
            cpus: this.modifyForm.cpus,
            memory: this.modifyForm.memory,
          };
          setResource(data)
            .then((res) => {
              if (res.data.code === 0 || res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: this.$t("text.configSuccess"),
                });
                this.$emit("nodeModifySuccess");
              } else {
                this.$message({
                  type: "error",
                  message: this.$chooseLang(res.data.code),
                });
              }
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: err.data || this.$t("text.systemError"),
              });
            });
        } else {
          return false;
        }
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