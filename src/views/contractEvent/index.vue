<template>
    <div>
        <!-- <v-content-head :headTitle="$t('title.subscribeEvent')" :headSubTitle="$t('title.contractEvent')" @changeGroup="changeGroup"></v-content-head> -->
        <nav-menu :headTitle="$t('title.subscribeEvent')" :headSubTitle="$t('title.contractEvent')" @changeGroup="changeGroup"></nav-menu>
        <div class="module-wrapper">
            <div class="search-table">
                <el-table :data="eventList" v-loading="loading">
                    <el-table-column v-for="head in eventHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row[head.enName]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { contractEventList } from "@/util/api";
import NavMenu from '../../components/navs/navMenu.vue';
import Bus from "@/bus"
export default {
    name: 'contractEvent',

    components: {
        'nav-menu': NavMenu,
    },

    props: {
    },

    data() {
        return {
            loading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            eventList: [],
            group: localStorage.getItem('groupId') || null
        }
    },

    computed: {
        eventHead() {
            var arr = [
                {
                    enName: 'appId',
                    name: this.$t('table.appId')
                },
                {
                    enName: 'groupId',
                    name: this.$t('table.groupId')
                },
                {
                    enName: 'exchangeName',
                    name: this.$t('table.exchangeName')
                },
                {
                    enName: 'routingKey',
                    name: this.$t('table.routingKey')
                },
                {
                    enName: 'queueName',
                    name: this.$t('table.queueName')
                },
                {
                    enName: 'contractAddress',
                    name: this.$t('table.contractAddress')
                },
                {
                    enName: 'topicList',
                    name: this.$t('table.topicList')
                },
                {
                    enName: 'frontInfo',
                    name: this.$t('table.frontInfo')
                }
            ]
            return arr
        }
    },

    watch: {
    },

    created() {
    },
    beforeDestroy() {
        Bus.$off("changeGroup")
    },
    mounted() {
        Bus.$on("changeGroup", data => {
            this.changeGroup(data)
        })
        if (this.group && (localStorage.getItem("configData") == 3 || localStorage.getItem("deployType") == 0)) {
            this.queryContractEventList()
        }
    },

    methods: {
        changeGroup(val) {
            this.group = val
            this.queryContractEventList();
        },
        queryContractEventList() {
            this.loading = true;
            let param = {
                groupId: this.group,
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            }
            contractEventList(param, {})
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.eventList = res.data.data;
                        this.total = res.data.totalCount;
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
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.queryContractEventList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.queryContractEventList();
        }
    }
}
</script>

<style scoped>
.search-part::after {
    display: block;
    content: "";
    clear: both;
}
.search-part-left-btn {
    border-radius: 20px;
}
</style>
