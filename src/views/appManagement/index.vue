<template>
    <div>
        <!-- <content-head :headTitle="$t('title.appManagement')" @changGroup="changGroup"></content-head> -->
        <nav-menu :headTitle="$t('title.appManagement')" ></nav-menu>
        <div class="module-wrapper">
            <div class="desc-wrapper">
                <p class="desc-content">
                    {{this.$t('text.appDescContent')}}
                </p>
                <div style="margin-top: 36px;">
                    <p class="access-process cursor-pointer" @click="processVisible = !processVisible">
                        <span class="process-title" style="margin-left:8px;">
                            {{this.$t('text.process')}}
                        </span>
                        <span>
                            <i :class="!processVisible ? 'el-icon-arrow-down': 'el-icon-arrow-up'"></i>
                        </span>
                    </p>
                    <transition name="fade">
                        <div style="margin-top: 24px;" v-if="processVisible">
                            <el-row :gutter="24">
                                <el-col :span="12">
                                    <div class="process-item">
                                        <div class="process-item-title">
                                            {{this.$t('text.appTitleDev')}}
                                        </div>
                                        <div class="step-item">
                                            <el-steps direction="vertical" :space='32'>
                                                <el-step>
                                                    <template slot="title">
                                                        <p class="span-ellipsis">
                                                            {{$t('text.appStep11')}}
                                                        </p>
                                                    </template>
                                                </el-step>
                                                <el-step :title="$t('text.appStep12')"></el-step>
                                            </el-steps>
                                            <div style="margin-left:36px;">
                                                <span class="step-tag">
                                                    {{this.$t('text.appStepTag1')}}
                                                </span>
                                                <span class="step-tag">
                                                    {{this.$t('text.appStepTag2')}}
                                                </span>
                                                <span class="step-tag">
                                                    {{this.$t('text.appStepTag3')}}
                                                </span>
                                                <span class="step-tag">
                                                    {{this.$t('text.appStepTag4')}}
                                                </span>
                                            </div>

                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="process-item">
                                        <div class="process-item-title">
                                            {{this.$t('text.appTitleAdmin')}}
                                        </div>
                                        <div class="step-item">
                                            <el-steps direction="vertical" :space='32'>
                                                <el-step :title="$t('text.appStep21')"></el-step>
                                                <el-step :title="$t('text.appStep22')"></el-step>
                                            </el-steps>
                                            <div style="margin-left:36px;">
                                                <div style="height:21px;"></div>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>

                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <div class="module-wrapper">
            <div class="desc-wrapper">
                <div style="margin-top: 0px;">
                    <p class="access-process">
                        <span class="process-title" style="margin-left:8px;">
                            {{this.$t('text.appListTile')}}
                        </span>
                    </p>
                    <div style="margin-top: 24px;">
                        <el-button type="primary" :disabled="disabled" @click="creatApp()" size="small">{{$t('text.creatApp')}}</el-button>
                    </div>
                    <div style="margin-top: 24px;">
                        <el-row :gutter="20">
                            <el-col :lg="12" :md="24" v-for="(item, index) in appList" :key="index">
                                <div>
                                    <li class="item-warehouse">
                                        <div class="left-warehouse">
                                            <el-image :src="item.appIcon" style="border-radius: 10px;">
                                                <div slot="error" class="image-slot">
                                                    <i class="el-icon-picture-outline"></i>
                                                </div>
                                            </el-image>
                                        </div>
                                        <div class="right-warehouse">
                                            <div class="right-warehouse-item store-name">
                                                <span style="font-weight:bold;font-size: 15px;">
                                                    {{item.appName}}
                                                </span>
                                                <span style="display: inline-block;width: 10px"></span>
                                                <el-button type="text" class="font-color-2956a3 font-12 cursor-pointer" :disabled="disabled" @click="modifyApp(item)">{{$t('text.modify')}}</el-button>
                                                <el-button type="text" class="font-color-2956a3 font-12 cursor-pointer" :disabled="disabled" @click="deleteApp(item)">{{$t('text.delete')}}</el-button>
                                            </div>
                                            <div class="right-warehouse-item store-desc one-ellipsis" style="margin-top:6px; color:#2E384D;" :title='item.appDesc'>
                                                {{item.appDesc}}
                                            </div>
                                            <div class="right-warehouse-item store-desc two-ellipsis" style="color: #666666;" :title='item.appDetail'>
                                                {{item.appDetail}}
                                            </div>
                                            <div class="right-warehouse-item" style="margin-top:14px;">
                                                <el-button type="primary" size="small" @click="register(item)" style="margin-right:5px;" class="btn-item">{{$t('text.registerInfo')}}</el-button>
                                                <el-button type="primary" size="small" @click="introduction(item)" style="margin-right:5px;" class="right-btn-item">{{$t('text.appIntroduction1')}}</el-button>
                                                <el-button :disabled="item.appStatus=='2'|| item.appStatus=='0'" type="primary" size="small" @click="linkService(item)" class="right-btn-item">{{linkText(item)}}</el-button>
                                                <!-- <el-button :disabled="item.appStatus=='2'" type="primary" size="small" @click="linkService(item)" class="right-btn-item">{{$t('text.appLinkService')}}</el-button> -->
                                            </div>
                                        </div>
                                    </li>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="appDialogVisible" :title="appDialogTitle" width="600px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="appDialogVisible">
            <app-dialog :handleType="handleType" @close="close" @success="success" :appDialogInfo="appDialogInfo"></app-dialog>
        </el-dialog>
        <el-dialog :visible.sync="registerDialogVisible" :title="registerDialogTitle" width="503px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="registerDialogVisible">
            <register-dialog :registerDialogInfo="registerDialogInfo"></register-dialog>
        </el-dialog>

    </div>
</template>
<script>
import NavMenu from '../../components/navs/navMenu.vue';
import { fetchAppList, fetchAppServerInfo, fetchDeleteApp } from "@/util/api";
import AppDialog from './components/appDialog.vue';
import RegisterDialog from './components/registerDialog.vue';

export default {
    name: "AppManagement",
    components: {
        'nav-menu':NavMenu,
        AppDialog,
        RegisterDialog
    },
    data() {
        return {
            disabled: false,
            loading: false,
            appList: [],
            appDialogTitle: this.$t('text.creatApp'),
            appDialogVisible: false,
            appDialogInfo: {},
            registerDialogTitle: this.$t('text.registerDialogTitle'),
            registerDialogVisible: false,
            registerDialogInfo: {},
            hostInfo: {},
            handleType: '',
            processVisible: false,
            timer: null
        }
    },
    beforeDestroy(){
        clearInterval(this.timer)
    },
    mounted() {
        if (localStorage.getItem("root") === "admin") {
            this.disabled = false
        } else {
            this.disabled = true
        }
        this.queryAppList()
        this.queryAppServerInfo()
        this.timer = setInterval(()=>{
            this.queryAppList()
            this.queryAppServerInfo()
        },1000*10)
    },
    methods: {
        changGroup() {

        },
        queryAppList() {
            fetchAppList()
                .then(res => {
                    if (res.data.code === 0) {
                        const { data } = res.data
                        this.appList = data;
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
        },
        queryAppServerInfo() {
            fetchAppServerInfo()
                .then(res => {
                    if (res.data.code === 0) {
                        this.hostInfo = res.data.data
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
        },
        register(val) {
            this.registerDialogInfo = Object.assign({}, this.hostInfo, val)
            this.registerDialogVisible = true
        },
        introduction(val) {
            window.open(val.appDocLink)
        },
        linkService(val) {
            window.open(val.appLink)
        },
        handleRemove() {

        },
        modifyApp(val) {
            this.handleType = 'modify'
            this.appDialogTitle = this.$t('text.modifyApp')
            this.appDialogInfo = val
            this.appDialogVisible = true
        },
        deleteApp(val) {

            this.$confirm(this.$t("text.confirmDelete"), {
                type: 'warning'
            })
                .then(_ => {
                    this.sureDeleteApp(val)
                })
                .catch(_ => { });
        },
        sureDeleteApp(val) {
            fetchDeleteApp(val.id)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: this.$t('text.resetSuccess')
                        })
                        this.queryAppList()
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000
                        });
                    }
                })
        },
        close() {
            this.appDialogVisible = false
        },
        success() {
            this.appDialogVisible = false
            this.queryAppList()
        },
        creatApp() {
            this.handleType = 'create'
            this.appDialogTitle = this.$t('text.creatApp')
            this.appDialogInfo = {}
            this.appDialogVisible = true
        },
        openProcess() {

        },
        linkText(item){
            switch (item.appStatus) {
                case 0:
                    return this.$t('text.notRegister')
                    break;
            
                case 1:
                    return this.$t('text.appLinkService')
                    break;
                case 2:
                    return this.$t('text.notAlive')
                    break;
            }
        }
    }
}
</script>
<style scoped>
.desc-wrapper {
    padding: 24px;
}
.desc-content {
    padding: 13px 14px;
    background: #f3fbfc;
    border: 1px solid #bfebec;
    border-radius: 2px;
}
.access-process {
    border-left: 4px solid #20d4d9;
}
.process-title {
    font-size: 16px;
    color: #333333;
    line-height: 16px;
    font-weight: 500;
}
.process-item {
    background: #f8f8f8;
    padding: 20px;
}
.process-item-title {
    font-size: 14px;
    color: #333333;
    line-height: 14px;
    font-weight: 500;
}
.step-item {
    margin-top: 20px;
}
.step-item >>> .el-step__icon {
    width: 20px;
    height: 20px;
}
.step-item >>> .el-step__icon-inner {
    font-size: 12px;
    color: #333333;
    text-align: center;
    font-weight: 400;
}
.step-item >>> .el-step__title.is-wait {
    font-size: 12px;
    color: #666666;
    line-height: 20px;
    font-weight: 400;
}
.step-tag {
    padding: 4px 8px;
    background: #ffffff;
    border: 1px solid #d0d0d0;
    border-radius: 2px;
    font-size: 12px;
    color: #666666;
    margin-right: 10px;
}
.app-wrapper {
    padding: 10px 30px 10px 30px;
}
.contract-introduction {
    margin-bottom: 20px;
}
.item-warehouse {
    /* border: 1px solid #dddddd; */
    border-radius: 2px;
    display: flex;
    flex-direction: row;
    padding: 20px;
    min-height: 174px;
    margin-bottom: 20px;
    border-radius: 10px; 
    box-shadow: 0 4px 12px 0 #ddd;
}
.left-warehouse {
}
.right-warehouse {
    margin-left: 20px;
}
.el-row {
    /* margin-bottom: 20px; */
}
.right-warehouse-item {
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
.right-btn-item {
    margin-left: 0px;
}
.store-name {
    font-size: 14px;
}
.store-name >>> .el-button {
    padding: 0;
}
.store-desc {
    font-size: 12px;
}
.el-image {
    width: 72px;
    height: 72px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #dddddd;
}
.dialog-wrapper >>> .el-dialog__header {
    text-align: left;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>