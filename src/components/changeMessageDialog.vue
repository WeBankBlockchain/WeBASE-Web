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
    <el-form :model="messageForm" status-icon :rules="rules" ref="ruleMessageForm" label-width="135px" class="demo-ruleForm">
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="messageForm.realName"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="messageForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="IDNumber">
        <el-input v-model="messageForm.IDNumber"></el-input>
      </el-form-item>
      <el-form-item label="公司" prop="company">
        <el-input v-model="messageForm.company"></el-input>
      </el-form-item>
      <!-- <el-form-item label="邮箱" prop="email">
        <el-input v-model="messageForm.email" style="width:366px;"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="vercode">
        <el-input v-model="messageForm.vercode" style="width:240px;"></el-input>
        <button class="codeUrlImg" :disabled="btnDisable" @click="changeCode()">获取验证码{{times}}</button>
      </el-form-item> -->
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="messageForm.address" type="textarea" :rows="3" placeholder="请输入地址"></el-input>
      </el-form-item>
      <div class="text-right sure-btn" style="margin-top:10px">
        <!-- <el-button type="primary" @click="submitForm('rulePasswordForm')">{{$t('text.cancel')}}</el-button> -->
        <el-button @click="submitForm('ruleMessageForm')">{{$t('text.sure')}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
const sha256 = require("js-sha256").sha256;
import { updateAccountInfo, getAccountDetail } from "@/util/api";
export default {
  name: "changeMessageDialog",
  props: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("main.inputPassword")));
      } else {
        if (this.ruleMessageForm.checkPass !== "") {
          this.$refs.ruleMessageForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("main.againPassword")));
      } else if (value !== this.ruleMessageForm.pass) {
        callback(new Error(this.$t("main.passwordError")));
      } else {
        callback();
      }
    };
    return {
      messageForm: {
        address: "",
        realName: "",
        mobile: "",
        email: "",
        vercode: "",
        realName: "",
        IDNumber: "",
        company: "",
        account: "",
      },
      rules: {
        account: [
          // { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{6,16}$/,
            message:
              "6-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符",
            trigger: "blur",
          },
          {
            required: true,
            validator: validatePass2,
            trigger: "blur",
          },
        ],
        confirmPassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            required: true,
            validator: validatePass,
            trigger: "blur",
          },
        ],
        useLimit: [
          { required: true, message: "请选择公司名称", trigger: "blur" },
        ],
        address: [
          // { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        realName: [
          // { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
        IDNumber: [
          // { required: true, message: "请输入身份证号码", trigger: "blur" },
          {
            pattern: /^[0-9]{18}$/,
            message: "身份证号码格式不正确",
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
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$$/,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        vercode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        // address: [{ required: true, message: "请输入地址", trigger: "blur" }],
      },
      rules2: {
        oldPass: [
          {
            required: true,
            message: this.$t("main.inputOldPassword"),
            trigger: "blur",
          },
          {
            min: 6,
            max: 12,
            message: this.$t("main.longPassword"),
            trigger: "blur",
          },
        ],
        pass: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur",
          },
          {
            min: 6,
            max: 12,
            message: this.$t("main.longPassword"),
            trigger: "blur",
          },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/,
            message: this.$t("main.passwordPattern"),
            trigger: "blur",
          },
        ],
        checkPass: [
          {
            required: true,
            validator: validatePass2,
            trigger: "blur",
          },
          {
            min: 6,
            max: 12,
            message: this.$t("main.longPassword"),
            trigger: "blur",
          },
        ],
      },
      account: localStorage.getItem("user"),
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      getAccountDetail()
        .then((res) => {
          if (res.data.code === 0) {
            this.messageForm.realName = res.data.data.realName;
            this.messageForm.mobile = res.data.data.mobile;
            this.messageForm.IDNumber = res.data.data.idCardNumber;
            this.messageForm.company = res.data.data.companyName;
            this.messageForm.address = res.data.data.contactAddress;
            this.messageForm.account = res.data.data.account;
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getResetPassword();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getResetPassword() {
      let reqData = {
        account: this.messageForm.account,
        realName: this.messageForm.realName,
        mobile: this.messageForm.mobile,
        idCardNumber: this.messageForm.IDNumber,
        companyName: this.messageForm.company,
        contactAddress: this.messageForm.address,
      };
      updateAccountInfo(reqData, {})
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: this.$t("text.updateSuccessMsg"),
            });
            this.$emit('success')
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
  },
};
</script>

<style>
</style>
