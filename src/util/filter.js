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
/**
 * 截取字符串前8位
 */
Vue.filter('splitString', function (value) {
    return value.substring(0, 8)
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
