<template>
    <div>
        <el-dialog :title="$t('text.addNode')" :visible.sync="dialogVisible" :before-close="modelClose" class="dialog-wrapper" width="480px" :center="true" :show-close='true'>
            <el-form :model="nodeFrom" :rules='rules' ref="nodeFrom" label-width="120px" class="demo-ruleForm">
                <el-form-item :label='$t("text.ip")' prop='hostId'>
                    <el-select v-model="nodeFrom.hostId" :placeholder="$t('text.select')" @change='hostChange' style="width: 240px">
                        <el-option v-for="item in hostList" :key="item.id" :label="item.ip" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-tooltip class="item" effect="dark" content="如果主机列表为空，请到主机管理添加主机" placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item :label='"Front" + $t("alarm.port")' prop='frontPort'>
                    <el-input v-model="nodeFrom.frontPort" :placeholder="$t('text.input') + 'Front' + $t('alarm.port')" type="number" style="width: 240px;" maxlength="16"></el-input>

                </el-form-item>
                <el-form-item :label='"P2P" + $t("alarm.port")' prop='p2pPort'>
                    <el-input v-model="nodeFrom.p2pPort" :placeholder="$t('text.input') + 'P2P' + $t('alarm.port')" type="number" style="width: 240px;" maxlength="16"></el-input>
                </el-form-item>
                <el-form-item :label='"Channel" + $t("alarm.port")' prop='channelPort'>
                    <el-input v-model="nodeFrom.channelPort" :placeholder="$t('text.input') + 'Channel' + $t('alarm.port')" type="number" style="width: 240px;" maxlength="16"></el-input>
                </el-form-item>
                <el-form-item :label='"RPC" + $t("alarm.port")' prop='rpcPort'>
                    <el-input v-model="nodeFrom.rpcPort" :placeholder="$t('text.input') + 'RPC' + $t('alarm.port')" type="number" style="width: 240px;" maxlength="16"></el-input>
                </el-form-item>
                <el-form-item :label='$t("nodes.nodeCount")'>
                    <el-input v-model="nodeFrom.nodecount" :placeholder="$t('nodes.inputNodes')" type="number" style="width: 240px;" maxlength="16"></el-input>
                </el-form-item>
            </el-form>
            <div class="text-right sure-btn" style="margin-top:10px">
                <el-button @click="modelClose">{{this.$t("text.cancel")}}</el-button>
                <el-button type="primary" :loading="loading" @click="submit('nodeFrom')">{{this.$t("text.sure")}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getHosts } from "@/util/api"
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            default: null
        },
        front: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            dialogVisible: this.show,
            nodeFrom: {
                ip: "",
                hostId: "",
                frontPort: 5002,
                p2pPort: 30300,
                channelPort: 20200,
                rpcPort: 8545,
                nodecount: 1
            },
            loading: false,
            hostList: [],
            nodeData: this.data,
            frontList: this.front
        }
    },
    computed: {
        rules() {
            let data = {
                hostId: [
                    { required: true, message: this.$t('rule.ipName'), trigger: 'blur' },
                ],
                frontPort: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' },
                ],
                p2pPort: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' },
                ],
                channelPort: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' },
                ],
                rpcPort: [
                    { required: true, message: this.$t('text.notNull'), trigger: 'blur' },
                ]
            }
            return data
        }
    },
    mounted() {
        if (this.nodeData) {
            this.getDetail()
        }
        this.getHostList()
        if (this.frontList.length) {
            for (let i = 0; i < this.frontList.length; i++) {
                this.frontList[i].ip = this.frontList[i].frontIp
                this.frontList[i].rpcPort = this.frontList[i].jsonrpcPort
            }
        }
    },
    methods: {
        modelClose() {
            this.$emit("close")
        },
        submit: function (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.add()
                } else {
                    return false
                }
            })
        },
        hostChange(val) {
            for (let i = 0; i < this.hostList.length; i++) {
                if (val == this.hostList[i].id) {
                    this.nodeFrom.ip = this.hostList[i].ip
                }
            }
        },
        add() {
            this.initialization()

        },
        portAbs() {
            let num1 = Math.abs(this.nodeFrom.frontPort - this.nodeFrom.p2pPort)
            let num2 = Math.abs(this.nodeFrom.frontPort - this.nodeFrom.channelPort)
            let num3 = Math.abs(this.nodeFrom.frontPort - this.nodeFrom.rpcPort)
            let num4 = Math.abs(this.nodeFrom.p2pPort - this.nodeFrom.channelPort)
            let num5 = Math.abs(this.nodeFrom.p2pPort - this.nodeFrom.rpcPort)
            let num6 = Math.abs(this.nodeFrom.channelPort - this.nodeFrom.rpcPort)
            if (num1 > this.nodeFrom.nodecount && num2 > this.nodeFrom.nodecount && num3 > this.nodeFrom.nodecount && num4 > this.nodeFrom.nodecount && num5 > this.nodeFrom.nodecount && num6 > this.nodeFrom.nodecount) {
                console.log(this.nodeFrom.nodecount)
            } else {
                this.$message({
                    type: "error",
                    message: this.$t("text.portConflict")
                });
                return
            }
        },
        //检验端口是否被占用
        validate(list, node) {
            if (this.nodeFrom.nodecount > 1) {
                //判断各个端口加上节点数量后  与已添加的节点列表的各个端口是否存在冲突，
                //判断依据是添加的端口小于或等于已添加的节点端口，添加的端口加上节点个数后大于或等于已添加的节点端口（存在冲突)
                for (let i = 0; i < list.length; i++) {
                    if (this.nodeFrom.hostId == list[i].hostId) {
                        if ((this.nodeFrom.frontPort < list[i].frontPort &&
                            (parseInt(this.nodeFrom.frontPort) + parseInt(this.nodeFrom.nodecount)) > list[i].frontPort) || this.nodeFrom.frontPort == list[i].frontPort ||
                            (parseInt(this.nodeFrom.frontPort) + parseInt(this.nodeFrom.nodecount)) === list[i].frontPort) {
                            this.$message({
                                type: "error",
                                message: `${this.$t('alarm.port')}${list[i].frontPort}${this.$t('text.used')}`
                            });
                            this.loading = false;
                            return
                        }
                        if ((this.nodeFrom.p2pPort < list[i].p2pPort &&
                            (parseInt(this.nodeFrom.p2pPort) + parseInt(this.nodeFrom.nodecount)) > list[i].p2pPort) ||
                            this.nodeFrom.p2pPort == list[i].p2pPort || (parseInt(this.nodeFrom.p2pPort) + parseInt(this.nodeFrom.nodecount)) === list[i].p2pPort) {
                            this.$message({
                                type: "error",
                                message: `${this.$t('alarm.port')}${list[i].p2pPort}${this.$t('text.used')}`
                            });
                            this.loading = false;
                            return
                        }
                        if ((this.nodeFrom.channelPort < list[i].channelPort &&
                            (parseInt(this.nodeFrom.channelPort) + parseInt(this.nodeFrom.nodecount) > list[i].channelPort)) ||
                            this.nodeFrom.channelPort == list[i].channelPort || (parseInt(this.nodeFrom.channelPort) + parseInt(this.nodeFrom.nodecount)) === list[i].channelPort) {
                            this.$message({
                                type: "error",
                                message: `${this.$t('alarm.port')}${list[i].channelPort}${this.$t('text.used')}`
                            });
                            this.loading = false;
                            return
                        }
                        if ((this.nodeFrom.rpcPort < list[i].rpcPort &&
                            (parseInt(this.nodeFrom.rpcPort) + parseInt(this.nodeFrom.nodecount)) > list[i].rpcPort) || this.nodeFrom.rpcPort == list[i].rpcPort ||
                            (parseInt(this.nodeFrom.rpcPort) + parseInt(this.nodeFrom.nodecount)) === list[i].rpcPort) {
                            this.$message({
                                type: "error",
                                message: `${this.$t('alarm.port')}${list[i].rpcPort}${this.$t('text.used')}`
                            });
                            this.loading = false;
                            return
                        }
                    }

                }
                for (let i = 0; i < this.nodeFrom.nodecount; i++) {
                    let data = {
                        id: (new Date()).getTime() + i,
                        status: 0,
                        ip: this.nodeFrom.ip,
                        hostId: this.nodeFrom.hostId,
                        frontPort: parseInt(this.nodeFrom.frontPort) + i,
                        p2pPort: parseInt(this.nodeFrom.p2pPort) + i,
                        channelPort: parseInt(this.nodeFrom.channelPort) + i,
                        rpcPort: parseInt(this.nodeFrom.rpcPort) + i,
                    }
                    if (!node) {
                        list.push(data)
                    }
                }
                if (!node) {
                    return list
                } else {
                    return true
                }
            } else {
                this.nodeFrom.id = (new Date()).getTime()
                this.nodeFrom.status = 0
                console.log(list)
                for (let i = 0; i < list.length; i++) {
                    if (this.nodeFrom.hostId == list[i].hostId) {
                        if (list[i].ip == this.nodeFrom.ip && list[i].frontPort == this.nodeFrom.frontPort) {
                            console.log("1111111111111111111111111111111111")
                            this.$message({
                                type: "error",
                                message: `front${this.$t('alarm.port')}${this.$t('text.used')}`,
                            })
                            this.loading = false;
                            return
                        } else if (list[i].ip == this.nodeFrom.ip && list[i].p2pPort == this.nodeFrom.p2pPort) {
                            this.$message({
                                type: "error",
                                message: `p2p${this.$t('alarm.port')}${this.$t('text.used')}`,
                            })
                            this.loading = false;
                            return
                        } else if (list[i].ip == this.nodeFrom.ip && list[i].channelPort == this.nodeFrom.channelPort) {
                            this.$message({
                                type: "error",
                                message: `channel${this.$t('alarm.port')}${this.$t('text.used')}`,
                            })
                            this.loading = false;
                            return
                        }
                        else if (list[i].ip == this.nodeFrom.ip && list[i].rpcPort == this.nodeFrom.rpcPort) {
                            this.$message({
                                type: "error",
                                message: `rpc${this.$t('alarm.port')}${this.$t('text.used')}`,
                            })
                            this.loading = false;
                            return
                        }
                    }
                }
                if (!node) {
                    list.push(this.nodeFrom)
                    return list
                } else {
                    return true
                }

            }

        },
        initialization() {
            console.log(this.frontList)
            let validate = true
            let list = []
            console.log(sessionStorage.getItem("nodeList"))
            if (!!sessionStorage.getItem("nodeList")) {
                list = JSON.parse(sessionStorage.getItem("nodeList"))
            }
            this.portAbs()
            if (this.frontList.length === 0) {
                let data = this.validate(list)
                if (data) {
                    list = data
                } else {
                    return
                }

            } else {
                validate = this.validate(this.frontList, true)
                if (validate) {
                    let data = this.validate(list)
                    if (data) {
                        list = data
                    } else {
                        return
                    }
                } else {
                    this.loading = false;
                    return
                }

            }

            if (!list) {
                list = []
            } else {
                sessionStorage.setItem('nodeList', JSON.stringify(list))
                this.$store.dispatch('set_node_list_action', list)
                this.$emit("success", this.nodeFrom)
            }

        },
        getHostList() {
            getHosts().then(res => {
                if (res.data.code === 0) {
                    this.hostList = res.data.data
                    if (res.data.data.length === 0 || !res.data.data) {
                        this.$message({
                            type: "info",
                            message: this.$t("text.goHostInfo")
                        });
                    }
                } else {
                    this.$message({
                        type: "error",
                        message: this.$chooseLang(res.data.code)
                    });
                }
            })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: err.data || this.$t('text.systemError')
                    });
                });
        },
        getDetail() {
            this.nodeFrom = {
                ip: this.nodeData.ip,
                hostId: this.nodeData.hostId,
                frontPort: this.nodeData.frontPort,
                p2pPort: this.nodeData.p2pPort,
                channelPort: this.nodeData.channelPort,
                rpcPort: this.nodeData.rpcPort,
                id: this.nodeData.id,
                state: this.nodeData.state
            }
        }
    }
}
</script>

<style>
</style>