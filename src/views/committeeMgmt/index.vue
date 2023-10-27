<template>
  <div>
    <!-- <v-content-head :headTitle="$t('title.systemManager')" :headSubTitle="$t('title.committeeMgmt')" @changGroup="changGroup"></v-content-head> -->
    <div style="padding: 10px 20px 0 20px;">
      <div class="">
        <el-button type="primary" :disabled="disabled" @click="addCommittee">{{this.$t('govCommittee.addCommittee')}}</el-button>
        <!-- <el-button type="primary" :disabled="disabled" @click="deleteCommittee">{{this.$t('govCommittee.deleteCommittee')}}</el-button>
        <el-button type="primary" :disabled="disabled" @click="modifyWeight">{{this.$t('govCommittee.modifyWeight')}}</el-button> -->
        <el-button type="primary" :disabled="disabled" @click="modifyThreshold">{{this.$t('govCommittee.modifyThreshold')}}</el-button>
        <el-button type="primary" :disabled="disabled" @click="$store.dispatch('switch_import_private_key_dialog')">{{this.$t('govCommittee.importUserprivateKey')}}</el-button>
      </div>
      <div>
        <el-table :data="produceCommittee" tooltip-effect="dark" v-loading="loading">
          <el-table-column v-for="head in chainCommitteeHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <template v-if="head.enName!='operate'">
                <span v-if="head.enName =='userId'">{{userName(scope.row['governorAddress'])}}</span>
                <span v-if="head.enName =='weightRate'">{{weightRate(scope.row['weight'])}}</span>
                <span v-else-if="head.enName =='governorAddress'">
                  <i class="wbs-icon-copy font-12 copy-public-key" v-show="scope.row[head.enName]" @click="copyPubilcKey(scope.row[head.enName])" :title="$t('privateKey.copy')"></i>
                  {{scope.row[head.enName]}}
                </span>
                <span v-else>{{scope.row[head.enName]}}</span>
              </template>
              <template v-else>
                <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="modifyWeight(scope.row)">{{$t('govCommittee.modifyWeight')}}</el-button>
                <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="deleteCommittee(scope.row)">{{$t('govCommittee.deleteCommittee')}}</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="total > 10" class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
          layout=" sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <el-dialog :title="$t('govCommittee.addCommittee')" :visible.sync="addCommitteeVisible" width="500px" v-if="addCommitteeVisible" center @close="closeAddCommittee">
          <el-form :model="governForm" :rules="rules" ref="governForm" label-width="130px" class="demo-ruleForm">
            <el-form-item :label="$t('govCommittee.fromUser')" prop="fromAddress">
              <template v-if="chainCommitteeList.length > 0">
                <el-select v-model="governForm.fromAddress" :placeholder="$t('text.select')" style="width:250px;">
                  <el-option v-for="item in produceCommittee" :key="item.governorAddress" :label="item.userName" :value="item.governorAddress">
                    <span>{{item.userName}}</span>
                    <span>{{item.governorAddress | splitString}}</span>
                  </el-option>
                </el-select>
              </template>
              <template v-else>
                <el-select v-model="governForm.fromAddress" :placeholder="$t('text.select')" style="width:250px;">
                  <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                    <span>{{item.userName}}</span>
                    <span class="font-12">{{item.address | splitString}}</span>
                  </el-option>
                </el-select>
              </template>
              <span v-if="isShowPrivate" class="contract-code-done" @click="$store.dispatch('switch_creat_user_dialog')" style="float:right;">
                <span target="_blank" style="cursor:pointer;font-size:12px;text-decoration:underline;">{{this.$t("privateKey.addUser")}}</span>
              </span>
            </el-form-item>
            <el-form-item :label="$t('govCommittee.user')" prop="address">

              <el-input v-model="governForm.address" style="width:250px;" :placeholder="$t('transaction.inputUserAddress')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('govCommittee.weight')" prop="weight">
              <el-input v-model="governForm.weight" @input="e => (governForm.weight = isnumber(e))" style="width:250px;"></el-input>
            </el-form-item>
          </el-form>
          <p style="padding-left: 50px">{{$t('govCommittee.dialogTips')}}</p>
          <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="closeAddCommittee">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="sureAddCommittee">{{this.$t('text.sure')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="$t('govCommittee.deleteCommittee')" :visible.sync="deleteCommitteeVisible" width="500px" v-if="deleteCommitteeVisible" center @close="closeDeleteCommittee">
          <el-form :model="governForm" :rules="rules" ref="governForm" label-width="144px" class="demo-ruleForm">
            <el-form-item :label="$t('govCommittee.fromUser')" prop="governorAddress">
              <el-select v-model="governForm.governorAddress" :placeholder="$t('text.select')" style="width:300px;">
                <el-option v-for="item in produceCommittee" :key="item.governorAddress" :label="item.userName" :value="item.governorAddress">
                  <span>{{item.userName}}</span>
                  <span>{{item.governorAddress | splitString}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item :label="$t('govCommittee.revokeCommittee')" prop="address">
              <el-select v-model="governForm.address" :placeholder="$t('text.select')">
                <el-option v-for="item in produceCommittee" :key="item.governorAddress" :label="item.userName" :value="item.governorAddress">
                  <span>{{item.userName}}</span>
                  <span class="font-12">{{item.governorAddress | splitString}}</span>
                </el-option>
              </el-select>
            </el-form-item> -->
          </el-form>
          <p style="padding-left: 50px">*{{$t('govCommittee.dialogTips')}}</p>
          <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="closeDeleteCommittee">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="sureDeleteCommittee" :loading="btnLoading">{{this.$t('text.sure')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="$t('govCommittee.modifyWeight')" :visible.sync="modifyWeightVisible" width="500px" v-if="modifyWeightVisible" center @close="closeModifyWeight">
          <el-form :model="governForm" :rules="rules" ref="governForm" label-width="130px" class="demo-ruleForm">
            <el-form-item :label="$t('govCommittee.fromUser')" prop="governorAddress">
              <el-select v-model="governForm.governorAddress" :placeholder="$t('text.select')" style="width:300px">
                <el-option v-for="item in produceCommittee" :key="item.governorAddress" :label="item.userName" :value="item.governorAddress">
                  <span>{{item.userName}}</span>
                  <span>{{item.governorAddress | splitString}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item :label="$t('govCommittee.toCommittee')" prop="governorAddress">
              <el-select v-model="governForm.governorAddress" :placeholder="$t('text.select')" @change="changeAddress">
                <el-option v-for="item in produceCommittee" :key="item.address" :label="item.userName" :value="item.address">
                  <span>{{item.governorAddress}}</span>
                  <span class="font-12">{{item.governorAddress}}...</span>
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item :label="$t('govCommittee.weight')" prop="weight">
              <el-input v-model="governForm.weight" @input="e => (governForm.weight = isnumber(e))" style="width:300px"></el-input>
            </el-form-item>
          </el-form>
          <!-- <p style="padding-left: 50px">{{$t('govCommittee.dialogTips')}}</p> -->
          <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="closeModifyWeight">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="sureModifyweight" :loading="btnLoading">{{this.$t('text.sure')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="$t('govCommittee.modifyThreshold')" :visible.sync="modifyThresholdVisible" width="500px" v-if="modifyThresholdVisible" center @close="closeModifyThreshold">
          <div style="text-align:center">
            <span>{{$t('govCommittee.thresholdNow')}}:{{winRateNow}}</span>
            <span>{{$t('govCommittee.participatesRateNow')}}:{{participatesRateNow}}</span>
          </div>
          <el-form :model="governForm" :rules="rules" ref="governForm" label-width="130px" class="demo-ruleForm">
            <el-form-item :label="$t('govCommittee.fromUser')" prop="fromAddress">
              <el-select v-model="governForm.fromAddress" :placeholder="$t('text.select')" style="width:300px;">
                <el-option v-for="item in produceCommittee" :key="item.governorAddress" :label="item.userName" :value="item.governorAddress">
                  <span>{{item.userName}}</span>
                  <span class="font-12">{{item.governorAddress | splitString}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('govCommittee.participatesRate')" prop="participatesRate">
              <el-input v-model="governForm.participatesRate" @input="e => (governForm.participatesRate = isnumber(e))" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('govCommittee.threshold')" prop="threshold">
              <el-input v-model="governForm.threshold" @input="e => (governForm.threshold = isnumber(e))" style="width:300px;"></el-input>
            </el-form-item>
          </el-form>
          <p style="padding-left: 50px">{{$t('privateKey.modifyThresholdTip')}}</p>
          <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="closeModifyThreshold">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="sureModifyThreshold">{{this.$t('text.sure')}}</el-button>
          </div>
        </el-dialog>
      </div>

    </div>
    <div style="padding: 60px 20px 0 20px;">
      <p>
        <span style="font-weight: bold">{{this.$t('govCommittee.votingList')}}</span>
        <!-- <span style="float: right">({{this.$t('govCommittee.blockNum')}}：<span style="color: #e6a23c">{{currentBlock}}</span>)</span> -->
      </p>
      <el-table :data="voteList" tooltip-effect="dark" v-loading="loading">
        <el-table-column v-for="head in voteHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <template v-if="head.enName!='operate'">
              <span v-if="head.enName=='againstVoters'">{{airJudg(scope.row[head.enName])}}</span>
              <span v-else-if="head.enName=='agreeVoters'">
                <span v-if="scope.row['agreeVoters']">
                  {{(scope.row[head.enName])}}
                </span>
                <span v-else>
                  -
                </span>
              </span>
              <span v-else-if="head.enName=='toAddress1'">
                <i class="wbs-icon-copy font-12 copy-public-key" v-show="scope.row['toAddress']" @click="copyPubilcKey(scope.row['toAddress'])" :title="$t('privateKey.copy')"></i>
                <span v-if="scope.row['toAddress']">
                  {{scope.row['toAddress']}}
                </span>
                <span v-else>
                  -
                </span>
              </span>
              <span v-else-if="head.enName=='type'">
                <span v-if="scope.row[head.enName]">
                  {{scope.row[head.enName] | voteType}}
                </span>
                <span v-else>
                  -
                </span>
              </span>
              <span v-else-if="head.enName=='status'">
                <span v-if="scope.row['status']=='notEnoughVotes'" style="color:#f56c6c">
                  {{(scope.row['status'])}}
                </span>
                <span v-else>
                  {{(scope.row['status'])}}
                </span>
              </span>
              <span v-else-if="head.enName=='timeLimit'">
                <span v-if="scope.row[head.enName]">
                  {{voteTimeZh(scope.row['timeLimit'])}}
                </span>
                <span v-else>
                  -
                </span>
              </span>
              <span v-else>
                <span v-if="scope.row[head.enName]">
                  {{scope.row[head.enName]}}
                </span>
                <span v-else>
                  -
                </span>
              </span>
            </template>
            <template v-else>
              <el-button :loading="btnLoading&&btnIndex===scope.row.id" :disabled="scope.row['status']=='finished'||scope.row['status']=='failed'||scope.row['status']=='revoke'" type="text" size="small"
                :style="{'color': disabled?'#666':''}" @click="Committee(scope.row)">
                {{$t('govCommittee.Committee')}}
              </el-button>
              <el-button :loading="btnLoading&&btnIndex===scope.row.id" :disabled="scope.row['status']=='finished'||scope.row['status']=='failed'||scope.row['status']=='revoke'" type="text" size="small"
                :style="{'color': disabled?'#666':''}" @click="revokeVotee(scope.row)">
                {{$t('govCommittee.revokeVote')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page" @size-change="voteSizeChange" @current-change="voteCurrentChange" :current-page="voteCurrentPage" :page-sizes="[10, 20, 30, 50]" layout=" total,sizes, prev, pager, next, jumper"
        :total="voteTotal">
      </el-pagination>
      <el-dialog :title="$t('govCommittee.Committee')" :visible.sync="CommitteeVisible" width="500px" v-if="CommitteeVisible" center @close="closeCommittee">
        <el-form :model="govCommittee" :rules="rules" ref="govCommittee" label-width="130px" class="demo-ruleForm">
          <el-form-item :label="$t('govCommittee.fromUser')" prop="fromAddress">
            <template v-if="chainCommitteeList.length > 0">
              <el-select v-model="govCommittee.fromAddress" :placeholder="$t('text.select')" style="width:300px">
                <el-option v-for="item in produceCommittee" :key="item.governorAddress" :label="item.userName" :value="item.governorAddress">
                  <span>{{item.userName}}</span>
                  <span>{{item.governorAddress | splitString}}</span>
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item :label="$t('govCommittee.operate')" prop="operate">
            <el-radio v-model="govCommittee.operate" :label='true'>{{this.$t('govCommittee.agree')}}</el-radio>
            <el-radio v-model="govCommittee.operate" :label='false'>{{this.$t('govCommittee.refuse')}}</el-radio>
          </el-form-item>
        </el-form>
        <!-- <p style="padding-left: 50px">{{$t('govCommittee.dialogTips')}}</p> -->
        <div class="text-right sure-btn" style="margin-top:10px">
          <el-button @click="closeCommittee">{{this.$t('text.cancel')}}</el-button>
          <el-button type="primary" @click="sureCommittee">{{this.$t('text.sure')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('govCommittee.revokeVote')" :visible.sync="revokeVoteVisible" width="500px" v-if="revokeVoteVisible" center @close="closerevokeVote">
        <el-form :model="revokeVote" :rules="rules" ref="revokeVote" label-width="130px" class="demo-ruleForm">
          <el-form-item :label="$t('govCommittee.fromUser')" prop="fromAddress">
            <template v-if="chainCommitteeList.length > 0">
              <el-select v-model="revokeVote.fromAddress" :placeholder="$t('text.select')" style="width:300px">
                <el-option v-for="item in produceCommittee" :key="item.governorAddress" :label="item.userName" :value="item.governorAddress">
                  <span>{{item.userName}}</span>
                  <span>{{item.governorAddress | splitString}}</span>
                </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-form>
        <!-- <p style="padding-left: 50px">{{$t('govCommittee.dialogTips')}}</p> -->
        <p style="padding-left: 50px">*{{$t('govCommittee.dialogTips')}}</p>
        <div class="text-right sure-btn" style="margin-top:10px">
          <el-button @click="closerevokeVote">{{this.$t('text.cancel')}}</el-button>
          <el-button type="primary" @click="sureRevokeVote">{{this.$t('text.sure')}}</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog :visible.sync="$store.state.creatUserVisible" :title="$t('privateKey.createUser')" width="640px" :append-to-body="true" class="dialog-wrapper" v-if='$store.state.creatUserVisible' center>
      <v-creatUser @creatUserClose="creatUserClose" :disablePub='true' ref="creatUser"></v-creatUser>
    </el-dialog>
    <el-dialog :visible.sync="$store.state.importPrivateKey" :title="$t('privateKey.importPrivateKeyAccount')" width="640px" :append-to-body="true" class="dialog-wrapper" v-if='$store.state.importPrivateKey' center>
      <v-importKey @importPrivateKeySuccess="importPrivateKeySuccess" ref="importKey"></v-importKey>
    </el-dialog>
  </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import importKey from "./components/importKey.vue";
import creatUser from "@/views/privateKeyManagement/components/creatUser";
import {
  addCommittee,
  getUserList,
  committeeList,
  deleteCommittee,

  voteRecord,
  deleteVoteRecord,
  getThreshold,
  getNetworkStatistics,
  getCommitteeWeight,
  voteCommittee,
  voteRevoke,
  modifyRate,
  getCount,
  getPermissionManagementStatus,
} from "@/util/api";
export default {
  name: "committeeMgmt",

  components: {
    "v-content-head": contentHead,
    "v-creatUser": creatUser,
    "v-importKey": importKey,
  },

  props: {},

  data() {
    return {
      disabled: false,
      loading: false,
      btnLoading: false,
      btnIndex: "",
      currentThreshold: "",
      currentBlock: 0,
      addCommitteeVisible: false,
      modifyThresholdVisible: false,
      modifyWeightVisible: false,
      CommitteeVisible: false,
      revokeVoteVisible: false,
      deleteCommitteeVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      winRate: "",
      voteCurrentPage: 1,
      votePageSize: 10,
      voteTotal: 0,
      adminRivateKeyList: [],
      chainRivateKeyList: [],
      chainCommitteeList: [],
      chainCommitteeHead: [
        {
          enName: "userId",
          name: this.$t("govCommittee.fromUser"),
          width: "",
        },
        {
          enName: "governorAddress",
          name: this.$t("govCommittee.address"),
          width: "",
        },
        {
          enName: "weight",
          name: this.$t("govCommittee.weight"),
          width: "",
        },
        {
          enName: "weightRate",
          name: this.$t("govCommittee.weightRatio"),
          width: "",
        },
        {
          enName: "operate",
          name: this.$t("govCommittee.operate"),
          width: "80",
        },
        // {
        //     enName: 'enable_num',
        //     name: this.$t("govCommittee.enableNum"),
        //     width: ''
        // }
      ],
      winRateNow: "",
      participatesRateNow: "",
      governForm: {
        fromAddress: "",
        governorAddress: "",
        address: "",
        threshold: "",
        weight: "",
        participatesRate: "",
      },
      govCommittee: {
        operate: true,
        fromAddress: "",
        proposalId: "",
      },
      revokeVote: {
        proposalId: "",
        fromAddress: "",
      },
      voteHead: [
        {
          enName: "proposalId",
          name: this.$t("govCommittee.id"),
          width: "",
        },
        {
          enName: "proposalType",
          name: this.$t("govCommittee.voteType"),
          width: "",
        },
        {
          enName: "proposer",
          name: this.$t("govCommittee.governUserId"),
          width: "",
        },
        {
          enName: "agreeVoters",
          name: this.$t("govCommittee.modifyUserId"),
          width: "",
        },
        {
          enName: "againstVoters",
          name: this.$t("govCommittee.modifyUserAddress"),
          width: "",
        },
        {
          enName: "status",
          name: this.$t("govCommittee.voteStatus"),
          width: "",
        },
        // {
        //     enName: 'timeLimit',
        //     name: this.$t("govCommittee.voteStatus"),
        //     width: ''
        // },
        // {
        //     enName: 'createTime',
        //     name: this.$t("govCommittee.updatetime"),
        //     width: ''
        // },
        {
          enName: "operate",
          name: this.$t("govCommittee.operate"),
          width: "80",
        },
      ],
      voteList: [
        // {
        //   againstVoters: "",
        //   agreeVoters: null,
        //   blockNumberInterval: '',
        //   proposalType: 0,
        //   proposalTypeString: "",
        //   proposer: "",
        //   resourceId: "",
        //   requestId: "",
        //   status: '',
        //   statusString: "",
        // },
      ],
      isShowPrivate: false,
      totalWeight: 0,
    };
  },

  computed: {
    rules() {
      let _this = this;
      var paramRule = (rule, value, callback) => {
        let val = value.trim();
        let chainCommittes = [];
        _this.produceCommittee.map((item) => {
          chainCommittes.push(item.governorAddress);
        });
        if (chainCommittes.includes(val)) {
          callback(new Error(this.$t("rule.chainCommite")));
        } else {
          callback();
        }
      };
      let data = {
        fromAddress: [
          {
            required: true,
            message: this.$t("rule.fromUserRule"),
            trigger: "change",
          },
        ],
        address: [
          {
            required: true,
            message: this.$t("transaction.inputUserAddress"),
            trigger: "blur",
          },
          {
            required: true,
            validator: paramRule,
            trigger: "blur",
          },
          {
            pattern: /^0[xX][0-9a-fA-F]{40}$/,
            message: "必须是十六进制的数字或字母,长度是42",
            trigger: "blur",
          },
        ],
        threshold: [
          {
            required: true,
            message: this.$t("rule.thresholdRule"),
            trigger: "blur",
          },
        ],
        participatesRate: [
          {
            required: true,
            message: this.$t("rule.thresholdRule"),
            trigger: "blur",
          },
        ],
        weight: [
          {
            required: true,
            message: this.$t("rule.weightRule"),
            trigger: "blur",
          },
          {
            pattern: /^([0-9]{1,2}|100)$/,
            message: this.$t("rule.weightRules"),
            trigger: "blur",
          },
        ],
      };
      return data;
    },
    produceCommittee() {
      let privateKeyList = this.adminRivateKeyList;
      let committeeList = this.chainCommitteeList;
      let totalWeight = 0;
      // whether find committee in local private key list
      let flagFind = false;
      let committeeLists = [];
      privateKeyList.forEach((item) => {
        committeeList.forEach((it) => {
          if (item.address == it.governorAddress) {
            it.userName = item.userName;
            flagFind = true;
            committeeLists.push(it);
            totalWeight += it.weight;
          }
        });
      });
      // if committee not empty
      if (!committeeList.length) {
        if (flagFind) {
          // 如果本地有committee私钥，则设置
          this.governForm.fromAddress = committeeList[0]["governorAddress"];
        } else {
          // 如果本地没有committee私钥，则不选默认值
        }
      }
      this.totalWeight = totalWeight;
      return committeeLists;
    },
  },

  watch: {},

  created() {},

  mounted() {
    if (localStorage.getItem("root") === "admin") {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
    if (localStorage.getItem("groupId")) {
      //this.queryGetThreshold()
      this.checkAuth();
    }
  },

  methods: {
    checkAuth() {
      getPermissionManagementStatus(localStorage.getItem("groupId"))
        .then((res) => {
          if (res.data.data == true) {
            this.queryCommitteeList();
            this.queryVoteRecordList();
            this.getUserData();
            this.queryVoteRecordListCount();
          } else {
            this.disabled = true;
          }
        })
        .catch((err) => {});
    },
    importPrivateKeySuccess() {
      this.queryCommitteeList();
      this.queryVoteRecordList();
      this.getUserData();
      this.queryVoteRecordListCount();
    },
    airJudg(val) {
      return typeof val == "undefined" || val == null || val == "" ? "-" : val;
    },
    changGroup() {
      this.adminRivateKeyList = [];
      //this.queryGetThreshold();
      this.getUserData();
      this.queryCommitteeList();
      this.queryVoteRecordList();
      this.queryVoteRecordListCount();
    },
    initGovernForm() {
      // this.governForm.fromAddress = ""
      this.governForm.address = "";
      this.governForm.weight = "";
    },
    queryGetThreshold() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
      };
      getThreshold(reqData).then((res) => {
        if (res.data.code === 0) {
          this.currentThreshold = res.data.data;
          this.$set(this.governForm, "threshold", this.currentThreshold);
        } else {
          this.$message({
            message: this.$chooseLang(res.data.code),
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    getUserData() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        pageNumber: 1,
        pageSize: 1000,
      };
      getUserList(reqData, {})
        .then((res) => {
          if (res.data.code === 0) {
            this.adminRivateKeyList = [];
            res.data.data.forEach((value) => {
              // if (value.hasPk === 1) {
              this.adminRivateKeyList.push(value);
              // }
            });
            if (this.adminRivateKeyList.length === 0) {
              this.isShowPrivate = true;
            } else {
              this.isShowPrivate = false;
              // this.governForm.fromAddress = this.adminRivateKeyList[0]['address'];
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
          this.$message({
            message: err.data || this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    addCommittee() {
      this.initGovernForm();
      this.addCommitteeVisible = true;
    },
    closeAddCommittee() {
      this.initGovernForm();
      this.addCommitteeVisible = false;
    },
    closeCommittee() {
      this.CommitteeVisible = false;
    },
    closerevokeVote() {
      this.revokeVoteVisible = false;
    },
    sureCommittee() {
      this.$refs["govCommittee"].validate((valid) => {
        if (valid) {
          this.voteCommitting();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    voteCommitting() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        fromAddress: this.govCommittee.fromAddress,
        proposalId: this.govCommittee.proposalId,
        signUserId: "",
        agree: this.govCommittee.operate,
      };
      voteCommittee(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: this.$t("govCommittee.CommitteeSuccess"),
            });
            this.closeCommittee();
            this.queryCommitteeList();
            this.queryVoteRecordList();
            this.queryVoteRecordListCount();
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
    sureRevokeVote() {
      this.$refs["revokeVote"].validate((valid) => {
        if (valid) {
          this.revokeVoting();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    revokeVoting() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        fromAddress: this.revokeVote.fromAddress,
        proposalId: this.revokeVote.proposalId,
        signUserId: "",
      };
      voteRevoke(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: this.$t("govCommittee.revokeVoteSuccess"),
            });
            this.closerevokeVote();
            this.queryCommitteeList();
            this.queryVoteRecordList();
            this.queryVoteRecordListCount();
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
    sureAddCommittee() {
      this.$refs["governForm"].validate((valid) => {
        if (valid) {
          this.queryAddCommittee();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    queryAddCommittee() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        fromAddress: this.governForm.fromAddress,
        accountAddress: this.governForm.address,
        signUserId: "",
        weight: this.governForm.weight,
      };
      addCommittee(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: this.$t("govCommittee.addSuccess"),
            });
            this.closeAddCommittee();
            this.queryCommitteeList();
            this.queryVoteRecordList();
            this.queryVoteRecordListCount();
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
    modifyThreshold() {
      this.modifyThresholdVisible = true;
      //this.queryGetThreshold();
    },
    sureModifyThreshold() {
      this.$refs["governForm"].validate((valid) => {
        if (valid) {
          this.queryModifyThreshold();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closeModifyThreshold() {
      this.governForm.threshold = "";
      this.governForm.participatesRate = "";
      this.initGovernForm();
      this.modifyThresholdVisible = false;
    },
    queryModifyThreshold() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        fromAddress: this.governForm.fromAddress,
        participatesRate: Number(this.governForm.participatesRate),
        signUserId: "",
        winRate: Number(this.governForm.threshold),
      };
      modifyRate(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: this.$t("govCommittee.modifyThresholdSuccess"),
            });
            // this.queryGetThreshold();
            this.closeModifyThreshold();
            this.queryCommitteeList();
            this.queryVoteRecordList();
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
    closeModifyWeight() {
      this.initGovernForm();
      this.modifyWeightVisible = false;
    },
    sureModifyweight() {
      this.$refs["governForm"].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let reqData = {
            groupId: localStorage.getItem("groupId"),
            fromAddress: this.governForm.governorAddress,
            accountAddress: this.governForm.accountAddress,
            signUserId: "",
            weight: this.governForm.weight,
          };
          addCommittee(reqData)
            .then((res) => {
              this.btnLoading = false;
              if (res.data.code === 0) {
                this.$message({
                  type: "success",
                  message: this.$t("govCommittee.modifySuccess"),
                });
                this.closeModifyWeight();
                this.queryCommitteeList();
                this.queryVoteRecordList();
                this.queryVoteRecordListCount();
              } else {
                this.$message({
                  message: this.$chooseLang(res.data.code),
                  type: "error",
                  duration: 2000,
                });
              }
            })
            .catch((err) => {
              this.btnLoading = false;
              this.$message({
                message: err.data || this.$t("text.systemError"),
                type: "error",
                duration: 2000,
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    modifyWeight(val) {
      this.modifyWeightVisible = true;
      this.governForm.governorAddress = val.governorAddress;
      this.governForm.accountAddress = val.governorAddress;
      this.governForm.weight = val.weight;
    },
    queryCommitteeList() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        // pageNumber: this.currentPage,
        // pageSize: this.pageSize
      };
      committeeList(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            let data = res.data.data;
            this.chainCommitteeList = data[0]["governorList"];
            this.winRateNow = data[0]["winRate"];
            this.participatesRateNow = data[0]["participatesRate"];
            this.chainRivateKeyList = [];
            // data.forEach(item=>{
            //     this.chainRivateKeyList.push({

            //     })
            // })
            //this.total = res.data.totalCount;
            this.disabled = false;
          } else {
            this.disabled = true;
            this.chainCommitteeList = [];
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
    deleteCommittee(val) {
      this.governForm.governorAddress = val.governorAddress;
      this.governForm.accountAddress = val.governorAddress;
      this.deleteCommitteeVisible = true;
    },
    closeDeleteCommittee() {
      this.initGovernForm();
      this.deleteCommitteeVisible = false;
    },
    sureDeleteCommittee() {
      this.$refs["governForm"].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let reqData = {
            groupId: localStorage.getItem("groupId"),
            fromAddress: this.governForm.governorAddress,
            accountAddress: this.governForm.accountAddress,
            signUserId: "",
            weight: 0,
          };
          addCommittee(reqData)
            .then((res) => {
              this.btnLoading = false;
              if (res.data.code === 0) {
                this.$message({
                  type: "success",
                  message: this.$t("govCommittee.deleteSuccess"),
                });
                this.closeDeleteCommittee();
                this.queryCommitteeList();
                this.queryVoteRecordList();
                this.queryVoteRecordListCount();
              } else {
                this.$message({
                  message: this.$chooseLang(res.data.code),
                  type: "error",
                  duration: 2000,
                });
              }
            })
            .catch((err) => {
              this.btnLoading = false;
              this.$message({
                message: err.data || this.$t("text.systemError"),
                type: "error",
                duration: 2000,
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    queryVoteRecordListCount() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
      };
      getCount(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            this.voteTotal = res.data.data;
            // this.getNetworkDetails()
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
    queryVoteRecordList() {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        pageNum: this.voteCurrentPage,
        pageSize: this.votePageSize,
      };
      voteRecord(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            this.disabled = false;
            this.voteList = res.data.data;
            //this.voteTotal = res.data.totalCount;
            // this.getNetworkDetails()
          } else {
            this.disabled = true;
            this.voteList = [];
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
    Committee(val) {
      this.CommitteeVisible = true;
      this.govCommittee.fromAddress = val.proposer;
      this.govCommittee.proposalId = val.proposalId;
    },
    revokeVotee(val) {
      this.revokeVoteVisible = true;
      this.revokeVote.proposalId = val.proposalId;
      this.revokeVote.fromAddress = val.proposer;
    },
    deleteHistoryVote(val) {
      this.$confirm(this.$t("govCommittee.delete") + "?", {
        center: true,
      })
        .then((_) => {
          this.btnIndex = val.id;
          this.btnLoading = true;
          deleteVoteRecord(val.id)
            .then((res) => {
              this.btnLoading = false;
              if (res.data.code === 0) {
                this.$message({
                  type: "success",
                  message: this.$t("govCommittee.success"),
                });
                this.queryVoteRecordList();
              } else {
                this.$message({
                  message: this.$chooseLang(res.data.code),
                  type: "error",
                  duration: 2000,
                });
              }
            })
            .catch((err) => {
              this.btnLoading = false;
              this.$message({
                message: err.data || this.$t("text.systemError"),
                type: "error",
                duration: 2000,
              });
            });
        })
        .catch((_) => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.queryCommitteeList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryCommitteeList();
    },
    voteSizeChange(val) {
      this.votePageSize = val;
      this.voteCurrentPage = 1;
      this.queryVoteRecordList();
      this.queryVoteRecordListCount();
    },
    voteCurrentChange(val) {
      this.voteCurrentPage = val;
      this.queryVoteRecordList();
      this.queryVoteRecordListCount();
    },
    getNetworkDetails() {
      let groupId = localStorage.getItem("groupId");
      getNetworkStatistics(groupId)
        .then((res) => {
          if (res.data.code === 0) {
            this.currentBlock = res.data.data.latestBlock;
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
    userName(val) {
      let name = "";
      this.adminRivateKeyList.forEach((item) => {
        if (item.address === val) {
          name = `${item.userName}`;
        }
      });
      return name;
    },
    weightRate(val) {
      return ((val / this.totalWeight) * 100).toString().substring(0, 5);
    },
    changValueZh(val) {
      if (!val) return;
      return val;
    },
    copyPubilcKey(val) {
      if (!val) {
        this.$message({
          type: "fail",
          showClose: true,
          message: this.$t("text.copyErrorMsg"),
          duration: 2000,
        });
      } else {
        this.$copyText(val).then((e) => {
          this.$message({
            type: "success",
            showClose: true,
            message: this.$t("text.copySuccessMsg"),
            duration: 2000,
          });
        });
      }
    },
    voteTimeZh(val) {
      if (val < this.currentBlock) {
        return "过期";
      } else {
        return "正常";
      }
    },
    changeAddress(val) {
      let reqData = {
        groupId: localStorage.getItem("groupId"),
        address: val,
      };
      getCommitteeWeight(reqData)
        .then((res) => {
          if (res.data.code === 0) {
            this.$set(this.governForm, "weight", res.data.data);
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
    isnumber(val) {
      val = val.replace(/[^0-9]/gi, "");
      // 此处还可以限制位数以及大小
      return val;
    },
    creatUserClose() {
      this.getUserData();
    },
  },
};
</script>

<style scoped>
.form-item-input >>> .el-input__inner {
  width: 214px;
}
</style>
