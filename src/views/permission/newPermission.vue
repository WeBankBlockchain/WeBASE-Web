<template>
    <div>
        <v-content-head :headTitle="$t('title.systemManager')" :headSubTitle="$t('title.permission')" @changGroup="changGroup" :headTooltip="$t('title.permissionTips')" :headHref="headHref">
        </v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 0 29px;">
            <el-tabs @tab-click="handleClick" v-model="activeName">
                <el-tab-pane :label="$t('title.committeeMgmt')">
                    <committeeMgmt ref='committeeMgmt'></committeeMgmt>
                </el-tab-pane>
                <el-tab-pane :label="$t('title.developerMgmt')">
                    <developerMgmt ref='developerMgmt'></developerMgmt>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import  committeeMgmt from "@/views/committeeMgmt/index";
import  developerMgmt from "@/views/developerMgmt/index";
export default {
    name: 'newPermission',
    components: {
        "v-content-head": contentHead,
        committeeMgmt,
        developerMgmt
    },
    data () {
        return {
            activeName: 0
        }
    },
    computed: {
        headHref() {
            let data = {
                href: "https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/design/security_control/permission_control.html",
                content: this.$t('title.permissionHref')
            }
            return data
        },
    },
    methods: {
        handleClick () {
            if(this.activeName == 0){
                this.$refs.committeeMgmt.adminRivateKeyList = [];
                this.$refs.committeeMgmt.queryGetThreshold()
                this.$refs.committeeMgmt.getUserData()
                this.$refs.committeeMgmt.queryCommitteeList()
                this.$refs.committeeMgmt.queryVoteRecordList()
            }else{
                this.$refs.developerMgmt.queryOperatorList()
                this.$refs.developerMgmt.getUserData()
            }
        },
        changGroup () {
            if(this.activeName == 0){
                this.$refs.committeeMgmt.adminRivateKeyList = [];
                this.$refs.committeeMgmt.queryGetThreshold()
                this.$refs.committeeMgmt.getUserData()
                this.$refs.committeeMgmt.queryCommitteeList()
                this.$refs.committeeMgmt.queryVoteRecordList()
            }else{
                this.$refs.developerMgmt.queryOperatorList()
                this.$refs.developerMgmt.getUserData()
            }
        }
    }
}
</script>

<style>

</style>