<!--
 * @Author: yyzhangyang zy871029@126.com
 * @Date: 2023-10-24 14:13:57
 * @LastEditors: yyzhangyang zy871029@126.com
 * @LastEditTime: 2023-10-27 11:01:33
 * @FilePath: /WeBASE-Web/src/views/permission/newPermission.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div>
        <!-- <contents  @changGroup="changGroup" :headTitle="$t('title.systemManager')" :headSubTitle="$t('title.permission')"  :headTooltip="$t('title.permissionTips')" :headHref="headHref">
        </contents> -->
        <nav-menu
          :headTitle="$t('title.systemManager')"
          :headSubTitle="$t('title.permission')"
          :headTooltip="$t('title.permissionTips')"
        ></nav-menu>
        <!-- <div  v-if="nodeVersionChange == 1" class="module-wrapper" style="padding: 30px 29px 0 29px;"> -->
        <div class="module-wrapper" style="padding: 30px 29px 0 29px;">
            <el-tabs @tab-click="handleClick" v-model="activeName">
                <el-tab-pane :label="$t('title.committeeMgmt')">
                    <committeeMgmt ref='committeeMgmt'></committeeMgmt>
                </el-tab-pane>
                <!-- <el-tab-pane :label="$t('title.developerMgmt')">
                    <developerMgmt ref='developerMgmt'></developerMgmt>
                </el-tab-pane> -->
            </el-tabs>
        </div>
        <!-- <div v-else class="module-wrapper" style="padding: 30px 29px 0 29px;">
             <permission ref='permission'></permission>
        </div> -->
    </div>
</template>

<script>
// import contents from "@/components/contentHead";
import NavMenu from "../../components/navs/navMenu.vue";
import committeeMgmt from "@/views/committeeMgmt/index";
import developerMgmt from "@/views/developerMgmt/index";
import permission from "@/views/permission/index";
import {getFronts} from "@/util/api";
export default {
    name: 'newPermission',
    components: {
        //  contents,
        committeeMgmt,
        developerMgmt,
        permission,
        "nav-menu": NavMenu,
    },
    data() {
        return {
            // handleClick:'',
            // changGroup:'',
            activeName: 0,
            nodeVersionChange: localStorage.getItem("nodeVersionChange")
            // nodeVersionChange: ""
        }
    },  
    computed: {
        headHref() {
            let data = {
                href: "https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/design/security_control/chain_governance.html",
                content: this.$t('title.permissionHref')
            }
            return data
        }
    }, 
    methods: {
        handleClick() {
            if (this.activeName == 0) {
                this.$refs.committeeMgmt.adminRivateKeyList = [];
                if (localStorage.getItem("groupId")) {
                    this.$refs.committeeMgmt.queryGetThreshold()
                    this.$refs.committeeMgmt.getUserData()
                    this.$refs.committeeMgmt.queryCommitteeList()
                    this.$refs.committeeMgmt.queryVoteRecordList()
                }
            } else {
                if (localStorage.getItem("groupId")) {
                    this.$refs.developerMgmt.queryOperatorList()
                    this.$refs.developerMgmt.getUserData()
                }
            }
        },
        changGroup() {
            if (this.activeName == 0) {
                if (localStorage.getItem("groupId")) {
                    this.$refs.committeeMgmt.adminRivateKeyList = [];
                    // this.$refs.committeeMgmt.queryGetThreshold()
                    this.$refs.committeeMgmt.getUserData()
                    this.$refs.committeeMgmt.queryCommitteeList()
                    this.$refs.committeeMgmt.queryVoteRecordList()
                }
            } else {
                if (localStorage.getItem("groupId")) {
                    this.$refs.developerMgmt.queryOperatorList()
                    this.$refs.developerMgmt.getUserData()
                }
            }
        } 
      }
    
}
</script>

<style>
</style>