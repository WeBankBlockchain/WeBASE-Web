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
import url from './url'
import { post, get, patch, put, deleted } from './http'
import { reviseParam } from './util'
import qs from 'qs'

//login
export function login(data) {
    return post({
        url: `${url.ORG_LIST}/account/login`,
        method: 'post',
        data: qs.stringify(data),
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        }
    })
}
//out login
export function loginOut() {
    return get({
        url: `${url.ORG_LIST}/account/logout`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//init change passWord
export function resetPassword(data) {
    return put({
        url: `${url.ORG_LIST}/account/passwordUpdate`,
        method: 'put',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**daily transaction data */
export function getChartData(data) {
    return get({
        url: `${url.ORG_LIST}/network/transDaily/${data}`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Chain overview */
export function getNetworkStatistics(data) {
    return get({
        url: `${url.ORG_LIST}/network/general/${data}`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Error log query node*/
export function getErrorNodeList(data) {
    return get({
        url: `${url.ORG_LIST}/node/nodeList/${data}`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Contract list */
export function getContractList(data) {
    return post({
        url: `${url.ORG_LIST}/contract/contractList`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**add contract */
export function addChaincode(data) {
    return post({
        url: `${url.ORG_LIST}/contract/contractInfo`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Delete contract */
export function deleteCode(data) {
    return deleted({
        url: `${url.ORG_LIST}/contract/${data}`,
        method: 'delete',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Blockchain list */
export function networkList() {
    return get({
        url: `${url.ORG_LIST}/network/all`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Transaction receipt based on transaction hash*/
export function getTransactionReceipt(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/web3/transactionReceipt/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Get transaction information based on transaction hash*/
export function hashTransactionInfo(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/web3/transaction/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** deleteAccount*/
export function deleteAccountInfo(data) {
    return deleted({
        url: `${url.ORG_LIST}/account/${data}`,
        method: 'delete',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**
 * 监管用户接口列表
 * @param networkId
 * @param ?userName
 * */
export function monitorUserInterfaceList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/monitor/interfaceList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**
 * 监管异常用户信息列表
 * @param networkId
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** Query block details based on block height*/
export function getBlockDetail(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/web3/blockByNumber/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** delete nodes*/
export function deleteNodes(data) {
    return deleted({
        url: `${url.ORG_LIST}/node/nodeInfo/${data}`,
        method: 'delete',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
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
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}