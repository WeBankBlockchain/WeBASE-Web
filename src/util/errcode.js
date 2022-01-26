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
let errCode = {
    "101001": {
        en: "WeBASE-Front system error",
        zh: 'WeBASE-Front系统异常'
    },
    "101002": {
        en: "param valid fail",
        zh: '参数校验异常'
    },
    "102000": {
        en: "WeBASE-Node-Manager system exception",
        zh: 'WeBASE-Node-Manager系统异常'
    },
    "103001": {
        en: "WeBASE-Sign system exception",
        zh: 'WeBASE-Sign系统异常'
    },
    "102001": {
        en: "system exception: please check front",
        zh: "系统错误，请检查front"
    },
    "102002": {
        en: "No group belongs to this groupId(node not belongs to this group)",
        zh: "没有群组属于这个群组id（节点不属于这个群组）"
    },
    "102003": {
        en: "When webase is v1.3.2 above(inclusive),fisco-bcos node must be v2.4.1 above(inclusive)",
        zh: "当webase为v1.3.2以上版本（含）时，fisco bcos节点必须为v2.4.1以上版本（含）"
    },
    "102004": {
        en: "Get check code fail, please check the log of WeBASE-Node-Manager for details",
        zh: "获取验证码失败，请结合后台日志获取详细错误信息"
    },
    "101003": {
        en: "web3j instance of current group is null",
        zh: '当前群组的web3j为空'
    },
    "101004": {
        en: "groupList error for no group, web3jMap is empty!",
        zh: '群组列表里没有该群组，web3jMap为空！'
    },

    "201001": {
        en: "groupId cannot be empty",
        zh: 'groupId不能为空'
    },
    "201002": {
        en: "user cannot be empty",
        zh: '用户编号不能为空'
    },
    "201003": {
        en: "contractName cannot be empty",
        zh: '合约名不能为空'
    },
    "201004": {
        en: "version cannot be empty",
        zh: '版本号不能为空'
    },
    "201005": {
        en: "funcName cannot be empty",
        zh: '方法名不能为空'
    },
    "201006": {
        en: "abiInfo cannot be empty",
        zh: 'abi内容不能为空'
    },
    "201007": {
        en: "contractBin cannot be empty",
        zh: '合约bin不能为空'
    },
    "201017": {
        en: "contract's current version has been deployed",
        zh: '合约的当前版本已部署'
    },
    "201009": {
        en: "contract is not deployed",
        zh: '合约未部署'
    },
    "201010": {
        en: "save abi error",
        zh: 'abi保存错误'
    },
    "201011": {
        en: "contract's parameter is error",
        zh: '合约参数错误'
    },
    "201012": {
        en: "requst blockNumber is greater than latest",
        zh: '请求块高大于最新块高'
    },
    "201013": {
        en: "get abi from chain error",
        zh: '从链上获取abi失败'
    },
    "201014": {
        en: "contract deploy error",
        zh: '合约部署错误'
    },
    "201015": {
        en: "user's privateKey is null",
        zh: '用户私钥为空'
    },
    "201016": {
        en: "file is not exist",
        zh: '文件不存在'
    },
    // "201017": {
    //     en: "failed to get node config",
    //     zh: '获取节点配置失败'
    // },
    "201018": {
        en: "blockNumber and pbftView unchanged",
        zh: '块高和pbftview没有发生变化'
    },
    "201019": {
        en: "request function is error",
        zh: '请求错误'
    },
    "201020": {
        en: "transaction query from chain failed",
        zh: '链上查询交易失败'
    },
    "201021": {
        en: "transaction send to chain failed",
        zh: '交易上链超时'
    },
    "201022": {
        en: "node request failed",
        zh: '节点请求失败'
    },
    "201023": {
        en: "contract already exists",
        zh: '合约已存在'
    },
    "201024": {
        en: "contract name cannot be repeated",
        zh: '合约名称不能重复'
    },
    "201025": {
        en: "invalid contract id",
        zh: '合约ID无效'
    },
    "201026": {
        en: "contract has been deployed",
        zh: '合约已部署'
    },
    "201027": {
        en: "send abiInfo fail",
        zh: '发送abi失败'
    },
    "201028": {
        en: "contractbin is null",
        zh: '合约bin为空'
    },
    "201029": {
        en: "contractAddress is null",
        zh: '合约地址为空'
    },
    "201030": {
        en: "contractAddress invalid",
        zh: '合约地址无效'
    },
    "201031": {
        en: "privateKey decode fail",
        zh: '私钥解码失败'
    },
    "201032": {
        en: "not found config of keyServer",
        zh: '找不到keyServer的配置'
    },
    "201033": {
        en: "data request sign error",
        zh: '签名服务无法访问'
    },
    "201034": {
        en: "groupId not exist",
        zh: 'groupId不存在'
    },
    "201035": {
        en: "version and address cannot all be  null",
        zh: '合约地址不能为空'
    },
    "201036": {
        en: "compile fail",
        zh: '编译失败'
    },
    "201037": {
        en: "user name is null",
        zh: '用户名为空'
    },
    "201038": {
        en: "user name already exists",
        zh: '用户名已经存在'
    },
    "201039": {
        en: "private key already exists",
        zh: '私钥已存在'
    },
    "201040": {
        en: "private key not exists",
        zh: '私钥不存在'
    },
    "201041": {
        en: "external user's appId and signUserId cannot be empty",
        zh: '外部用户的appId和signUserId不能为空'
    },
    "201042": {
        en: "There is no sol files in source",
        zh: '源文件中没有sol文件'
    },
    "201043": {
        en: "Invalid group operate type",
        zh: '无效的群组操作类型'
    },
    "201044": {
        en: "Invalid data type",
        zh: '无效的数据类型'
    },
    "201045": {
        en: "Encode string can not be empty",
        zh: '编码字符串不能为空'
    },
    "201046": {
        en: "Transaction failed!",
        zh: '交易失败!'
    },
    "201100": {
        en: "Params not fit",
        zh: '参数不合适'
    },
    "201101": {
        en: "groupId cannot be empty",
        zh: 'groupId不能为空'
    },
    "201102": {
        en: "TableName cannot be empty",
        zh: '表名不能为空'
    },
    "201103": {
        en: "permissionType cannot be empty",
        zh: '权限类型不能为空'
    },
    "201104": {
        en: "PermissionType not exists",
        zh: '权限类型不存在'
    },
    "201105": {
        en: "From address cannot be empty",
        zh: '被授权人地址不能为空'
    },
    "201106": {
        en: "Contract name cannot be empty",
        zh: '合约名称不能为空'
    },
    "201107": {
        en: "System config key cannot be empty",
        zh: '系统配置键不能为空'
    },
    "201108": {
        en: "System config value cannot be empty",
        zh: '系统配置值不能为空'
    },
    "201109": {
        en: "Node id cannot be empty",
        zh: '节点id不能为空'
    },
    "201110": {
        en: "Node type cannot be empty",
        zh: '节点类型不能为空'
    },
    "201111": {
        en: "Permission state cannot be all empty",
        zh: '权限状态不能全部为空'
    },
    "201116": {
        en: "Contract status handle fail",
        zh: '合约状态修改失败'
    },
    "201112": {
        en: "sql syntax error",
        zh: 'sql语法错误'
    },
    "201120": {
        en: "Group operate fail",
        zh: '群组操作失败'
    },
    "201121": {
        en: "Node internal error",
        zh: '节点内部错误'
    },
    "201122": {
        en: "Group already exists",
        zh: '已存在该群组'
    },
    "201123": {
        en: "Group already running",
        zh: '群组已处于运行状态'
    },
    "201124": {
        en: "Group already stopped",
        zh: '群组已处于停止状态'
    },
    "201125": {
        en: "Group already deleted",
        zh: '群组已处于删除状态'
    },
    "201126": {
        en: "Group not found",
        zh: '群组不存在'
    },
    "201127": {
        en: "Group operate param error",
        zh: '参数不合法'
    },
    "201128": {
        en: "Group peers not connected",
        zh: '群组内节点无有效P2P连接'
    },
    "201129": {
        en: "Group genesis conf already exists",
        zh: '创世块配置文件已存在'
    },
    "201130": {
        en: "Group config.ini already exists",
        zh: '群组配置文件已存在'
    },
    "201131": {
        en: "Group genesis conf not found",
        zh: '群组配置文件不存在，无法添加该节点为共识节点'
    },
    "201132": {
        en: "Group config.ini not found",
        zh: '未找到群组配置文件'
    },
    "201133": {
        en: "Group is stopping",
        zh: '群组停止中'
    },
    "201134": {
        en: "Group not deleted",
        zh: '群组并未被删除'
    },


    "201130": {
        en: "Sign user Id cannot be empty",
        zh: 'webase-sign用户编号不能为空'
    },
    "201151": {
        en: "Unsupported contract param type to encoded",
        zh: '不支持合约参数类型编码'
    },
    "201152": {
        en: "Unsupported contract param type to decoded",
        zh: '不支持合约参数类型解码'
    },
    "201153": {
        en: "Unable to create instance of type, check input params",
        zh: '输入参数格式错误'
    },
    "201161": {
        en: "Generate project failed in scaffold",
        zh: '项目Scaffold脚手架生成失败'
    },
    "201213": {
        en: "address is invalid",
        zh: '地址无效'
    },
    "201200": {
        en: "Params not fit",
        zh: '参数不匹配'
    },
    "201201": {
        en: "Address is invalid",
        zh: '地址无效'
    },
    "201202": {
        en: "Permission denied, please check chain administrator permission",
        zh: '权限不足，请到“权限管理”检查用户权限'
    },
    "201203": {
        en: "node id is invalid",
        zh: '节点ID无效'
    },
    "201204": {
        en: "invalid node type: sealer, observer, remove",
        zh: '无效的节点类型：sealer，observer，remove'
    },
    "201205": {
        en: "permission denied or params error, set system config value fail",
        zh: '权限被拒绝或params错误，设置系统配置值失败'
    },
    "201207": {
        en: "System config key is invalid",
        zh: '系统配置的类型不正确'
    },
    "201208": {
        en: "Unsupported for this system config key",
        zh: '不支持修改此系统配置'
    },
    "201209": {
        en: "Provide value by positive integer mode, from 100000 to 2147483647",
        zh: '以正整数模式提供值，从100000到2147483647'
    },
    "201210": {
        en: "Set system config value fail for params error or permission denied",
        zh: '设置参数错误的系统配置值失败或权限被拒绝'
    },
    "201211": {
        en: "Query system config value list fail",
        zh: '查询系统配置值列表失败'
    },
    "201216": {
        en: "Node id is invalid",
        zh: '节点ID不正确'
    },
    "201217": {
        en: "Invalid node type: sealer, observer, remove",
        zh: '无效的节点类型：sealer、observer、remove'
    },
    "201218": {
        en: "Set node consensus type fail, check permission or node's group config file",
        zh: '设置节点共识类型失败，请检查权限或节点的组配置文件'
    },
    "201221": {
        en: "Contract version should only contains 'A-Z' or 'a-z' or '0-9' or dot mark ",
        zh: '合约版本应仅包含“A-Z”或“A-Z”或“0-9”或点'
    },
    "201222": {
        en: "Version of contract is out of length",
        zh: '合约版本过长,不能超过32位'
    },
    "201223": {
        en: "CNS register fail ",
        zh: 'CNS注册失败'
    },
    "201224": {
        en: "Version not exists",
        zh: '版本不存在'
    },
    "201225": {
        en: "CNS name cannot be empty",
        zh: 'CNS名称不能为空'
    },
    "201226": {
        en: "sql syntax error",
        zh: 'sql语法错误'
    },
    "201227": {
        en: "crud sql fail",
        zh: 'crud sql fail'
    },
    "201228": {
        en: "Table not exists",
        zh: '表不存在'
    },
    "201231": {
        en: "Cert file not found, please check cert path in config",
        zh: '找不到证书文件，请检查配置中的证书路径'
    },
    "201235": {
        en: "P12's password cannot be chinese",
        zh: 'p12密码不能为中文'
    },
    "201236": {
        en: "P12's password not match ",
        zh: 'p12的密码错误'
    },
    "201237": {
        en: "P12 file content error",
        zh: '文件内容错误'
    },

    "201241": {
        en: "Exchange or message queue not exists, please check mq server or mq configuration",
        zh: 'Exchange或消息队列不存在，请检查mq服务器或mq配置'
    },
    "201242": {
        en: "Database error: data already exists in db",
        zh: '数据库错误：数据库中已存在数据'
    },
    "201243": {
        en: "Block range error, from/toBlock must greater than 0, toBlock must be greater than fromBlock",
        zh: '块范围错误，from/toBlock必须大于0，toBlock必须大于fromBlock'
    },
    "201244": {
        en: "Database error: data not exists in db, please check your params",
        zh: '数据库错误：数据库中不存在数据，请检查参数'
    },
    "201245": {
        en: "Only support letter and digit, please check your params",
        zh: '仅支持字母和数字，请检查您的参数'
    },
    "201246": {
        en: "Register contractEvent failed, please check your param",
        zh: '注册contractEvent失败，请检查您的参数'
    },
    "201248": {
        en: "Contract abi invalid, please check abi",
        zh: '合约ABI校验错误，请检查ABI参数格式'
    },
    "201301": {
        en: "threshold must be greater than zero",
        zh: '阈值必须大于零'
    },
    "201302": {
        en: "committee weight must be greater than zero",
        zh: '权重必须大于零'
    },
    "201303": {
        en: "chain governance address cannot be blank",
        zh: '链治理地址不能为空'
    },
    "201311": {
        en: "get event callback fail for time out",
        zh: '获取事件回调超时失败'
    },
    "201312": {
        en: "get event callback error",
        zh: '获取事件回调错误'
    },
"201321": {
    en: "query cns info fail",
    zh: '查询cns信息失败'
},
"201322": {
    en: "contract funcParam size not match with ABI",
    zh: '合同函数参数大小与ABI不匹配'
},
"201323": {
    en: "contract funcParam bytes array size not match",
    zh: '协定funcParam字节数组大小不匹配'
},
"201324": {
    en: "contract funcParam bytes array not support high dimensional array",
    zh: '协定funcParam字节数组不支持高维数组'
},
    "201501": {
        en: "web3sdk create key pair fail and return null",
        zh: 'sdk创建私钥对失败并返回Null'
    },
    "201502": {
        en: "pem/p12 manager get key pair error for input params",
        zh: 'pem/p12证书获取私钥对失败，检查入参'
    },
    "201503": {
        en: "pem/p12 manager get key pair error for bc dependency error",
        zh: 'pem/p12证书获取私钥对失败，检查bc依赖包版本'
    },
    "201504": {
        en: "sign service return error",
        zh: '签名服务并返回异常'
    },
    "201510": {
        en: "transaction receipt status return error",
        zh: '交易回执状态码非0x0，交易执行失败'
    },
    "201511": {
        en: "contract abi parse json error",
        zh: '合约ABI转JSON失败'
    },
    "201512": {
        en: "call contract error for io exception",
        zh: '调用合约的交易上链失败'
    },
    "201513": {
        en: "get transaction receipt fail for exec",
        zh: '获取交易回执失败，返回执行错误'
    },
    "201514": {
        en: "get transaction receipt fail for time out",
        zh: '获取交易回执失败，链上链下请求超时'
    },
    "201515": {
        en: "transaction receipt fail and parse output fail",
        zh: '转化交易回执中output输出值失败'
    },
    "201516": {
        en: "transaction receipt fail and output is null",
        zh: '交易回执output为空'
    },
    "201517": {
        en: "call contract constant method fail",
        zh: '调用合约constant方法失败'
    },
    "201521": {
        en: "get list of manager on chain fail",
        zh: '获取链上管理员列表失败'
    },
    "201522": {
        en: "table key length error",
        zh: '用户表的键值长度大于最大值255'
    },
    "201523": {
        en: "crud's param parse json error",
        zh: 'CRUD方法的入参转Entry/Condition失败，请检查入参'
    },
    "201524": {
        en: "precompiled common transfer to json fail",
        zh: '预编译错误码转JSON失败'
    },
    "202000": {
        en: "invalid front info",
        zh: '无效的节点id'
    },
    "202001": {
        en: "database exception",
        zh: '数据库异常'
    },
    "202002": {
        en: "Not found any front for this group",
        zh: '找不到此群组的任何前置'
    },
    "202003": {
        en: "not support this ip",
        zh: '不支持该ip'
    },
    "202004": {
        en: "front already exists",
        zh: '前置已经存在'
    },
    "202005": {
        en: "group id cannot be empty",
        zh: '群组不能为空'
    },
    "202006": {
        en: "invalid network id",
        zh: '无效的网络编号'
    },
    "202007": {
        en: "CheckCode is null",
        zh: '校验码为空'
    },
    "202008": {
        en: "invalid checkCode",
        zh: '无效的校验码'
    },
    "202009": {
        en: "save front fail",
        zh: '保存前置失败'
    },
    "202010": {
        en: "request front fail",
        zh: '请求前置失败'
    },
    "202011": {
        en: "abiInfo cannot be empty",
        zh: 'abi信息不能为空'
    },
    "202012": {
        en: "user id cannot be empty",
        zh: '用户编号不能为空'
    },
    "202013": {
        en: "invalid user id",
        zh: '无效的用户ID'
    },
    "202014": {
        en: "user already exists",
        zh: '用户信息已经存在'
    },
    "202015": {
        en: "contract already exists",
        zh: '合约信息已经存在'
    },
    "202016": {
        en: "contract id cannot be empty",
        zh: '合约编号不能为空'
    },
    "202017": {
        en: "invalid contract id",
        zh: '无效的合约ID'
    },
    "202018": {
        en: "invalid param info",
        zh: '无效的入参信息'
    },
    "202019": {
        en: "contract name cannot be repeated",
        zh: '合约名称不能重复'
    },
    "202020": {
        en: "deployed contract cannot be modified",
        zh: '已部署合约不支持修改'
    },
    "202021": {
        en: "invalid organization type",
        zh: '组织类型不正确'
    },
    "202022": {
        en: "unable to delete deployed contract",
        zh: '不能删除已部署的合约'
    },
    "202023": {
        en: "contract has not deploy",
        zh: '合约尚未部署'
    },
    "202024": {
        en: "node p2p port cannot be empty",
        zh: '节点p2p端口不能为空'
    },
    "202025": {
        en: "did not find node log",
        zh: '找不到节点日志'
    },
    "202026": {
        en: "account info already exists",
        zh: '该帐号已经存在'
    },
    "202027": {
        en: "ccount info not exists",
        zh: '该帐号不存在'
    },
    "202028": {
        en: "account name empty",
        zh: '帐号名称不能为空'
    },
    "202029": {
        en: "invalid account name",
        zh: '无效的账号名称'
    },
    "202030": {
        en: "password error",
        zh: '密码错误'
    },
    "202031": {
        en: "role id cannot be empty",
        zh: '角色编号不能为空'
    },
    "202032": {
        en: "invalid role id",
        zh: '无效的角色编号'
    },
    "202033": {
        en: "invalid contract address",
        zh: '无效的合约地址'
    },
    "202034": {
        en: "login fail",
        zh: '登录失败'
    },
    "202035": {
        en: "contract has been deployed",
        zh: '该合约已经部署'
    },
    "202036": {
        en: "publicKey cannot be empty",
        zh: '公钥不能为空'
    },
    "202037": {
        en: "user does not exist",
        zh: '用户信息不存在'
    },
    "202038": {
        en: "interface does not exist",
        zh: '接口不存在'
    },
    "202039": {
        en: "do not save this block height",
        zh: '不保存该块高信息'
    },
    "202040": {
        en: "contract deploy not success",
        zh: '合约部署失败'
    },
    "202041": {
        en: "invalid user index",
        zh: '不能删除已部署的合约'
    },
    "202042": {
        en: "invalid contract index",
        zh: '无效的合约索引'
    },
    "202043": {
        en: "did not found system contract:contractDetail",
        zh: '找不到系统合约【contractDetail】'
    },
    "202044": {
        en: "did not found system contract:user",
        zh: '找不到系统合约【user】'
    },
    "202045": {
        en: "the new password cannot be same as old",
        zh: '新旧密码不能一致'
    },
    "202046": {
        en: "contract has not compiled",
        zh: "合约的abi或bin不存在"
    },
    "202047": {
        en: "did not found system contract:node",
        zh: "找不到系统合约【node】"
    },
    "202048": {
        en: "invalid node index",
        zh: "无效的节点索引"
    },
    "202049": {
        en: "contract name is empty",
        zh: "合约名为空"
    },
    "202050": {
        en: "publicKey's length is 130,address's length is 42",
        zh: "公钥长度为130，公钥地址长度为42"
    },
    "202051": {
        en: "wrong host or port",
        zh: "错误的主机或端口"
    },
    "202052": {
        en: "invalid token",
        zh: "无效的token"
    },
    "202053": {
        en: "token expire",
        zh: "token过期"    
    },
    "202054": {
        en: "Available front url is empty, check front status",
        zh: "没有有效前置，请检查前置状态"
    },
    "202055": {
        en: "invalid contract",
        zh: "无效的合约"
    },
    "202058": {
        en: "not support transaction",
        zh: "不支持发交易"
    },
    "202060": {
        en: "cert handle error",
        zh: "证书句柄错误"
    },
    "202061": {
        en: "store cert error",
        zh: "存储证书错误"
    },
    "202062": {
        en: "cert format error, must start with -----BEGIN CERTIFICATE-----\\n, end with end",
        zh: "证书格式错误，必须由 --BEGIN CERTIFICATE-- 包围"
    },
    "202063": {
        en: "saving front's cert error",
        zh: "保存前置证书错误"
    },
    "202070": {
        en: "Mail server config error.",
        zh: "邮件服务器配置错误。"
    },
    "202071": {
        en: "Mail server config param empty/not match",
        zh: "邮件服务器配置参数为空/不匹配"
    },
    "202072": {
        en: "Mail server config error, db's server config is empty",
        zh: "邮件服务器配置错误，数据库的服务器配置为空"
    },
    "202076": {
        en: "Alert rule error.",
        zh: "警报规则错误。"
    },
    "202077": {
        en: "Alert rule param not match.",
        zh: "警报规则参数不匹配。"
    },
    "202080": {
        en: "Send mail error, please check mail server configuration.",
        zh: "发送邮件错误，请检查邮件服务器配置。"
    },
    "202081": {
        en: "Send mail error, please enable mail server before send.",
        zh: "发送邮件错误，请在发送前启用邮件服务器。"
    },
    "202086": {
        en: "Alert log error.",
        zh: "警报日志错误。"
    },
    "202087": {
        en: "Alert log param: status/logId is empty.",
        zh: "警报日志参数：status/logId为空。"
    },

    "202090": {
        en: "Update guomi methodId error",
        zh: "更新国密methodId错误"
    },
    "202091": {
        en: "Front's encrypt type not matches with nodemgr",
        zh: "Front的加密类型与nodemgr不匹配"
    },
    "202096": {
        en: "Contract address already exists",
        zh: "合约地址已存在"
    },
    "202097": {
        en: "Abi info of this id not exists",
        zh: "此ID的ABI信息不存在"
    },
    "202098": {
        en: "Contract abi invalid, please check abi",
        zh: "合约ABI无效，请检查ABI"
    },
    "202099": {
        en: "Abi Id cannot be empty",
        zh: "此ID的ABI信息为空"
    },
    "202100": {
        en: "contractAddress is null",
        zh: "合约地址为空"
    },
    "202110": {
        en: "User's signUserId not exist",
        zh: "用户的signUserId不存在"
    },
    "202111": {
        en: "Fail to parse json",
        zh: "解析json错误"
    },

    "202121": {
        en: "Cert file not found, please check cert path in config",
        zh: "找不到证书文件，请检查配置中的证书路径"
    },
    "202122": {
        en: "Pem file format error, must surrounded by -----XXXXX PRIVATE KEY-----",
        zh: "Pem文件格式错误，必须包含-----XXXXX PRIVATE KEY-----"
    },
    "202123": {
        en: "Pem file content error",
        zh: "Pem文件内容错误"
    },
    "202124": {
        en: "p12's password cannot be chinese",
        zh: "P12的密码不能为中文"
    },
    "202125": {
        en: "p12's password not match",
        zh: "P12的密码错误"
    },
    "202126": {
        en: "p12 file content error",
        zh: "P12文件内容错误"
    },
    "202321": {
        en: "path contains deployed contract, please delete one by one.",
        zh: "路径包含已部署的协定，请逐个删除。"
    },
    "202322": {
        en: "contract path cannot be blank(use '/\' instead)",
        zh: "合同路径不能为空（请改用“/\”）"
    },
    "202323": {
        en: "privateKey decode fail",
        zh: "私钥解码失败"
    },
    "202324": {
        en: "password decode fail",
        zh: "密码解码错误"
    },
    "201232": {
        en: "Pem file format error, must surrounded by -----XXXXX PRIVATE KEY-----",
        zh: "Pem文件格式错误，必须包含-----XXXXX PRIVATE KEY----- "
    },
    "201233": {
        en: "Pem file content error",
        zh: "Pem文件内容错误"
    },

    "202300": {
        en: "Group id already exists",
        zh: "群组id已存在"
    },
    "202301": {
        en: "Node's front not exists",
        zh: "节点前置不存在"
    },
    "202310": {
        en: "govern vote record not exist",
        zh: "投票记录不存在"
    },
    "202311": {
        en: "permission denied on chain",
        zh: "链上权限被禁止"
    },
    "203003": {
        en: "Param exception",
        zh: "参数异常"
    },
    "203004": {
        en: "Sign user id cannot be blank",
        zh: "签名用户id不能为空"
    },
    "203005": {
        en: "Invalid sign user id (max length of 64, only support letter and digit)",
        zh: "无效的签名用户id（最大长度为64，仅支持字母和数字）"
    },
    "203006": {
        en: "App id cannot be blank",
        zh: "应用程序id不能为空"
    },
    "203007": {
        en: "App id invalid, only support letter and digit",
        zh: "应用程序id无效，仅支持字母和数字"
    },
    "203008": {
        en: "Encrypt type should be 0 (ecdsa) or 1 (guomi)",
        zh: "加密类型应为0（ecdsa）或1（guomi）"
    },
    "203009": {
        en: "Encoded data string must be hex string",
        zh: "编码的数据字符串必须是十六进制字符串"
    },

    "202401": {
        "en": "No configured of docker registry url.",
        "zh": "没有配置 Docker 镜像更新 URL 地址"
    },
    "202402": {
        "en": "Fetch image tag from docker registry error.",
        "zh": "从 Docker 源更新镜像版本失败"
    },
    "202403": {
        "en": "Fetch Docker image tag list error, unknown config type.",
        "zh": "查询 Docker 镜像版本失败（未知类型）"
    },
    "202404": {
        "en": "Save chain's configuration to file error.",
        "zh": "保存链配置信息文件失败"
    },
    "202405": {
        "en": "Docker image tag invalid.",
        "zh": "错误的镜像版本"
    },
    "202406": {
        "en": "Configuration of host is empty.",
        "zh": "主机配置参数为空"
    },
    "202407": {
        "en": "Chain exists, deploy failed.",
        "zh": "链已存在，部署失败"
    },
    "202408": {
        "en": "Save chain data to DB error.",
        "zh": "插入链信息到数据库失败"
    },
    "202409": {
        "en": "Chain root dir exist, please move it manually.",
        "zh": "链的根目录default_chain_nodes已存在，请移除脏数据文件"
    },
    "202410": {
        "en": "Execute build_chain.sh script error.",
        "zh": "执行 build_chain.sh 链生成脚本失败"
    },
    "202411": {
        "en": "Host, agency, group configuration error.",
        "zh": "主机，机构，群组配置信息错误"
    },
    "202412": {
        "en": "Host ip and num error.",
        "zh": "主机 IP，节点数量配置错误"
    },
    "202413": {
        "en": "Agency name invalid, only [a-zA-Z0-9_] is valid.",
        "zh": "机构名称格式错误，只能包含大小写字母，数字，下划线"
    },
    "202414": {
        "en": "Group id error, only positive integer is valid.",
        "zh": "群组编号格式错误，必须为正整数"
    },
    "202415": {
        "en": "Login to host /ip/ through SSH error. Please check SSH configuration.",
        "zh": "SSH登录主机/ip/失败，请检查 SSH 配置"
    },
    "202416": {
        "en": "Save agency data into DB error.",
        "zh": "插入新机构信息到数据库失败"
    },
    "202417": {
        "en": "Save group data into DB error.",
        "zh": "插入新群组信息到数据库失败"
    },
    "202418": {
        "en": "Save host data into DB error.",
        "zh": "插入主机信息到数据库失败"
    },
    "202419": {
        "en": "Save front data into DB error.",
        "zh": "插入前置信息到数据库失败"
    },
    "202420": {
        "en": "Save node data into DB error.",
        "zh": "插入节点信息到数据库失败"
    },
    "202421": {
        "en": "Save node and front mapping data into DB error.",
        "zh": "插入前置和群组映射关系到数据库失败"
    },
    "202422": {
        "en": "Parse node index from directory error.",
        "zh": "从目录获取节点序号失败"
    },
    "202423": {
        "en": "A single host IP only belongs to one agency.",
        "zh": "一个 IP 主机，只能属于一个机构"
    },
    "202424": {
        "en": "Unknown error during deploying.",
        "zh": "部署时发生未知错误"
    },
    "202425": {
        "en": "SSH login through username and password is unsupported yet.",
        "zh": "不支持使用 SSH 密码登录主机"
    },
    "202426": {
        "en": "Chain has no agency.",
        "zh": "当前链没有所属机构"
    },
    "202427": {
        "en": "No deployed chain,",
        "zh": "链不存在"
    },
    "202428": {
        "en": "IP format error.",
        "zh": "IP 格式错误"
    },
    "202429": {
        "en": "Agency name cannot be blank when IP is new.",
        "zh": "主机 IP 是新 IP 时，机构名称不能为空"
    },
    "202430": {
        "en": "Agency name already exists.",
        "zh": "存在同名机构"
    },
    "202431": {
        "en": "Add new node error.",
        "zh": "新增节点错误"
    },
    "202432": {
        "en": "No valid chain certification.",
        "zh": "链证书无效"
    },
    "202433": {
        "en": "Generate agency private key and crt file error.",
        "zh": "生成机构私钥和证书失败"
    },
    "202434": {
        "en": "Host without agency error.",
        "zh": "主机所属机构为空"
    },
    "202435": {
        "en": "Node num should be positive integer, and less then 10.",
        "zh": "主机数量格式错误，正整数，并且小于 10"
    },
    "202436": {
        "en": "Generate sdk ",
        "zh": "生成主机 SDK 私钥和证书失败"
    },
    "202437": {
        "en": "Generate node private key and crt files error.",
        "zh": "生成新节点私钥和证书失败"
    },
    "202438": {
        "en": "Copy SDK files error.",
        "zh": "拷贝 SDK 证书和私钥失败"
    },
    "202439": {
        "en": "Upload SDK files error.",
        "zh": "上传 SDK 证书和私钥失败"
    },
    "202440": {
        "en": "Upload node config files error.",
        "zh": "上传节点证书和私钥失败"
    },
    "202441": {
        "en": "Copy group config files from original node error.",
        "zh": "从旧节点复制群组配置文件失败"
    },
    "202442": {
        "en": "Delete tmp directory of agency error.",
        "zh": "删除机构临时目录失败"
    },
    "202443": {
        "en": "Delete tmp directory of SDK error.",
        "zh": "删除 SDK 临时目录失败"
    },
    "202444": {
        "en": "Delete tmp directory of node error.",
        "zh": "删除节点临时目录失败"
    },
    "202445": {
        "en": "Unknown nodeid.",
        "zh": "未知节点编号（nodeid）"
    },
    "202446": {
        "en": "Stop node error.",
        "zh": "停止节点失败（停止容器）"
    },
    "202447": {
        "en": "Start node error.",
        "zh": "启动节点失败（启动容器）"
    },
    "202448": {
        "en": "Both new image tag and old are the same.",
        "zh": "链升级的新版本和链的现有版本相同"
    },
    "202449": {
        "en": "Upgrade chain to new image tag error.",
        "zh": "链升级失败"
    },
    "202450": {
        "en": "Delete node failed, node is still in group.",
        "zh": "节点仍属于群组，删除失败"
    },
    "202451": {
        "en": "Parse node's config files error.",
        "zh": "读取节点配置文件失败"
    },
    "202452": {
        "en": "Delete node's config error.",
        "zh": "删除节点配置文件失败"
    },
    "202453": {
        "en": "Stop node before deleting.",
        "zh": "节点正在运行，删除失败，请先停止节点"
    },
    "202454": {
        "en": "Update p2p part of related nodes error.",
        "zh": "更新关联节点 P2P 配置失败"
    },
    "202455": {
        "en": "Delete chain error.",
        "zh": "删除链失败"
    },
    "202456": {
        "en": "Node is still a sealer or observer, delete failed.",
        "zh": "节点处于观察或共识状态，删除失败"
    },
    "202457": {
        "en": "Fetch node list from host's configuration files.",
        "zh": "从主机配置文件获取节点列表失败"
    },
    "202458": {
        "en": "Generate application.yml for front error.",
        "zh": "生成前置 application.yml 配置文件失败"
    },
    "202459": {
        "en": "Init host with shell script error.",
        "zh": "通过脚本初始化主机失败"
    },
    "202460": {
        "en": "Sync files error.",
        "zh": "传输文件失败"
    },
    "202461": {
        "en": "Host must be all localhost(127.0.0.1) or all non-localhost",
        "zh": "主机必须全都是127.0.0.1或都不是127.0.0.1"
    },
    "202462": {
        "en": "Two nodes at least.",
        "zh": "至少两个节点。"
    },
    "202463": {
        "en": "Group need two sealers at least.",
        "zh": "群组至少需要两个共识节点。"
    },
    "202464": {
        "en": "WebaseSignAddess configuration error in Application.yml",
        "zh": "application.yml中的webaseSignAddess配置错误"
    },
    "202465": {
        "en": "webaseSignAddress cannot be 127.0.0.1 or localhost in application.yml file",
        "zh": "配置项application.yml文件中webaseSign的地址不能是127.0.0.1或localhost"
    },
    "202466": {
        "en": "Please pull the Docker image manually in host /ip/",
        "zh": "主机上的节点镜像不存在，请检查/ip/！"
    },
    "202467": {
        "en": "Max 4 nodes on a single host",
        "zh": "单个主机最多部署 4 个节点"
    },
    "202468": {
        "en": "Host of WeBASE-Node-Manager's ip is already existed.",
        "zh": "节点管理服务主机IP(127.0.0.1)已存在。"
    },
    "202469": {
        "en": "Check docker installed and running of host.",
        "zh": "检查docker主机的安装和运行情况。"
    },
    "202470": {
        "en": "Check host memory not enough for nodes(s).",
        "zh": "检查主机内存不足，无法容纳节点。"
    },
    "202471": {
        "en": "Check host cpu core count not enough for node.",
        "zh": "检查节点的主机cpu核心数不足。"
    },
    "202472": {
        "en": "Host check had been interrupt.",
        "zh": "主机检查被中断。"
    },
    "202473": {
        "en": "Host check fail for inpurt param.",
        "zh": "检测主机参数错误"
    },
    "202475": {
        "en": "Fail to generate chain and front config locally.",
        "zh": "本地生成链和前置配置失败。"
    },
    "202476": {
        "en": "Not all host init success.",
        "zh": "部分主机初始化失败。"
    },
    "202477": {
        "en": "Ipconf's node port config error.",
        "zh": "Ipconf的节点端口配置错误。"
    },
    "202478": {
        "en": "Ipconf not match with deploy info list.",
        "zh": "Ipconf与部署信息列表不匹配。"
    },
    "202479": {
        "en": "Delete host fail for host contains node(front).",
        "zh": "删除主机失败，主机仍包含节点"
    },

    "202480": {
        "en": "Ansible not installed!",
        "zh": "Ansible未安装！"
    },
    "202481": {
        "en": "Ansible fetch not support fetch directory.",
        "zh": "Ansible fetch不支持拉取目录。"
    },
    "202482": {
        "en": "Ansible ping cannot reach target ip.",
        "zh": "主机节点无法连通，请检查ansible hosts免密配置。"
    },
    "202483": {
        "en": "Ansible init host of image and scp config not all success.",
        "zh": "Ansible 初始化主机镜像和scp配置没有全部成功。"
    },
    "202484": {
        "en": "Ansible pull docker hub fail.",
        "zh": "Ansible连接DockerHub错误。"
    },
    "202485": {
        "en": "Ansible pull docker cdn fail.",
        "zh": "Ansible连接CDN错误。"
    },
    "202486": {
        "en": "Ansible run docker command fail.",
        "zh": "Ansible run docker命令失败。"
    },
    "202487": {
        "en": "Ansible exec command error.",
        "zh": "Ansible 执行远端命令失败。"
    },
    "202488": {
        "en": "Ansible exec scp(copy) error.",
        "zh": "Ansible 执行 scp（复制）错误。"
    },
    "202489": {
        "en": "Ansible exec scp(fetch) error",
        "zh": "Ansible 执行 scp (拉取)错误。"
    },
    "202491": {
        "en": "Ansible check image exist error for param.",
        "zh": "Ansible检查镜像的参数错误。"
    },
    "202492": {
        "en": "Ansible check docker container exist error for param.",
        "zh": "Ansible检查docker容器的参数错误。"
    },
    "202493": {
        "en": "Check host not pass, please check host remark.",
        "zh": "主机检测未通过，请查看操作日志。"
    },
    "202494": {
        "en": "Check host port is in use, please check host remark.",
        "zh": "检测到接口已使用，请查看操作日志。"
    },
    "202495": {
        "en": "Host already exist",
        "zh": "主机已存在"
    },
    "202496": {
        "en": "Host root dir access denied.",
        "zh": "主机安装目录无权限。"
    },
    "202497": {
        "en": "Host not exist or already been deleted.",
        "zh": "主机不存在或已被删除。"
    },
    "202498": {
        "en": "Host's rootDir must be absolute path",
        "zh": "主机的rootDir必须是绝对路径"
    },


    "202501": {
        "en": "Contract path is exists.",
        "zh": "目录已存在。"
    },
    "202502": {
        "en": "version cannot be empty.",
        "zh": "版本不能为空"
    },
    "202503": {
        "en": "cns name cannot be empty.",
        "zh": "CNS 名不能为空"
    },
    "202504": {
        "en": "version already exists.",
        "zh": "版本已存在"
    },

    "202511": {
        "en": "Front's sdk cert and key not found!",
        "zh": "找不到前置sdk证书和密钥！"
    },
    "202512": {
        "en": "Write front's sdk cert and key fail!",
        "zh": "写入前置的sdk证书和密钥失败！"
    },
    "202513": {
        "en": "Write private key file fail!",
        "zh": "写入密钥文件失败！"
    },
    "202514": {
        "en": "Group genesis conf not found",
        "zh": "群组配置文件不存在，无法添加该节点为共识节点"
    },
    "202516": {
        "en": "app name exists ",
        "zh": "应用名称已存在"
    },
    "202517": {
        "en": "app name not exists",
        "zh": "应用名称不存在"
    },
    "202518": {
        "en": "app id not exists",
        "zh": "应用编号不存在"
    },
    "202519": {
        "en": "link format invalid",
        "zh": "链接格式错误"
    },
    "202531": {
        "en": "Generate project failed in scaffold",
        "zh": "项目Scaffold脚手架生成失败"
    },
    "202532": {
        "en": "Get sdk cert/key content map failed",
        "zh": "获取SDK证书私钥失败"
    },
    "202534": {
        "en": "contract path not exists.",
        "zh": "合约路径不存在"
    },
    "302000": {
        en: "user not logged in",
        zh: '未登录的用户'
    },
    "302001": {
        en: "Access denied",
        zh: "没有权限"
    },
    "303001": {
        en: "User of this sign user id is already exists",
        zh: "此签名用户id的用户已存在"
    },
    "303002": {
        en: "User does not exist or already been disable",
        zh: "用户不存在或已被禁用"
    },
    "303003": {
        en: "PrivateKey is null",
        zh: "PrivateKey为空"
    },
    "303004": {
        en: "PrivateKey decode fail",
        zh: "私钥解码失败"
    },
    "303005": {
        en: "PrivateKey format error",
        zh: "PrivateKey格式错误"
    },
    "303006": {
        en: "privateKey not support transfer",
        zh: "私钥不支持传输"
    },
    "402000": {
        en: "param exception",
        zh: "参数错误"
    },
    "-50000": {
        en: "Permission denied",
        zh: "没有权限"
    },
    "-50001": {
        en: "Table name already exist",
        zh: "表名已经存在"
    },
    "-50100": {
        en: "Table does not exist",
        zh: "表不存在"
    },
    "-50101": {
        en: "Unknow function call",
        zh: "未知函数调用"
    },
    "-50102": {
        en: "Address invalid",
        zh: "地址无效"
    },
    "-51000": {
        en: "Table name and address already exist",
        zh: "表名和地址已经存在"
    },
    "-51001": {
        en: "Table name and address does not exist",
        zh: "该地址不属于管理员，无法删除"
    },
    "-51100": {
        en: "Invalid node ID",
        zh: "无效的节点ID"
    },
    "-51101": {
        en: "The last sealer cannot be removed",
        zh: "不能移除最后一个共识节点"
    },
    "-51102": {
        en: "The node is not reachable",
        zh: "节点无法访问"
    },
    "-51103": {
        en: "The node is already set as removed",
        zh: "节点已被设为游离节点"
    },
    "-51104": {
        en: "The node is already in the sealer list",
        zh: "节点已经在共识列表中"
    },
    "-51105": {
        en: "The node is already in the observer list",
        zh: "节点已经在观察者列表中" 
    },
    "-51200": {
        en: "Contract name and version already exist",
        zh: "合约名称和版本已存在"
    },
    "-51201": {
        en: "Version string length exceeds the maximum limit",
        zh: "版本字符串长度超过最大限制"
    },
    "-51300": {
        en: "Invalid configuration entry",
        zh: "配置条目无效"
    },
    "-51500": {
        en: "Entry parse error",
        zh: "解析错误"
    },
    "-51501": {
        en: "Condition parse error",
        zh: "条件解析错误"
    },
    "-51502": {
        en: "Condition operation undefined",
        zh: "条件操作未定义"
    },
    "-51503": {
        en: "Please provide field 'in field list",
        zh: "请在字段列表中提供字段。"
    },
    "-51900": {
        en: "contract frozen",
        zh: "合约冻结"
    },
    "-51901": {
        en: "contract available",
        zh: "合约为空"
    },
    "-51902": {
        en: "CONTRACT_REPEAT_AUTHORIZATIO",
        zh: "重复权限"
    },
    "-51903": {
        en: "INVALID_CONTRACT_ADDRESS",
        zh: "无效的合约地址"
    },
    "-51904": {
        en: "TABLE_NOT_EXIST",
        zh: "表不存在"
    },
    "-51905": {
        en: "NO_AUTHORIZED",
        zh: "链上没有权限"
    },
    "-52000": {
        en: "COMMITTEE_MEMBER_EXIST",
        zh: "链委员已存在"
    },
    "-52001": {
        en: "COMMITTEE_MEMBER_NOT_EXIST",
        zh: "该链委员不存在"
    },
    "-52002": {
        en: "INVALID_REQUEST_PERMISSION_DENIED",
        zh: "无效的请求，链上权限拒绝"
    },
    "-52003": {
        en: "INVALID_THRESHOLD",
        zh: "无效阈值"
    },
    "-52004": {
        en: "OPERATOR_CANNOT_BE_COMMITTEE_MEMBER",
        zh: "运维不能同时成为链委员"
    },
    "-52005": {
        en: "COMMITTEE_MEMBER_CANNOT_BE_OPERATOR",
        zh: "链委员不能同时成为运维"
    },
    "-52006": {
        en: "OPERATOR_EXIST",
        zh: "运维员已存在"
    },
    "-52007": {
        en: "OPERATOR_NOT_EXIST",
        zh: "无效运维员"
    },
    "-52008": {
        en: "ACCOUNT_NOT_EXIST",
        zh: "无效账户"
    },
    "-52009": {
        en: "INVALID_ACCOUNT_ADDRESS",
        zh: "无效账户地址"
    },
    "-52010": {
        en: "ACCOUNT_ALREADY_AVAILABLE",
        zh: "账户已经在用"
    },
    "-52011": {
        en: "ACCOUNT_FROZEN",
        zh: "账户冻结"
    },
    "-52012": {
        en: "CURRENT_VALUE_IS_EXPECTED_VALUE",
        zh: "当前值是预期值"
    },
    "-1": {
        en: "no active connection available with node, please check node status",
        zh: "节点与前置断开连接，请检查节点状态"
    },

    "422": {
        en: "param error",
        zh: "参数错误"
    },
    "500": {
        en: "system exception",
        zh: '系统异常'
    },
    "202541": {
        en: "Developer account cannot modify data of other account",
        zh: '当前账号无权限操作其他账户数据'
    },
    "202542": {
        en: "No private key of contract manager address in webase",
        zh: '无链管理员或合约部署者私钥，无法操作合约'
    },
    "202543": {
        en: "Binding private key not match this user's address",
        zh: '绑定私钥与此用户的地址不匹配'
    },
}
export function chooseLang(code, value) {
    let lang = localStorage.getItem('lang')
    let message = errCode[code][lang];
    if (value) {
        let oldMessage
        let arry = message.split("/")
        oldMessage = arry[0] + value + arry[2]
        return oldMessage
    } else {
        return message
    }
}
