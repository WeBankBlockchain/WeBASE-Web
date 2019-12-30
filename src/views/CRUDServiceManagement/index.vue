<template>
    <div>
        <v-content-head :headTitle="$t('title.contractTitle')" :headSubTitle="'CRUD'" @changGroup="changGroup" :headTooltip="$t('title.CRUDTips')"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 20px 29px;">
            <el-form :model="sqlForm" :rules="rules" ref="sqlForm" class="demo-ruleForm">
                <el-form-item :label="$t('contracts.adminUser')" prop="adminRivateKey" class="item-form">
                    <el-select v-model="sqlForm.adminRivateKey" :placeholder="$t('text.select')" class="select-32">
                        <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                            <span>{{item.userName}}</span>
                            <span class="font-12 text-float-right">{{item.address | splitString}}...</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <div style="display:flex">

                        <div class="editor-top">
                            <div class="editor-wrapper" ref="ace">

                            </div>
                        </div>
                        <el-tooltip effect="dark" placement="top-start" style="padding-top:4px;">
                            <div slot="content">
                                {{this.$t("text.example")}}：<br>{{this.$t("contracts.createTable")}}：
                                <i class="wbs-icon-copy font-12" @click="copySql('create table t_demo(name varchar, item_id varchar, item_name varchar, primary key(name))')" :title="$t('text.copy')">create table t_demo(name varchar, item_id varchar, item_name varchar, primary key(name))</i> 
                                <br>{{this.$t("contracts.insertTable")}}： 
                                <i class="wbs-icon-copy font-12" @click="copySql('insert into t_demo (name, item_id, item_name) values (fruit, 1, apple1)')" :title="$t('text.copy')">insert into t_demo (name, item_id, item_name) values (fruit, 1, apple1)</i> 
                                <br>{{this.$t("contracts.searchTable")}}：
                                <i class="wbs-icon-copy font-12" @click="copySql('select * from t_demo where name = fruit')" :title="$t('text.copy')">select * from t_demo where name = fruit</i> 
                                <br>{{this.$t("contracts.updateTable")}}：
                                <i class="wbs-icon-copy font-12" @click="copySql('update t_demo set item_name = orange where name = fruit and item_id = 1')" :title="$t('text.copy')">update t_demo set item_name = orange where name = fruit and item_id = 1</i> 
                                <br>{{this.$t("contracts.deleteTable")}}：
                                <i class="wbs-icon-copy font-12" @click="copySql('delete from t_demo where name = fruit and item_id = 1')" :title="$t('text.copy')">delete from t_demo where name = fruit and item_id = 1</i> 
                                <br>{{this.$t("contracts.tableDetail")}}：
                                <i class="wbs-icon-copy font-12" @click="copySql('desc t_demo')" :title="$t('text.copy')">desc t_demo</i> 
                            </div>
                            <i class="el-icon-info contract-icon font-15">Example</i>
                        </el-tooltip>
                    </div>

                </el-form-item>

                <el-form-item>
                    <el-button size="small" type="primary" @click="runSql('sqlForm')" :disabled="disabled" class="run-btn" :loading="loading">{{this.$t('text.implement')}}</el-button>
                </el-form-item>
            </el-form>

            <template v-if="typeof(runSqlResult)==='string'">
                <div>
                    <p><span v-if="runSqlResult">{{this.$t('text.implementResult')}}：</span>{{runSqlResult}}</p>
                </div>

            </template>
            <template v-else>
                <div>
                    <p><span v-if="runSqlResult">{{this.$t('text.implementResult')}}：</span></p>
                    <json-viewer :value="runSqlResult" :expand-depth='5' copyable></json-viewer>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import ace from "ace-builds";
// import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/mode-sql";
import contentHead from "@/components/contentHead";
import { getUserList, queryCrudService } from "@/util/api";
export default {
    name: 'ConfigManagement',

    components: {
        "v-content-head": contentHead,
    },

    props: {
    },

    data() {
        return {
            disabled: false,
            loading: false,
            adminRivateKeyList: [],
            runSqlResult: "",
            sqlForm: {
                adminRivateKey: ''
            },
            rules: {
                adminRivateKey: [
                    {
                        required: true,
                        message: this.$t("rule.selectAdmin"),
                        trigger: "blur"
                    }
                ]
            },
            aceEditor: null,
            // themePath: "ace/theme/chrome",
            // modePath: "ace/mode/sql",
            sqlExample: ""
        }
    },

    computed: {
    },

    mounted() {
        if (localStorage.getItem("root") === "admin") {
            this.disabled = false
        } else {
            this.disabled = true
        }
        this.initEditor()
        this.getUserData()
    },

    methods: {
        changGroup() {
            this.getUserData()
            this.sqlForm = {
                adminRivateKey: ''
            }
            this.aceEditor.setValue('')
            this.runSqlResult = ""
        },
        initEditor() {
            this.aceEditor = ace.edit(this.$refs.ace);
            this.aceEditor.setTheme("ace/theme/chrome");
            this.aceEditor.getSession().setMode("ace/mode/sql");
            this.aceEditor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true,
                wrap: true
            });
            this.aceEditor.setShowPrintMargin(false)
        },
        changeSql() {

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
                        if(res.data.data.length == 0){
                            this.$message({
                                type: "info",
                                message: this.$t("contracts.addPrivateKeyInfo")
                            }); 
                        }
                        res.data.data.forEach(value => {
                            if (value.hasPk === 1) {
                                this.adminRivateKeyList.push(value);
                            }
                        });
                        if(this.adminRivateKeyList.length) this.sqlForm.adminRivateKey = this.adminRivateKeyList[0]['address'];
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                        this.$message.closeAll()
                    }
                })
                .catch(err => {
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                    this.$message.closeAll()
                });
        },
        runSql(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.getSqlList()
                } else {
                    return false;
                }
            });
        },
        getSqlList() {
            if (!this.aceEditor.getValue().trim()) {
                this.$message({
                    type: 'info',
                    message: this.$t("rule.sqlRule")
                })
                return
            }
            var sqlContent = this.aceEditor.getValue().trim();
            var sqlType = sqlContent.split(' ')[0].toLowerCase();

            this.loading = true;
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                fromAddress: this.sqlForm.adminRivateKey,
                sql: sqlContent
            }
            queryCrudService(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.runSqlResult = res.data.data;
                        // if(sqlType==='select'|| sqlType ==='desc'){
                        //     this.runSqlResult = res.data.data;
                        // }else {
                        //     this.runSqlResult = res.data.msg
                        // }

                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.$message({
                        message: this.$t('text.systemError'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        copySql(val) {
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
    }
}
</script>

<style scoped>
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
.run-btn {
    margin-left: 10px;
}
.sql-ruslt {
    width: 100%;
}
.sql-ruslt-th > th {
    border: 1px dashed;
    padding: 0 5px;
}
.sql-ruslt-th > th {
    border-left-style: solid;
    border-right-style: solid;
}
.sql-ruslt-td > td {
    border: 1px dashed;
    padding: 0 5px;
    text-align: center;
}
.instructions {
    margin-bottom: 16px;
    padding: 10px 10px;
    color: #2e384d;
    border-radius: 10px;
    display: inline-block;
}
.editor-top {
    height: 200px;
    width: 550px;
    margin-left: 15px;
    margin-top: 5px;
    border: 1px solid #f2f2f2;
}
.editor-wrapper {
    height: 100%;
    width: 100%;
}
</style>
