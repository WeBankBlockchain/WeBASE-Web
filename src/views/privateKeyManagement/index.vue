<template>
    <div class="rivate-key-management-wrapper">
        <!-- <v-contentHead :headTitle="$t('title.PrivateKey')" @changGroup="changGroup"></v-contentHead> -->
        <nav-menu :headTitle="$t('title.PrivateKey')"></nav-menu>
         <div class="module-wrapper" style="padding: 20px 0px;">
        <el-tabs class="search-part" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="已登记" name="registered">
                <privateKey ref='registered' v-if='activeName === "registered"'></privateKey>
            </el-tab-pane>
            <el-tab-pane label="全量" name="total">
                <total-privateKey ref='total' v-if='activeName === "total"'></total-privateKey>
            </el-tab-pane>
        </el-tabs>
        </div>
    </div>
</template>

<script>
import NavMenu from '../../components/navs/navMenu.vue';
import privateKey from './privateKeyManagement'
import totalPrivateKey from './totalPrivateKey'
import contentHead from "@/components/contentHead";
import Bus from "@/bus"

export default {
    name: "privateKeyManagement",
    components: {
        privateKey,
        totalPrivateKey,
        "v-contentHead": contentHead,
        'nav-menu':NavMenu,
    },
    data() {
        return {
            activeName: null
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
        //         this.$refs.registered.getUserInfoData()
        //     }
        },
        changGroup(data) {
            if (this.activeName === 'total') {
                this.$refs.total.getList()
            } else {
                this.$refs.registered.changGroup(data)
            }
        },
    },
    mounted(){
     Bus.$on("changGroup", (item) => {
        
           this.changGroup()
       
    })
    },
     destroyed() {
     Bus.$off("changGroup");
  },
   
}
</script>

<style>

</style>