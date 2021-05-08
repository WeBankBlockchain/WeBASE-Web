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
import Vue from 'vue'
/**
 * 截取字符串前8位
 */
Vue.filter('splitString', function (value) {
    return value.substring(0, 8)
});
/**
 * 截取字符串前8位
 */
Vue.filter('splitString6', function (value) {
    return value.substring(0, 6)
});
/**
 * 截取字符串前25位
 */
Vue.filter('splitString_0_25', function (value) {
    return value.substring(0, 25)
});
/**
 * authorType
 */
Vue.filter('permissionName', function (value) {
    let name = ''
    switch (value) {
        case 'permission':
            name = '管理权限'
            break;
        case 'userTable':
            name = '表权限'
            break;
        case 'cns':
            name = 'CNS权限'
            break;
        case 'node':
            name = '节点权限'
            break;
        case 'sysConfig':
            name = '系统参数权限'
            break;
        case 'deployAndCreate':
            name = '部署和建表权限'
            break;
    }
    return name
});

/**
 * vote type
 */
Vue.filter('voteType', function (value) {
    let name = ''
    switch (value) {
        case 1:
            name = '增加委员'
            break;
        case 2:
            name = '去除委员'
            break;
        case 3:
            name = '更新委员权重'
            break;
        case 4:
            name = '更新阈值'
            break;

    }
    return name
});

Vue.filter('formatErrorMessage', function (value) {
    try {
        return `${value.formattedMessage} `
    } catch (error) {
        console.warn(error);
    }
});

Vue.filter('contractSource', function (value) {
    switch (value) {
        case "0x0000000000000000000000000000000000001000":
            return "SystemConfig"
            break;
        case "0x0000000000000000000000000000000000001001":
            return "TableFactory"
            break;
        case "0x0000000000000000000000000000000000001002":
            return "CRUD"
            break;
        case "0x0000000000000000000000000000000000001003":
            return "Consensus"
            break;
        case "0x0000000000000000000000000000000000001004":
            return "CNS"
            break;
        case "0x0000000000000000000000000000000000001005":
            return "Permission"
            break;
        case "0x0000000000000000000000000000000000001007":
            return "CSM"
            break;
        case "0x0000000000000000000000000000000000001008":
            return "ChainGovern"
            break;
        case "0x0000000000000000000000000000000000001009":
            return "ChainCharge"
            break;
        default:
            return ""
            break;
    }
});