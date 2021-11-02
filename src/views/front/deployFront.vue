<template>
    <div>
        <div style="height: 100%">
            <!-- <v-content-head :headTitle="$t('text.chainTitle')" :headSubTitle="$t('title.nodeTitle')"></v-content-head> -->
            <div v-loading='loading'></div>
        </div>
    </div>
</template>

<script>
import { getChainInfo } from "@/util/api"
import contentHead from "@/components/contentHead";
export default {
    name: "deployFront",
    components: {
        'v-content-head': contentHead
    },
    data() {
        return {
            chainInfo: null,
            show: 0,
            loading: true
        }
    },
    created() {
        this.getChainData()
    },
    methods: {
        getChainData() {
            getChainInfo().then(res => {
                if (res.data.code === 0) {
                    this.chainInfo = res.data.data
                    if (this.chainInfo) {
                        this.$router.push("/newNode")
                    } else {
                        this.$router.push({
                            path: "/node/chain",
                        })
                    }
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error"
                    });
                }
            }).catch(err => {
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: "error"
                });
            })
        }
    }
}
</script>

<style>
</style>