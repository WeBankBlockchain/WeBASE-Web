<template>
    <div style="height: 200px;">
        <div style="height: 150px;">

            <table>
                <td>
                    <tr class="item-p"> &#12288;&#12288;{{this.$t('text.agreeNode_1')}}
                        <strong>{{this.$t('text.agreeNode_5')}}</strong>
                        {{this.$t('text.agreeNode_6')}};
                        {{this.$t('text.agreeNode_7')}}。
                    </tr>
                </td>
            </table>
        </div>
        <div class="text-center sure-btn">
            <el-button type="primary" @click="otherModifyNodeType">{{this.$t('text.agreeNodeBtn')}}</el-button>
        </div>
        <el-dialog :title="$t('text.groupConfTitle')" :visible.sync="groupConfVisible" width="557px" :close-on-click-modal="false" v-if="groupConfVisible" center append-to-body>
            <group-conf @closeGroupConf="closeGroupConf" @addGroupSuccess="addGroupSuccess"></group-conf>
        </el-dialog>
    </div>
</template>

<script>
import groupConf from "./groupConf.vue";
export default {
    name: 'JoinGroupTips',

    components: {
        groupConf
    },

    props: {
    },

    data() {
        return {
            groupConfVisible: false
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
        otherModifyNodeType() {
            this.groupConfVisible = true;
        },
        closeGroupConf() {
            this.groupConfVisible = false;
        },
        addGroupSuccess() {
            this.closeGroupConf()
            this.$emit('joinGroupTipsSuccess')
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
