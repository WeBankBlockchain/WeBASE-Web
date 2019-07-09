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
        </div>
        <div class="content-head-network">
            <router-link target="_blank" to="/helpDoc">帮助文档</router-link>
            <!-- <span style="margin-left:30px"></span> -->
            <!-- <span class="network-name">区块链网络: {{networkName || 'network1'}}</span> -->
            <!-- <span @click="checkNetwork" class="select-network">切换网络
                <i :class="[dialogShow?'el-icon-arrow-up':'el-icon-arrow-down','select-network']"></i>
            </span>
            <v-dialog v-if="dialogShow" :network-dialog="dialogShow" :route="path" @success="changeNetwork" @close="close"></v-dialog> -->
            <el-popover placement="bottom" width="0" min-width="50px" trigger="click">
                <div class="sign-out-wrapper">
                    <span class="change-password" @click="changePassword">修改密码</span>
                    <span class="sign-out" @click="signOut">退出</span>
                </div>
                <a class="browse-user" slot="reference">
                    <i class="wbs-icon-user-icon"></i>
                    <i>{{accountName}}</i>
                </a>
            </el-popover>
        </div>
        <el-dialog title="修改密码" :visible.sync="changePasswordDialogVisible" width="30%" style="text-align: center;">
            <change-password-dialog @success="success"></change-password-dialog>
        </el-dialog>

    </div>
</template>

<script>
import dialog from "./networkDialog";
import changePasswordDialog from "./changePasswordDialog";
import helpDoc from "./helpDoc";
import router from "@/router";
import { loginOut } from "@/util/api";
import { delCookie } from '@/util/util'
export default {
    name: "conetnt-head",
    props: ["headTitle", "icon", "route", "headSubTitle"],
    components: {
        "v-dialog": dialog,
        changePasswordDialog,
        helpDoc
    },
    watch: {
        headTitle: function(val) {
            this.title = val;
        }
    },
    data: function() {
        return {
            title: this.headTitle,
            networkName: "-",
            accountName: "-",
            dialogShow: false,
            path: "",
            headIcon: this.icon || false,
            way: this.route || "",
            changePasswordDialogVisible: false
        };
    },
    mounted: function() {
        if (localStorage.getItem("networkName")) {
            this.networkName = localStorage.getItem("networkName");
        }
        if (localStorage.getItem("user")) {
            this.accountName = localStorage.getItem("user");
        }
    },
    methods: {
        checkNetwork: function() {
            if (this.dialogShow) {
                this.dialogShow = false;
            } else {
                this.dialogShow = true;
            }

            this.path = this.$route.path;
        },
        changeNetwork: function() {
            this.networkName = localStorage.getItem("networkName");
            this.dialogShow = false;
        },
        close: function() {
            this.dialogShow = false;
        },
        skip: function() {
            if (this.route) {
                router.push(this.way);
            } else {
                this.$router.go(-1);
            }
        },
        signOut: function() {
            localStorage.removeItem("user");
            localStorage.removeItem("token")
            loginOut()
                .then()
                .catch();
            // delCookie('JSESSIONID')
            // delCookie('NODE_MGR_ACCOUNT_C')
            router.push("/login");
        },
        changePassword: function() {
            this.changePasswordDialogVisible = true;
        },
        success: function(val) {
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
    overflow: hidden;
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
    color: #cfd7db
}
.sign-out-wrapper {
    text-align: center;
}
.sign-out {
    cursor: pointer;
    color: #ed5454;
}
.change-password {
    color: #2d5f9e;
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
.content-head-network a:nth-child(1){
    text-decoration: none;
    outline: none;
    color: #cfd7db;
    padding-right: 15px;
    border-right: 1px solid #657d95;
    margin-right: 15px;
}
a{
    
}
</style>
