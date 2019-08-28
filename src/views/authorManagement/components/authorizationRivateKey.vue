<template>
    <div>
        <el-form :model="permissionForm" :rules="rules" ref="permissionForm" label-width="110px" class="demo-ruleForm">
            <el-form-item label="管理员账号" prop="adminRivateKey" style="width: 320px;">
                <el-select v-model="permissionForm.adminRivateKey" placeholder="请选择">
                    <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="外部账号地址" prop="otherRivateKey" style="width: 320px;">
                <el-input v-model.trim="permissionForm.otherRivateKey" placeholder="请输入帐号"></el-input>
            </el-form-item>
        </el-form>
        <div class="text-right sure-btn" style="margin-top:10px">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="submit('permissionForm')">确定</el-button>
        </div>
    </div>
</template>

<script>
import { getUserList, postPermission } from "@/util/api";
export default {
    name: 'AuthorizationRivateKey',

    components: {
    },

    props: {
        authorType: {
            type: String,
        },
        tableName: {
            type: String
        }
    },

    data() {
        return {
            adminRivateKeyList: [],
            permissionForm: {
                adminRivateKey: '',
                otherRivateKey: ''
            },
            rules: {
                adminRivateKey: [
                    {
                        required: true,
                        message: "请选择管理员账号",
                        trigger: "blur"
                    }
                ],
                otherRivateKey: [
                    {
                        required: true,
                        message: "请输入外部账号地址",
                        trigger: "blur"
                    }
                ]
            }
        }
    },

    computed: {

    },

    watch: {

    },

    created() {

    },

    mounted() {
        this.getUserData()
    },

    methods: {
        close() {
            this.$emit("close");
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.queryPostPermission()
                } else {
                    return false;
                }
            });

        },
        queryPostPermission() {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                permissionType: this.authorType,
                tableName: this.tableName && this.authorType === 'userTable' ? this.tableName : '',
                fromAddress: this.permissionForm.adminRivateKey,
                address: this.permissionForm.otherRivateKey
            }
            console.log(reqData)
            postPermission(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '授权成功'
                        })
                        this.$emit('authorizeSuccess')
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
        changeRivateKey(val) {
            this.adminRivateKey = val
        },
        getUserData: function () {
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
        }
    }
}
</script>

<style scoped>
.sure-btn >>> .el-button {
    padding: 9px 16px;
}
</style>
