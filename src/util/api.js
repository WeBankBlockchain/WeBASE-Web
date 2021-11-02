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
import { debug } from 'request'

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
        url: `${url.ORG_LIST}/config/encrypt`,
        method: 'get'
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
//init changeDescription
export function changeDescription(data) {
    return put({
        url: `${url.ORG_LIST}/group/description `,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//
export function putCityIpAengcy(data) {
    return put({
        url: `${url.ORG_LIST}/node/description`,
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
/** nodeCity query node*/
export function getCityList(data) {
    return get({
        url: `${url.ORG_LIST}/node/city/list`,
        method: 'get',
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

// search contract list for contract path
export function searchContract(data) {
    return get({
        url: `${url.ORG_LIST}/contract/contractList/multiPath`,
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
/**get nodeInfo */
export function getNodeInfo(groupId,nodeId) {
    return get({
        url: `${url.ORG_LIST}/node/nodeInfo/${groupId}/${nodeId}`,
        method: 'get',
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
//export pem privateKey 
export function exportPemPrivateKey(data) {
    return post({
        url: `${url.ORG_LIST}/user/exportPem`,
        method: 'post',
        data: data,
        responseType: 'blob/application/json',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
        }
    })
}

//export p12 privateKey
export function exportP12PrivateKey(data) {
    return post({
        url: `${url.ORG_LIST}/user/exportP12`,
        method: 'post',
        data: data,
        responseType: 'blob',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
        }
    })
}
// /user/export / { userId }
//export tex privateKey
export function exportTxtPrivateKey(data) {
    return post({
        url: `${url.ORG_LIST}/user/export/${data}`,
        method: 'post',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
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
/**Modify user description */
export function bindPrivateKey(data) {
    return post({
        url: `${url.ORG_LIST}/user/bind/privateKey`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function bindPrivateKeyPm(data) {
    return post({
        url: `${url.ORG_LIST}/user/bind/privateKey/pem`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function bindPrivateKeyP12(data) {
    return post({
        url: `${url.ORG_LIST}/user/bind/privateKey/p12`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
            'Content-Type': "multipart/form-data"
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
/** 查询每日交易数据 */
export function getTransDaily(data, list) {
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
        url: `${url.ORG_LIST}/chain/monitorInfo/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function fetchNodeMonitor(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/stat`,
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
        url: `${url.ORG_LIST}/method/findById/${params.str.substr(0,12)}`,
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
export function createGroup(data, nodeId) {
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
        params: list,
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
export function getConfigList(data) {
    return get({
        url: `${url.ORG_LIST}/config/list`,
        method: "get",
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//鉴权是否启用接口，无需登录就可以访问
export function getConfigAuth() {
    return get({
        url: `${url.ORG_LIST}/config/auth`,
        method: "get",    
    })
}

//部署接口
export function deployConfig(data) {
    return post({
        url: `${url.ORG_LIST}/deploy/init`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//新增节点
export function newNode(data) {
    return post({
        url: `${url.ORG_LIST}/node/add`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//部署新增节点
export function addNode(data) {
    return post({
        url: `${url.ORG_LIST}/deploy/node/add`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//节点升级
export function upgradeNode(data) {
    return post({
        url: `${url.ORG_LIST}/deploy/upgrade`,
        method: "post",
        data: data,

        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//删除链
export function deleteChain() {
    return deleted({
        url: `${url.ORG_LIST}/deploy/delete`,
        method: "delete",
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//删除节点
export function deleteNode(data) {
    return post({
        url: `${url.ORG_LIST}/deploy/node/delete`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//停止节点
export function stopNode(data) {
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
export function startNode(data) {
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
export function getChainInfo() {
    return get({
        url: `${url.ORG_LIST}/deploy/chain/info`,
        method: "get",
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//获取链的部署进度
export function getProgress() {
    return get({
        url: `${url.ORG_LIST}/deploy/progress`,
        method: "get",
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//获取链部署方式
export function getDeployType() {
    return get({
        url: `${url.ORG_LIST}/deploy/type`,
        method: "get",
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//获取链版本
export function getVersion() {
    return get({
        url: `${url.ORG_LIST}/config/version`,
        method: "get",
        responseType: "text",
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//获取主机信息
export function getHostList() {
    return get({
        url: `${url.ORG_LIST}/deploy/host/list`,
        method: "get",
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//治理委员会list
export function committeeList(data) {
    return get({
        url: `${url.ORG_LIST}/governance/committee/list/sorted/`,
        method: "get",
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//合约连委员和部署者list
export function listManagerList(data) {
    return get({
        url: `${url.ORG_LIST}/contract/listManager/`+`${data.groupId}/`+`${data.contractAddress}`,
        method: "get",
        //params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//增加链治理委员
export function addCommittee(data) {
    return post({
        url: `${url.ORG_LIST}/governance/committee`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//删除链管理委员 
export function deleteCommittee(data) {
    return deleted({
        url: `${url.ORG_LIST}/governance/committee`,
        method: 'delete',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//查询阈值
export function getThreshold(data) {
    return get({
        url: `${url.ORG_LIST}/governance/threshold`,
        method: "get",
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//修改阈值
export function changeThreshold(data) {
    return put({
        url: `${url.ORG_LIST}/governance/threshold`,
        method: "put",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//获取链委员权重
export function getCommitteeWeight(data) {
    return get({
        url: `${url.ORG_LIST}/governance/committee/weight`,
        method: "get",
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//修改委员的权重
export function putCommitteeWeight(data) {
    console.log(data)
    return put({
        url: `${url.ORG_LIST}/governance/committee/weight`,
        method: "put",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//  投票  
export function voteRecord(data) {
    return get({
        url: `${url.ORG_LIST}/vote/record/list`,
        method: "get",
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//删除投票纪录
export function deleteVoteRecord(data) {
    return deleted({
        url: `${url.ORG_LIST}/vote/record/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//运维列表
export function operatorList(data) {
    return get({
        url: `${url.ORG_LIST}/governance/operator/list`,
        method: "get",
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//增加运维
export function addDevOps(data) {
    return post({
        url: `${url.ORG_LIST}/governance/operator`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//删除运维
export function deleteDevOps(data) {
    return deleted({
        url: `${url.ORG_LIST}/governance/operator`,
        method: 'delete',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//合约状态管理
export function getContractStatus(data) {
    return post({
        url: `${url.ORG_LIST}/precompiled/contract/status`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// 批量查询合约状态
export function getAllContractStatus(data) {
    return post({
        url: `${url.ORG_LIST}/precompiled/contract/status/list`,
        method: "post",
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//冻结/解冻合约历史记录
export function contractHistoryStatus(data) {
    return get({
        url: `${url.ORG_LIST}/contract/status/record/list`,
        method: "get",
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function deleteHandleHistory(data) {
    return deleted({
        url: `${url.ORG_LIST}/contract/status/record/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// contract path list
export function getContractPathList(data) {
    return post({
        url: `${url.ORG_LIST}/contract/contractPath/list/${data}`,
        method: 'post',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//add contract path
export function addContractPath(data) {
    return post({
        url: `${url.ORG_LIST}/contract/contractPath`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//delete contract path
export function deletePath(data) {
    return deleted({
        url: `${url.ORG_LIST}/contract/batch/path`,
        method: 'delete',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//event check 
export function checkEvent(data) {
    return post({
        url: `${url.ORG_LIST}/event/eventLogs/list`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function contractFindOne(contractId) {
    return get({
        url: `${url.ORG_LIST}/contract/findOne/${contractId}`,
        method: 'GET',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function contractListAll(data) {
    return get({
        url: `${url.ORG_LIST}/contract/contractList/all/light`,
        method: 'GET',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// 
export function listAddress(groupId) {
    return get({
        url: `${url.ORG_LIST}/event/listAddress/${groupId}`,
        method: 'GET',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function contractInfo(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/event/contractInfo/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function eventContractInfo(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/event/contractInfo/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

// 仓库列表
export function getContractStore() {
    return get({
        url: `${url.ORG_LIST}/warehouse/list`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function getContractStoreById(storeId) {
    return get({
        url: `${url.ORG_LIST}/contractStore/getContractStoreById/${storeId}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//
export function getContractItemById(contractId) {
    return get({
        url: `${url.ORG_LIST}/warehouse/${contractId}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function getContractFolderById(contractFolderId) {
    return get({
        url: `${url.ORG_LIST}/warehouse/folder/list/${contractFolderId}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// 通过文件ID获取文件下的合约
export function getContractItemByFolderId(data) {
    return get({
        url: `${url.ORG_LIST}/warehouse/item/list`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//获取合约仓库目录
export function getFolderItemListByStoreId(data) {
    return get({
        url: `${url.ORG_LIST}/warehouse/folder/list`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//在线工具
//生成sign
export function signHash(data) {
    return post({
        url: `${url.ORG_LIST}/transaction/signMessageHash`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function batchSaveContract(data) {
    return post({
        url: `${url.ORG_LIST}/contract/copy`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//注册cns
export function registerCns(data) {
    return post({
        url: `${url.ORG_LIST}/contract/registerCns`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//cns查询

export function findCnsInfo(data) {
    return post({
        url: `${url.ORG_LIST}/contract/findCns`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//localCns查询

export function findCnsInfoList(data) {
    return post({
        url: `${url.ORG_LIST}/contract/findCnsList`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**
 * @method 查询主机列表
 * @param none
 */
export function getHosts() {
    return get({
        url: `${url.ORG_LIST}/host/list`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * @method 添加主机
 * @param String sshIp; String sshUser; int sshPort ;init dockerPort ; String rootDir
 */
export function addHost(data) {
    return post({
        url: `${url.ORG_LIST}/host/add`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * @method 检测主机
 * @param Array hostIdList
 */
export function checkHost(data) {
    return post({
        url: `${url.ORG_LIST}/host/check`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * @method 检测nodemgr ansible
 */
export function getAnsible() {
    return post({
        url: `${url.ORG_LIST}/host/ansible`,
        method: 'post',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * @method 部署初始化
 * 
 */
export function initChainData(data) {
    return post({
        url: `${url.ORG_LIST}/deploy/init`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**
 * @method 部署初始化
 * 
 */
export function deployChainData(data) {
    return post({
        url: `${url.ORG_LIST}/deploy/config`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * @method 检测端口
 * 
 */
export function checkPort(data) {
    return post({
        url: `${url.ORG_LIST}/deploy/checkPort`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * @method  config
 *
 */
export function startChainData(data) {
    return get({
        url: `${url.ORG_LIST}/deploy/chain/start`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * @method ping主机
 * 
 */
export function pingHostData(data) {
    return post({
        url: `${url.ORG_LIST}/host/ping`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * @method 添加节点
 */
export function addChainNodeData(data) {
    return post({
        url: `${url.ORG_LIST}/deploy/node/add`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * @method  删除主机
 */
export function deleteHost(data) {
    return deleted({
        url: `${url.ORG_LIST}/host/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * @method 刷新front
 */
export function refreshFront() {
    return get({
        url: `${url.ORG_LIST}/front/refresh`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**
 * @method  查询初始化状态
 */
export function initCheck(data) {
    return post({
        url: `${url.ORG_LIST}/deploy/initCheck`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * @method  更新front状态
 */
export function getFrontStatus() {
    return get({
        url: `${url.ORG_LIST}/front/refresh/status`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * @method 重启节点
 */
export function restartNode(data) {
    return post({
        url: `${url.ORG_LIST}/deploy/node/stopForce`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}


/**
 * 链上用户
 * @params {*} data  {groupId} 、{pageNumber}、 {pageSize}
 */
export function externalAccountList(data) {
    const params = reviseParam(data, {});
    return post({
        url: `${url.ORG_LIST}/external/account/list/${params.str}`,
        method: 'get',
       headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}


// 导出cert sdk
export function exportCertSdk(frontId) {
    return get({
        url: `${url.ORG_LIST}/cert/sdk/zip/${frontId}`,
        method: 'get',
        responseType: 'blob',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}


// 导出cert sdk
export function getGroupName(groupId) {
    return get({
        url: `${url.ORG_LIST}/group/detail/${groupId}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}


/**
 * 链上合约的数据
 * @params {*} data  {groupId} 、{pageNumber}、 {pageSize}
 */
export function externalContractList(data) {
    const params = reviseParam(data, {});
    return post({
        url: `${url.ORG_LIST}/external/contract/list/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
        }
    })
}


/**
 * @method  保存应用
 */
export function fetchSaveApp(data) {
    return post({
        url: `${url.ORG_LIST}/app/save`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
        }
    })
}

/**

 * 链上所有合约abi
 * @params {*} {groupId} 、{pageNumber}、 {pageSize} ？ account
 */
export function getAllAbiList(data,list) {
    const params = reviseParam(data, list);
    return post({
        url: `${url.ORG_LIST}/abi/list/all/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
        }
    })
}
/**
 * @method  删除应用
 */
export function fetchDeleteApp(id) {
    return deleted({
        url: `${url.ORG_LIST}/app/${id}`,
        method: 'delete',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
        }
    })
}

/**
 * @method  应用列表
 */
export function fetchAppList(data) {
    return get({
        url: `${url.ORG_LIST}/app/list`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
        }
    })
}

/**
 * 链上所有合约地址
 * @params {*} {groupId} 、{pageNumber}、 {pageSize} ？ account
 */
export function getAllContractList(data,list) {
    const params = reviseParam(data, list);
    return post({
        url: `${url.ORG_LIST}/external/contract/list/all/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
        }
    })
}
/**
 * @method  获取服务信息
 */
export function fetchAppServerInfo(data) {
    return get({
        url: `${url.ORG_LIST}/config/ipPort`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * 链上所有用户地址
 * @params {*} {groupId} 、{pageNumber}、 {pageSize} ？ account
 */
export function getAllUserList(data,list) {
    const params = reviseParam(data, list);
    return post({
        url: `${url.ORG_LIST}/external/account/list/all/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
      AuthorizationToken: "Token " + localStorage.getItem("token") || "",
  }
})
}
/**
 * @method  查询已部署合约是否支持修改
 */
export function fetchIsDeployedModifyEnable() {
    return get({
        url: `${url.ORG_LIST}/config/isDeployedModifyEnable`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
        }
    })
}
/**
 * @method 导出合约项目
 */
export function exportJavaProject(data) {
    return get({
        url: `${url.ORG_LIST}/scaffold/export`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
        }
    })
}
/**
 * @method 获取channelport
 */
export function fetchChannelPort(data) {
    return get({
        url: `${url.ORG_LIST}/front/nodeConfig`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || "",
        }
    })
}


// get 单个 告警 配置 
export function queryChannelIP(data) {
    return get({
        url: `${url.ORG_LIST}/scaffold/check?nodeIp=`+data.nodeIp+'&channelPort='+data.channelPort,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

