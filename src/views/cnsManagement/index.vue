<template>
  <div>
    <!-- <v-content-head :headTitle="$t('title.contractTitle')" :headSubTitle="$t('title.CNSmanager')" @changGroup="changGroup" :headTooltip="$t('title.CNSTips')"></v-content-head> -->
    <nav-menu :headTitle="$t('title.contractTitle')" :headSubTitle="$t('title.CNSmanager')"></nav-menu>
    <div class="module-wrapper" style="padding: 20px 29px 0 29px;">
      <span class="cns-title">{{$t('contracts.cnsTitle')}}</span>
      <el-form :model="cnsForm" :rules="rules" ref="cnsForm" class="demo-ruleForm">
        <el-form-item :label="$t('contracts.contractName')" prop="contractName" class="item-form">
          <el-input v-model.trim="cnsForm.contractName" :placeholder="$t('text.input')" class="select-32" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item :label="$t('contracts.contractVersion')" prop="contractVersion" class="item-form">
          <el-input v-model.trim="cnsForm.contractVersion" :placeholder="$t('text.input')" class="select-32" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="searchCns('cnsForm')" class="modify-btn" :disabled="disabled" :loading="loading1">{{this.$t('text.search')}}</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="cnsList" tooltip-effect="dark" v-loading="loading" class="search-table-content">
        <el-table-column v-for="head in cnsHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center" :width="head.width">
          <template slot-scope="scope">
            <span>{{scope.row[head.enName]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 本地cns注释 -->
    <!-- <div class="module-wrapper" style="padding: 20px 29px 0 29px;">
            <span class="cns-title">{{$t('contracts.localCnsTitle')}}</span>
            <el-table :data="localCnsList" tooltip-effect="dark" v-loading="loadingLocal" class="search-table-content">
                <el-table-column v-for="head in localCnsHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center" :width="head.width">
                    <template slot-scope="scope">
                        <span>{{scope.row[head.enName]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="page" @size-change="localSizeChange" @current-change="localCurrentChange" :current-page="currentPageLocal" :page-sizes="[10, 20, 30, 50]" :page-size="pageSizeLocal" layout="total, sizes, prev, pager, next, jumper" :total="totalLocal">
            </el-pagination>
        </div> -->
  </div>
</template>

<script>
import NavMenu from '../../components/navs/navMenu.vue';
import {
  queryCnsListByName,
  queryCnsListByNameVersion,
  findCnsInfoList,
} from "@/util/api";
export default {
  name: "ConfigManagement",

  components: {
    'nav-menu':NavMenu
  },

  props: {},

  data() {
    return {
      disabled: false,
      loading: false,
      loading1: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      cnsForm: {
        contractVersion: "",
        contractName: "",
      },
      cnsList: [],
      loadingLocal: false,
      currentPageLocal: 1,
      pageSizeLocal: 10,
      totalLocal: 0,
      localCnsList: [],
    };
  },

  computed: {
    cnsHead() {
      let data = [
        {
          enName: "name",
          name: this.$t("contracts.contractName"),
          width: "120",
        },
        {
          enName: "version",
          name: this.$t("contracts.contractVersion"),
          width: "",
        },
        {
          enName: "address",
          name: this.$t("contracts.contractAddress"),
          width: "",
        },
        {
          enName: "abi",
          name: this.$t("contracts.contractAbi"),
          width: "",
        },
      ];
      return data;
    },
    localCnsHead() {
      let data = [
        {
          enName: "cnsName",
          name: this.$t("contracts.contractName"),
          width: "120",
        },
        {
          enName: "version",
          name: this.$t("contracts.contractVersion"),
          width: "",
        },
        {
          enName: "contractAddress",
          name: this.$t("contracts.contractAddress"),
          width: "",
        },
        {
          enName: "contractAbi",
          name: this.$t("contracts.contractAbi"),
          width: "",
        },
      ];
      return data;
    },
    rules() {
      let data = {
        contractName: [
          {
            required: true,
            message: this.$t("rule.contractName"),
            trigger: "blur",
          },
        ],
      };
      return data;
    },
  },

  mounted() {
    if (
      localStorage.getItem("root") === "admin" ||
      localStorage.getItem("root") === "developer" ||
      localStorage.getItem("groupId")
    ) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
    // 本地cns查询注释
    // if (localStorage.getItem("groupId") && (localStorage.getItem("configData") == 3 || localStorage.getItem("deployType") == 0)) {
    //     this.queryLocalCns();
    // }
  },

  methods: {
    changGroup() {
      this.getCnsList();
      //this.queryLocalCns()
    },
    searchCns(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading1 = true;
          this.getCnsList("handleSearch");
        } else {
          return false;
        }
      });
    },
    getCnsList(handleType) {
      this.loading = true;
      this.cnsList = [];
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        // pageNumber: this.currentPage,
        // pageSize: this.pageSize,
      };
      if (this.cnsForm.contractVersion) {
        reqData.version = `${this.cnsForm.contractVersion}`;
        reqData.contractName = `${this.cnsForm.contractName}`;
        queryCnsListByNameVersion(reqData)
          .then((res) => {
            this.loading = false;
            this.loading1 = false;
            if (res.data.code === 0) {
              if (JSON.parse(res.data.data).address != "") {
                this.cnsList.push(
                  Object.assign(JSON.parse(res.data.data), {
                    name: reqData.contractName,
                    version: reqData.version,
                  })
                );
              }

              this.total = res.data.totalCount;
              if (handleType == "handleSearch") {
                this.$message({
                  type: "success",
                  message: this.$t("text.selectSuccess"),
                });
              }
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
            this.loading1 = false;
            this.$message({
              message: err.data || this.$t("text.systemError"),
              type: "error",
              duration: 2000,
            });
          });
      } else {
        reqData.contractName = `${this.cnsForm.contractName}`;
        queryCnsListByName(reqData)
          .then((res) => {
            this.loading = false;
            this.loading1 = false;
            if (res.data.code === 0) {
              this.cnsList = JSON.parse(res.data.data);
              this.total = res.data.totalCount;
              if (handleType == "handleSearch") {
                this.$message({
                  type: "success",
                  message: this.$t("text.selectSuccess"),
                });
              }
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
            this.loading1 = false;
            this.$message({
              message: err.data || this.$t("text.systemError"),
              type: "error",
              duration: 2000,
            });
          });
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getCnsList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCnsList();
    },
    queryLocalCns() {
      this.loadingLocal = true;
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        contractName: "",
      };
      findCnsInfoList(reqData)
        .then((res) => {
          this.loadingLocal = false;
          if (res.data.code === 0) {
            this.localCnsList = res.data.data;
            this.totalLocal = res.data.totalCount;
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.loadingLocal = false;
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    localSizeChange(val) {
      this.pageSizeLocal = val;
      this.currentPageLocal = 1;
      this.queryLocalCns();
    },
    localCurrentChange(val) {
      this.currentPageLocal = val;
      this.queryLocalCns();
    },
  },
};
</script>

<style scoped>
.demo-ruleForm {
  display: flex;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: -moz-flex;
}
.item-form {
  display: flex;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: -moz-flex;
  margin-left: 10px;
}
.item-form:first-child {
  margin-left: 0px;
}
.modify-btn {
  margin-left: 10px;
}
.instructions {
  margin-bottom: 16px;
  padding: 10px 10px;
  color: #2e384d;
  border-radius: 10px;
  display: inline-block;
}
.search-table-content >>> th {
  background: #fafafa;
}
.cns-title {
  display: inline-block;
  margin-bottom: 20px;
  font-weight: bold;
}
</style>
