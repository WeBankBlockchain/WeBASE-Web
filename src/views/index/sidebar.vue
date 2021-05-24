/*
 * Copyright 2014-2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
<template>
    <div style="height: 100%;position: relative;box-sizing: border-box">
        <div style="height: 100%;background-color: #0c1220;box-sizing: border-box" class="sidebar-content">
            <div class="image-flex justify-center center" style="height: 54px;position:relative;" v-if="menuShowC">
                <img :src="maxLog" alt="" style="width:120px">
                <span class="sidebar-contract-icon">
                    <i class="el-icon-caret-left font-color-aeb1b5" @click="hideMune(true)" style="font-size: 18px;"></i>
                </span>
            </div>
            <div class="mini-sidebar-contract-icon" v-if="!menuShowC" style="padding-bottom:40px">
                <i class="el-icon-caret-right font-color-aeb1b5" @click="hideMune(false)" style="font-size: 18px;"></i>
            </div>
            <el-menu default-active="999" router class="el-menu-vertical-demo" text-color="#9da2ab" active-text-color="#37eef2" active-background-color="#1e293e" background-color="#0c1220" @select="select" :collapse="!menuShowC" @open="handleOpen" @close="handleClose">
                <template v-for="(item,index) in routesListC" v-if="item.menuShow">
                    <el-submenu v-if="!item.leaf" :index="`${index}`" ref="ele" class="">
                        <template slot="title">
                            <div :style="{'padding-left':  menuShowC ? '13px':''}">
                                <i :class="item.iconCls" :style="{'color': activeIndex == index ? '#37eef2':''}"></i>
                                <span :class="{'font-color-37eef2': activeIndex == index}">{{item.name}}</span>
                            </div>
                        </template>

                        <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow" style="padding-left: 58px" :style="{
                                    'color': term.path == activeRoute ? '#37eef2':'',
                                    'border-left':term.path == activeRoute ? '3px solid #37eef2': '',
                                    'padding-left':term.path == activeRoute ? '55px': '58px',
                                    'background-color':term.path == activeRoute ? '#1e293e': '#0c1220',}">
                            <span>{{term.name}}</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path" :style="{
                                'border-left':item.children[0].path == activeRoute ? '3px solid #37eef2': '',
                                'padding-left':item.children[0].path == activeRoute ? '30px': '33px',
                                'background-color':item.children[0].path == activeRoute ? '#1e293e': '#0c1220',}">
                        <i :class="item.iconCls"></i>
                        <span slot="title">{{item.children[0].name}}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </div>

    </div>
</template>

<script>
import maxLog from "@/../static/image/logo-2 copy@1.5x.jpg";
import router from "@/router";
import { versionfunegt } from "@/util/util.js";
export default {
    name: "sidebar",
    props: ["minMenu"],
    data() {
        return {
            maxLog: maxLog,
            activeIndex: 0,
            // activeRoute: "",
            active: '',
            userRole: localStorage.getItem("root"),
            routesList: [],
            versionfunegt: versionfunegt
        };
    },
    computed: {
        routesListC() {
            var list = this.routesList;
            list.forEach((item => {
                switch (item.nameKey) {
                    case 'contractTitle':
                        item.name = this.$t('title.contractTitle')
                        break;
                    case 'systemManager':
                        item.name = this.$t('title.systemManager')
                        break;
                    case 'systemMonitor':
                        item.name = this.$t('title.systemMonitor')
                        break;
                    case 'transactionAudit':
                        item.name = this.$t('title.transactionAudit')
                        break;
                    case 'subscribeEvent':
                        item.name = this.$t('title.subscribeEvent')
                        break;
                    case 'chainTitle':
                        item.name = this.$t('text.chainTitle')
                        break;
                    case 'appManagement':
                        item.name = this.$t('title.appManagement')
                        break;
                }
                if (item.children) {
                    item.children.forEach((it) => {
                        switch (it.nameKey) {
                            case 'dataOverview':
                                it.name = this.$t('title.dataOverview')
                                break;
                            case 'nodeTitle':
                                it.name = this.$t('title.nodeTitle')
                                break;
                            case 'groupManagement':
                                it.name = this.$t('title.groupManagement')
                                break;
                            case 'PrivateKey':
                                it.name = this.$t('title.PrivateKey')
                                break;
                            case 'accountManagement':
                                it.name = this.$t('title.accountManagement')
                                break;
                            case 'contractIDE':
                                it.name = this.$t('title.contractIDE')
                                break;
                            // case 'abiList':
                            //     it.name = this.$t('title.abiList')
                            //     break;
                            // case 'parseAbi':
                            //     it.name = this.$t('title.parseAbi')
                            //     break;
                            case 'contractList':
                                it.name = this.$t('title.contractList')
                                break;
                            case 'CNSmanager':
                                it.name = this.$t('title.CNSmanager')
                                break;
                            case 'CRUDServiceManagement':
                                it.name = this.$t('title.CRUDServiceManagement')
                                break;
                            case 'permission':
                                it.name = this.$t('title.permission')
                                break;
                            case 'configManager':
                                it.name = this.$t('title.configManager')
                                break;
                            case 'certificate':
                                it.name = this.$t('title.certificate')
                                break;
                            case 'nodesMonitor':
                                it.name = this.$t('title.nodesMonitor')
                                break;
                            case 'hostMonitor':
                                it.name = this.$t('title.hostMonitor')
                                break;
                            case 'userTransaction':
                                it.name = this.$t('title.userTransaction')
                                break;
                            case 'unusualUser':
                                it.name = this.$t('title.unusualUser')
                                break;
                            case 'unusualContract':
                                it.name = this.$t('title.unusualContract')
                                break;
                            case 'emailAlarm':
                                it.name = this.$t('title.emailAlarm')
                                break;
                            case 'emailAlarmType':
                                it.name = this.$t('title.emailAlarmType')
                                break;
                            // case 'externalAccount':
                            //     it.name = this.$t('title.externalAccount')
                            //     break;
                            // case 'externalContract':
                            //     it.name = this.$t('title.externalContract')
                            //     break;
                            case 'blockEvent':
                                it.name = this.$t('title.blockEvent')
                                break;
                            case 'contractEvent':
                                it.name = this.$t('title.contractEvent')
                                break;
                            case 'newPermission':
                                it.name = this.$t('title.permission')
                                break;
                            case 'checkEvent':
                                it.name = this.$t('title.checkEvent')
                                break;
                            case 'onlineTools':
                                it.name = this.$t('title.onlineTools')
                            case 'hostMgrTitle':
                                it.name = this.$t('text.hostMgrTitle')
                                break;
                            case 'appManagement':
                                it.name = this.$t('title.appManagement')
                                break;
                            case 'contractWarehouse':
                                it.name = this.$t('title.contractWarehouse')
                                break;
                        }
                    })
                }
            }))
            return list
        },
        menuShowC() {
            if (this.minMenu) {
                return this.minMenu;
            } else {
                return false;
            }
        },
        activeRoute() {
            return this.active ? this.active : this.$route.path
        }
    },
    watch: {
        $route(to, from) {
            console.log(this.$route.path)
            if (this.$route.path !== to.path && to.path !== "/node/node" && to.path !== "/node/chain") {
                this.active = this.$route.path
            } else if (to.path === "/node/node" || to.path === "/node/chain") {
                this.active = '/front'
            } else {
                this.active = this.$route.path
            }
            if (this.$route.path === '/hostDetail') {
                this.active = '/front'
            }
            if (this.$route.path === '/parseAbi') {
                this.active = '/contractList'
            }
            if (this.$route.path === '/privateKeyManagement') {
                this.active = '/privateKeyManagement'
            }
        },
        // activeRoute(to, from) {

        //     // console.log(this.$route.path, to, from, this.activeRoute)
        //     console.log(this.$route.path !== to, to === "/node/node" || to === "/node/chain", to)
        //     if (this.$route.path !== to && to !== "/node/node" && to !== "/node/chain") {
        //         this.activeRoute = this.$route.path
        //     } else if (to === "/node/node" || to === "/node/chain") {
        //         this.activeRoute = '/front'
        //     }
        //     console.log(this.activeRoute)
        // }
    },
    mounted: function () {
        this.$nextTick(function () {
            localStorage.setItem("sidebarHide", false);
            this.changeRouter();
        });
    },
    methods: {
        changeRouter: function () {
            let list = this.$router.options.routes;

            list.forEach(item => {
                if (this.userRole === "admin" && item.name === "帐号管理") {
                    item.menuShow = true;
                }
                if (item.nameKey == 'systemManager') {
                    if (item.children) {
                        item.children.forEach(it => {
                            if (it.nameKey == 'permission' && localStorage.getItem("nodeVersionChange")) {
                                it.menuShow = false;
                            } else if (it.nameKey == 'newPermission') {
                                it.menuShow = true;
                            } else {
                                it.menuShow = true;
                            }
                            if (it.nameKey == 'newPermission' && !localStorage.getItem("nodeVersionChange")) {
                                it.menuShow = false;
                            }
                        })
                    }
                }
            });
            if (localStorage.getItem("root") === "developer") {
                list.forEach(item => {
                    item.menuShow = false;
                    if (item.nameKey === 'contractTitle') {
                        item.menuShow = true;
                    }
                    if (item.nameKey === 'dataOverview') {
                        item.menuShow = true;
                    }
                    if (item.nameKey === 'PrivateKey') {
                        item.menuShow = true;
                    }
                    if (item.children) {
                        item.children.forEach((it) => {
                            it.menuShow = false;
                            if (it.nameKey == 'permission') {
                                it.menuShow = true;
                            }
                            if (it.nameKey == 'blockTitle') {
                                it.menuShow = true;
                            }
                            if (it.nameKey == 'transactionInfo') {
                                it.menuShow = true;
                            }
                            if (it.nameKey == 'contractIDE') {
                                it.menuShow = true;
                            }
                            if (it.nameKey == 'contractList') {
                                it.menuShow = true;
                            }
                             if (it.nameKey == 'checkEvent') {
                                it.menuShow = true;
                            }
                            // if (it.nameKey == 'abiList') {
                            //     it.menuShow = true;
                            // }
                            // if (it.nameKey == 'parseAbi') {
                            //     it.menuShow = true;
                            // }
                            if (it.nameKey == 'CNSmanager') {
                                it.menuShow = true;
                            }
                            if (it.nameKey == 'CRUDServiceManagement') {
                                it.menuShow = true;
                            }
                            if (it.nameKey == 'PrivateKey') {
                                it.menuShow = true;
                            }
                           
                        })
                    }
                });
            } else {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].name == '帐号管理') {
                        list[i].menuShow = false
                    } else if (list[i].nameKey == 'main' || list[i].nameKey == 'login' || list[i].nameKey == 'blockBrowsing' || list[i].nameKey == 'groupManagement') {
                        list[i].menuShow = false;
                    } else {
                        list[i].menuShow = true;
                    }
                    if (list[i].children) {
                        list[i].children.forEach(it => {
                            if (it.menuShow) {
                                it.menuShow = true;
                            } else {
                                it.menuShow = false;
                            }
                            if (localStorage.getItem("deployType") == 0 && it.nameKey == 'hostMgrTitle') {
                                it.menuShow = false;
                            }
                        })
                    }
                    if (list[i].nameKey == 'guide') {
                        list[i].menuShow = false
                    }
                }
                list.forEach(item => {
                    if (this.userRole === "admin" && item.name === "帐号管理") {
                        item.menuShow = true;
                    }
                    if (item.nameKey == 'systemManager') {
                        if (item.children) {
                            item.children.forEach(it => {
                                if (it.nameKey == 'permission' && localStorage.getItem("nodeVersionChange")) {
                                    it.menuShow = false;
                                } else if (it.nameKey == 'newPermission') {
                                    it.menuShow = true;
                                } else {
                                    it.menuShow = true;
                                }
                                if (it.nameKey == 'newPermission' && !localStorage.getItem("nodeVersionChange")) {
                                    it.menuShow = false;
                                }
                                if (localStorage.getItem("deployType") == 0 && it.nameKey == 'hostMgrTitle') {
                                    it.menuShow = false;
                                }
                            })
                        }
                    }
                });
            }
            this.routesList = list;
        },
        select: function (index, indexPath) {
            this.activeIndex = indexPath[0];
            this.active = index;
        },
        handleOpen(key, keyPath) {
        },
        handleClose(key, keyPath) {
        },
        hideMune: function (val) {
            this.$emit("sidebarChange", val);
            if (this.menuShow) {
                this.menuShow = false;
            } else {
                this.menuShow = true;
            }
            if (this.$route.path === "contract" && val) {
                localStorage.setItem("sidebarHide", true);
            } else {
                localStorage.setItem("sidebarHide", false);
            }
        },
        getAdmin: function () { }
    }
};
</script>

<style scoped>
.el-menu-vertical-demo {
    padding-top: 31px;
    border: none;
}
.el-menu-vertical-demo >>> .el-menu-item {
    font-size: 14px;
    color: #9da2ab;
    text-align: left;
}
.el-menu-vertical-demo >>> .el-submenu__title {
    padding-left: 33px;
}
.el-menu-item-group > ul > .el-menu-item {
    font-size: 14px;
    color: #9da2ab;
    text-align: left;
    padding-left: 57px !important;
    height: 46px;
    line-height: 46px;
}
.sidebar-content {
    position: relative;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
}
.sidebar-content ::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}
.sidebar-version {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 30px;
    color: rgba(255, 255, 255, 0.1);
    z-index: 9999;
    background-color: #0c1220;
    box-sizing: border-box;
}
.sidebar-version-item {
    line-height: 22px;
}
.sidebar-content >>> .el-menu--collapse {
    width: 56px;
}
.sidebar-content >>> .el-menu--collapse .is-active .el-tooltip {
    padding-left: 17px !important;
    background-color: #1e293e;
}
.mini-sidebar-contract-icon {
    position: relative;
    text-align: center;
}
.mini-sidebar-contract-icon i {
    position: absolute;
    top: 20px;
    right: 10px;
    z-index: 9999;
    cursor: pointer;
}

.image-flex {
    display: -webkit-box !important;
    display: -webkit-flex !important;
    display: -ms-flexbox !important;
    display: flex !important;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}
.image-flex,
.image-flex *,
.image-flex :after,
.image-flex :before {
}
.image-flex.justify-center {
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
}
.image-flex.center {
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
}
.sidebar-icon {
    font-size: 15px;
    padding-right: 5px;
}
.sidebar-contract-icon {
    position: absolute;
    display: inline-block;
    left: 180px;
    top: 18px;
    font-size: 12px;
    letter-spacing: 0;
    text-align: right;
    cursor: pointer;
    z-index: 6666;
}
.sidebar-contract-icon i {
    cursor: pointer;
}
</style>
