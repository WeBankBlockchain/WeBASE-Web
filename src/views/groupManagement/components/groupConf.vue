<template>
    <div class="add-wrapper">
        <div class="text-center">
            <span class="fileinput-button">
                <span class="font-color-00c1d4">{{this.$t('system.import')}}</span>
                <input type="file" @change="importFile($event)" />
            </span>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
            <el-form-item :label="$t('nodes.groupId')" prop="groupId" style=" position:relative">
                <el-input v-model="ruleForm.groupId"></el-input>
            </el-form-item>
            <el-form-item :label="$t('nodes.groupTimestamp')" prop="groupTimestamp" style=" position:relative">
                <el-input v-model="ruleForm.groupTimestamp"></el-input>
                <el-tooltip class="tool-tip" effect="dark" :content="$t('text.timestampConf')" placement="right">
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item :label="$t('nodes.sealerNodeList')" prop="nodeIdList" style=" position:relative">
                <el-input v-model="ruleForm.nodeIdList" type="textarea" :autosize="{ minRows: 4}"></el-input>
                <el-tooltip class="tool-tip" effect="dark" :content="$t('text.sealerListConf_1')" placement="right">
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item :label="$t('nodes.targetNode')" prop="targetNode" style="position:relative" class="tatget-node">
                <el-select v-model="ruleForm.targetNode" placeholder="请选择" :multiple="true">
                    <el-option v-for="item in frontData" :key="item.frontId" :label="item.frontId" :value="item.nodeId">
                        <span style="float: left">{{ item.frontId }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px" :title="item.nodeId">{{ item.nodeId | splitString_0_25}}...</span>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="close">{{this.$t("text.cancel")}}</el-button>
            <el-button type="primary" :loading="loading" @click="submit('ruleForm')">{{this.$t("text.sure")}}</el-button>
        </div>
    </div>
</template>

<script>
import { getFronts, createGroup, crudGroup } from "@/util/api";
import { isJson } from "@/util/util";
export default {
    name: 'groupConfig',

    components: {
    },

    props: {
    },

    data() {
        let _this = this;
        let validateJSON = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(_this.$t("rule.contractAbi")));
            } else {
                if (!isJson(value)) {
                    callback(new Error(_this.$t("rule.correctJson")));
                } else {
                    callback()
                }
            }
        }
        return {
            ruleForm: {
                groupId: '',
                groupTimestamp: '',
                nodeIdList: '',
                targetNode: [],
            },
            rules: {
                groupId: [
                    {
                        required: true,
                        message: this.$t('rule.groupId')
                    },
                ],
                groupTimestamp: [
                    {
                        required: true,
                        message: this.$t('rule.groupTimestamp')
                    },
                ],
                nodeIdList: [
                    {
                        required: true,
                        message: this.$t('rule.nodeIdList')
                    },
                    {
                        validator: validateJSON, trigger: 'blur'
                    }
                ],
                targetNode: [
                    {
                        required: true,
                        message: this.$t('rule.targetNode')
                    }
                ]
            },
            loading: false,
            description: '',
            frontData: [],
            frontNodeList: []
        }
    },

    computed: {
    },

    watch: {
    },

    created() {
    },

    mounted() {
        this.getFrontTable()
    },

    methods: {
        close() {
            this.$emit('closeGroupConf')
        },
        importFile(e) {
            if (!e.target.files.length) {
                return;
            }
            var fileString = "";
            let files = e.target.files[0];
            let reader = new FileReader();
            reader.readAsText(files, "UTF-8");
            let _this = this;
            reader.onload = function (evt) {
                fileString = evt.target.result;
                try {
                    _this.ruleForm.groupTimestamp = JSON.parse(fileString).groupTimestamp
                    _this.ruleForm.nodeIdList = JSON.parse(fileString).nodeIdList
                    _this.ruleForm.groupId = JSON.parse(fileString).groupId
                } catch (error) {
                    console.log(error)
                }


            }
        },
        getFrontTable() {
            getFronts()
                .then(res => {
                    if (res.data.code === 0) {
                        this.frontData = res.data.data || [];
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
        submit(ruleForm) {
            let _this = this
            this.$refs[ruleForm].validate(valid => {
                if (valid) {
                    var targetNodeList = this.ruleForm.targetNode;
                    targetNodeList.forEach(i => {
                        this.queryCreateGroup(i, this.frontId(i), this.queryCrudGroup)
                    })
                } else {
                    return false;
                }
            });
        },
        queryCreateGroup(nodeId, frontId, callback) {
            this.loading = true;
            var nodeId = nodeId;
            var frontId = frontId;
            let data = {
                generateGroupId: this.ruleForm.groupId,
                timestamp: this.ruleForm.groupTimestamp,
                nodeList: JSON.parse(this.ruleForm.nodeIdList),
                description: this.description
            }
            createGroup(data, nodeId).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$notify({
                        title: this.$t('text.addSuccess'),
                        dangerouslyUseHTMLString: true,
                        message: `<a class="cursor-pointer"><span class="font-color-00c1d4">${this.$t("text.nodeAddGroupSuccess")}</span></a>`,
                        type: 'success',
                        duration: 0,
                        onClick: () => {
                            this.$router.push('front')
                        }
                    });
                    callback(nodeId)
                } else {
                    this.$message({
                        type: "error",
                        message: `${this.$t('nodes.targetNode')}${frontId}${this.$chooseLang(res.data.code)}`,
                        duration: 4500
                    })
                }
            }).catch(err => {
                this.loading = false;
                this.$message({
                    type: "error",
                    message: err.data || this.$t('text.systemError')
                })
            })
        },
        queryCrudGroup(nodeId) {
            var nodeId = nodeId;
            let data = {
                generateGroupId: this.ruleForm.groupId,
                type: 'start'
            }
            crudGroup(data, nodeId)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$emit('addGroupSuccess')
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        })
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    })
                })
        },
        frontId(nodeId) {
            var frontId = '';
            var nodeId = nodeId;
            var array = this.frontData;
            for (let i = 0; i < array.length; i++) {
                if (array[i]['nodeId'] == nodeId) frontId = array[i]['frontId']
            }
            return frontId
        }
    }
}
</script>

<style scoped>
.add-wrapper {
}
.tool-tip {
    position: absolute;
    top: 11px;
    right: -22px;
}
.fileinput-button {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    margin-right: 20px;
}

.fileinput-button input {
    position: absolute;
    left: -21px;
    top: 0px;
    opacity: 0;
    -ms-filter: "alpha(opacity=0)";
    cursor: pointer;
    height: 42px;
    width: 49px;
}
.demo-ruleForm {
    padding-right: 30px;
}
.tatget-node >>> .el-select {
    width: 346px;
}
</style>
