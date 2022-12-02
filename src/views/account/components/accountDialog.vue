/*
 * Copyright 2014-2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
<template>
  <div>
    <el-form :model="accountForm" :rules="rules" ref="accountForm" label-width="100px" class="demo-ruleForm">
      <el-form-item :label="$t('account.user')" prop="name">
        <el-input v-model="accountForm.name" :placeholder="$t('system.inputUser')" maxlength="12" :disabled="accountForm['disabled']"></el-input>
      </el-form-item>
      <el-form-item :label="$t('login.password')" prop="password" v-if="accountForm['dShow']">
        <el-input v-model="accountForm.password" :placeholder="$t('inputText.password')" minlength="6" maxlength="12" :type="inputType">
          <i slot="suffix" style="color: #00122C;" :class="[inputType === 'password' ? 'el-icon-view': 'wbs-icon-view-hidden']" @click.stop.prevent="showPassword"></i>
        </el-input>
      </el-form-item>
      <el-form-item v-if='accountForm.emailshow||accountForm.creatShow' :label="$t('account.email')" prop="email">
        <!-- <el-input v-model="accountForm.email" :placeholder="$t('account.inputEmail')" :disabled="accountForm['disabled']"></el-input> -->
        <el-input v-model="accountForm.email" :disabled="accountForm['disabled']"></el-input>
      </el-form-item>
      <el-form-item :label="$t('account.roleNameZh')" prop="role" v-if="accountForm['mShow']">
        <el-select v-model="accountForm.role" :placeholder="$t('text.select')" :disabled="accountForm['mDisabled']" style="width:100%">
          <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleNameZh" :value="item.roleId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用期限" prop="useLimit" v-if='false'>
        <el-select v-model="accountForm.useLimit" placeholder="" style="width:100%">
          <el-option :key='item.label' v-for="item in limit" :label="item.name" :value="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="期限" prop="expireTime" v-if='!accountForm["mShow"]&&!accountForm["dShow"]'>
        <el-input v-model="accountForm.expireTime" disabled></el-input>
      </el-form-item>
      <el-form-item label="期限续期" prop="expandLimit" v-if='!accountForm["mShow"]&&!accountForm["dShow"]'>
        <el-select v-model="accountForm.expandLimit" placeholder="" style="width:100%">
          <el-option :key='item.label' v-for="item in limit" :label="item.name" :value="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if='accountForm.emailshow' label="真实姓名" prop="realName">
        <el-input v-model="accountForm.realName"></el-input>
      </el-form-item>
      <el-form-item v-if='accountForm.emailshow' label="手机号" prop="mobile">
        <el-input v-model="accountForm.mobile"></el-input>
      </el-form-item>
      <el-form-item v-if='accountForm.emailshow' label="身份证号" prop="IDNumber">
        <el-input v-model="accountForm.IDNumber"></el-input>
      </el-form-item>
      <el-form-item v-if='accountForm.emailshow' label="公司" prop="company">
        <el-input v-model="accountForm.company"></el-input>
      </el-form-item>
      <el-form-item v-if='accountForm.emailshow' label="联系地址" prop="address">
        <el-input v-model="accountForm.address" type="textarea" :rows="3" placeholder="请输入地址"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="modelClose">{{this.$t('text.cancel')}}</el-button>
      <el-button type="primary" @click="submit('accountForm')" :loading="loading">{{this.$t('text.sure')}}</el-button>
    </div>
  </div>
</template>

<script>
import {
  roleList,
  creatAccountInfo,
  modifyAccountInfo,
  deleteAccountInfo,
  updateAccountInfo,
  getUserAccountDetail
} from "@/util/api";
const sha256 = require("js-sha256").sha256;
import utils from "@/util/sm_sha";
export default {
  name: "accountDialog",
  props: {
    accountDialogOptions: {
      type: Object,
    },
  },
  watch: {
    "accountDialogOptions.type": {
      handler(val) {
        this.type = val;
        switch (val) {
          case "creat":
            this.accountForm = {
              name: "",
              password: "",
              role: 100000,
              disabled: false,
              mDisabled: false,
              dShow: true,
              mShow: true,
              email: "",
              emailshow: false,
              creatShow:true,
              useLimit: "1",
            };
            break;
          case "delete":
            this.accountForm = {
              name: this.accountDialogOptions.data["account"],
              password: "",
              role: this.accountDialogOptions.data["roleId"],
              expireTime: this.accountDialogOptions.data["expireTime"],
              expandLimit:'1',
              disabled: true,
              mDisabled: true,
              dShow: false,
              emailshow: false,
              // email: "",
            };
            break;
          case "modify":
            this.accountForm = {
              name: this.accountDialogOptions.data["account"],
              password: this.accountDialogOptions.data["accountPwd"],
              role: this.accountDialogOptions.data["roleId"],
              address: "",
              realName: "",
              mobile: "",
              email: "",
              vercode: "",
              realName: "",
              IDNumber: "",
              disabled: true,
              mDisabled: false,
              dShow: true,
              mShow: false,
              // email: this.accountDialogOptions.data["email"],
              // emailshow: true
            };
            break;
          case "email":
            this.accountForm = {
              name: this.accountDialogOptions.data["account"],
              // password:this.accountDialogOptions.data["accountPwd"],
              role: this.accountDialogOptions.data["roleId"],
              realName: '',
              mobile: '',
              address: this.accountDialogOptions.data["contactAddress"],
              IDNumber: '',
              useLimit: this.accountDialogOptions.data["expandTime"],
              expireTime: this.accountDialogOptions.data["expireTime"],
              company: this.accountDialogOptions.data["companyName"],
              disabled: true,
              mDisabled: false,
              expandLimit:'1',
              // dShow: true,
              // mShow: false,
              email: this.accountDialogOptions.data["email"],
              emailshow: true,
            };
            break;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      type: this.accountDialogOptions.type,
      loading: false,
      accountForm: {},
      roleList: [],
      inputType: "password",
      limit: [
        { name: "一年", label: "1" },
        { name: "三年", label: "3" },
        { name: "五年", label: "5" },
      ],
    };
  },
  computed: {
    rules() {
      let data = {
        name: [
          {
            required: true,
            message: this.$t("system.inputUser"),
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
        password: [
          {
            required: true,
            message: this.$t("inputText.password"),
            trigger: "blur",
          },
          {
            min: 6,
            max: 12,
            message: this.$t("rule.passwordLong"),
            trigger: "blur",
          },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/,
            message: this.$t("rule.passwordRule"),
            trigger: "blur",
          },
        ],
        IDNumber: [
          // { required: true, message: "请输入身份证号码", trigger: "blur" },
          {
            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "身份证号码格式不正确",
            trigger: "blur",
          },
        ],
        email: [
          // { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$$/,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        mobile: [
          // { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^1[0-9]{10}$/,
            message: "手机号码格式不正确",
            trigger: "blur",
          },
        ],
      };
      return data;
    },
  },
  mounted() {
    this.getRoleList();
    if(this.accountDialogOptions.type=='email'){
     this.getDetail()
    }
  },
  methods: {
    getDetail() {
      getUserAccountDetail(this.accountDialogOptions.data.account)
        .then((res) => {
          if (res.data.code === 0) {
            this.accountForm.realName = res.data.data.realName;
            this.accountForm.mobile = res.data.data.mobile;
            this.accountForm.IDNumber = res.data.data.idCardNumber;
            this.accountForm.company = res.data.data.companyName;
            this.accountForm.address = res.data.data.contactAddress;
            this.accountForm.account = res.data.data.account;
            this.accountForm.useLimit = res.data.data.expandTime;
            this.accountForm.expireTime = res.data.data.expireTime;
            this.accountForm.email = res.data.data.email;
            if(!this.accountForm.email){
              this.accountForm.disabled=false
            }
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
    modelClose: function () {
      this.$emit("close", false);
    },
    submit: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm(this.$t("text.confirmSubmit"), {
            center: true,
          })
            .then(() => {
              this.loading = true;
              this.getAllAccountInfo();
            })
            .catch(() => {
              this.modelClose();
            });
        } else {
          return false;
        }
      });
    },
    getRoleList: function () {
      let groupId = localStorage.getItem("groupId");
      let reqQuery = {};
      reqQuery = {
        groupId: groupId,
        pageNumber: "",
        pageSize: "",
        roleId: "",
        roleName: "",
      };
      roleList({}, reqQuery)
        .then((res) => {
          if (res.data.code === 0) {
            let list = res.data.data;
            // var item = list[2];
            // list[2] = list[1];
            // list[1] = item;
            list.forEach((item) => {
              switch (item.roleId) {
                case 100000:
                  item.roleNameZh = this.$t("text.Administrator");
                  break;
                case 100002:
                  item.roleNameZh = this.$t("text.developer");
                  break;
                case 100001:
                  item.roleNameZh = this.$t("text.normalUsers");
                  break;
              }
            });
            this.roleList = list;
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
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
    getAllAccountInfo: function () {
      let type = this.type;
      console.log(type)
      switch (type) {
        case "creat":
          this.getCreatAccountInfo();
          break;
        case "modify":
          this.getModifyAccountInfo();
          break;
        case "delete":
          this.getDeleteAccountInfo();
          break;
        case "email":
          this.getModifyEmailInfo();
          break;
      }
    },
    getModifyEmailInfo: function () {
      let reqData = {
        account: this.accountForm.name,
        companyName: this.accountForm.company,
        contactAddress: this.accountForm.address,
        description: this.accountForm.description,
        email: this.accountForm.email,
        expandTime: this.accountForm.expandTime,
        idCardNumber: this.accountForm.IDNumber,
        mobile: this.accountForm.mobile,
        realName: this.accountForm.realName,
        roleId: this.accountForm.role,
      };
      // if(localStorage.getItem("encryptionId") == 1){
      //     reqData.accountPwd = "0x" + utils.sha4(this.accountForm.password)
      // }else{
      //     reqData.accountPwd = sha256(this.accountForm.password)
      // }
      updateAccountInfo(reqData, {})
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: this.$t("text.updateSuccessMsg"),
            });
            this.modelClose();
            this.$emit("success");
          } else {
            this.modelClose();
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.modelClose();
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    getCreatAccountInfo: function () {
      let reqData = {
        account: this.accountForm.name,
        accountPwd: sha256(this.accountForm.password),
        roleId: this.accountForm.role,
        // companyName: this.accountForm.company,
        // contactAddress: this.accountForm.address,
        // description: this.accountForm.description,
        email: this.accountForm.email,
        // expandTime: this.accountForm.expandTime,
        // idCardNumber: this.accountForm.IDNumber,
        // mobile: this.accountForm.mobile,
        // realName: this.accountForm.realName,
      };
      // if(localStorage.getItem("encryptionId") == 1){
      //     reqData.accountPwd = "0x" + utils.sha4(this.accountForm.password);
      // }else{
      //     reqData.accountPwd = sha256(this.accountForm.password);
      // }
      // if (this.accountForm.email) {
      //   let pattern =
      //     /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      //   if (!pattern.test(this.accountForm.email)) {
      //     this.$message({
      //       type: "error",
      //       message: this.$t("account.emailTypeError"),
      //     });
      //     this.loading = false;
      //     return;
      //   } else {
      //     reqData.email = this.accountForm.email;
      //   }
      // }
      creatAccountInfo(reqData, {})
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: this.$t("text.addSuccess"),
            });
            this.modelClose();
            this.$emit("success");
          } else {
            this.modelClose();
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.modelClose();
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    getModifyAccountInfo: function () {
      let reqData = {
        account: this.accountForm.name,
        accountPwd: sha256(this.accountForm.password),
        roleId: this.accountForm.role,
      };
      // if(localStorage.getItem("encryptionId") == 1){
      //     reqData.accountPwd = "0x" + utils.sha4(this.accountForm.password)
      // }else{
      //     reqData.accountPwd = sha256(this.accountForm.password)
      // }
      if (this.accountForm.email) {
        let pattern =
          /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!pattern.test(this.accountForm.email)) {
          this.$message({
            type: "error",
            message: this.$t("account.emailTypeError"),
          });
          this.loading = false;
          return;
        } else {
          reqData.email = this.accountForm.email;
        }
      }
      modifyAccountInfo(reqData, {})
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: this.$t("text.updateSuccessMsg"),
            });
            this.modelClose();
            this.$emit("success");
          } else {
            this.modelClose();
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.modelClose();
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    getDeleteAccountInfo: function () {
      let reqData = {
        account: this.accountForm.name,
        // accountPwd: sha256(this.accountForm.password),
        roleId: this.accountForm.role,
        expandYear:this.accountForm.expandLimit
      };
      modifyAccountInfo(reqData, {})
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: this.$t("text.updateSuccessMsg"),
            });
            this.modelClose();
            this.$emit("success");
          } else {
            this.modelClose();
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.modelClose();
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    showPassword() {
      if (this.inputType === "password") {
        this.inputType = "text";
      } else {
        this.inputType = "password";
      }
    },
  },
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
  margin-right: -5px;
  padding-bottom: 20px;
  padding-top: 12px;
}
.isNone {
  display: none;
}
.isShow {
  display: block;
}
.demo-ruleForm >>> .el-form-item__error {
  padding-top: 0;
}
</style>
