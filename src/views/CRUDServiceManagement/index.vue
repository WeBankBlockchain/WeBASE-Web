<template>
    <div>
        <v-content-head :headTitle="'系统管理'" :headSubTitle="'CRUDService'" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 20px 29px;">
            <span class="instructions bg-efefef">
                CRUDService说明：CRUD(增删改查)可以创建表，对表进行增删改查操作。</br>
                Tips: 如果启用了部署和建表权限，建表操作需要部署和建表权限。删除和修改表操作需要该表的表权限。
            </span>
            <el-form :model="sqlForm" :rules="rules" ref="sqlForm" class="demo-ruleForm">
                <el-form-item label="管理员账号" prop="adminRivateKey" class="item-form">
                    <el-select v-model="sqlForm.adminRivateKey" placeholder="请选择" class="select-32">
                        <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                            <span>{{item.userName}}</span>
                            <span class="font-12 text-float-right">{{item.address | splitString}}...</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="SQL" prop="sqlText" class="item-form">
                    <el-input v-model="sqlForm.sqlText" placeholder="请输入你要执行的CRUD SQL语句" type="textarea" :autosize="{ minRows: 4}" style="min-width: 500px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="runSql('sqlForm')" :disabled="disabled" class="run-btn" :loading="loading">执行</el-button>
                </el-form-item>
            </el-form>
            <!-- <div class="editor-top">
                <div class="editor-wrapper" ref="ace"></div>
            </div> -->
            <template v-if="typeof(runSqlResult)==='string'">
                <p><span>执行结果：</span>{{runSqlResult}}</p>
            </template>
            <template v-else>
                <p><span>执行结果：</span></p>
                <json-viewer :value="runSqlResult" :expand-depth='5' copyable></json-viewer>
            </template>
        </div>
    </div>
</template>

<script>
// import ace from "ace-builds";
// import "ace-builds/webpack-resolver";
// import "ace-builds/src-noconflict/ext-language_tools";
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
                adminRivateKey: '',
                sqlText: ''
            },
            rules: {
                adminRivateKey: [
                    {
                        required: true,
                        message: "请选择管理员",
                        trigger: "blur"
                    }
                ],
                sqlText: [
                    {
                        required: true,
                        message: "请输入SQL",
                        trigger: "blur"
                    }
                ]
            }
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
        // this.initEditor()
        this.getUserData()
    },

    methods: {
        changGroup() {
            this.sqlForm = {
                adminRivateKey: '',
                sqlText: ''
            }
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
            this.loading = true;
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                fromAddress: this.sqlForm.adminRivateKey,
                sql: this.sqlForm.sqlText.trim()
            }
            queryCrudService(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.runSqlResult = res.data.data;
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
        }
    }
}
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
    padding: 2px 5px;
    color: #2e384d;
    border-radius: 10px;
    display: inline-block;
}
.editor-top {
    height: 200px;
}
.editor-wrapper {
    height: 100%;
}
</style>
