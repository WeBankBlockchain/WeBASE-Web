<template>
  <div class="key-dialog">
    <el-form
      :model="keyForm"
      :rules="rules"
      ref="keyForm"
      label-width="142px"
      class="demo-ruleForm"
    >
      <el-form-item
        :label="$t('privateKey.importType')"
        prop="fileType"
        style="width: 546px"
      >
        <el-radio-group v-model="keyForm.fileType" @change="changeFileType">
          <el-radio
            :label="item.enName"
            :key="item.enName"
            v-for="item in fileTypeList"
            >{{ item.enName }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('privateKey.fileName')"
        prop="fileName"
        style="width: 546px"
      >
        <el-input
          v-model="keyForm.fileName"
          :placeholder="$t('privateKey.inputFileName')"
          maxlength="12"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('privateKey.password')"
        prop="password"
        style="width: 546px"
        v-if="keyForm.fileType === '.p12'"
      >
        <el-input
          type="password"
          v-model="keyForm.password"
          :placeholder="$t('privateKey.placeholderPassword')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('table.baseSystem')"
        prop="radio"
        style="width: 546px"
        v-if="keyForm.fileType === 'string'"
      >
        <el-radio-group v-model="keyForm.radio" @change="changeJzType">
          <el-radio :label="16">{{ $t("text.hexType") }}</el-radio>
          <el-radio :label="10">{{ $t("text.decimalType") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('privateKey.privateKey')"
        prop="privateKey"
        style="width: 546px"
        v-if="keyForm.fileType == 'string'"
      >
        <el-input
          v-model="keyForm.privateKey"
          :placeholder="keyPlaceholderDec"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('privateKey.description')"
        prop="description"
        style="width: 546px"
      >
        <el-input
          v-model="keyForm.description"
          maxlength="120"
          :placeholder="$t('privateKey.userLong')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('privateKey.file')"
        prop="fileList"
        style="width: 546px"
        v-if="keyForm.fileType != 'string'"
        ref="uploadKey"
      >
        <el-upload
          ref="upload"
          :accept="keyForm.fileType"
          action=""
          :http-request="uploadFile"
          :auto-upload="false"
          :file-list="keyForm.fileList"
          show-file-list
          :limit="1"
          :on-change="uploadChange"
          :on-remove="removeFile"
        >
          <el-button slot="trigger" size="small" type="primary">{{
            this.$t("privateKey.importFile")
          }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button class="footer-button" @click="modelClose">{{
        this.$t("text.cancel")
      }}</el-button>
      <el-button
        style="margin-left: 10px"
        type="primary"
        @click="submitUploadList"
        >{{ this.$t("text.confirm") }}</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  queryImportPrivateKey,
  ImportPemPrivateKey,
  ImportP12PrivateKey,
} from "@/util/api";
let Base64 = require("js-base64").Base64;
const Web3Utils = require("web3-utils");
export default {
  name: "importKey",

  components: {},

  props: {},

  data() {
    return {
      loading: false,
      disabled: false,
      keyForm: {
        fileName: "",
        fileType: "string",
        password: "",
        description: "",
        privateKey: "",
        fileList: [],
        radio: 16,
      },
      fileTypeList: [
        {
          enName: "string",
        },
        {
          enName: ".txt",
        },
        {
          enName: ".pem",
        },
        {
          enName: ".p12",
        },
      ],
      fileList: [],
      keyPlaceholderDec: "",
    };
  },
  computed: {
    rules() {
      var checkData = (rule, value, callback) => {
        if (value) {
          if (/[\u4E00-\u9FA5]/g.test(value)) {
            callback(new Error(this.$t("privateKey.passwordError")));
          } else {
            callback();
          }
        }
        callback();
      };
      let data = {
        fileName: [
          {
            required: true,
            message: this.$t("privateKey.inputFileName"),
            trigger: "blur",
          },
          {
            pattern: /^[A-za-z0-9]+$/,
            message: this.$t("rule.privateKeyNameRule"),
            trigger: "blur",
          },
          {
            min: 1,
            max: 12,
            message: this.$t("rule.textLong1_12"),
            trigger: "blur",
          },
        ],
        fileType: [
          {
            required: true,
            message: this.$t("privateKey.inputFileType"),
            trigger: "blur",
          },
        ],
        password: [{ validator: checkData, trigger: "blur" }],
        privateKey: [
          {
            required: true,
            message: this.$t("privateKey.validatorPrivateKey"),
            trigger: "blur",
          },
          {
            pattern:
              this.keyForm.radio == 10 ? /^[1-9]\d*$/ : /([a-fA-F0-9]{1,100})$/,
            message:
              this.keyForm.radio == 10
                ? this.$t("privateKey.validatorPrivateKey10")
                : this.$t("privateKey.validatorPrivateKey1"),
            trigger: "blur",
          },
        ],
        fileList: [
          {
            required: true,
            message: this.$t("privateKey.importFileValidator"),
            trigger: "change",
          },
        ],
        radio: [{ required: true, message: "Error", trigger: "change" }],
      };
      return data;
    },
  },

  watch: {},

  created() {},

  mounted() {
    if (this.keyForm.radio == 16) {
      this.keyPlaceholderDec = this.$t("privateKey.validatorPrivateKey16");
    } else {
      this.keyPlaceholderDec = this.$t("privateKey.validatorPrivateKey");
    }
  },

  methods: {
    modelClose() {
      this.keyForm = Object.assign({
        fileName: "",
        fileType: "",
      });
      this.loading = false;
      this.$store.state.importPrivateKey = false;
    },
    onBeforeUpload() {},
    changeJzType(val) {
      if (val == 16) {
        this.keyPlaceholderDec = this.$t("privateKey.validatorPrivateKey16");
      } else {
        this.keyPlaceholderDec = this.$t("privateKey.validatorPrivateKey");
      }
    },
    changeFileType() {
      if (this.$refs.upload) this.$refs.upload.clearFiles();
      this.$refs["keyForm"].clearValidate();
      this.keyForm.fileName = "";
      this.keyForm.description = "";
      this.keyForm.fileList = [];
    },
    submitUploadList() {
      if (this.keyForm.fileType == "string") {
        this.uploadFile();
      } else {
        this.$refs["keyForm"].validate((valid) => {
          if (valid) {
            this.$refs.upload.submit();
          }
        });
      }
    },
    uploadFile(param) {
      this.$refs["keyForm"].validate((valid) => {
        if (valid) {
          if (this.keyForm.fileType == "string") {
            var reg = /^0x+/i;
            var privateKey = this.keyForm.privateKey.replace(reg, "");
            if (this.keyForm.radio == 10) {
              privateKey = Web3Utils.toHex(privateKey).split("0x")[1];
            }
            this.textPrivateKey(privateKey);
          } else {
            var reader = new FileReader(),
              self = this;
            reader.readAsText(param.file, "UTF-8");
            reader.onload = function (evt) {
              var fileContent = evt.target.result;
              switch (self.keyForm.fileType) {
                case ".txt":
                  try {
                    var fileString = JSON.parse(fileContent).privateKey;
                    self.textPrivateKey(fileString);
                  } catch (error) {
                    console.log(error);
                  }
                  break;
                case ".pem":
                  self.pemPrivateKey(fileContent);
                  break;
                case ".p12":
                  self.p12PrivateKey(param.file);
                  break;
              }
            };
            this.$refs.upload.clearFiles();
          }
        } else {
          return false;
        }
      });
    },
    textPrivateKey(fileString) {
      let reqQuery = {
        privateKey: Base64.encode(fileString),
        userName: this.keyForm.fileName,
        groupId: localStorage.getItem("groupId"),
        description: this.keyForm.description,
        account: localStorage.getItem("user"),
      };
      queryImportPrivateKey(reqQuery)
        .then((res) => {
          const { data, status } = res;
          if (status === 200) {
            this.$emit("importPrivateKeySuccess");
            this.modelClose();
            this.$message({
              type: "success",
              message: this.$t("text.importSuccessed"),
            });
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
    },
    pemPrivateKey(fileContent) {
      let reqQuery = {
        pemContent: fileContent,
        userName: this.keyForm.fileName,
        groupId: localStorage.getItem("groupId"),
        description: this.keyForm.description,
        account: localStorage.getItem("user"),
      };
      ImportPemPrivateKey(reqQuery)
        .then((res) => {
          const { data, status } = res;
          if (status === 200) {
            this.$emit("importPrivateKeySuccess");
            this.$message({
              type: "success",
              message: this.$t("text.importSuccessed"),
            });
            this.modelClose();
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
    },
    p12PrivateKey(param) {
      var form = new FormData();
      form.append("userName", this.keyForm.fileName);
      form.append("p12File", param);
      form.append("p12Password", Base64.encode(this.keyForm.password));
      form.append("groupId", localStorage.getItem("groupId"));
      form.append("description", this.keyForm.description);
      form.append("account", localStorage.getItem("user"));
      ImportP12PrivateKey(form)
        .then((res) => {
          const { data, status } = res;
          if (status === 200) {
            this.$emit("importPrivateKeySuccess");
            this.$message({
              type: "success",
              message: this.$t("text.importSuccessed"),
            });
            this.modelClose();
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
    },
    uploadChange(file, fileList) {
      this.$refs["uploadKey"].clearValidate();
      this.keyForm.fileList = fileList;
    },
    removeFile() {
      this.keyForm.fileList = [];
    },
  },
};
</script>

<style scoped>
.footer-button {
  margin-right: 10px;
}
.dialog-footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-bottom: 20px;
}
</style>
