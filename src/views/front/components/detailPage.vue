<template>
    <div>
     <json-viewer
                    :value="details"
                    :expand-depth=5
                    copyable
                    sort
                    boxed></json-viewer>
    </div>
</template>

<script>
import { getDetail } from "@/util/api";
export default {
    name: 'detailPage',

    components: {
    },

    props: {
        detailParam: {
            type: Object
        }
    },

    data() {
        return {
        details:null,
          groupId:localStorage.getItem('groupId')
        }
    },
    computed: {
     
    },

    watch: {

    },

    created() {

    },

    mounted() {
      this.getDetails()
    },

    methods: {

      getDetails(){
          let reqData={
             groupId :this.groupId,
             frontId:this.detailParam.frontId
          }
          getDetail(reqData)
          .then(res => {
                if (res.status == 200) {
                    this.details = JSON.parse(res.data);
                }
          })
          .catch(err => {
          
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            })
      }
    }
}
</script>

<style scoped>
.sure-btn >>> .el-button {
    padding: 9px 16px;
}
.info {
    padding-left: 30px;
    color: #f00;
}
</style>
