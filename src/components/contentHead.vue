/*
 * Copyright 2014-2019 the original author or authors.
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
    <div class="content-head-wrapper">
        <div class="content-head-title">
            <span class="content-head-icon" v-if="icon" @click="skip">
                <i class="wbs-icon-back"></i>
            </span>
            <span :class="{ 'font-color-9da2ab': headSubTitle}">{{title}}</span>
            <span v-show="headSubTitle" class="font-color-9da2ab">/</span>
            <span>{{headSubTitle}}</span>
            <el-tooltip effect="dark"  placement="bottom-start" v-if="headTooltip" offset='0'>
                 <div slot="content">{{headTooltip}}</div>
                <i class="el-icon-info contract-icon font-15" ></i>
            </el-tooltip>
            <a v-if="headHref" target="_blank" :href="headHref.href" class="font-color-fff font-12">{{headHref.content}}</a>
        </div>
        <div class="content-head-network">
            <a target="_blank" href="https://webasedoc.readthedocs.io/zh_CN/latest/">{{this.$t("head.helpText")}}</a>
            <el-popover placement="bottom" width="120" min-width="50px" trigger="click">
                <ul class="group-item">
                    <li class="group-item-list" v-for='item in groupList' :key='item.groupId' @click='changeGroup(item)'>{{item.groupName}}</li>
                </ul>
                <span slot="reference" class="contant-head-name" style="color: #fff" @click='checkGroup'>{{this.$t("head.group")}}: {{groupName || '-'}}</span>
            </el-popover>

            <!-- <span @click="checkNetwork" class="select-network">切换群组 -->
            <i :class="[dialogShow?'el-icon-arrow-up':'el-icon-arrow-down','select-network']"></i>
            <!-- </span> -->
            <span style="padding-right:10px"></span>
            <el-popover placement="bottom" width="0" min-width="50px" trigger="click">
                <div class="sign-out-wrapper">
                    <span class="change-password" @click="changePassword">{{this.$t("head.changePassword")}}</span><br>
                    <span class="sign-out" @click="signOut">{{this.$t("head.exit")}}</span>
                </div>
                <a class="browse-user" slot="reference">
                    <i class="wbs-icon-user-icon"></i>
                    <i>{{accountName}}</i>
                </a>
            </el-popover>
        </div>
        <!-- <div class="content-head-lang">
            <lang-select class="right-menu-item hover-effect" />
        </div> -->
        <el-dialog :title="$t('head.changePassword')" :visible.sync="changePasswordDialogVisible" width="30%" style="text-align: center;">
            <change-password-dialog @success="success"></change-password-dialog>
        </el-dialog>
        <!-- <v-dialog v-if="dialogShow" :show="dialogShow" @success="changeNetwork" @close='close' @changGroupSucess="changGroupSucess"></v-dialog> -->

    </div>
</template>

<script>
import dialog from "./groupdialog";
import changePasswordDialog from "./changePasswordDialog";
import router from "@/router";
import { loginOut, getGroups } from "@/util/api";
import { delCookie } from '@/util/util'
import Bus from "@/bus"
import langSelect from "@/components/langSelect"
export default {
    name: "conetnt-head",
    props: {
        headTitle: {
            type: String
        },
        icon: {
            type: Boolean
        },
        route: {
            type: String
        },
        headSubTitle: {
            type: String
        },
        headTooltip: {
            type: String
        },
        headHref: {
            type: Object
        }
    },
    components: {
        "v-dialog": dialog,
        changePasswordDialog,
        "lang-select": langSelect
    },
    watch: {
        headTitle: function (val) {
            this.title = val;
        }
    },
    data: function () {
        return {
            title: this.headTitle,
            groupName: "-",
            accountName: "-",
            dialogShow: false,
            path: "",
            headIcon: this.icon || false,
            way: this.route || "",
            changePasswordDialogVisible: false,
            groupList: []
        };
    },
    beforeDestroy: function () {
        Bus.$off("deleteFront")
    },
    mounted: function () {
        if (localStorage.getItem("groupName")) {
            this.groupName = localStorage.getItem("groupName");
        }
        if (localStorage.getItem("user")) {
            this.accountName = localStorage.getItem("user");
        }
        this.getGroupList();
        Bus.$on("deleteFront", () => {
            this.groupName = "";
            this.getGroupList('delete');
        })
        Bus.$on("addFront", () => {
            this.getGroupList();
        })
    },
    methods: {
        getGroupList: function (type) {
            getGroups().then(res => {
                if (res.data.code === 0) {
                    if (res.data.data && res.data.data.length) {
                        // this.dialogShow = true;
                        this.groupList = res.data.data || []
                    } else {
                        this.groupList = [];
                        localStorage.setItem("groupName", "")
                        localStorage.setItem("groupId", "")
                    }
                    if (type && res.data.data && res.data.data.length) {
                        this.groupName = res.data.data[0].groupName;
                        localStorage.setItem("groupName", res.data.data[0].groupName)
                        localStorage.setItem("groupId", res.data.data[0].groupId)
                    } else if (res.data.data && res.data.data.length && !localStorage.getItem("groupName")) {
                        this.groupName = res.data.data[0].groupName;
                        localStorage.setItem("groupName", res.data.data[0].groupName)
                        localStorage.setItem("groupId", res.data.data[0].groupId)
                    } else if (res.data.data && res.data.data.length && localStorage.getItem("groupName")) {
                        this.groupName = localStorage.getItem("groupName");
                    }
                } else {
                    this.groupList = [];
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                    localStorage.setItem("groupName", "")
                    localStorage.setItem("groupId", "")
                }
            }).catch(err => {
                this.groupList = [];
                localStorage.setItem("groupName", "")
                localStorage.setItem("groupId", "")
                this.$message({
                    message: this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
                this.$message.closeAll()
            })
                ;
        },
        checkGroup: function () {
            if (this.dialogShow) {
                this.dialogShow = false;
            } else {
                this.dialogShow = true;
            }

            this.path = this.$route.path;
        },
        changeGroup: function (val) {
            this.groupName = val.groupName
            localStorage.setItem("groupName", val.groupName);
            localStorage.setItem("groupId", val.groupId);
            this.$emit('changGroup', val.groupId);
            this.dialogShow = true;
        },
        // changGroupSucess(val){

        // },
        // changeNetwork: function() {
        //     this.groupName = localStorage.getItem("groupName");
        //     this.dialogShow = false;
        // },
        // close: function() {
        //     this.dialogShow = false;
        // },
        skip: function () {
            if (this.route) {
                this.$router.push(this.way);
            } else {
                this.$router.go(-1);
            }
        },
        signOut: function () {
            localStorage.removeItem("user");
            loginOut()
                .then()
                .catch();
            delCookie("JSESSIONID");
            delCookie("NODE_MGR_ACCOUNT_C");
            this.$router.push("/login");
        },
        changePassword: function () {
            this.changePasswordDialogVisible = true;
        },
        success: function (val) {
            this.changePasswordDialogVisible = false;
        }
    }
};
</script>
<style scoped>
.content-head-wrapper {
    width: calc(100%);
    background-color: #181f2e;
    text-align: left;
    line-height: 54px;
    position: relative;
}
.content-head-wrapper::after {
    display: block;
    content: "";
    clear: both;
}
.content-head-icon {
    color: #fff;
    font-weight: bold;
    cursor: pointer;
}
.content-head-title {
    margin-left: 40px;
    display: inline-block;
    font-size: 16px;
    color: #fff;
    font-weight: bold;
}
.content-head-network {
    float: right;
    padding-right: 10px;
    position: relative;
}
.browse-user {
    text-align: center;
    text-decoration: none;
    font-size: 12px;
    cursor: pointer;
    color: #cfd7db;
}
.sign-out-wrapper {
    line-height: 32px;
    text-align: center;
}
.sign-out {
    cursor: pointer;
    color: #ed5454;
}
.change-password {
    color: #0db1c1;
    cursor: pointer;
}
.network-name {
    font-size: 12px;
    color: #9da2ab;
    padding: 3px 0px;
    /* border-right: 2px solid #e7ebf0; */
    margin-right: 16px;
}
.select-network {
    color: #2d5f9e;
    cursor: default;
}
.content-head-network a:nth-child(1) {
    text-decoration: none;
    outline: none;
    color: #cfd7db;
    padding-right: 15px;
    border-right: 1px solid #657d95;
    margin-right: 15px;
}
.contant-head-name {
    position: relative;
    cursor: pointer;
}
.contant-head-name ul {
    position: absolute;
    width: 150%;
    left: -10px;
    top: 35px;
    background-color: #fff;
    color: #666;
    text-align: center;
    z-index: 9999999;
    box-shadow: 1px 4px 4px;
}
.contant-head-name ul li {
    width: 100%;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
}
.group-item {
    line-height: 32px;
    text-align: center;
}
.group-item-list {
    cursor: pointer;
}
.group-item-list:hover {
    color: #0db1c1;
}
.right-menu-item {
   padding: 0 20px;
}
.hover-effect {
    cursor: pointer;
    /* transition: background 0.3s; */
}
.content-head-lang{
    position: absolute;
    /* background-color: #fff; */
    right: 350px;
    top: 0px;
}
</style>
