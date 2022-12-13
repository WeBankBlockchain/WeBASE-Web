<template>
  <div>
    <content-head :headTitle="'注册'" :disabled="true"></content-head>
    <!-- <div class="go-back">
      <span @click="goback">返回</span>
    </div> -->
    <div class="module">
      <div class="module-content">
        <p class="from-title">注册帐号</p>
        <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="85px" class="demo-ruleForm" size="medium">
          <el-form-item label="用户名称" prop="account">
            <el-input v-model="registerForm.account" style="width:366px;"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" type="password" style="width:366px;"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" style="width:366px;"></el-input>
          </el-form-item>
          <el-form-item label="使用期限" prop="useLimit">
            <el-select v-model="registerForm.useLimit" placeholder="" style="width:366px;">
              <el-option :key='item.label' v-for="item in limit" :label="item.name" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户类型" prop="roleId">
            <el-select v-model="registerForm.roleId" placeholder="" style="width:366px;">
              <el-option :key='item.label' v-for="item in role" :label="item.name" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" style="width:366px;"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="vercode" v-if="needMail">
            <el-input v-model="registerForm.vercode" style="width:240px;"></el-input>
            <el-button type="primary" class="codeUrlImg" :disabled="btnDisable" @click="changeCode">发送邮箱验证码{{times}}</el-button>
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="registerForm.realName" style="width:366px;"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="registerForm.mobile" style="width:366px;"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="IDNumber">
            <el-input v-model="registerForm.IDNumber" style="width:366px;"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="registerForm.address" type="textarea" :rows="3" placeholder="请输入地址" style="width:366px;"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="registerForm.description" type="textarea" :rows="3" placeholder="请输入地址" style="width:366px;"></el-input>
          </el-form-item>
          <el-form-item label="" prop="agree">
            <el-checkbox v-model="agree" style="margin-right:10px"></el-checkbox>注册即代表同意<span class="fontColor" @click="showAgree">《用户注册及使用网站隐私协议》</span>
          </el-form-item>
        </el-form>
        <div class="form-button">
          <el-button type="button" size="small" :loading='loading' style="width: 366px" @click="submitForm('registerForm')" :disabled="allowRegister">注册</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="协议" :visible.sync="dialogVisible" width="50%" id="privacy">
      <pre v-html="privacy" heigth='50%'></pre>
    </el-dialog>
  </div>
</template>

<script>
import constant from "@/util/constant";
import router from "@/router";
import {
  ifEnableMailCheckCode,
  sendCheckCodeMail,
  registerAccount,
  getPrivacy,
} from "@/util/api";
let Base64 = require("js-base64").Base64;
const sha256 = require("js-sha256").sha256;
import contentHead from "@/components/registerHead";
export default {
  name: "register",
  components: {
    "content-head": contentHead,
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.password !== "") {
          this.$refs.registerForm.validateField("password");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      countryList: constant.country,
      allowRegister:true,
      registerForm: {
        account: "",
        password: "",
        confirmPassword: "",
        useLimit: "1",
        address: "",
        realName: "",
        mobile: "",
        email: "",
        vercode: "",
        IDNumber: "",
        roleId: 100001,
        description: ""
      },
      limit: [
        { name: "一年", label: "1" },
        { name: "三年", label: "3" },
        { name: "五年", label: "5" },
      ],
      role: [
        { name: "普通用户", label: 100001 },
        { name: "开发者", label: 100002 },
      ],
      loading: false,
      codeUrl: "",
      authToken: "",
      rules: {
        account: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{6,16}$/,
            message:
              "6-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符",
            trigger: "blur",
          },
        
        ],
        confirmPassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            required: true,
            validator: validatePass2,
            trigger: "blur",
          },
        ],
        useLimit: [
          // { required: true, message: "请选择公司名称", trigger: "blur" },
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
          { required: true, message: "请输入手机号码", trigger: "blur" },
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
      },
      btnDisable: false,
      times: "",
      agree: false,
      dialogVisible: false,
      needMail: true,
      timer: null,
      privacy: null,
    };
  },
  mounted() {
    // this.changeCode()
    this.ifNeedMail();
    this.getPrivacyContent();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getPrivacyContent() {
      getPrivacy()
        .then((res) => {
          if (res.data.code == 0) {
            console.log(this.privacy);
            this.privacy = Base64.decode(res.data.data);
            console.log(this.privacy);
          }
        })
        .catch((err) => {
          this.$message({
            message: err.data || "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },
    ifNeedMail() {
      ifEnableMailCheckCode()
        .then((res) => {
          if (res.data.data == false) {
            this.needMail = false;
            this.allowRegister = false;
          } else {
            this.needMail = true;
          }
        })
        .catch((err) => {
          this.$message({
            message: err.data || "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },
    submitForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.agree) {
            this.logining = true;
            this.userRegister();
          } else {
            this.$message("请勾选隐私协议");
          }
        } else {
          return false;
        }
      });
    },
    link(val) {
      router.push(val);
    },
    userRegister() {
      this.times = "";
      this.btnDisable = false;
      clearInterval(this.timer);
      let reqData = {
        account: this.registerForm.account,
        accountPwd: sha256(this.registerForm.password),
        idCardNumber: this.registerForm.IDNumber,
        mobile: this.registerForm.mobile,
        realName: this.registerForm.realName,
        email: this.registerForm.email,
        contactAddress: this.registerForm.address,
        roleId: this.registerForm.roleId,
        description: this.registerForm.description,
        // authToken: this.registerForm.vercode
      };
      registerAccount(reqData, this.registerForm.vercode, this.authToken)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              message: "管理员审核注册账号后，即可登录使用",
              type: "success",
              duration: 2000,
            });
            // router.push("/login");
          } else {
            this.registerForm.vercode = "";
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: err.data || "系统错误",
            type: "error",
            duration: 2000,
          });
        });
      this.allowRegister=true
    },
    changeCode: function () {
      let pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$$/;
      if (!this.registerForm.email) {
        this.$message({
          message: "请输入邮箱",
          type: "error",
          duration: 2000,
        });
        return false;
      } else if (!pattern.test(this.registerForm.email)) {
        this.$message({
          message: "邮箱格式不正确",
          type: "error",
          duration: 2000,
        });
        return false;
      }
      this.btnDisable = true;
      this.times = 60;
      this.timer = setInterval(() => {
        if (this.times == 1) {
          this.times = "";
          this.btnDisable = false;
          clearInterval(this.timer);
          return false;
        }
        this.times--;
      }, 1000);
      let reqData = {
        mailAddress: this.registerForm.email,
      };
      sendCheckCodeMail(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            this.authToken = res.data.data.token;
            this.allowRegister=false
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
            message: err.data || "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },
    goback() {
      router.go(-1);
    },
    showAgree() {
      this.dialogVisible = true;
    },
  },
};
</script>

<style scoped>
.header {
  overflow: hidden;
  height: 60px;
  font-size: 16px;
  padding: 0 20px;
  background-color: #fff;
  line-height: 60px;
  box-sizing: border-box;
}
.hedaer-logo {
  padding-top: 10px;
  display: inline-block;
  /* vertical-align: middle; */
}
.header-right {
  float: right;
  line-height: 60px;
}
.header-button {
  display: inline-block;
  margin-left: 10px;
  vertical-align: top;
}
.go-back {
  line-height: 40px;
  padding-left: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
.module {
  display: flex;
  justify-content: center;
}
.from-title {
  font-size: 18px;
  color: #333333;
  border-left: 4px solid #337bf6;
  height: 18px;
  line-height: 18px;
  padding-left: 10px;
}
.module-content {
  /* width: 600px; */
  background: #ffffff;
  /* margin-top: 56px; */
  padding-top: 48px;
  padding-left: 44px;
  padding-right: 100px;
  padding-bottom: 48px;
}
.form-button {
  padding-left: 85px;
}
.form-button >>> .el-button--small {
  font-size: 14px;
}
.demo-ruleForm {
  margin-top: 48px;
}
.codeUrlImg {
  display: inline-block;
  height: 36px;
  width: 120px;
  vertical-align: bottom;
  cursor: pointer;
  text-align: center;
  padding:0
}
.fontColor {
  color: blue;
  cursor: pointer;
}
/deep/ #privacy .el-dialog {
  height: 60%;
  overflow: scroll;
}
</style>
