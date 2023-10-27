<template>
  <div>
    <!-- <content-head :headTitle="$t('title.groupManagement')" :icon="true" @changGroup="changGroup" :updateGroup="updateGroup" :updateGroupType="updateGroupType"></content-head> -->
    <nav-menu :headTitle="$t('title.groupManagement')"></nav-menu>
    <div class="module-wrapper">
      <div class="search-part" style="padding-top: 20px">
        <div class="search-part-right">
          <!-- <el-button
            type="primary"
            class="search-part-left-btn"
            @click="generateGroup"
            >{{ this.$t("nodes.addGroup") }}</el-button
          >
          <el-button
            type="primary"
            class="search-part-left-btn"
            @click="addHadGroup"
            >{{ this.$t("nodes.addHadGroup") }}</el-button
          > -->
          <el-button type="text" icon="el-icon-refresh" @click="queryUpdateGroup" v-preventReClick :title="$t('alarm.refresh')">{{ this.$t('alarm.refresh') }}
          </el-button>
        </div>
        <div class="">
          <el-table :data="groupList" class="search-table-content" v-loading="loading">
            <el-table-column v-for="head in groupHead" :label="head.name" :key="head.enName" :prop="head.enName" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="head.enName === 'groupName'" class="cursor-pointer font-color-00c1d4">
                  <span @click="queryCrudGroup(scope.row)">
                    {{ scope.row[head.enName] }}
                  </span>
                </span>
                <span v-else-if="head.enName === 'groupStatus'" :style="{ color: groupStatusColor(scope.row[head.enName]) }">
                  <span class="cursor-pointer" @click="queryCrudGroup(scope.row)">
                    {{ status(scope.row[head.enName]) }}
                  </span>
                  <i :class="scope.row['icon']" :title="scope.row['icon_text']"></i>
                </span>
                <span v-else>{{ scope.row[head.enName] }}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('nodes.operation')" width="250">
              <template slot-scope="scope">
                <!-- <el-button
                  type="text"
                  size="small"
                  @click="queryCrudGroup(scope.row)"
                  >{{ $t("text.update") }}</el-button
                > -->
                <el-button type="text" size="small" :loading="dropLoading && dropIndex === scope.row.groupId" @click="queryDeleteGroupData(scope.row)">{{ $t("text.dropGroupData") }}</el-button>
                <el-button type="text" size="small" v-if="scope.row.groupType !== 1" :disabled="scope.row.groupType === 1 ? true : false" @click="exportFile(scope.row)">{{ $t("system.export") }}</el-button>
                <el-button type="text" size="small" @click="remarks(scope.row)">{{ $t("text.remarks") }}</el-button>
                <el-tooltip effect="light" :content="$t('text.noExportGroup')" placement="bottom-end">
                  <i v-if="scope.row.groupType !== 1" class="el-icon-warning"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
          <el-dialog :title="$t('nodes.addGroup')" :visible.sync="generateGroupVisibility" v-if="generateGroupVisibility" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <generate-group @generateSuccess="generateSuccess" @close="close"></generate-group>
          </el-dialog>
          <el-dialog :title="
              $t('nodes.modifyGroup') +
              '(' +
              'ID:' +
              ' ' +
              `${modifyGroupId}` +
              ')'
            " :visible.sync="modifyGroupVisibility" v-if="modifyGroupVisibility" center>
            <modify-group @modifySuccess="modifySuccess" @modifyClose="modifyClose" :itemGroupData="itemGroupData"></modify-group>
          </el-dialog>
          <el-dialog :title="$t('text.joinExitedGroup')" :visible.sync="joinGroupTipsVisibility" v-if="joinGroupTipsVisibility" center>
            <join-group-tips @joinGroupTipsSuccess="joinGroupTipsSuccess"></join-group-tips>
          </el-dialog>
          <el-dialog :title="$t('nodes.description')" :visible.sync="descriptionShow" v-if="descriptionShow" center class="descr">
            <el-form ref="form" :model="nodes" label-width="80px">
              <el-form-item label="群组描述">
                <el-input v-model="nodes.description"></el-input>
              </el-form-item>
              <el-form-item class="btn">
                <el-button type="primary" @click="changeDescriptions">修改</el-button>
                <el-button @click='closeThis'>取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import contentHead from "@/components/contentHead";
import NavMenu from '../../components/navs/navMenu.vue';
import generateGroup from "./components/generateGroup";
import modifyGroup from "./components/modifyGroup";
import joinGroupTips from "./components/joinGroupTips";
import {
  crudGroup,
  getUpdateGroup,
  getGroupsInvalidIncluded,
  deleteGroupData,
  changeDescription,
} from "@/util/api";
const FileSaver = require("file-saver");
export default {
  name: "groupManagement",

  components: {
    contentHead,
    generateGroup,
    modifyGroup,
    joinGroupTips,
    'nav-menu': NavMenu,
  },

  props: {},

  data() {
    return {
      disabled: false,
      loading: false,
      generateGroupVisibility: false,
      modifyGroupVisibility: false,
      updateGroup: 0,
      groupList: [],
      typeList: ["start", "stop", "remove", "recover"],
      itemGroupData: {},
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dropLoading: false,
      dropIndex: "",
      updateGroupType: "",
      modifyGroupId: "",
      joinGroupTipsVisibility: false,
      descriptionShow: false,
      nodes: {
        description: "",
        groupId: "",
      },
    };
  },

  computed: {
    groupHead() {
      let data = [
        {
          enName: "groupId",
          name: this.$t("nodes.groupId"),
          width: "",
        },
        // {
        //   enName: "groupName",
        //   name: this.$t("nodes.groupName"),
        //   width: "",
        // },
        {
          enName: "nodeCount",
          name: this.$t("nodes.nodeCount"),
          width: "",
        },
        // {
        //   enName: "groupStatus",
        //   name: this.$t("nodes.groupStatus"),
        //   width: "",
        // },
        {
          enName: "modifyTime",
          name: this.$t("nodes.modifyTime"),
          width: "",
        },
      ];
      return data;
    },
  },

  watch: {},

  created() {},

  mounted() {
    this.queryGroupTable();
  },

  methods: {
    changGroup() {},
    generateGroup() {
      this.generateGroupVisibility = true;
    },
    addHadGroup() {
      this.joinGroupTipsVisibility = true;
    },
    modify() {
      this.modifyGroupVisibility = true;
    },
    close() {
      this.generateGroupVisibility = false;
    },
    generateSuccess() {
      this.generateGroupVisibility = false;
      this.queryGroupTable();
      this.updateGroup++;
      // this.updateGroupType = 'update'
    },
    modifyClose() {
      this.modifyGroupVisibility = false;
      this.queryGroupTable();
    },
    modifySuccess() {
      // this.modifyGroupVisibility = false;
      this.queryGroupTable();
      this.updateGroup++;
      // this.updateGroupType = 'update'
    },
    joinGroupTipsSuccess() {
      this.joinGroupTipsVisibility = false;
      this.queryGroupTable();
    },
    queryGroupTable() {
      let reqData = {
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
        },
        reqQuery = {};
      getGroupsInvalidIncluded(reqData, reqQuery)
        .then((res) => {
          if (res.data.code === 0) {
            this.groupList = res.data.data;
            this.total = res.data.totalCount;
            var abnormalList = [];
            this.groupList.forEach((item) => {
              if (item.groupStatus === 3) {
                abnormalList.push(item.groupId);
                item.icon = "el-icon-warning";
                item.icon_text = `${this.$t("text.group")}${this.$t(
                  "text.groupConf"
                )}`;
              }
              if (item.groupStatus === 4) {
                item.icon = "el-icon-warning";
                item.icon_text = `${this.$t("text.groupConf4_all")}`;
              }
            });
            if (abnormalList.length > 0) {
              this.$notify({
                type: "error",
                message: `${this.$t("text.group")} ${abnormalList} ${this.$t(
                  "text.groupConf"
                )}`,
                duration: 9500,
                offset: 55,
              });
            }
          } else {
            this.$message({
              type: "error",
              message: this.$chooseLang(res.data.code),
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            type: "error",
            message: err.data || this.$t("text.systemError"),
          });
        });
    },
    queryUpdateGroup() {
      this.loading = true;
      getUpdateGroup()
        .then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.queryGroupTable();
            this.updateGroup++;
            this.updateGroupType = "update";
          } else {
            this.$message({
              type: "error",
              message: this.$chooseLang(res.data.code),
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            type: "error",
            message: err.data || this.$t("text.systemError"),
          });
        });
    },
    queryCrudGroup(row) {
      this.itemGroupData = row;
      this.modifyGroupId = row.groupId;
      this.modifyGroupVisibility = true;
    },
    queryDeleteGroupData(val) {
      this.$confirm(this.$t("text.confirmDorp"), {
        type: "warning",
      })
        .then((_) => {
          this.$confirm(this.$t("text.confirmDorp2"), {
            type: "warning",
          })
            .then((_) => {
              this.sureDeleteGroupData(val);
            })
            .catch((_) => {});
        })
        .catch((_) => {});
    },
    sureDeleteGroupData(val) {
      this.dropLoading = true;
      this.dropIndex = val.groupId;
      var groupId = val.groupId;
      deleteGroupData(groupId)
        .then((res) => {
          this.dropLoading = false;
          if (res.data.code === 0) {
            this.queryGroupTable();
            this.updateGroup++;
            this.updateGroupType = "update";
          } else {
            this.$message({
              type: "error",
              message: this.$chooseLang(res.data.code),
            });
          }
        })
        .catch((err) => {
          this.dropLoading = false;
          this.$message({
            type: "error",
            message: err.data || this.$t("text.systemError"),
          });
        });
    },
    exportFile(itemGroupData) {
      let str = JSON.stringify(itemGroupData);
      var blob = new Blob([str], { type: "text;charset=utf-8" });
      FileSaver.saveAs(blob, itemGroupData.groupName);
    },
    status(key) {
      switch (key) {
        case 1:
          return this.$t("text.running");
          break;

        case 2:
          return this.$t("text.maintaining");
          break;
        case 3:
          return this.$t("text.abnormal");
          break;
        case 4:
          return this.$t("text.abnormal");
          break;
      }
    },
    remarks(val) {
      this.descriptionShow = true;
      this.nodes.description = val.description;
      this.nodes.groupId = val.groupId;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.queryGroupTable();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryGroupTable();
    },
    groupStatusColor(key) {
      switch (key) {
        case 1:
          return "rgb(88, 203, 125)";
          break;

        case 2:
          return "#E6A23C";
          break;
        case 3:
          return "#F56C6C";
          break;
        case 4:
          return "#F56C6C";
          break;
      }
    },
    changeDescriptions() {
      let reqData = {
        groupId: this.nodes.groupId,
        description: this.nodes.description,
      };
      changeDescription(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: "修改成功",
            });
            this.descriptionShow = false;
            this.queryGroupTable();
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            type: "error",
            message: err.data || this.$t("text.systemError"),
          });
          this.descriptionShow = false;
        });
    },
     closeThis(){
          this.descriptionShow = false;
    },
  },
};
</script>

<style scoped>
.search-part-left-btn {
  border-radius: 20px;
}
.descr {
  width: 50%;
  margin: 0 auto;
}
.btn {
  margin: 0 auto;
}
</style>
