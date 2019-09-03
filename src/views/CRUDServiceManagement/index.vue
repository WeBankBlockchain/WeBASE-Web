<template>
    <div>
        <v-content-head :headTitle="'系统管理'" :headSubTitle="'CRUD'" @changGroup="changGroup" :headTooltip="`CRUD说明：CRUD(增删改查)可以创建表，对表进行增删改查操作。Tips：如果启用了部署和建表权限，建表操作需要部署和建表权限。删除和修改表操作需要该表的表权限。`"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 20px 29px;">

            <el-form :model="sqlForm" :rules="rules" ref="sqlForm" class="demo-ruleForm">
                <el-form-item label="管理员账号" prop="adminRivateKey" class="item-form">
                    <el-select v-model="sqlForm.adminRivateKey" placeholder="请选择" class="select-32">
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
                                例如：</br>创建表：
                                <i class="wbs-icon-copy font-12" @click="copySql('create table t_demo(name varchar, item_id varchar, item_name varchar, primary key(name))')" title="复制">create table t_demo(name varchar, item_id varchar, item_name varchar, primary key(name))</i> 
                                </br>插入表记录： 
                                <i class="wbs-icon-copy font-12" @click="copySql('insert into t_demo (name, item_id, item_name) values (fruit, 1, apple1)')" title="复制">insert into t_demo (name, item_id, item_name) values (fruit, 1, apple1)</i> 
                                </br>查询表记录：
                                <i class="wbs-icon-copy font-12" @click="copySql('select * from t_demo where name = fruit')" title="复制">select * from t_demo where name = fruit</i> 
                                </br>更新表记录：
                                <i class="wbs-icon-copy font-12" @click="copySql('update t_demo set item_name = orange where name = fruit and item_id = 1')" title="复制">update t_demo set item_name = orange where name = fruit and item_id = 1</i> 
                                </br>删除表记录：
                                <i class="wbs-icon-copy font-12" @click="copySql('delete from t_demo where name = fruit and item_id = 1')" title="复制">delete from t_demo where name = fruit and item_id = 1</i> 
                                </br>显示表详情：
                                <i class="wbs-icon-copy font-12" @click="copySql('desc t_demo')" title="复制">desc t_demo</i> 
                            </div>
                            <i class="el-icon-info contract-icon font-15">Example</i>
                        </el-tooltip>
                    </div>

                </el-form-item>

                <el-form-item>
                    <el-button size="small" type="primary" @click="runSql('sqlForm')" :disabled="disabled" class="run-btn" :loading="loading">执行</el-button>
                </el-form-item>
            </el-form>

            <template v-if="typeof(runSqlResult)==='string'">
                <div>
                    <p><span v-if="runSqlResult">执行结果：</span>{{runSqlResult}}</p>
                </div>

            </template>
            <template v-else>
                <div>
                    <p><span v-if="runSqlResult">执行结果：</span></p>
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
                        message: "请选择管理员",
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
                        res.data.data.forEach(value => {
                            if (value.hasPk === 1) {
                                this.adminRivateKeyList.push(value);
                            }
                        });
                        if(this.adminRivateKeyList.length) this.sqlForm.adminRivateKey = this.adminRivateKeyList[0]['userName'];
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "系统错误！"
                    });
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
                    message: '请输入sql'
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
                            type: "error",
                            message: this.errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.$message({
                        type: "error",
                        message: "系统错误！"
                    });
                });
        },
        copySql(val) {
            if (!val) {
                this.$message({
                    type: "fail",
                    showClose: true,
                    message: "key为空，不复制。",
                    duration: 2000
                });
            } else {
                this.$copyText(val).then(e => {
                    this.$message({
                        type: "success",
                        showClose: true,
                        message: "复制成功",
                        duration: 2000
                    });
                });
            }
        },
    }
}
</script>

<style scoped>
.demo-ruleForm {
    /* display: flex;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: -moz-flex; */
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
