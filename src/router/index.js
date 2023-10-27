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
import Vue from "vue";
import Router from "vue-router";
import { getCookie } from "@/util/util";
const main = resolve => require(["@/views/index/index"], resolve);
const home = resolve => require(["@/views/home/home"], resolve);
const blockInfo = resolve => require(["@/views/blockInfo/blockInfo"], resolve);
const bfs = resolve => require(["@/views/bfs/index"], resolve);
const transactionInfo = resolve =>
  require(["@/views/transactionInfo/transactionInfo"], resolve);
const front = resolve => require(["@/views/front/index"], resolve);
const chain = resolve => require(["@/views/front/chain"], resolve);
const host = resolve => require(["@/views/front/host"], resolve);
const node = resolve => require(["@/views/front/node"], resolve);
const newFront = resolve => require(["@/views/front/front"], resolve);
const hostDetail = resolve =>
  require(["@/views/front/components/hostDetail"], resolve);
const contract = resolve => require(["@/views/chaincode/contract"], resolve);
const oldContract = resolve => require(["@/views/chaincode/index"], resolve);
const privateKeyManagement = resolve =>
  require(["@/views/privateKeyManagement/index"], resolve);
const hostMetric = resolve => require(["@/views/hostMetric"], resolve);
const nodesMetric = resolve => require(["@/views/nodesMetric"], resolve);
const accountInfo = resolve =>
  require(["@/views/account/accountInfo"], resolve);
const transactionCharts = resolve =>
  require(["@/views/transactionCharts/transactionCharts"], resolve);
const unusualUser = resolve =>
  require(["@/views/unusualUser/unusualUser"], resolve);
const unusualContract = resolve =>
  require(["@/views/unusualContract/unusualContract"], resolve);
const certificate = resolve => require(["@/views/certificate"], resolve);
const permission = resolve => require(["@/views/permission"], resolve);
const configManagement = resolve =>
  require(["@/views/configManagement"], resolve);
const cnsManagement = resolve => require(["@/views/cnsManagement"], resolve);
const CRUDServiceManagement = resolve =>
  require(["@/views/CRUDServiceManagement"], resolve);
const emailAlarm = resolve => require(["@/views/alarm/emailAlarm"], resolve);
const emailAlarmType = resolve =>
  require(["@/views/alarm/emailAlarmType"], resolve);
const contractEvent = resolve => require(["@/views/contractEvent"], resolve);
const blockEvent = resolve => require(["@/views/blockEvent"], resolve);
const groupManagement = resolve =>
  require(["@/views/groupManagement"], resolve);
const abiList = resolve => require(["@/views/abiList"], resolve);
const parseAbi = resolve => require(["@/views/parseAbi"], resolve);
const committeeMgmt = resolve => require(["@/views/committeeMgmt"], resolve);
const developerMgmt = resolve => require(["@/views/developerMgmt"], resolve);
const newPermission = resolve =>
  require(["@/views/permission/newPermission"], resolve);
const eventCheck = resolve => require(["@/views/eventCheck"], resolve);
const contractWarehouse = resolve =>
  require(["@/views/contractWarehouse"], resolve);
const onlineTools = resolve => require(["@/views/onlineTools"], resolve);
const appManagement = resolve => require(["@/views/appManagement"], resolve);
const toolsContract = resolve => require(["@/views/toolsContract"], resolve);
const bigScreen = resolve => require(["@/views/bigScreen/index"], resolve);
const register = resolve => require(["@/views/register/register"], resolve);
Vue.use(Router);
const routes = [
  {
    path: "/",
    nameKey: "main",
    redirect: "/main"
  },
  // {
  //   path: "/login",
  //   nameKey: "login",
  //   name: "login",
  //   component: resolve => require(["@/views/login/login"], resolve)
  // },
  {
    path: "/register",
    name: "register",
    nameKey: "register",
    component:  resolve => require(["@/views/register/register"], resolve)
  },
  {
    path: "/bigScreen",
    nameKey: "bigScreen",
    name: "bigScreen",
    component: bigScreen,
    menuShow: false,
    leaf: false,
    iconCls: "wbs-icon-overview sidebar-icon"
    // children: [
    //     {
    //         path: '/bigScreen', component: bigScreen, name: '数据大屏', nameKey: "bigScreen", menuShow: false, meta: { requireAuth: true }
    //     }
    // ]
  },
  {
    path: "/main",
    name: "main",
    // redirect: '/home',
    leaf: true,
    nameKey: "dataOverview",
    menuShow: true,
    iconCls: "wbs-icon-gailan sidebar-icon",
    component: main,
    children: [
      {
        path: "/home",
        component: home,
        name: "数据概览",
        nameKey: "dataOverview",
        menuShow: true,
        meta: { requireAuth: true }
      }
    ]
  },
  {
    path: "/",
    component: main,
    name: "区块浏览",
    nameKey: "blockBrowsing",
    menuShow: false,
    iconCls: "wbs-icon-overview sidebar-icon",
    children: [
      {
        path: "/blockInfo",
        component: blockInfo,
        name: "区块信息",
        nameKey: "blockTitle",
        menuShow: true,
        meta: { requireAuth: true }
      },
      {
        path: "/transactionInfo",
        component: transactionInfo,
        name: "交易信息",
        nameKey: "transactionInfo",
        menuShow: true,
        meta: { requireAuth: true }
      }
    ]
  },
  {
    path: "/",
    component: main,
    name: "链管理",
    nameKey: "chainTitle",
    leaf: false,
    menuShow: true,
    iconCls: "wbs-icon-group sidebar-icon",
    children: [
      {
        path: "/host",
        component: host,
        name: "主机管理",
        nameKey: "hostMgrTitle",
        menuShow: true,
        meta: { requireAuth: true }
      },
      {
        path: "/front",
        component: front,
        name: "节点管理",
        nameKey: "nodeTitle",
        menuShow: true,
        meta: { requireAuth: true }
      },
      {
        path: "/node/:id",
        component: node,
        name: "节点管理",
        nameKey: "nodeTitle",
        menuShow: false,
        meta: { requireAuth: true }
      },
      {
        path: "/newNode",
        component: newFront,
        name: "节点管理",
        nameKey: "nodeTitle",
        menuShow: false,
        meta: { requireAuth: true }
      },
      {
        path: "/hostDetail",
        component: hostDetail,
        name: "节点详情",
        nameKey: "nodeDetail",
        leaf: false,
        menuShow: false,
        meta: { requireAuth: true }
      },
      {
        path: "/chain",
        component: chain,
        name: "链管理",
        nameKey: "chainTitle",
        menuShow: true,
        meta: { requireAuth: true }
      },
    ]
  },
  {
    path: "/",
    component: main,
    name: "群组管理",
    nameKey: "groupManagement",
    leaf: true,
    menuShow: false,
    iconCls: "wbs-icon-group sidebar-icon",
    children: [
      {
        path: "/groupManagement",
        component: groupManagement,
        name: "群组管理",
        nameKey: "groupManagement",
        menuShow: true,
        meta: { requireAuth: true }
      }
    ]
  },
  {
    path: "/",
    component: main,
    name: "合约管理",
    nameKey: "contractTitle",
    leaf: false,
    menuShow: true,
    iconCls: "wbs-icon-heyueguanli sidebar-icon",
    children: [
      {
        path: "/contract/ide",
        component: contract,
        name: "合约IDE",
        nameKey: "contractIDE",
        menuShow: true,
        meta: { requireAuth: true }
      },
      {
        path: "/contract/List",
        component: oldContract,
        name: "合约列表",
        nameKey: "contractList",
        menuShow: true,
        meta: { requireAuth: true }
      },
      {
        path: "/contract/Warehouse",
        component: contractWarehouse,
        name: "合约仓库",
        nameKey: "contractWarehouse",
        menuShow: true,
        meta: { requireAuth: false }
      },
      // { path: '/abiList', component: abiList, name: 'Abi列表', nameKey: "abiList", menuShow: false, meta: { requireAuth: true } },
      {
        path: "/contract/parseAbi",
        component: parseAbi,
        name: "解析Abi",
        nameKey: "parseAbi",
        menuShow: false,
        meta: { requireAuth: true }
      },
      {
        path: "/contract/cnsManagement",
        component: cnsManagement,
        name: "CNS查询",
        nameKey: "CNSmanager",
        menuShow: true,
        meta: { requireAuth: true }
      },
      {
        path: "/contract/CRUDServiceManagement",
        component: CRUDServiceManagement,
        name: "CRUD",
        nameKey: "CRUDServiceManagement",
        menuShow: false,
        meta: { requireAuth: true }
      },
      {
        path: "/contract/eventCheck",
        component: eventCheck,
        name: "Event查看",
        nameKey: "checkEvent",
        menuShow: true,
        meta: { requireAuth: false }
      },
      {
        path: "/contract/BFS",
        component: bfs,
        name: "BFS",
        nameKey: "BFS",
        menuShow: true,
        meta: { requireAuth: false }
      },
      // { path: '/onlineTools', component: onlineTools, name: '在线工具', enName: 'onlineTools', menuShow: true, meta: { requireAuth: false } },
      {
        path: "/toolsContract",
        component: toolsContract,
        name: "工具合约",
        nameKey: "toolsContract",
        menuShow: false,
        meta: { requireAuth: false }
      }
    ]
  },
  {
    path: "/",
    component: main,
    name: "私钥管理",
    nameKey: "PrivateKey",
    leaf: true,
    menuShow: true,
    iconCls: "wbs-icon-lock sidebar-icon",
    children: [
      {
        path: "/privateKeyManagement",
        component: privateKeyManagement,
        name: "私钥管理",
        nameKey: "PrivateKey",
        menuShow: true,
        meta: { requireAuth: true }
      }
    ]
  },

  {
    path: "/",
    component: main,
    name: "系统管理",
    nameKey: "systemManager",
    leaf: false,
    menuShow: false,
    iconCls: "wbs-icon-xitongguanli sidebar-icon",
    children: [
      {
        path: "/sys/newPermission",
        component: newPermission,
        name: "权限管理",
        nameKey: "newPermission",
        menuShow: true,
        meta: { requireAuth: true }
      },
      // { path: '/permission', component: permission, name: '权限管理', nameKey: "permission", menuShow: true, meta: { requireAuth: true } },
      {
        path: "/sys/configManagement",
        component: configManagement,
        name: "配置管理",
        nameKey: "configManager",
        menuShow: true,
        meta: { requireAuth: true }
      },
      {
        path: "/sys/certificate",
        component: certificate,
        name: "证书管理",
        nameKey: "certificate",
        menuShow: true,
        meta: { requireAuth: true }
      }
      // { path: '/committeeMgmt', component: committeeMgmt, name: '委员会管理', nameKey: "committeeMgmt", menuShow: true, meta: { requireAuth: true } },
      // { path: '/developerMgmt', component: developerMgmt, name: '运维账号管理', nameKey: "developerMgmt", menuShow: true, meta: { requireAuth: true } },
    ]
  },
  {
    path: "/",
    component: main,
    name: "应用管理",
    nameKey: "appManagement",
    leaf: true,
    menuShow: true,
    iconCls: "wbs-icon-deploy sidebar-icon",
    children: [
      {
        path: "/appManagement",
        component: appManagement,
        name: "应用管理",
        nameKey: "appManagement",
        menuShow: true,
        meta: { requireAuth: false }
      }
    ]
  },
  {
    path: "/",
    component: main,
    name: "系统监控",
    nameKey: "systemMonitor",
    leaf: false,
    menuShow: true,
    iconCls: "wbs-icon-monitor sidebar-icon",
    children: [
      {
        path: "/monitor/nodesMetric",
        component: nodesMetric,
        name: "节点监控",
        nameKey: "nodesMonitor",
        menuShow: true,
        meta: { requireAuth: false }
      },
      {
        path: "/monitor/hostMetric",
        component: hostMetric,
        name: "主机监控",
        nameKey: "hostMonitor",
        menuShow: false,
        meta: { requireAuth: false }
      },
      {
        path: "/monitor/emailAlarm",
        component: emailAlarm,
        name: "邮件告警配置",
        nameKey: "emailAlarm",
        menuShow: true,
        meta: { requireAuth: false }
      },
      {
        path: "/monitor/emailAlarmType",
        component: emailAlarmType,
        name: "告警类型配置",
        nameKey: "emailAlarmType",
        menuShow: true,
        meta: { requireAuth: false }
      }
    ]
  },
  {
    path: "/",
    component: main,
    name: "交易审计",
    nameKey: "transactionAudit",
    leaf: false,
    menuShow: true,
    iconCls: "wbs-icon-regulatory sidebar-icon",
    children: [
      {
        path: "/audit/transactionCharts",
        component: transactionCharts,
        name: "用户交易",
        nameKey: "userTransaction",
        menuShow: true,
        meta: { requireAuth: true }
      },
      {
        path: "/audit/unusualUser",
        component: unusualUser,
        name: "异常用户",
        nameKey: "unusualUser",
        menuShow: true,
        meta: { requireAuth: true }
      },
      {
        path: "/audit/unusualContract",
        component: unusualContract,
        name: "异常合约",
        nameKey: "unusualContract",
        menuShow: true,
        meta: { requireAuth: true }
      }
      // { path: '/externalAccount', component: externalAccount, name: '链上用户', nameKey: "externalAccount", menuShow: true, meta: { requireAuth: false } },
      // { path: '/externalContract', component: externalContract, name: '链上合约', nameKey: "externalContract", menuShow: true, meta: { requireAuth: false } },
    ]
  },
  {
    path: "/",
    component: main,
    name: "订阅事件",
    nameKey: "subscribeEvent",
    leaf: false,
    menuShow: true,
    iconCls: "wbs-icon-dingyue sidebar-icon",
    children: [
      {
        path: "/subscribe/blockEvent",
        component: blockEvent,
        name: "出块事件",
        nameKey: "blockEvent",
        menuShow: true,
        meta: { requireAuth: true }
      },
      {
        path: "/subscribe/contractEvent",
        component: contractEvent,
        name: "合约Event事件",
        nameKey: "contractEvent",
        menuShow: true,
        meta: { requireAuth: true }
      }
    ]
  },
  {
    path: "/",
    component: main,
    name: "帐号管理",
    nameKey: "accountManagement",
    leaf: true,
    menuShow: false,
    iconCls: "wbs-icon-key sidebar-icon",
    children: [
      {
        path: "/accountInfo",
        component: accountInfo,
        name: "帐号管理",
        nameKey: "accountManagement",
        menuShow: true,
        meta: { requireAuth: true }
      }
    ]
  }
];

const base = window.__POWERED_BY_QIANKUN__ ? '/bcos3' : '/'
const router = new Router({
  base,
  mode: 'history',
  routes
});
/*
router.afterEach((to, from, next) => {
  const state = {
    ...history.state,
    current: base + to.fullPath
  }
  history.replaceState(state, '', window.location.href)
})
*/
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

export default router;
