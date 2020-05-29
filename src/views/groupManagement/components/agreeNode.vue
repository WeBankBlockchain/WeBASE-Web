<template>
    <div style="height: 200px;">
        <div style="height: 150px;">
        
            <table>
                <td>
                    <tr class="item-p">1：{{this.$t('text.agreeNode_1')}}</tr>
                    <tr class="item-p">2：{{this.$t('text.agreeNode_2')}}</tr>
                    <tr class="item-p">3：<span>{{this.$t('text.agreeNode_3')}}</span>
                        <span>
                            <i class="wbs-icon-copy font-12" @click="copyNodeIdKey(itemNodeData.nodeId)" :title="$t('text.copy')"></i>
                            <span :title="itemNodeData.nodeId">{{itemNodeData.nodeId | splitString}}...</span>
                        </span>
                        <span>{{this.$t('text.agreeNode_4')}}</span></tr>
                </td>
            </table>
        </div>
        <div class="text-center sure-btn">
            <el-button type="primary" @click="modifyNodeType">{{this.$t('text.addAgreeNode')}}</el-button>
            <el-button type="primary" @click="otherModifyNodeType">{{this.$t('text.agreedNode')}}</el-button>
        </div>
        <el-dialog :title="$t('nodes.updateNodesType')" :visible.sync="modifyDialogVisible" width="387px" v-if="modifyDialogVisible" center append-to-body>
            <modify-node-type @nodeModifyClose="nodeModifyClose" @nodeModifySuccess="nodeModifySuccess" :itemNodeData="itemNodeData"></modify-node-type>
        </el-dialog>
    </div>
</template>

<script>
import modifyNodeType from "./modifyNodeType";
export default {
    name: 'agreeNode',

    components: {
        modifyNodeType
    },

    props: {
        itemNodeData: {
            type: Object
        }
    },

    data() {
        return {
            modifyDialogVisible: false,
            modifyNode: this.modifyNodeType.nodeId
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
        modifyNodeType() {
            this.modifyDialogVisible = true
        },
        otherModifyNodeType() {
            this.$emit('nodeHadGroup', this.itemNodeData)
        },
        copyNodeIdKey(val) {
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
        nodeModifySuccess() {
            this.modifyDialogVisible = false
            this.$emit('addSuccess')
        },
        nodeModifyClose() {
            this.modifyDialogVisible = false
        }
    }
}
</script>

<style scoped>
.item-p {
    height: 24px;
    line-height: 24px;
    font-size: 14px;
}
</style>
