<template>
    <div>
        <!-- <v-content-head :headTitle="$t('title.systemManager')" :headSubTitle="$t('title.committeeMgmt')" @changGroup="changGroup"></v-content-head> -->
        <div style="padding: 10px 20px 0 20px;">
            <div class="">
                <el-button type="primary" :disabled="disabled" @click="addCommittee">{{this.$t('govCommittee.addCommittee')}}</el-button>
                <el-button type="primary" :disabled="disabled" @click="deleteCommittee">{{this.$t('govCommittee.deleteCommittee')}}</el-button>
                <el-button type="primary" :disabled="disabled" @click="modifyWeight">{{this.$t('govCommittee.modifyWeight')}}</el-button>
                <el-button type="primary" :disabled="disabled" @click="modifyThreshold">{{this.$t('govCommittee.modifyThreshold')}}({{currentThreshold}})</el-button>
            </div>
            <div>
                <el-table :data="chainCommitteeList" tooltip-effect="dark" v-loading="loading">
                    <el-table-column v-for="head in chainCommitteeHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <template v-if="head.enName!='operate'">

                                <span v-if="head.enName =='userId'">{{userName(scope.row['address'])}}</span>
                                <span v-else-if="head.enName =='address'">
                                    <i class="wbs-icon-copy font-12 copy-public-key" v-show="scope.row[head.enName]" @click="copyPubilcKey(scope.row[head.enName])" :title="$t('privateKey.copy')"></i>
                                    {{scope.row[head.enName]}}
                                </span>
                                <span v-else>{{scope.row[head.enName]}}</span>
                            </template>
                            <template v-else>
                                <!-- <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="modifyWeight(scope.row)">{{$t('govCommittee.modifyWeight')}}</el-button> -->
                                <!-- <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="deleteCommittee(scope.row)">{{$t('govCommittee.deleteCommittee')}}</el-button> -->
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-if="total > 10" class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout=" sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
                <el-dialog :title="$t('govCommittee.addCommittee')" :visible.sync="addCommitteeVisible" width="480px" v-if="addCommitteeVisible" center @close="closeAddCommittee">
                    <el-form :model="governForm" :rules="rules" ref="governForm" label-width="130px" class="demo-ruleForm">
                        <el-form-item :label="$t('govCommittee.fromUser')" prop="fromAddress">
                            <template v-if="chainCommitteeList.length > 0">
                                <el-select v-model="governForm.fromAddress" :placeholder="$t('text.select')">
                                    <el-option v-for="item in produceCommittee" :key="item.address" :label="item.userName" :value="item.address">
                                        <span>{{item.userName}}</span>
                                        <span class="font-12">{{item.address | splitString}}...</span>
                                    </el-option>
                                </el-select> 
                            </template>
                            <template v-else>
                                <el-select v-model="governForm.fromAddress" :placeholder="$t('text.select')">
                                    <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                                        <span>{{item.userName}}</span>
                                        <span class="font-12">{{item.address | splitString}}...</span>
                                    </el-option>
                                </el-select>
                            </template>
                             <span v-if="isShowPrivate" class="contract-code-done"  @click="$store.dispatch('switch_creat_user_dialog')" style="float:right;">
                                <span target="_blank" style="cursor:pointer;font-size:12px;text-decoration:underline;">{{this.$t("privateKey.addUser")}}</span>
                            </span>
                        </el-form-item>
                        <el-form-item :label="$t('govCommittee.user')" prop="address">
                            <el-select v-model="governForm.address" :placeholder="$t('text.select')">
                                <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                                    <span>{{item.userName}}</span>
                                    <span class="font-12">{{item.address | splitString}}...</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <p style="padding-left: 50px">{{$t('govCommittee.dialogTips')}}</p>
                    <div class="text-right sure-btn" style="margin-top:10px">
                        <el-button @click="closeAddCommittee">{{this.$t('text.cancel')}}</el-button>
                        <el-button type="primary" @click="sureAddCommittee">{{this.$t('text.sure')}}</el-button>
                    </div>
                </el-dialog>
                <el-dialog :title="$t('govCommittee.deleteCommittee')" :visible.sync="deleteCommitteeVisible" width="480px" v-if="deleteCommitteeVisible" center @close="closeDeleteCommittee">
                    <el-form :model="governForm" :rules="rules" ref="governForm" label-width="144px" class="demo-ruleForm">
                        <el-form-item :label="$t('govCommittee.fromUser')" prop="fromAddress">
                            <el-select v-model="governForm.fromAddress" :placeholder="$t('text.select')">
                                <el-option v-for="item in produceCommittee" :key="item.address" :label="item.userName" :value="item.address">
                                    <span>{{item.userName}}</span>
                                    <span class="font-12">{{item.address | splitString}}...</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('govCommittee.revokeCommittee')" prop="address">
                            <el-select v-model="governForm.address" :placeholder="$t('text.select')">
                                <el-option v-for="item in produceCommittee" :key="item.address" :label="item.userName" :value="item.address">
                                    <span>{{item.userName}}</span>
                                    <span class="font-12">{{item.address | splitString}}...</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <p style="padding-left: 50px">{{$t('govCommittee.dialogTips')}}</p>
                    <div class="text-right sure-btn" style="margin-top:10px">
                        <el-button @click="closeDeleteCommittee">{{this.$t('text.cancel')}}</el-button>
                        <el-button type="primary" @click="sureDeleteCommittee" :loading="btnLoading">{{this.$t('text.sure')}}</el-button>
                    </div>
                </el-dialog>
                <el-dialog :title="$t('govCommittee.modifyWeight')" :visible.sync="modifyWeightVisible" width="480px" v-if="modifyWeightVisible" center @close="closeModifyWeight">
                    <el-form :model="governForm" :rules="rules" ref="governForm" label-width="130px" class="demo-ruleForm">
                        <el-form-item :label="$t('govCommittee.fromUser')" prop="fromAddress">
                            <el-select v-model="governForm.fromAddress" :placeholder="$t('text.select')">
                                <el-option v-for="item in produceCommittee" :key="item.address" :label="item.userName" :value="item.address">
                                    <span>{{item.userName}}</span>
                                    <span class="font-12">{{item.address | splitString}}...</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('govCommittee.toCommittee')" prop="address">
                            <el-select v-model="governForm.address" :placeholder="$t('text.select')" @change="changeAddress">
                                <el-option v-for="item in produceCommittee" :key="item.address" :label="item.userName" :value="item.address">
                                    <span>{{item.userName}}</span>
                                    <span class="font-12">{{item.address | splitString}}...</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('govCommittee.weight')" prop="weight">
                            <el-input v-model="governForm.weight" @input="e => (governForm.weight = isnumber(e))" class="form-item-input"></el-input>
                        </el-form-item>
                    </el-form>
                    <!-- <p style="padding-left: 50px">{{$t('govCommittee.dialogTips')}}</p> -->
                    <div class="text-right sure-btn" style="margin-top:10px">
                        <el-button @click="closeModifyWeight">{{this.$t('text.cancel')}}</el-button>
                        <el-button type="primary" @click="sureModifyweight" :loading="btnLoading">{{this.$t('text.sure')}}</el-button>
                    </div>
                </el-dialog>
                <el-dialog :title="$t('govCommittee.modifyThreshold')" :visible.sync="modifyThresholdVisible" width="480px" v-if="modifyThresholdVisible" center @close="closeModifyThreshold">
                    <el-form :model="governForm" :rules="rules" ref="governForm" label-width="130px" class="demo-ruleForm">
                        <el-form-item :label="$t('govCommittee.fromUser')" prop="fromAddress">
                            <el-select v-model="governForm.fromAddress" :placeholder="$t('text.select')">
                                <el-option v-for="item in produceCommittee" :key="item.address" :label="item.userName" :value="item.address">
                                    <span>{{item.userName}}</span>
                                    <span class="font-12">{{item.address | splitString}}...</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('govCommittee.threshold')" prop="threshold">
                            <el-input v-model="governForm.threshold" @input="e => (governForm.threshold = isnumber(e))" class="form-item-input"></el-input>
                        </el-form-item>
                    </el-form>
                    <!-- <p style="padding-left: 50px">{{$t('govCommittee.dialogTips')}}</p> -->
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
                            <span v-if="head.enName=='fromAddress'">{{userName(scope.row[head.enName])}}</span>
                            <span v-else-if="head.enName=='toAddress'">
                                <span v-if="scope.row['toAddress']">
                                    {{userName(scope.row[head.enName])}}
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
                            <span v-else-if="head.enName=='newValue'">
                                <span v-if="scope.row['detail']">
                                    {{changValueZh(scope.row['detail'])}}
                                </span>
                                <span v-else>
                                    -
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
                            <el-button :loading="btnLoading&&btnIndex===scope.row.id" :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="deleteHistoryVote(scope.row)">{{$t('govCommittee.delete')}}</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="page" @size-change="voteSizeChange" @current-change="voteCurrentChange" :current-page="voteCurrentPage" :page-sizes="[10, 20, 30, 50]" :page-size="votePageSize" layout=" sizes, prev, pager, next, jumper" :total="voteTotal">
            </el-pagination>
        </div>
         <el-dialog :visible.sync="$store.state.creatUserVisible" :title="$t('privateKey.createUser')" width="640px" :append-to-body="true" class="dialog-wrapper" v-if='$store.state.creatUserVisible' center>
            <v-creatUser @creatUserClose="creatUserClose" :disablePub='true'  ref="creatUser"></v-creatUser>
        </el-dialog>	
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import creatUser from "@/views/privateKeyManagement/components/creatUser";
import { addCommittee, getUserList, committeeList, deleteCommittee, putCommitteeWeight, voteRecord, deleteVoteRecord, changeThreshold, getThreshold, getNetworkStatistics, getCommitteeWeight } from "@/util/api";
export default {
    name: 'committeeMgmt',

    components: {
        "v-content-head": contentHead,
        "v-creatUser": creatUser
    },

    props: {
    },

    data() {
        return {
            disabled: false,
            loading: false,
            btnLoading: false,
            btnIndex: '',
            currentThreshold: '',
            currentBlock: 0,
            addCommitteeVisible: false,
            modifyThresholdVisible: false,
            modifyWeightVisible: false,
            deleteCommitteeVisible: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            voteCurrentPage: 1,
            votePageSize: 10,
            voteTotal: 0,
            adminRivateKeyList: [],
            chainRivateKeyList: [],
            chainCommitteeList: [],
            chainCommitteeHead: [
                {
                    enName: 'userId',
                    name: this.$t("govCommittee.fromUser"),
                    width: ''
                },
                {
                    enName: 'address',
                    name: this.$t("govCommittee.address"),
                    width: ''
                },
                {
                    enName: 'weight',
                    name: this.$t("govCommittee.weight"),
                    width: ''
                },
                {
                    enName: 'weightRate',
                    name: this.$t("govCommittee.weightRatio"),
                    width: ''
                },
                {
                    enName: 'enable_num',
                    name: this.$t("govCommittee.enableNum"),
                    width: ''
                }
            ],
            governForm: {
                fromAddress: '',
                address: '',
                threshold: '',
                weight: '',
            },
            voteHead: [
                {
                    enName: 'id',
                    name: this.$t("govCommittee.id"),
                    width: ''
                },
                {
                    enName: 'type',
                    name: this.$t("govCommittee.voteType"),
                    width: ''
                },
                {
                    enName: 'fromAddress',
                    name: this.$t("govCommittee.governUserId"),
                    width: ''
                },
                {
                    enName: 'toAddress',
                    name: this.$t("govCommittee.modifyUserId"),
                    width: ''
                },
                {
                    enName: 'toAddress1',
                    name: this.$t("govCommittee.modifyUserAddress"),
                    width: ''
                },
                {
                    enName: 'newValue',
                    name: this.$t("govCommittee.newValue"),
                    width: ''
                },
                // {
                //     enName: 'timeLimit',
                //     name: this.$t("govCommittee.voteStatus"),
                //     width: ''
                // },
                {
                    enName: 'createTime',
                    name: this.$t("govCommittee.updatetime"),
                    width: ''
                },
                // {
                //     enName: "operate",
                //     name: this.$t("govCommittee.operate"),
                //     width: '80'
                // }
            ],
            voteList: [
                {
                    "createtime": 1598873236000,
                    "governAcctAddress": "0xbb3cc188fb76e129ae18b0829803f741288c1a92",
                    "governUserId": "admin",
                    "id": 61,
                    "modifyUserId": "",
                    "newAddress": "0xbb3cc188fb76e129ae18b0829803f741288c1a92",
                    "newValue": 2,
                    "requestId": 1598873236271,
                    "updatetime": 1598873236000,
                    "voteStatus": 0,
                    "voteType": 3
                },
            ],
            isShowPrivate: false
        }
    },

    computed: {
        rules() {
            let data = {
                fromAddress: [
                    {
                        required: true,
                        message: this.$t("rule.fromUserRule"),
                        trigger: "blur"
                    }
                ],
                address: [
                    {
                        required: true,
                        message: this.$t("rule.userRule"),
                        trigger: "blur"
                    }
                ],
                threshold: [
                    {
                        required: true,
                        message: this.$t("rule.thresholdRule"),
                        trigger: "blur"
                    }
                ],
                weight: [
                    {
                        required: true,
                        message: this.$t("rule.weightRule"),
                        trigger: "blur"
                    }
                ],
            }
            return data
        },
        produceCommittee() {
            let privateKeyList = this.adminRivateKeyList
            let committeeList = this.chainCommitteeList
            // whether find committee in local private key list
            let flagFind = false
            privateKeyList.forEach(item => {
                committeeList.forEach(it => {
                    if (item.address == it.address) {
                        it.userName = item.userName
                        flagFind = true
                    }
                })
            })
            // if committee not empty
            if (!committeeList.length) {
                if (flagFind) {
                    // 如果本地有committee私钥，则设置
                    this.governForm.fromAddress = committeeList[0]['address'];                    
                } else {
                    // 如果本地没有committee私钥，则不选默认值
                }
            }
            return committeeList
        }
    },

    watch: {
    },

    created() {
    },

    mounted() {
        if (localStorage.getItem("root") === "admin"|| localStorage.getItem("groupId")) {
            this.disabled = false
        } else {
            this.disabled = true
        }
        if (localStorage.getItem("groupId")) {
            this.queryGetThreshold()
             this.queryCommitteeList()
            this.queryVoteRecordList()
            this.getUserData()
        }
    },

    methods: {
        changGroup() {
            this.adminRivateKeyList = []
            this.queryGetThreshold()
            this.getUserData()
             this.queryCommitteeList()
            this.queryVoteRecordList()

        },
        initGovernForm() {
            // this.governForm.fromAddress = ""
            this.governForm.address = ""
            this.weight = ""
        },
        queryGetThreshold() {
            let reqData = {
                groupId: localStorage.getItem("groupId")
            }
            getThreshold(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.currentThreshold = res.data.data
                        this.$set(this.governForm, 'threshold', this.currentThreshold)
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
        },
        getUserData() {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: 1,
                pageSize: 1000
            };
            getUserList(reqData, {})
                .then(res => {
                    if (res.data.code === 0) { 
                        this.adminRivateKeyList = [];
                        res.data.data.forEach(value => {
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
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        addCommittee() {
            this.addCommitteeVisible = true
        },
        closeAddCommittee() {
            this.initGovernForm()
            this.addCommitteeVisible = false
        },
        sureAddCommittee() {
            this.$refs['governForm'].validate((valid) => {
                if (valid) {
                    this.queryAddCommittee()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        queryAddCommittee() {
            let reqData = {
                groupId: localStorage.getItem('groupId'),
                fromAddress: this.governForm.fromAddress,
                address: this.governForm.address,
            }
            addCommittee(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: this.$t("govCommittee.success")
                        })
                        this.closeAddCommittee()
                         this.queryCommitteeList()
                        this.queryVoteRecordList()
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        modifyThreshold() {
            this.modifyThresholdVisible = true
            this.queryGetThreshold()
        },
        sureModifyThreshold() {
            this.$refs['governForm'].validate((valid) => {
                if (valid) {
                    this.queryModifyThreshold()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        closeModifyThreshold() {
            this.initGovernForm()
            this.modifyThresholdVisible = false
        },
        queryModifyThreshold() {
            let reqData = {
                groupId: localStorage.getItem('groupId'),
                fromAddress: this.governForm.fromAddress,
                threshold: this.governForm.threshold
            }
            changeThreshold(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: this.$t('govCommittee.success')
                        })
                        this.queryGetThreshold()
                        this.closeModifyThreshold()
                         this.queryCommitteeList()
                        this.queryVoteRecordList()
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        closeModifyWeight() {
            this.initGovernForm()
            this.modifyWeightVisible = false
        },
        sureModifyweight() {
            this.$refs['governForm'].validate((valid) => {
                if (valid) {
                    this.btnLoading = true
                    let reqData = {
                        groupId: localStorage.getItem('groupId'),
                        fromAddress: this.governForm.fromAddress,
                        address: this.governForm.address,
                        weight: this.governForm.weight
                    }
                    putCommitteeWeight(reqData)
                        .then(res => {
                            this.btnLoading = false
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: this.$t("govCommittee.success")
                                })
                                this.closeModifyWeight()
                                 this.queryCommitteeList()
                                this.queryVoteRecordList()
                            } else {
                                this.$message({
                                    message: this.$chooseLang(res.data.code),
                                    type: "error",
                                    duration: 2000
                                });
                            }
                        })
                        .catch(err => {
                            this.btnLoading = false
                            this.$message({
                                message: err.data || this.$t('text.systemError'),
                                type: "error",
                                duration: 2000
                            });
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        modifyWeight(val) {
            this.modifyWeightVisible = true
            this.governForm.weight = val.weight
        },
        queryCommitteeList() {
            let reqData = {
                groupId: localStorage.getItem('groupId'),
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            }
            committeeList(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        let data = res.data.data
                        this.chainCommitteeList = data;
                        this.chainRivateKeyList = []
                        // data.forEach(item=>{
                        //     this.chainRivateKeyList.push({

                        //     })
                        // })
                        this.total = res.data.totalCount
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        deleteCommittee(val) {
            this.deleteCommitteeVisible = true
        },
        closeDeleteCommittee() {
            this.initGovernForm()
            this.deleteCommitteeVisible = false
        },
        sureDeleteCommittee() {
            this.$refs['governForm'].validate((valid) => {
                if (valid) {
                    this.btnLoading = true
                    let reqData = {
                        groupId: localStorage.getItem('groupId'),
                        fromAddress: this.governForm.fromAddress,
                        address: this.governForm.address,
                    }
                    deleteCommittee(reqData)
                        .then(res => {
                            this.btnLoading = false
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: this.$t('govCommittee.success')
                                })
                                this.closeDeleteCommittee()
                                 this.queryCommitteeList()
                                this.queryVoteRecordList()
                            } else {
                                this.$message({
                                    message: this.$chooseLang(res.data.code),
                                    type: "error",
                                    duration: 2000
                                });
                            }
                        })
                        .catch(err => {
                            this.btnLoading = false
                            this.$message({
                                message: err.data || this.$t('text.systemError'),
                                type: "error",
                                duration: 2000
                            });
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        queryVoteRecordList() {
            let reqData = {
                groupId: localStorage.getItem('groupId'),
                pageNumber: this.voteCurrentPage,
                pageSize: this.votePageSize
            }
            voteRecord(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.voteList = res.data.data
                        this.voteTotal = res.data.totalCount
                        this.getNetworkDetails()
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        deleteHistoryVote(val) {

            this.$confirm(this.$t("govCommittee.delete") + '?', {
                center: true
            })
                .then(_ => {
                    this.btnIndex = val.id
                    this.btnLoading = true
                    deleteVoteRecord(val.id)
                        .then(res => {
                            this.btnLoading = false
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: this.$t('govCommittee.success')
                                })
                                this.queryVoteRecordList()
                            } else {
                                this.$message({
                                    message: this.$chooseLang(res.data.code),
                                    type: "error",
                                    duration: 2000
                                });
                            }
                        })
                        .catch(err => {
                            this.btnLoading = false
                            this.$message({
                                message: err.data || this.$t('text.systemError'),
                                type: "error",
                                duration: 2000
                            });
                        });
                })
                .catch(_ => {

                });

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
        },
        voteCurrentChange(val) {
            this.voteCurrentPage = val;
            this.queryVoteRecordList();
        },
        getNetworkDetails() {
            let groupId = localStorage.getItem('groupId');
            getNetworkStatistics(groupId)
                .then(res => {
                    if (res.data.code === 0) {
                        this.currentBlock = res.data.data.latestBlock
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });

                });
        },
        userName(val) {
            let name = ''
            this.adminRivateKeyList.forEach(item => {
                if (item.address === val) {
                    name = `${item.userName}`
                }
            })
            return name
        },
        changValueZh(val) {
            if (!val) return
            return val
        },
        copyPubilcKey(val) {
            if (!val) {
                this.$message({
                    type: "fail",
                    showClose: true,
                    message: this.$t("text.copyErrorMsg"),
                    duration: 2000
                });
            } else {
                this.$copyText(val).then(e => {
                    this.$message({
                        type: "success",
                        showClose: true,
                        message: this.$t("text.copySuccessMsg"),
                        duration: 2000
                    });
                });
            }
        },
        voteTimeZh(val) {
            if (val < this.currentBlock) {
                return '过期'
            } else {
                return '正常'
            }
        },
        changeAddress(val) {
            let reqData = {
                groupId: localStorage.getItem('groupId'),
                address: val
            }
            getCommitteeWeight(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$set(this.governForm, 'weight', res.data.data)
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: err.data || this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
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
    }
}
</script>

<style scoped>
.form-item-input >>> .el-input__inner {
    width: 214px;
}
</style>
