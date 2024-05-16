<template>
    <div>
        <!-- <content-head :headTitle="$t('title.contractTitle')" :headSubTitle="$t('title.contractWarehouse')"></content-head> -->
        <nav-menu :headTitle="$t('title.contractTitle')" :headSubTitle="$t('title.contractWarehouse')"></nav-menu>
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
                                <div class="right-warehouse-item right-warehouse-item-content">
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
                        <li class="item-warehouse">
                            <div class="left-warehouse">
                                <svg-icon icon-class='comingSoon' class="font-120" style=""></svg-icon>
                            </div>
                            <div class="item-warehouse-none right-warehouse">
                                {{$t('text.developing')}}
                            </div>
                        </li>
                    </el-col>
                </el-row>
            </div>
            <folder v-if='folderVisible' :folderItem="folderItem" :folderVisible="folderVisible" @close="close" @success="success($event)"></folder>
        </div>
    </div>
</template>

<script>
// import contentHead from "@/components/contentHead";
import NavMenu from '../../components/navs/navMenu.vue';
import Bus from "@/bus"
import { getContractStore, getContractItemByFolderId, batchSaveContract, getFolderItemListByStoreId } from "@/util/api"
import Folder from "@/components/Folder";
export default {
    name: 'contractWarehouse',

    components: {
        // contentHead,
        Folder,
        'nav-menu': NavMenu,
    },

    props: {
    },

    data() {
        return {
            wareHouseList: [],
            language: localStorage.getItem('lang')?localStorage.getItem('lang'):'zh',
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
                        // var iconList = ["tools", "supply", "points"];
                        // list.forEach((item, index) => {
                        //     switch (item.warehouseIcon) {
                        //         case "toolboxId":
                        //             item.warehouseIcon = "tools"
                        //             break;
                        //         case "evidenceId":
                        //             item.warehouseIcon = "supply"
                        //             break;
                        //         case "pointsId":
                        //             item.warehouseIcon = "points"
                        //             break;
                        //         default:
                        //             break;
                        //     }
                        // });
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
        },
        toDetail(val) {
            let warehouseType = val.type;
            this.$router.push({
                path: '/toolsContract',
                query: {
                    storeId: val.id,
                    storeType: val.type,
                    storeName: this.language != 'en'? val.warehouseName : val.warehouseNameEn
                }
            })

        },
        close() {
            this.folderVisible = false;
        },
        success(val) {
            this.folderVisible = false;
            this.folderName = val;
            this.queryContractFolder()
        },
        //通过合约仓库id 获取合约文件夹
        queryContractFolder() {
            let param = {
                warehouseId: this.folderItem.id
            }
            getFolderItemListByStoreId(param)
                .then(res => {
                    if (res.data.code === 0) {
                        let list = res.data.data;
                        if (list.length) {
                            var contractFolderId = list[0]['id'];
                            this.queryContract(contractFolderId)
                        }
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$chooseLang(res.data.code)
                        });
                    }
                })
        },
        //通过合约文件夹id 获取合约列表
        queryContract(contractFolderId) {
            let param = {
                folderId: contractFolderId
            }
            getContractItemByFolderId(param)
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
                            path: "/contract/ide",
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
    height: 125px;
    padding: 10px;
}
.left-warehouse {
    margin-left: 10px;
}
.right-warehouse {
    margin-left: 20px;
    padding-right: 10px;
    padding-bottom: 10px;
}
.el-row {
    /* margin-bottom: 20px; */
}
.right-warehouse-item {
    margin-top: 10px;
}
.right-warehouse-item-content {
    height: 42px;
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
