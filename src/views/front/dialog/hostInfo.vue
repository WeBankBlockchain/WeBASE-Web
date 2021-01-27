<template>
    <div>
        <el-dialog :title="$t('text.hostTitle')" :visible.sync="dialogVisible" :before-close="modelClose" class="dialog-wrapper" width="700px" :center="true" :show-close='true'>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="ip" :label="$t('nodes.hostIp')"></el-table-column>
                <el-table-column prop="dockerPort" :label="$t('alarm.port')" width='120'></el-table-column>
                <el-table-column prop="status" :label="$t('text.hostStatus')" width='120'>
                    <template slot-scope="scope">
                        <span v-if='scope.row.status != 3'>{{HostStatus(scope.row.status)}}</span>
                        <span v-if='scope.row.status == 3' style="color: #f00">{{HostStatus(scope.row.status)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" :label="$t('home.createTime')">
                    <template slot-scope="scope">
                        <span>{{changeData(scope.row.createTime)}}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" :label='$t("nodes.operation")'>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click='open(scope.row)' :disabled="scope.row.status != 3">{{$t("text.errInfo")}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="text-right sure-btn" style="margin-top:10px">
                <el-button type="primary" @click="modelClose">{{this.$t("text.sure")}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getHostList } from "@/util/api"
import { date } from "@/util/util"
export default {
    name: "hostInfo",
    props: ['show'],
    data: function () {
        return {
            tableData: [],
            dialogVisible: this.show,
        }
    },
    mounted() {
        this.getHosts()
    },
    methods: {
        modelClose: function () {
            this.$emit("close")
        },
        HostStatus(val) {
            switch (val) {
                case 1:
                    return this.$t("nodes.initialize")
                    break;
                case 2:
                    return this.$t("privateKey.normal")
                    break;
                case 3:
                    return this.$t("text.abnormal")
                    break;
            }
        },
        getHosts: function () {
            getHostList().then(res => {
                if (res.data.code == 0) {
                    this.tableData = res.data.data
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
        open: function (row) {
            this.$alert(row.remark, row.ip, {
                confirmButtonText: '确定',
            });
        },
        changeData(timestamp) {
            var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            return Y + M + D + h + m + s;
        }
    }
}
</script>

<style>
</style>