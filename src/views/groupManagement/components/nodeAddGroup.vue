<template>
    <div class="add-wrapper">
        <div class="text-center">
            <span class="fileinput-button">
                <span class="font-color-00c1d4">{{this.$t('system.import')}}</span>
                <input type="file" @change="importFile($event)" />
            </span>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
            <el-form-item :label="$t('nodes.groupTimestamp')" prop="groupTimestamp" style=" position:relative">
                <el-input v-model="ruleForm.groupTimestamp"></el-input>
                <el-tooltip class="tool-tip" effect="dark" :content="$t('text.timestampConf')" placement="right">
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item :label="$t('nodes.nodeList')" prop="nodeIdList" style=" position:relative">
                <el-input v-model="ruleForm.nodeIdList" type="textarea" :autosize="{ minRows: 4}"></el-input>
                <el-tooltip class="tool-tip" effect="dark" :content="$t('text.sealerListConf')" placement="right">
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>
        </el-form>
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="close">{{this.$t("text.cancel")}}</el-button>
            <el-button type="primary" :loading="loading" @click="submit('ruleForm')">{{this.$t("text.sure")}}</el-button>
        </div>
    </div>
</template>

<script>
import { createGroup, crudGroup } from "@/util/api"
import { isJson } from "@/util/util";
export default {
    name: 'nodeAddGroup',

    components: {
    },

    props: {
        itemGroupData: {
            type: Object
        },
        addGroupData: {
            type: Object
        }
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
                groupTimestamp: this.itemGroupData.groupTimestamp,
                nodeIdList: this.itemGroupData.nodeIdList
            },
            rules: {
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
                ]
            },
            loading: false,
            description: ''
        }
    },

    computed: {
    },

    watch: {
    },

    created() {
    },

    mounted() {

    },

    methods: {
        close() {
            this.$emit('addClose')
        },
        submit(ruleForm) {
            let _this = this
            this.$refs[ruleForm].validate(valid => {
                if (valid) {
                    this.$confirm(_this.$t("text.groupTimestamp") + `${_this.ruleForm.groupTimestamp}` + ',' + _this.$t("text.nodeList") + `${_this.ruleForm.nodeIdList}` + ',' + _this.$t("text.confirmSubmit"), {
                        type: 'warning'
                    })
                        .then(_ => {
                            this.loading = true;
                            this.queryCreateGroup()
                        })
                        .catch(_ => { });

                } else {
                    return false;
                }
            });
        },
        queryCreateGroup() {
            this.loading = true;
            var nodeId = this.addGroupData.nodeId;
            let data = {
                generateGroupId: this.itemGroupData.groupId,
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
                    this.queryCrudGroup()
                    this.$emit('addGroupSuccess')
                } else {
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
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
        queryCrudGroup() {
            this.loading = true;
            let nodeId = this.addGroupData.nodeId;
            let data = {
                generateGroupId: this.itemGroupData.groupId,
                type: 'start'
            }
            crudGroup(data, nodeId)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {

                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        })
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    })
                })
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
                } catch (error) {
                    console.log(error)
                }


            }
        },
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
</style>
