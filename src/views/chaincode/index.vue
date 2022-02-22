<template>
    <div class="rivate-key-management-wrapper">
        <!-- <v-contentHead :headTitle="$t('title.contractTitle')" :headSubTitle="$t('title.contractList')" @changGroup="changGroup"></v-contentHead> -->
        <nav-menu :headTitle="$t('title.contractTitle')" :headSubTitle="$t('title.contractList')" @changGroup="changGroup"></nav-menu>
         <div class="module-wrapper" style="padding: 20px 0px;">
        <el-tabs class="search-part" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('title.registered')" name="registered">
                <registered-contract ref='registered' v-if='activeName === "registered"'></registered-contract>
            </el-tab-pane>
            <el-tab-pane :label="$t('title.all')" name="total">
                <total-contract ref='total' v-if='activeName === "total"'></total-contract>
            </el-tab-pane>
        </el-tabs>
        </div>
    </div>
</template>

<script>
import NavMenu from '@/components/navs/navMenu'
import registeredContract from './oldContract'
import totalContract from './totalContract'
import contentHead from "@/components/contentHead";
export default {
    name: "contractList",
    components: {
        registeredContract,
        totalContract,
        "v-contentHead": contentHead,
        'nav-menu':NavMenu
    },
    data() {
        return {
            activeName: null,

        }
    },
    created() {
      if (this.$route.query.tab === 'total') {
          this.activeName = 'total'
      } else {
          this.activeName = 'registered'
      }
    },
    methods: {
        handleClick() {
        //   if (this.activeName === 'total') {
        //         this.$refs.total.getList()
        //     } else {
        //         this.$refs.registered.getContracts()
        //     }
        },
        changGroup(data) {
            if (this.activeName === 'total') {
                this.$refs.total.getList()
            } else {
                this.$refs.registered.changGroup(data)
            }
        },
    }
}
</script>

<style>

</style>