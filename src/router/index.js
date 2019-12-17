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
import Vue from 'vue'
import Router from 'vue-router'
import { getCookie } from '@/util/util'

const main = resolve => require(['@/views/index/main'], resolve);
const home = resolve => require(['@/views/home/home'], resolve);
const blockInfo = resolve => require(['@/views/blockInfo/blockInfo'], resolve);
const transactionInfo = resolve => require(['@/views/transactionInfo/transactionInfo'], resolve);
const front = resolve => require(['@/views/front/front'], resolve);
const hostDetail = resolve => require(['@/views/front/components/hostDetail'], resolve);
const contract = resolve => require(['@/views/chaincode/contract'], resolve);
const oldContract = resolve => require(['@/views/chaincode/oldContract'], resolve)
const rivateKeyManagement = resolve => require(['@/views/rivateKeyManagement/rivateKeyManagement'], resolve);
const errorLogExport = resolve => require(['@/views/errorLogExport/errorLogExport'], resolve);
const hostMetric = resolve => require(['@/views/hostMetric'], resolve);
const nodesMetric = resolve => require(['@/views/nodesMetric'], resolve);
const accountInfo = resolve => require(['@/views/account/accountInfo'], resolve);
const transactionCharts = resolve => require(['@/views/transactionCharts/transactionCharts'], resolve);
const unusualUser = resolve => require(['@/views/unusualUser/unusualUser'], resolve);
const unusualContract = resolve => require(['@/views/unusualContract/unusualContract'], resolve);
const authorManagement = resolve => require(['@/views/authorManagement'], resolve); 
const certificate = resolve => require(['@/views/certificate'], resolve); 
const permission = resolve => require(['@/views/permission'], resolve);
const configManagement = resolve => require(['@/views/configManagement'], resolve);
const cnsManagement = resolve => require(['@/views/cnsManagement'], resolve);
const CRUDServiceManagement = resolve => require(['@/views/CRUDServiceManagement'], resolve);
const emailAlarm = resolve => require(['@/views/alarm/emailAlarm'], resolve); 
const emailAlarmType = resolve => require(['@/views/alarm/emailAlarmType'], resolve); 
Vue.use(Router);
const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/login',
        name: 'login',
        component: resolve => require(['@/views/login/login'], resolve),
    },
    {
        path: '/main',
        name: 'main',
        // redirect: '/home',
        leaf: true,
        nameKey: "dataOverview",    
        menuShow: true,
        iconCls: 'wbs-icon-gailan sidebar-icon',
        component: main,
        children: [
            {
                path: '/home', component: home, name: '数据概览',nameKey: "dataOverview", menuShow: true, meta: { requireAuth: true }
            }
        ]
    },
    {
        path: '/',
        component: main,
        name: '区块浏览',
        nameKey: "blockBrowsing",
        menuShow: false,
        iconCls: 'wbs-icon-overview sidebar-icon',
        children: [
            { path: '/blockInfo', component: blockInfo, name: '区块信息',nameKey: "blockTitle", menuShow: true, meta: { requireAuth: true } },
            { path: '/transactionInfo', component: transactionInfo, name: '交易信息',nameKey: "transactionInfo", menuShow: true, meta: { requireAuth: true } },
        ]
    },
    {
        path: '/',
        component: main,
        name: '节点管理',
        nameKey: "nodeTitle",
        leaf: true,
        menuShow: true,
        iconCls: 'wbs-icon-group sidebar-icon',
        children: [
            { path: '/front', component: front, name: '节点管理', nameKey: "nodeTitle", menuShow: true, meta: { requireAuth: true } },
            { path: '/hostDetail', component: hostDetail, name: '节点详情', nameKey: "nodeDetail", menuShow: true, meta: { requireAuth: true } }
        ]
    },
    {
        path: '/',
        component: main,
        name: '合约管理',
        nameKey: "contractTitle",
        // leaf: true,
        menuShow: true,
        iconCls: 'wbs-icon-heyueguanli sidebar-icon',
        children: [
            { path: '/contract', component: contract, name: '合约IDE', nameKey: "contractIDE", menuShow: true, meta: { requireAuth: true } },
            { path: '/contractList', component: oldContract, name: '合约列表', nameKey: "contractList", menuShow: true, meta: { requireAuth: true } },
            { path: '/cnsManagement', component: cnsManagement, name: 'CNS查询', nameKey: "CNSmanager", menuShow: true, meta: { requireAuth: true } },
            { path: '/CRUDServiceManagement', component: CRUDServiceManagement, name: 'CRUD', nameKey: "CRUDServiceManagement", menuShow: true, meta: { requireAuth: true } }
        ]
    },
    {
        path: '/',
        component: main,
        name: '私钥管理',
        nameKey: "PrivateKey",
        leaf: true,
        menuShow: true,
        iconCls: 'wbs-icon-lock sidebar-icon',
        children: [
            { path: '/privateKeyManagement', component: rivateKeyManagement, name: '私钥管理', nameKey: "PrivateKey", menuShow: true, meta: { requireAuth: true } }
        ]
    },
    {
        path: '/',
        component: main,
        name: '系统管理',
        nameKey: "systemManager",
        menuShow: true,
        iconCls: 'wbs-icon-xitongguanli sidebar-icon',
        children: [
            // { path: '/authorManagement', component: authorManagement, name: '权限管理', menuShow: true, meta: { requireAuth: true } },
            { path: '/permission', component: permission, name: '权限管理', nameKey: "permission", menuShow: true, meta: { requireAuth: true } }, 
            { path: '/configManagement', component: configManagement, name: '配置管理', nameKey: "configManager", menuShow: true, meta: { requireAuth: true } },
            { path: '/certificate', component: certificate, name: '证书管理', nameKey: "certificate", menuShow: true, meta: { requireAuth: true } }
            
        ]
    },
    {
        path: '/',
        component: main,
        name: '系统监控',
        nameKey: "systemMonitor",
        menuShow: true,
        iconCls: 'wbs-icon-monitor sidebar-icon',
        children: [
            // { path: '/errorLogExport', component: errorLogExport, name: '错误日志', menuShow: true, meta: { requireAuth: true } },
            { path: '/nodesMetric', component: nodesMetric, name: '节点监控', nameKey: "nodesMonitor", menuShow: true, meta: { requireAuth: false } },
            { path: '/hostMetric', component: hostMetric, name: '主机监控', nameKey: "hostMonitor", menuShow: true, meta: { requireAuth: false } },
            { path: '/emailAlarm', component: emailAlarm, name: '邮件告警配置', nameKey: "emailAlarm", menuShow: true, meta: { requireAuth: false } },
            { path: '/emailAlarmType', component: emailAlarmType, name: '告警类型配置', nameKey: "emailAlarmType", menuShow: true, meta: { requireAuth: false } },
        ]
    },
    {
        path: '/',
        component: main,
        name: '交易审计',
        nameKey: "transactionAudit",
        menuShow: true,
        iconCls: 'wbs-icon-regulatory sidebar-icon',
        children: [
            { path: '/transactionCharts', component: transactionCharts, name: '用户交易', nameKey: "userTransaction", menuShow: true, meta: { requireAuth: true } },
            { path: '/unusualUser', component: unusualUser, name: '异常用户', nameKey: "unusualUser", menuShow: true, meta: { requireAuth: true } },
            { path: '/unusualContract', component: unusualContract, name: '异常合约', nameKey: "unusualContract", menuShow: true, meta: { requireAuth: true } }
        ]
    }, 
    {
        path: '/',
        component: main,
        name: '帐号管理',
        nameKey: "accountManagement",
        leaf: true,
        menuShow: false,
        iconCls: 'wbs-icon-key sidebar-icon',
        children: [
            { path: '/accountInfo', component: accountInfo, name: '帐号管理', nameKey: "accountManagement", menuShow: true, meta: { requireAuth: true } }
        ]
    },
    // {
    //     path: '/',
    //     component: main,
    //     name: '告警配置',
    //     menuShow: true,
    //     iconCls: 'wbs-icon-monitor sidebar-icon',
    //     children: [
    //         { path: '/emailAlarm', component: emailAlarm, name: '邮件告警配置', menuShow: true, meta: { requireAuth: false } },
    //         { path: '/emailAlarmType', component: emailAlarmType, name: '告警类型配置', menuShow: true, meta: { requireAuth: false } },
    //     ]
    // },
    
]
const router = new Router({
    routes
});
router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if (isChunkLoadFailed) {
        router.go(0);
        router.replace(targetPath);
    }
});

export default router
