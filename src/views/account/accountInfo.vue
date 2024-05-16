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
  <div class="account-wrapper">
    <!-- <content-head :headTitle="$t('title.accountManagement')"></content-head> -->
    <nav-menu :headTitle="$t('title.accountManagement')"></nav-menu>
    <div class="module-wrapper">
      <div class="search-part">
        <div class="search-part-left">
          <el-button type="primary" class="search-part-left-btn" @click="creatAccount">{{$t('account.addAccount')}}</el-button>
        </div>
      </div>
      <div class="search-table">
        <el-table :data="accountList" tooltip-effect="light" v-loading="loading">
          <el-table-column v-for="head in accountHeader" :label="head.name" :key="head.enName" show-overflow-tooltip :width="head.width" align="center" :fixed="head.fixed">
            <template slot-scope="scope">
              <template v-if="head.enName!='operate'">
                <span v-if="head.enName === 'roleNameZh'">{{translate(scope.row['roleId'])}}</span>
                <span v-else-if="head.enName === 'accountStatus'">{{parseStatus(scope.row['accountStatus'])}}</span>
                <span v-else>{{scope.row[head.enName]}}</span>
              </template>
              <template v-else>
                <el-button type="text" size="small" @click="deleteAccount(scope.row,'delete')">{{$t('text.renewal')}}</el-button>
                <el-button type="text" size="small" @click="modifyAccount(scope.row,'modify')">{{$t('text.updatePassword')}}</el-button>
                <el-button type="text" size="small" @click="modifyEmail(scope.row,'email')">{{$t('text.email')}}</el-button>
                <el-button style="font-size:14px;" type="text" size="mini" :loading="loading&&index == scope.$index" @click="permissions(scope.row,authBtn(scope.row['accountStatus']))">{{authBtn(scope.row['accountStatus']) }}
                </el-button>
                <el-button  style="color:red" type="text" size="small"  @click="deleteUser(scope.row)">{{$t('text.delete')}}</el-button>
              </template>
            </template>

          </el-table-column>
        </el-table>
        <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <el-dialog :visible.sync="accountDialogVisible" :title="accountDialogTitle" width="433px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="accountDialogVisible">
          <account-dialog :accountDialogOptions="accountDialogOptions" @success="success" @close="close"></account-dialog>
        </el-dialog>

      </div>

    </div>
  </div>
</template>

<script>
import NavMenu from '../../components/navs/navMenu.vue';
import { accountList, modifyAccountInfo,accountFreeze,accountUnfreeze,deleteAccount} from "@/util/api";
import accountDialog from "./components/accountDialog";
export default {
  name: "accountList",
  components: {
    'nav-menu':NavMenu,
    accountDialog,
  },
  data() {
    return {
      accountName: "",
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      accountDialogVisible: false,
      accountDialogTitle: "",
      accountDialogOptions: {},
      accountList: [],
      index:''
    };
  },
  computed: {
    accountHeader() {
      let data = [
        {
          enName: "account",
          name: this.$t("account.user"),
          width:100
        },
        {
          enName: "roleNameZh",
          name: this.$t("account.roleNameZh"),
          width:100

        },
        {
          enName: "email",
          name: this.$t("account.email"),
          width:200

        },
        {
          enName: "accountStatus",
          name: this.$t("alarm.status"),
          width:100

        },
        {
          enName: "expireTime",
          name: this.$t("text.expireTime"),
          width:200

        },
        {
          enName: "description",
          name: this.$t("nodes.description"),
          width:200

        },
        {
          enName: "realName",
          name: this.$t("text.realName"),
          width:150

        },
        {
          enName: "mobile",
          name: this.$t("text.mobile"),
          width:200

        },
        {
          enName: "idCardNumber",
          name: this.$t("text.IDNumber"),
          width:200

        },
        {
          enName: "companyName",
          name: this.$t("text.company"),
          width:200

        },
        {
          enName: "contactAddress",
          name: this.$t("text.address"),
          width:200

        },
        {
          enName: "operate",
          name: this.$t("nodes.operation"),
          width:300,
          fixed:"right"
        },
        
      ];
      return data;
    },
  },
  mounted() {
    this.getAccountList();
  },
  methods: {
    deleteUser(rows){
      this.$confirm(this.$t("text.confirmDelete"), {
            center: true,
          })
            .then(() => {
              this.loading = true;
              deleteAccount({account:rows.account})
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message({
              message: this.$t("text.resetSuccess"),
              type: "success",
              duration: 2000,
            });
            this.getAccountList();
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
            })
            .catch(() => {
              // this.modelClose();
            });
    },
    modifyEmail(val, type) {
      this.accountDialogOptions = {
        type: type,
        data: val,
      };
      this.accountDialogVisible = true;
      this.accountDialogTitle = this.$t("account.updataEmail");
    },
    success() {
      this.getAccountList();
    },
    close(val) {
      this.accountDialogVisible = val;
    },
    getAccountList() {
      this.loading = true;
      let reqData = {
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
        },
        reqQuery = {
          account: "",
        };
      accountList(reqData, reqQuery)
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.accountList = res.data.data || [];
            this.total = res.data.totalCount;
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
    handleSizeChange: function (val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getAccountList();
    },
    handleCurrentChange: function (val) {
      this.currentPage = val;
      this.getAccountList();
    },
    creatAccount() {
      this.accountDialogVisible = true;
      this.accountDialogTitle = this.$t("account.createAccount");
      this.accountDialogOptions = {
        type: "creat",
        data: {
          account: "",
          role: "",
        },
      };
    },
    deleteAccount(val, type) {
      this.accountDialogOptions = {
        type: type,
        data: val,
      };
      this.accountDialogVisible = true;
      this.accountDialogTitle = this.$t("text.renewal");
    },
    modifyAccount(val, type) {
      this.accountDialogOptions = {
        type: type,
        data: val,
      };
      this.accountDialogVisible = true;
      this.accountDialogTitle = this.$t("account.updataAccount");
    },
    translate(val) {
      var str = "";
      switch (val) {
        case 100000:
          str = this.$t("text.Administrator");
          break;

        case 100001:
          str = this.$t("text.normalUsers");
          break;
        case 100002:
          str = this.$t("text.developer");
          break;
      }
      return str;
    },
    permissions(row, authBtn) {
      this.$prompt(`${authBtn}理由`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "请输入拒绝理由",
      })
        .then(({ value }) => {
          this.index = row.$index;
          this.loading = true;
          if (row.accountStatus == 3||row.accountStatus == 4) {
            this.queryDeveloperUnFreeze(row, value);
          } else {
            this.queryDeveloperFreeze(row, value);
          }
        })
        .catch((_) => {});
    },
    queryDeveloperFreeze(row, value) {
      let reqData = {
        account: row.account,
        description: value,
      };
      accountFreeze(reqData)
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: "冻结成功",
            });
            this.getAccountList();
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
            message: err.data || "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },
    queryDeveloperUnFreeze(row, value) {
      let reqData = {
        account: row.account,
        description: value,
      };
      accountUnfreeze(reqData)
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: "解冻成功",
            });
            this.getAccountList();
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
            message: err.data || "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },
    authBtn(val) {
      switch (val) {
        case 4:
          return "解冻";
          break;
        case 1:
          return "冻结";
          break;
        case 2:
          return "冻结";
          break;
          case 3:
          return "解冻";
          break;
      }
    },
    parseStatus(val){
      switch (val) {
        case 4:
          return "已注销";
          break;
        case 1:
          return "未改密码";
          break;
        case 2:
          return "正常";
          break;
          case 3:
          return "冻结";
          break;
      }
    }
  },
};
</script>

<style scoped>
@import "./accountInfo.css";
</style>
