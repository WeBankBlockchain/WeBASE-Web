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
import url from './url'
import { post, get, patch, put, deleted } from './http'
import { reviseParam } from './util'
import qs from 'qs'

//login
export function login(data, code, token) {
    return post({
        url: `${url.ORG_LIST}/account/login?checkCode=${code}`,
        // url: `${url.ORG_LIST}/account/login`,
        method: 'post',
        data: qs.stringify(data),
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'token': token
        }
    })
}
//out login
export function loginOut() {
    return get({
        url: `${url.ORG_LIST}/account/logout`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//
export function encryption() {
    return get({
        url: `${url.ORG_LIST}/encrypt`,
        method: 'get',
        // headers: {
        //     AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        // }
    })
}
//init change passWord
export function resetPassword(data) {
    return put({
        url: `${url.ORG_LIST}/account/passwordUpdate`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**daily transaction data */
export function getChartData(data) {
    return get({
        url: `${url.ORG_LIST}/group/transDaily/${data}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Chain overview */
export function getNetworkStatistics(data) {
    return get({
        url: `${url.ORG_LIST}/group/general/${data}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Block list */
export function getBlockPage(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/block/blockList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Node list */
export function getNodeList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/node/nodeList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Error log query node*/
export function getErrorNodeList(data) {
    return get({
        url: `${url.ORG_LIST}/node/nodeList/${data}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**Organization list */
export function getOrgList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/organization/organizationList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Contract list */
export function getContractList(data) {
    return get({
        url: `${url.ORG_LIST}/contract/contractList`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Add node */
export function addnodes(data) {
    return post({
        url: `${url.ORG_LIST}/node/nodeInfo`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Increase organization */
export function addgroup(data) {
    return post({
        url: `${url.ORG_LIST}/organization/organizationInfo`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**add contract */
export function saveChaincode(data) {
    return post({
        url: `${url.ORG_LIST}/contract/save`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Compile contract */
export function setCompile(data) {
    return post({
        url: `${url.ORG_LIST}/contract/compile`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/* Background compilation*/
export function backgroundCompile(data) {
    return post({
        url: `${url.ORG_LIST}/contract/comtractCompile `,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Deployment contract */
export function getDeployStatus(data) {
    return post({
        url: `${url.ORG_LIST}/contract/deploy`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Delete contract */
export function deleteCode(data, list) {
    const params = reviseParam(data, list);
    return deleted({
        url: `${url.ORG_LIST}/contract/${params.str}`,
        method: 'delete',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Blockchain list */
export function networkList() {
    return get({
        url: `${url.ORG_LIST}/network/all`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Modify contract */
export function editChain(data) {
    return put({
        url: `${url.ORG_LIST}/contract/contractInfo`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Public key or private key user list */
export function getUserList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/user/userList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**add users */
export function getAddUser(data) {
    return post({
        url: `${url.ORG_LIST}/user/userInfo`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//import privateKey 
export function queryImportPrivateKey(data) {
    return post({
        url: `${url.ORG_LIST}/user/import`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//import pem privateKey 
export function ImportPemPrivateKey(data) {
    return post({
        url: `${url.ORG_LIST}/user/importPem`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//import p12 privateKey 
export function ImportP12PrivateKey(data) {
    return post({
        url: `${url.ORG_LIST}/user/importP12`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
            'Content-Type': "multipart/form-data"
        }

    })
}
/**Modify user description */
export function getUserDescription(data) {
    return put({
        url: `${url.ORG_LIST}/user/userInfo`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Send transaction */
export function sendTransation(data) {
    return post({
        url: `${url.ORG_LIST}/contract/transaction`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Transaction receipt based on transaction hash*/
export function getTransactionReceipt(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/transaction/transactionReceipt/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Get transaction information based on transaction hash*/
export function hashTransactionInfo(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/transaction/transInfo/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** creat account*/
export function creatAccountInfo(data) {
    return post({
        url: `${url.ORG_LIST}/account/accountInfo`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Change account information*/
export function modifyAccountInfo(data) {
    return put({
        url: `${url.ORG_LIST}/account/accountInfo`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** deleteAccount*/
export function deleteAccountInfo(data) {
    return deleted({
        url: `${url.ORG_LIST}/account/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Query role list*/
export function roleList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/role/roleList${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**Query account list*/
export function accountList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/account/accountList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Query error log list*/
export function errorLogList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/nodeLog/nodeLogList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Bind user*/
export function bindUser(data) {
    return post({
        url: `${url.ORG_LIST}/user/bind`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** Regulate user transaction information*/
export function monitorTransactionInfo(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/monitor/transList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** Transaction list*/
export function getTransactionList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/transaction/transList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Supervised user list*/
export function monitorUserList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/monitor/userList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**
 * 监管用户接口列表
 * @param groupId
 * @param ?userName
 * */
export function monitorUserInterfaceList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/monitor/interfaceList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**
 * 监管异常用户信息列表
 * @param groupId
 * @param pageNumber
 * @param pageSize
 * @param ?userName
 * */
export function unusualUserList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/monitor/unusualUserList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Regulatory abnormal contract information*/
export function unusualContractList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/monitor/unusualContractList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** bytecode*/
export function getByteCode(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/web3/code/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** Query block details based on block height*/
export function getBlockDetail(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/block/blockByNumber/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** delete nodes*/
export function deleteNodes(data) {
    return deleted({
        url: `${url.ORG_LIST}/node/nodeInfo/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**  Collection node metric*/
export function metricInfo(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/performance/ratio/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Machine configuration information*/
export function nodesHostInfo(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/performance/config/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function nodesHealth(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/chain/mointorInfo/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function addFront(data) {
    return get({
        url: `${url.ORG_LIST}/front/new`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function getGroups() {
    return get({
        url: `${url.ORG_LIST}/group/all`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function getFronts(data) {
    return get({
        url: `${url.ORG_LIST}/front/find`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function deleteFront(data) {
    return deleted({
        url: `${url.ORG_LIST}/front/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function addFunctionAbi(data) {
    return post({
        url: `${url.ORG_LIST}/method/add`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function getFunctionAbi(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/method/findById/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function getAbi(data) {
    // const params = reviseParam(data, list);
    return post({
        url: `${url.ORG_LIST}/contract/findByPartOfBytecodeBin`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function getPictureCheckCode() {
    return get({
        url: `${url.ORG_LIST}/account/pictureCheckCode`,
        method: 'get'
    })
}

// permission post
export function postPermission(data) {
    return post({
        url: `${url.ORG_LIST}/permission`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// permission delete
export function deletePermission(data) {
    return deleted({
        url: `${url.ORG_LIST}/permission`,
        method: 'delete',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// permission get
export function getPermission(data) {
    return get({
        url: `${url.ORG_LIST}/permission`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// permission  full get
export function getPermissionFull(data) {
    return get({
        url: `${url.ORG_LIST}/permission/full`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// consensus node id
export function consensusNodeId(data) {
    return post({
        url: `${url.ORG_LIST}/precompiled/consensus`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// consensus node id list 
export function getConsensusNodeId(data) {
    return get({
        url: `${url.ORG_LIST}/precompiled/consensus/list`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// sys config 
export function querySysConfig(data) {
    return post({
        url: `${url.ORG_LIST}/sys/config`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// sys config list
export function querySysConfigList(data) {
    return get({
        url: `${url.ORG_LIST}/sys/config/list`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// cns list
export function queryCnsList(data) {
    return get({
        url: `${url.ORG_LIST}/precompiled/cns/list`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

// CRUD service
export function queryCrudService(data) {
    return post({
        url: `${url.ORG_LIST}/precompiled/crud`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//permission/sorted get批量权限
export function getPermissionSorted(list) {
    return get({
        url: `${url.ORG_LIST}/permission/sorted`,
        method: 'get',
        params: list,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//permission/sorted post添加权限

export function postPermissionSorted(data) {
    return post({
        url: `${url.ORG_LIST}/permission/sorted`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//上传证书文件 post：/cert
export function importCert(data) {
    return post({
        url: `${url.ORG_LIST}/cert`,
        method: 'post',
        data: data,
        // responseType: 'blob/json',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// 导出证书文件list get: /cert
export function exportCert(list) {
    return get({
        url: `${url.ORG_LIST}/cert`,
        method: 'get',
        params: list,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// get证书文件list get: /cert/list
export function certList(list) {
    return get({
        url: `${url.ORG_LIST}/cert/list`,
        method: 'get',
        params: list,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// delete 证书 /cert 
export function deleteCert(data) {
    return deleted({
        url: `${url.ORG_LIST}/cert`,
        method: 'delete',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// put 告警邮箱 配置 
export function changeEmailConfig(data) {
    return put({
        url: `${url.ORG_LIST}/mailServer/config`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// get 告警邮箱 配置 
export function getEmailList() {
    return get({
        url: `${url.ORG_LIST}/mailServer/config/list`,
        method: 'get',
        // data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// get all 告警 配置 
export function getAlarmList() {
    return get({
        url: `${url.ORG_LIST}/alert/list`,
        method: 'get',
        // data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// get 单个 告警 配置 
export function getAlarm(id) {
    return get({
        url: `${url.ORG_LIST}/alert/${id}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

// put 单个 告警 配置 
export function changeAlarm(data) {
    return put({
        url: `${url.ORG_LIST}/alert`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

// put 启动 告警 配置 
export function startAlarm(data) {
    return put({
        url: `${url.ORG_LIST}/alert/toggle`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//test 邮箱 
export function testEmail(list, data) {
    return post({
        url: `${url.ORG_LIST}/alert/mail/test/${list}`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//get  alarm log 
export function getAlarmLogs(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/log/list/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//put  alarm log 
export function changeAlarmLog(data) {
    return put({
        url: `${url.ORG_LIST}/log`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//
export function blockEventList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/event/newBlockEvent/list/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}


export function contractEventList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/event/contractEvent/list/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

// 新增群组
export function createGroup(data,nodeId) {
    return post({
        url: `${url.ORG_LIST}/group/generate/${nodeId}`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// 批量启动group
export function batchStartGroup(data) {
    return post({
        url: `${url.ORG_LIST}/group/batchStart`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//刷新动态添加的群组
export function getUpdateGroup() {
    return get({
        url: `${url.ORG_LIST}/group/update`,
        method: 'GET',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//增删改查群组
export function crudGroup(data, nodeId) {
    return post({
        url: `${url.ORG_LIST}/group/operate/${nodeId}`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//all group
export function getGroupsInvalidIncluded(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/group/all/invalidIncluded/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//单个节点获取所有群组状态
export function groupStatus(data) {
    return post({
        url: `${url.ORG_LIST}/group/queryGroupStatus/list`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function deleteGroupData(groupId) {
    return deleted({
        url: `${url.ORG_LIST}/group/${groupId}`,
        method: 'delete',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//abi 列表
export function getAbiList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/abi/list/${params.str}`,
        method: 'GET',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}


export function getAbiInfo(abiId) {
    return get({
        url: `${url.ORG_LIST}/abi/${abiId}`,
        method: 'GET',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function importAbi(data) {
    return post({
        url: `${url.ORG_LIST}/abi`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//update imported abi
export function updateImportAbi(data) {
    return put({
        url: `${url.ORG_LIST}/abi`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function deleteImportAbi(data) {
    return deleted({
        url: `${url.ORG_LIST}/abi/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//p2p连接的节点 
export function p2pNodeList(groupId) {
    return get({
        url: `${url.ORG_LIST}/node/nodeIdList/${groupId}`,
        method: 'GET',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}


//查询群组状态异常（4）
export function groupStatus4(groupStatus) {
    return get({
        url: `${url.ORG_LIST}/group/all/${groupStatus}`,
        method: 'GET',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//获取 Docker 镜像版本
export function getConfigList (data) {
    return get ({
        url: `${url.ORG_LIST}/config/list`,
        method: "get",
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//部署接口
export function deployConfig (data) {
    return post ({
        url: `${url.ORG_LIST}/deploy/init`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//新增节点
export function newNode (data) {
    return post ({
        url: `${url.ORG_LIST}/node/add`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//部署新增节点
export function addNode (data) {
    return post ({
        url: `${url.ORG_LIST}/deploy/node/add`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//节点升级
export function upgradeNode (data) {
    return post ({
        url: `${url.ORG_LIST}/deploy/upgrade`,
        method: "post",
        data: data,
         
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//删除链
export function deleteChain () {
    return deleted ({
        url: `${url.ORG_LIST}/deploy/delete`,
        method: "delete",
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//删除节点
export function deleteNode(data) {
    return post ({
        url: `${url.ORG_LIST}/deploy/node/delete`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//停止节点
export function stopNode (data) {
    return post({
        url: `${url.ORG_LIST}/deploy/node/stop`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//启动节点
export function startNode (data) {
    return post({
        url: `${url.ORG_LIST}/deploy/node/start`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//链信息
export function getChainInfo () {
    return get ({
        url: `${url.ORG_LIST}/deploy/chain/info`,
        method: "get",
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//获取链的部署进度
export function getProgress () {
    return get ({
        url: `${url.ORG_LIST}/deploy/progress`,
        method: "get",
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//获取链部署方式
export function getDeployType () {
    return get ({
        url: `${url.ORG_LIST}/deploy/type`,
        methods: "get",
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//获取链版本
export function getVersion () {
    return get ({
        url: `${url.ORG_LIST}/version`,
        methods: "get",
        responseType: "text",
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}



