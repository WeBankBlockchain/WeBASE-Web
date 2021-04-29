<template>
    <div>
        <content-head :headTitle="$t('title.contractWarehouse')"></content-head>
        <div class="module-wrapper" style="padding: 20px;" v-loading="loading">
            <div class="contract-introduction">
                <!-- <p>{{$t('text.appIntroduction')}}</p> -->
                <p>{{$t('text.warehouseDes')}}</p>
            </div>

            <div class="contract-app">
                <el-row :gutter="20">
                    <el-col :span="12" v-for="(item, index) in wareHouseList" :key="index">
                        <li class="item-warehouse">
                            <div class="left-warehouse">
                                <svg-icon :icon-class='item.warehouseIcon' class="font-120" style=""></svg-icon>
                                <!-- <el-image style="width: 120px; height: 120px" :src="item.storeIcon">
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image> -->
                            </div>
                            <div class="right-warehouse">
                                <div class="right-warehouse-item">
                                    <p v-if="language=='zh'">{{item.warehouseName}}</p>
                                    <p v-else>{{item.warehouseNameEn}}</p>
                                </div>
                                <div class="right-warehouse-item">
                                    <p v-if="language=='zh'">{{item.description}}</p>
                                    <p v-else>{{item.descriptionEn}}</p>
                                </div>
                                <div class="right-warehouse-item">
                                    <el-button type="primary" v-show="item.type!=1" size="small" @click="exportContract(item)" class="btn-item">{{$t('contracts.exportToIde')}}</el-button>
                                    <el-button type="primary" size="small" @click="toDetail(item)">{{$t('text.previewAndDescription')}}</el-button>
                                </div>
                            </div>
                        </li>
                    </el-col>
                    <el-col :span="12">
                        <li class="item-warehouse-none item-warehouse">
                            {{$t('text.developing')}}
                        </li>
                    </el-col>
                </el-row>
            </div>
            <folder v-if='folderVisible' :folderItem="folderItem" :folderVisible="folderVisible" @close="close" @success="success($event)"></folder>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import Bus from "@/bus"
import { getContractStore, getContractItemByFolderId, batchSaveContract } from "@/util/api"
import Folder from "@/components/Folder";
export default {
    name: 'contractWarehouse',

    components: {
        contentHead,
        Folder
    },

    props: {
    },

    data() {
        return {
            wareHouseList: [],
            language: localStorage.getItem('lang'),
            folderVisible: false,
            folderName: false,
            loading: false,
            folderItem: {}
        }
    },

    computed: {
    },

    watch: {
    },

    created() {
    },
    beforeDestroy() {
        Bus.$off("chooselanguage")
    },
    mounted() {
        this.queryContractStore()
        Bus.$on("chooselanguage", data => {
            this.language = data
            this.queryContractStore()
        })
    },

    methods: {
        queryContractStore() {
            this.loading = true;
            getContractStore()
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        var list = res.data.data;
                        var iconList = ["tools", "supply"];
                        list.forEach((item, index) => {
                            if (index === 0) {
                                item.warehouseIcon = iconList[index]
                            } else {
                                item.warehouseIcon = iconList[1]
                            }
                        });
                        this.wareHouseList = list;

                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        });
                    }
                })
        },
        exportContract(item) {
            this.folderVisible = true;
            this.folderItem = item;
            console.log(item);
        },
        toDetail(val) {
            let warehouseType = val.type;
            this.$router.push({
                path: '/toolsContract',
                query: {
                    storeId: val.id,
                    storeType: val.type,
                    storeName: val.warehouseName
                }
            })

        },
        close() {
            this.folderVisible = false;
        },
        success(val) {
            this.folderVisible = false;
            this.folderName = val;
            this.queryContract()
        },
        queryContract() {
            getContractItemByFolderId(this.folderItem.id)
                .then(res => {
                    if (res.data.code === 0) {
                        var folderContract = res.data.data;
                        this.queryBatchSaveContract(folderContract)

                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        });
                    }
                })
        },
        queryBatchSaveContract(folderContract) {
            let contractItems = folderContract.map(item => {
                return {
                    contractName: item.contractName,
                    contractSource: item.contractSource
                }
            })
            let param = {
                contractItems: contractItems,
                contractPath: this.folderName,
                groupId: localStorage.getItem("groupId"),
                account: localStorage.getItem("user")
            }
            console.log(param);
            batchSaveContract(param)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: this.$t('text.importSuccessed')
                        })
                        this.$router.push({
                            path: "/contract",
                            query: {
                                contractPath: this.folderName
                            }
                        })
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        });
                    }
                })

        },
    }
}
</script>

<style scoped>
.contract-introduction {
    margin-bottom: 20px;
}
.item-warehouse {
    border: 1px solid;
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
}
.left-warehouse {
    margin-left: 10px;
}
.right-warehouse {
    margin-left: 20px;
}
.el-row {
    /* margin-bottom: 20px; */
}
.right-warehouse-item {
    margin-top: 10px;
}
.btn-item {
    margin-left: 0;
}
.item-warehouse-none {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
}
</style>
