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
  "-50000": {
    en: "Permission denied",
    zh: "链上权限被拒绝，请检查节点日志进行排查"
  },
  "-50001": {
    en: "Table name already exist",
    zh: "表名已经存在"
  },
  "-50002": {
    en: "File already existed",
    zh: "BFS文件已存在，请检查节点日志进行排查"
  },
  "-50003": {
    en: "The table field name exceeds the limit 64",
    zh: "表名长度超过限制 64"
  },
  "-50004": {
    en: "The length of all the fields name exceeds the limit 1024",
    zh: "所有字段名称长度超过限制 1024"
  },
  "-50005": {
    en:
      "The value exceeds the limit, key max length is 255, field value max length is 1024",
    zh: "值超过限制，key最大长度为255，字段值最大长度为1024"
  },
  "-50006": {
    en: "The field value exceeds the limit 1024",
    zh: "字段值超过限制 1024"
  },
  "-50007": {
    en: "The table contains duplicated field",
    zh: "该表包含重复的字段"
  },
  "-50008": {
    en: "Invalid table name or field name",
    zh: "无效的表名或字段名"
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
  "-50103": {
    en: "Table set row error",
    zh: "表设置行错误"
  },
  "-50104": {
    en: "Create table error",
    zh: "创建表错误"
  },
  "-50105": {
    en: "Open table error",
    zh: "操作表错误"
  },
  "-51000": {
    en: "Table name and address already exist",
    zh: "表名和地址已经存在"
  },
  "-51001": {
    en: "Table name and address does not exist",
    zh: "该地址不属于管理员，无法删除"
  },
  "-51002": {
    en:
      "The contract method auth type not set, please set method auth type first",
    zh: "合约方法鉴权类型未设置，请先设置方法鉴权类型"
  },
  "-51003": {
    en: "Error auth type input",
    zh: "错误鉴权输入，请检查节点日志进行排查"
  },
  "-51004": {
    en: "Auth map decode error",
    zh: "鉴权解码错误，请检查节点日志进行排查"
  },
  "-51100": {
    en: "Invalid node ID",
    zh: "无效的节点ID，请检查节点日志进行排查"
  },
  "-51101": {
    en: "The last sealer cannot be removed",
    zh: "不能移除最后一个共识节点"
  },
  "-51102": {
    en: "The node is not reachable",
    zh: "节点无法访问，请检查节点日志进行排查"
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
  "-51202": {
    en: "The version string or address is error",
    zh: "版本或地址格式错误"
  },
  "-51300": {
    en: "Invalid configuration entry",
    zh: "配置条目无效"
  },
  "-51500": {
    en: "Entry parse error",
    zh: "解析错误，请查看节点日志进行排查"
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
    zh: "请在字段列表中提供field字段。"
  },
  "-51504": {
    en: "Add specific table key in entry",
    zh: "在条目中添加特定的表键"
  },
  "-51505": {
    en: "Add specific table key EQ syntax in condition",
    zh: "在条件中添加特定的表键 EQ 语法"
  },
  "-51506": {
    en: "Don't insert the key already existed",
    zh: "不要插入已经存在的密钥"
  },
  "-51507": {
    en: "Key not exist in table, use insert method",
    zh: "表中不存在键，使用插入方法"
  },
  "-51900": {
    en: "contract frozen",
    zh: "合约已冻结"
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
    zh: "账户已经可用"
  },
  "-52011": {
    en: "ACCOUNT_FROZEN",
    zh: "账户冻结"
  },
  "-52012": {
    en: "CURRENT_VALUE_IS_EXPECTED_VALUE",
    zh: "当前值是预期值"
  },
  "-53001": {
    en: "File not exist",
    zh: "文件不存在"
  },
  "-53002": {
    en: "File already existed",
    zh: "文件已存在"
  },
  "-53003": {
    en: "Make directory failed",
    zh: "BFS创建目录失败，请检查节点日志进行排查"
  },
  "-53005": {
    en: "Invalid path",
    zh: "BFS路径无效，请检查节点日志进行排查"
  },
  "-53006": {
    en: "Invalid file type",
    zh: "文件类型无效"
  },
  "-1": {
    en: "no active connection available with node, please check node status",
    zh: "节点与前置断开连接，请检查节点状态"
  },
  "422": {
    en: "param error",
    zh: "参数错误，请检查参数格式、类型是否匹配"
  },
  "500": {
    en: "system exception",
    zh: "系统异常，请查看后台日志进行排查"
  },
  "101001": {
    en: "system error",
    zh: "系统异常，请到节点前置的log目录中检查异常原因"
  },
  "101002": {
    en: "param valid fail",
    zh: "参数校验异常，请检查参数的长度、格式、类型是否匹配"
  },
  "101003": {
    en:
      "web3jMap of groupId is null, please call /{groupId}/web3/refresh to refresh",
    zh: "连接当前群组失败，请调用/{groupId}/web3/refresh刷新群组"
  },
  "101004": {
    en: "getGroupList error for no group, web3jMap is empty!",
    zh: "群组列表为空，请到节点服务中检查节点共识状态"
  },
  "102000": {
    en: "WeBASE-Node-Manager system exception",
    zh: "WeBASE-Node-Manager系统异常，请到后台的log目录中检查异常原因"
  },
  "102001": {
    en: "system exception: please check front",
    zh: "系统错误，请到节点前置的log目录中检查异常原因"
  },
  "102002": {
    en: "No group belongs to this groupId(node not belongs to this group)",
    zh: "没有群组属于这个群组id（节点不属于这个群组），请检查节点日志进行排查"
  },
  "102003": {
    en:
      "When webase is v1.3.2 above(inclusive),fisco-bcos node must be v2.4.1 above(inclusive)",
    zh:
      "当webase为v1.3.2以上版本（含）时，fisco bcos节点必须为v2.4.1以上版本（含）"
  },
  "103001": {
    en: "WeBASE-Sign system exception",
    zh: "WeBASE-Sign系统异常，请到sign后台的log目录中检查异常原因"
  },
  "201001": {
    en: "groupId cannot be empty",
    zh: "groupId参数不能为空，请刷新试试"
  },
  "201002": {
    en: "user cannot be empty",
    zh: "用户编号参数不能为空"
  },
  "201004": {
    en: "version cannot be empty",
    zh: "版本号参数不能为空"
  },
  "201005": {
    en: "funcName cannot be empty",
    zh: "合约的方法名参数不能为空"
  },
  "201006": {
    en: "abiInfo cannot be empty",
    zh: "abi参数内容不能为空"
  },
  "201007": {
    en: "bytecodeBin cannot be empty",
    zh: "合约bin参数不能为空"
  },
  "201009": {
    en: "contract is not deployed",
    zh: "合约未部署，请先部署后再进行调用"
  },
  "201010": {
    en: "save abi error",
    zh: "合约abi保存错误"
  },
  "201011": {
    en: "contract's parameter is error",
    zh: "合约的入参错误，请检查参数格式、类型是否匹配"
  },
  "201012": {
    en: "requst blockNumber is greater than latest",
    zh: "请求的块高大于链上最新块高，请输入正确的块高"
  },
  "201013": {
    en: "get abi error",
    zh: "从链上获取abi失败"
  },
  "201014": {
    en: "contract deploy error",
    zh: "合约部署错误，请检查合约的构造函数入参或检查链状态"
  },
  "201015": {
    en: "user's privateKey is null",
    zh: "当前调用的user私钥为空，请检查user是否存在"
  },
  "201016": {
    en: "file is not exist",
    zh: "文件不存在"
  },
  // "201017": {
  //     en: "failed to get node config",
  //     zh: '获取节点配置失败'
  // },
  "201017": {
    en: "contract's current version has been deployed",
    zh: "合约的当前版本已部署"
  },
  "201018": {
    en: "blockNumber and pbftView unchanged",
    zh: "块高和pbftview无增长，请检查节点状态"
  },
  "201019": {
    en: "request function is error",
    zh: "请求的函数不存在或错误"
  },
  "201020": {
    en: "transaction query from chain failed",
    zh: "链上查询交易失败，请检查参数"
  },
  "201021": {
    en: "transaction send to chain failed",
    zh: "交易上链超时，请检查链的共识状态是否正常"
  },
  "201022": {
    en: "node request failed",
    zh: "节点请求失败，请检查节点的共识状态是否正常"
  },
  "201023": {
    en: "contract already exists",
    zh: "合约已存在"
  },
  "201024": {
    en: "contract name cannot be repeated",
    zh: "合约名称不能重复"
  },
  "201025": {
    en: "invalid contract id",
    zh: "合约ID无效"
  },
  "201026": {
    en: "contract has been deployed",
    zh: "合约已部署"
  },
  "201027": {
    en: "send abiInfo fail",
    zh: "发送abi失败"
  },
  "201028": {
    en: "contractbin is null",
    zh: "合约bin为空"
  },
  "201029": {
    en: "contractAddress is null",
    zh: "合约地址为空"
  },
  "201030": {
    en: "contractAddress invalid",
    zh: "合约地址无效"
  },
  "201031": {
    en: "privateKey decode fail, please check base64 format",
    zh: "私钥解码失败，请检查私钥是否使用base64进行编码"
  },
  "201032": {
    en: "not found config of keyServer",
    zh: "找不到keyServer（WeBASE-Sign）的配置"
  },
  "201033": {
    en: "data request sign error",
    zh: "访问webase-sign失败，请检查配置是否正确，网络是否正常"
  },
  "201034": {
    en: "groupId not exist",
    zh: "groupId在链上不存在，请检查节点中的群组列表"
  },
  "201035": {
    en: "version and address cannot all be  null",
    zh: "合约地址不能为空"
  },
  "201037": {
    en: "user name is null",
    zh: "用户名为空"
  },
  "201038": {
    en: "user name already exists",
    zh: "用户名已经存在"
  },
  "201039": {
    en: "private key already exists",
    zh: "私钥已存在"
  },
  "201040": {
    en: "private key not exists",
    zh: "私钥不存在"
  },
  "201041": {
    en: "external user's appId and signUserId cannot be empty",
    zh: "外部用户的appId和signUserId不能为空"
  },
  "201042": {
    en: "There is no sol files in source",
    zh: "源文件中没有sol文件"
  },
  "201043": {
    en: "Invalid group operate type",
    zh: "无效的群组操作类型，请参考接口文档传入对应的参数"
  },
  "201044": {
    en: "Invalid data type",
    zh: "无效的数据类型"
  },
  "201045": {
    en: "Encode string can not be empty",
    zh: "用于签名的交易编码字符串不能为空"
  },
  "201046": {
    en: "Transaction failed!",
    zh: "上链交易失败，请检查交易格式或链状态"
  },
  "201100": {
    en: "Params not fit",
    zh: "参数不正确，请检查参数的长度、格式、类型是否匹配"
  },
  "201101": {
    en: "GroupId cannot be empty",
    zh: "群组不能为空"
  },
  "201102": {
    en: "TableName cannot be empty",
    zh: "表名不能为空"
  },
  "201103": {
    en: "Permission type cannot be empty",
    zh: "权限类型不能为空"
  },
  "201104": {
    en: "PermissionType not exists",
    zh: "权限类型不存在"
  },
  "201105": {
    en: "From address cannot be empty",
    zh: "交易的发起私钥from地址不能为空"
  },
  "201106": {
    en: "Contract name cannot be empty",
    zh: "合约名称不能为空"
  },
  "201107": {
    en: "System config key cannot be empty",
    zh: "系统配置key不能为空"
  },
  "201108": {
    en: "System config value cannot be empty",
    zh: "系统配置的value不能为空"
  },
  "201109": {
    en: "Node id cannot be empty",
    zh: "节点id不能为空"
  },
  "201110": {
    en: "Node type cannot be empty",
    zh: "节点类型不能为空"
  },
  "201111": {
    en: "Permission state cannot be all empty",
    zh: "权限状态不能全部为空"
  },
  "201112": {
    en: "contract address cannot be empty",
    zh: "合约地址不能为空"
  },
  "201120": {
    en: "Group operate fail",
    zh: "群组操作失败"
  },
  "201121": {
    en: "Node internal error",
    zh: "节点内部错误，请查看节点日志进行排查"
  },
  "201122": {
    en: "Group already exists",
    zh: "该群组已存在"
  },
  "201123": {
    en: "Group already running",
    zh: "群组已处于运行状态"
  },
  "201124": {
    en: "Group already stopped",
    zh: "群组已处于停止状态"
  },
  "201125": {
    en: "Group already deleted",
    zh: "群组已处于删除状态"
  },
  "201126": {
    en: "Group not found",
    zh: "群组不存在"
  },
  "201127": {
    en: "Group operate param error",
    zh: "群组操作的参数错误"
  },
  "201128": {
    en: "Group peers not connected",
    zh: "群组内的节点连接异常，请检查节点日志"
  },
  "201129": {
    en: "Group genesis conf already exists",
    zh: "创世块配置文件已存在"
  },
  "201130": {
    en: "Group config.ini already exists",
    zh: "群组配置文件已存在"
  },
  "201131": {
    en: "Group genesis conf not found",
    zh: "群组配置文件不存在，无法添加该节点为共识节点"
  },
  "201132": {
    en: "Group config.ini not found",
    zh: "未找到群组配置文件"
  },
  "201133": {
    en: "Group is stopping",
    zh: "群组正在停止"
  },
  "201134": {
    en: "Group not deleted",
    zh: "群组并未被删除"
  },
  "201151": {
    en: "Unsupported contract param type to encoded",
    zh: "合约交易入参错误，请检查入参个数与入参值是否与ABI匹配"
  },
  "201152": {
    en: "Unsupported contract param type to decoded",
    zh: "合约的返回值解析失败，请查看后台日志进行排查"
  },
  "201153": {
    en: "Unable to create instance of type, check input params",
    zh: "合约的输入参数格式错误，请参考交易提示或合约参数类型进行检查"
  },
  "201154": {
    en: "contract path is exists.",
    zh: "目录已存在。"
  },
  "201155": {
    en: "contract path cannot be empty.",
    zh: "合约路径不能为空"
  },
  "201156": {
    en: "Write front's sdk cert and key fail!",
    zh: "前置的sdk证书和私钥生成失败，请查看后台日志进行排查"
  },
  "201161": {
    en: "Generate project failed in scaffold",
    zh: "项目Scaffold脚手架生成失败，请查看后台日志进行排查"
  },
  "201200": {
    en: "Params not fit",
    zh: "参数不合适，请检查参数格式、类型是否匹配"
  },
  "201201": {
    en: "Address is invalid",
    zh: "地址格式不正确"
  },
  "201202": {
    en: "Permission denied, please check chain administrator permission",
    zh: "权限被拒绝，请检查该私钥用户是否具有权限进行操作"
  },
  "201203": {
    en: "Node id is invalid",
    zh: "节点ID不正确"
  },
  "201204": {
    en: "Invalid node type: sealer, observer, remove",
    zh: "节点类型错误，仅支持：sealer，observer，remove"
  },
  "201205": {
    en: "Permission denied or params error, set system config value fail",
    zh:
      "权限被拒绝或params错误，设置系统配置失败，请检查该私钥用户是否具有权限进行操作"
  },
  "201206": {
    en: "Create system config in db fail for already exist",
    zh: "在数据库中为已存在的创建系统配置失败"
  },
  "201207": {
    en: "System config key is invalid",
    zh: "系统配置的key值不正确"
  },
  "201208": {
    en: "Unsupported for this system config key",
    zh: "不支持修改该系统配置"
  },
  "201209": {
    en: "Provide value by positive integer mode, from 100000 to 2147483647",
    zh: "该参数仅支持正整数，范围为100000到2147483647"
  },
  "201210": {
    en: "Set system config value fail for params error or permission denied",
    zh: "设置参数错误的系统配置值失败或权限被拒绝"
  },
  "201211": {
    en: "Auth check status already is 1(enabled), cannot disabled now",
    zh: "权限校验已开启，暂不支持关闭校验"
  },
  "201213": {
    en: "address is invalid",
    zh: "address地址无效"
  },
  "201216": {
    en: "Node id is invalid",
    zh: "节点id无效"
  },
  "201217": {
    en: "Invalid node type: sealer, observer, remove",
    zh: "错误的节点类型，仅支持：sealer、observer、remove"
  },
  "201218": {
    en:
      "Set node consensus type fail, check permission or node's group config file",
    zh: "设置节点共识类型失败，请检查该用户私钥的权限或检查节点的群组配置文件"
  },
  "201221": {
    en:
      "Contract version should only contains 'A-Z' or 'a-z' or '0-9' or dot mark ",
    zh: "合约版本应仅包含“A-Z”或“A-Z”或“0-9”或点标记"
  },
  "201222": {
    en: "Version of contract is out of length",
    zh: "合约版本号过长"
  },
  "201223": {
    en: "CNS register fail ",
    zh: "CNS注册失败"
  },
  "201224": {
    en: "Version not exists",
    zh: "版本不存在"
  },
  "201225": {
    en: "CNS name cannot be empty",
    zh: "CNS名称不能为空"
  },
  "201226": {
    en: "sql syntax error",
    zh: "sql语法错误"
  },
  "201227": {
    en: "crud sql fail",
    zh: "crud sql fail"
  },
  "201228": {
    en: "Table not exists",
    zh: "表不存在"
  },
  "201231": {
    en: "Cert file not found, please check cert path in config",
    zh: "找不到证书文件，请检查配置中的证书路径"
  },
  "201232": {
    en: "Pem file format error, must surrounded by -----XXXXX PRIVATE KEY-----",
    zh: "Pem文件格式错误，必须包含-----XXXXX PRIVATE KEY----- "
  },
  "201233": {
    en: "Pem file content error",
    zh: "Pem文件内容错误"
  },
  "201235": {
    en: "P12's password cannot be chinese",
    zh: "p12密码不能为中文"
  },
  "201236": {
    en: "P12's password not match ",
    zh: "p12的密码错误"
  },
  "201237": {
    en: "P12 file content error",
    zh: "p12文件内容的格式错误"
  },
  "201241": {
    en:
      "Exchange or message queue not exists, please check mq server or mq configuration",
    zh: "Exchange或消息队列不存在，请检查mq服务器或mq配置"
  },
  "201242": {
    en: "Database error: data already exists in db",
    zh: "数据库错误：数据库中已存在数据"
  },
  "201243": {
    en:
      "Block range error, from/toBlock must greater than 0, toBlock must be greater than fromBlock",
    zh: "块范围错误，from/toBlock必须大于0，toBlock必须大于fromBlock"
  },
  "201244": {
    en: "Database error: data not exists in db, please check your params",
    zh: "数据库错误：数据库中不存在数据，请检查参数"
  },
  "201245": {
    en: "Only support letter and digit, please check your params",
    zh: "仅支持字母和数字，请检查您的参数"
  },
  "201246": {
    en: "Register contractEvent failed, please check your param",
    zh: "注册contractEvent失败，请检查您的参数"
  },
  "201248": {
    en: "Contract abi invalid, please check abi",
    zh: "合约ABI校验错误，请检查ABI参数格式"
  },
  "201255": {
    en: "Contract address already exists",
    zh: "合约地址已存在"
  },
  "201256": {
    en: "Abi info of this id not exists",
    zh: "此ID的ABI信息不存在"
  },
  "201257": {
    en: "ABI Id cannot be empty",
    zh: "ABI Id不能为空"
  },
  "201263": {
    en: "Solc js file name already exist",
    zh: "文件名已存在"
  },
  "201265": {
    en: "Read solc js file error, please check if file deleted",
    zh: "读取solc js文件错误，请检查文件是否已删除"
  },
  "201311": {
    en: "get event callback fail for time out",
    zh: "获取事件回调超时失败"
  },
  "201312": {
    en: "get event callback error",
    zh: "获取事件回调错误"
  },
  "201501": {
    en: "web3sdk create key pair fail and return null",
    zh: "sdk创建私钥失败并返回Null，请查看后台日志进行排查"
  },
  "201502": {
    en: "pem/p12 manager get key pair error for input params",
    zh: "从pem/p12证书获取私钥失败，请检查入参"
  },
  "201503": {
    en: "pem/p12 manager get key pair error for bc dependency error",
    zh: "pem/p12证书获取私钥对失败，检查bc依赖包版本或检查后台日志进行排查"
  },
  "201504": {
    en: "sign service return error",
    zh: "签名服务返回异常，请检查签名服务或检查私钥是否存在"
  },
  "201510": {
    en: "transaction receipt of this hash not exist",
    zh: "此哈希的交易回执不存在"
  },
  "201511": {
    en: "block of this hash not exist",
    zh: "此哈希的块不存在"
  },
  "201512": {
    en: "call contract error for io exception",
    zh: "调用合约的交易上链失败，请检查参数的长度、格式、类型是否匹配"
  },
  "201513": {
    en: "get transaction receipt fail for exec",
    zh: "获取交易回执失败，返回执行错误，请查看后台日志进行排查"
  },
  "201514": {
    en: "get transaction receipt fail for time out",
    zh: "获取交易回执失败，请求超时，请检查节点状态"
  },
  "201515": {
    en: "transaction receipt fail and parse output fail",
    zh: "交易回执中output输出值解码失败，请查看后台日志进行排查"
  },
  "201516": {
    en: "transaction receipt fail and output is null",
    zh: "交易回执output为空"
  },
  "201517": {
    en: "call contract constant method fail",
    zh: "调用合约constant方法失败，请检查参数的长度、格式、类型是否匹配"
  },
  "201518": {
    en: "get message's hash fail",
    zh: "获取哈希失败，，请检查参数的长度、格式、类型是否匹配"
  },
  "201521": {
    en: "get list of manager on chain fail",
    zh: "获取链上管理员列表失败，请查看后台日志进行排查"
  },
  "201522": {
    en: "table key length error",
    zh: "用户表的键值长度大于最大值255"
  },
  "201523": {
    en: "crud's param parse json error",
    zh: "CRUD方法的入参转Entry/Condition失败，请检查入参"
  },
  "201524": {
    en: "precompiled common transfer to json fail",
    zh: "预编译错误码转JSON失败"
  },
  "201600": {
    en: "BcosSDK is empty, call config api to init one bcosSDK",
    zh: "前置连接节点失败，调用config api来初始化一个BcosSDK"
  },
  "201601": {
    en: "Sdk's peers cannot be empty",
    zh: "Sdk的peers配置不能为空"
  },
  "201602": {
    en: "Sdk's sdk certificates and key cannot be empty",
    zh: "Sdk的Sdk证书和密钥不能为空"
  },
  "201603": {
    en: "Sdk's peers same with new peers",
    zh: "Sdk的peers与新peers相同"
  },
  "201604": {
    en: "webase-front connect to new peers ip port failed!",
    zh: "节点前置连接到新peers IP端口失败!"
  },
  "201605": {
    en: "Build client instance of new group failed",
    zh: "创建新群组的Client实例失败，请检查前置日志进行排查"
  },
  "201606": {
    en: "This group only support Liquid contract of wasm",
    zh: "当前群组仅支持Liquid合约"
  },
  "201607": {
    en: "This group not connected with front's rpc peers",
    zh: "节点前置无法通过已连接的rpc节点访问该群组，请检查前置日志进行排查"
  },
  "201608": {
    en: "Deploying contract not match with the group(solidity/liquid)",
    zh: "部署的合约与群组的合约类型不匹配(solidity/liquid)"
  },
  "201609": {
    en: "This liquid contract already compiling, please wait...",
    zh: "liquid合约编译中，请稍候..."
  },
  "201610": {
    en: "Contract compile task not exist",
    zh: "合约编译任务不存在，请重试"
  },
  "201621": {
    en: "Sealer's weight cannot be null",
    zh: "共识节点的权重值不可为空"
  },
  "201622": {
    en: "Proposal is voting, the previous vote need to be finished",
    zh: "提案正在投票，需要完成上一次投票"
  },
  "201623": {
    en: "The proposal is not votable , please ensure the proposal",
    zh: "提案不可投票，请确保提案有效"
  },
  "201624": {
    en: "The account address has already voted the proposal",
    zh: "账户地址已对提案进行投票"
  },
  "201625": {
    en: "The proposal is not exist",
    zh: "提案不存在"
  },
  "201626": {
    en: "Only newly created proposal can be revoked",
    zh: "只能撤销新创建的提案"
  },
  "201627": {
    en: "Current proposal not end",
    zh: "当前提案未结束"
  },
  "201631": {
    en: "Java Command exec timeout",
    zh: "Liquid命令执行超时，请查看后台日志进行排查"
  },
  "201632": {
    en: "Java Command return error",
    zh: "Liquid命令返回错误，请检查日志"
  },
  "201633": {
    en: "When deploying liquid, contract address must not be empty",
    zh: "部署liquid时，合约地址不得为空"
  },
  "201634": {
    en: "Liquid environment not configured in the host of webase-front",
    zh: "webbase-front主机中未配置Liquid环境，请先按节点前置文档进行配置"
  },
  "201635": {
    en:
      "Create new liquid project failed, please check 'liquid' directory in webase-front",
    zh: "创建新的Liquid项目失败，请检查webbase-front中的“liquid”目录"
  },
  "201636": {
    en: "Create new liquid project and set gitee url failed",
    zh: "创建新的Liquid项目并设置gitee url 失败，请查看节点前置后台日志进行排查"
  },
  "201637": {
    en: "Write liquid contract source into lib.rs file failed",
    zh: "将Liquid合约资源写入lib.rs文件失败，请查看节点前置后台日志进行排查"
  },
  "201638": {
    en: "Compile liquid contract failed, please check contract source",
    zh: "编译Liquid合约失败，请查看合约资源，请查看节点前置后台日志进行排查"
  },
  "201639": {
    en:
      "Liquid compile target file not exist, please check 'liquid' directory in webase-front",
    zh: "Liquid编译目标文件不存在，请检查webbase-front中的'liquid'目录"
  },
  "201640": {
    en:
      "Read liquid contract's abi and bin file failed, please check 'liquid' directory in webase-front",
    zh: "读取Liquid合约的abi和bin文件失败，请检查webbase-front中的'liquid'目录"
  },
  "201665": {
    en: "Build eventSubscribe instance of new group failed",
    zh: "创建新群组的EventSub实例失败，请检查前置日志进行排查"
  },
  "201670": {
    en: "exec env is wasm, don't support",
    zh: "Wasm环境，不支持solidity操作"
  },
  "201672": {
    en: "the account must be the proposer of proposal",
    zh: "该帐户必须是提案的提议者"
  },
  "201680": {
    en: "the PATH is invalid",
    zh: "路径PATH无效"
  },
  "202000": {
    en: "invalid node info",
    zh: "错误的节点信息"
  },
  "202001": {
    en: "database exception",
    zh: "数据库异常，请查看后台日志进行排查"
  },
  "202002": {
    en: "not found any front for this group",
    zh: "组织已经存在"
  },
  "202003": {
    en: "organization not exists",
    zh: "组织信息不存在"
  },
  "202004": {
    en: "node already exists",
    zh: "节点已经存在"
  },
  "202005": {
    en: "network id cannot be empty",
    zh: "网络编号不能为空"
  },
  "202006": {
    en: "invalid network id",
    zh: "无效的网络编号"
  },
  "202007": {
    en: "organization id cannot be empty",
    zh: "组织编号不能为空"
  },
  "202008": {
    en: "invalid organization id",
    zh: "无效的组织编号"
  },
  "202009": {
    en: "network_organization_mapping already exists",
    zh: "已有该网络和组织的关联"
  },
  "202010": {
    en: "network_organization_mapping not exist",
    zh: "没有该组织和网络的关联信息"
  },
  "202011": {
    en: "did not find the current organization",
    zh: "未找到本组织信息"
  },
  "202012": {
    en: "user id cannot be empty",
    zh: "用户编号不能为空"
  },
  "202013": {
    en: "invalid user id",
    zh: "无效的用户编号"
  },
  "202014": {
    en: "user already exists",
    zh: "用户信息已经存在"
  },
  "202015": {
    en: "contract already exists",
    zh: "合约信息已经存在"
  },
  "202016": {
    en: "contract id cannot be empty",
    zh: "合约编号不能为空"
  },
  "202017": {
    en: "invalid contract id",
    zh: "无效的合约编号"
  },
  "202018": {
    en: "invalid param info",
    zh: "无效的入参信息"
  },
  "202019": {
    en: "did not find node info",
    zh: "未找到节点信息"
  },
  "202020": {
    en: "current organization already exist",
    zh: "已存在本组织信息"
  },
  "202021": {
    en: "invalid organization type",
    zh: "无效的组织类型"
  },
  "202022": {
    en: "unable to delete deployed contract",
    zh: "不能删除已部署的合约"
  },
  "202023": {
    en: "node ip cannot be empty",
    zh: "节点编号不能为空"
  },
  "202024": {
    en: "node p2p port cannot be empty",
    zh: "节点p2p端口不能为空"
  },
  "202025": {
    en: "did not find node log",
    zh: "找不到节点日志"
  },
  "202026": {
    en: "account info already exists",
    zh: "该帐号已经存在"
  },
  "202027": {
    en: "ccount info not exists",
    zh: "该帐号不存在"
  },
  "202028": {
    en: "account name empty",
    zh: "帐号名称不能为空"
  },
  "202029": {
    en: "invalid account name",
    zh: "无效的账号名称"
  },
  "202030": {
    en: "password error",
    zh: "密码错误"
  },
  "202031": {
    en: "role id cannot be empty",
    zh: "角色编号不能为空"
  },
  "202032": {
    en: "invalid role id",
    zh: "无效的角色编号"
  },
  "202033": {
    en: "invalid attr",
    zh: "无效的attr值"
  },
  "202034": {
    en: "login fail",
    zh: "登录失败，请检查密码或后台服务是否正常"
  },
  "202035": {
    en: "contract has been deployed",
    zh: "该合约已经部署"
  },
  "202036": {
    en: "publicKey cannot be empty",
    zh: "公钥不能为空"
  },
  "202037": {
    en: "user does not exist",
    zh: "用户信息不存在"
  },
  "202038": {
    en: "interface does not exist",
    zh: "接口不存在"
  },
  "202039": {
    en: "do not save this block height",
    zh: "块高参数错误"
  },
  "202040": {
    en: "contract deploy not success",
    zh: "合约部署失败，请检查合约的构造函数入参或检查链状态"
  },
  "202041": {
    en: "invalid user index",
    zh: "错误的用户id"
  },
  "202042": {
    en: "invalid contract index",
    zh: "错误的合约id"
  },
  "202043": {
    en: "did not found system contract:contractDetail",
    zh: "找不到系统合约【contractDetail】"
  },
  "202044": {
    en: "did not found system contract:user",
    zh: "找不到系统合约【user】"
  },
  "202045": {
    en: "the new password cannot be same as old",
    zh: "新旧密码不能一致"
  },
  "202046": {
    en: "contract has not compiled",
    zh: "合约的abi或bin为空，请先编译合约。"
  },
  "202047": {
    en: "did not found system contract:node",
    zh: "找不到系统合约【node】"
  },
  "202048": {
    en: "invalid node id",
    zh: "无效的节点id"
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
    en: "invalid node ip",
    zh: "IP或者端口错误"
  },
  "202052": {
    en: "did not find current node info",
    zh: "找不到当前节点信息"
  },
  "202053": {
    en: "system user has not been initialized yet",
    zh: "系统用户尚未初始化"
  },
  "202054": {
    en: "contract had not deploy",
    zh: "合约尚未部署"
  },
  "202055": {
    en: "invalid contract",
    zh: "无的合约"
  },
  "202058": {
    en: "not support transaction",
    zh: "不支持发交易"
  },
  "202060": {
    en: "cert handle error",
    zh: "证书句柄错误，请查看后台日志进行排查"
  },
  "202061": {
    en: "store cert error",
    zh: "存储证书错误，请查看后台日志进行排查"
  },
  "202062": {
    en:
      "cert format error, must start with -----BEGIN CERTIFICATE-----\\n, end with end",
    zh: "证书格式错误，必须由 --BEGIN CERTIFICATE-- 包围"
  },
  "202063": {
    en: "saving front's cert error",
    zh: "保存前置证书错误，请查看后台日志进行排查"
  },
  "202070": {
    en: "Mail server config error.",
    zh: "邮件服务器配置错误，请查看后台日志进行排查"
  },
  "202071": {
    en: "Mail server config param empty/not match",
    zh: "邮件服务器配置参数为空/不匹配"
  },
  "202072": {
    en: "Mail server config error, db's server config is empty",
    zh: "邮件服务器配置错误，数据库的存储的配置为空"
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
    zh: "发送邮件错误，请检查邮件服务器配置，请查看后台日志进行排查"
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
    zh: "Front的加密类型与node-mgr不匹配"
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
  "202300": {
    en: "Group id already exists",
    zh: "群组id已存在"
  },
  "202301": {
    en: "Node's front not exists",
    zh: "节点请求失败，请查看后台日志进行排查"
  },
  "202310": {
    en: "govern vote record not exist",
    zh: "投票记录不存在"
  },
  "202311": {
    en: "permission denied on chain",
    zh: "链上权限被拒绝，请检查私钥用户的权限"
  },
  "202321": {
    en: "path contains deployed contract, please delete one by one.",
    zh: "路径包含已部署的合约，请逐个删除。"
  },
  "202322": {
    en: "contract path cannot be blank(use '/' instead)",
    zh: "合同路径不能为空（请改用“/”）"
  },
  "202323": {
    en: "privateKey decode fail",
    zh: "私钥解码失败"
  },
  "202324": {
    en: "password decode fail",
    zh: "密码解码错误"
  },
  "202401": {
    en: "No configured of docker registry url.",
    zh: "没有配置 Docker 镜像更新 URL 地址"
  },
  "202402": {
    en: "Fetch image tag from docker registry error.",
    zh: "从 Docker 源更新镜像版本失败，请重试或检查网络"
  },
  "202403": {
    en: "Fetch Docker image tag list error, unknown config type.",
    zh: "查询 Docker 镜像版本失败（未知类型）"
  },
  "202404": {
    en: "Save chain's configuration to file error.",
    zh: "保存链配置信息文件失败，请重试或查看后台日志进行排查"
  },
  "202405": {
    en: "Docker image tag invalid.",
    zh: "错误的镜像版本"
  },
  "202406": {
    en: "Configuration of host is empty.",
    zh: "主机配置参数为空"
  },
  "202407": {
    en: "Chain exists, deploy failed.",
    zh: "链已存在，部署失败。请等待上次部署操作完成后再进行下一步"
  },
  "202408": {
    en: "Save chain data to DB error.",
    zh: "插入链信息到数据库失败"
  },
  "202409": {
    en: "Chain root dir exist, please move it manually.",
    zh: "链的根目录default_chain_nodes已存在，请移除脏数据文件"
  },
  "202410": {
    en: "Execute build_chain.sh script error.",
    zh: "执行 build_chain.sh 链生成脚本失败，请重试或查看后台日志进行排查"
  },
  "202411": {
    en: "Host, agency, group configuration error.",
    zh: "主机，机构，群组配置信息错误，请重试或查看后台日志进行排查"
  },
  "202412": {
    en: "Host ip and num error.",
    zh: "主机 IP，节点数量配置错误"
  },
  "202413": {
    en: "Agency name invalid, only [a-zA-Z0-9_] is valid.",
    zh: "机构名称格式错误，只能包含大小写字母，数字，下划线"
  },
  "202414": {
    en: "Group id error, only positive integer is valid.",
    zh: "群组编号格式错误，必须为正整数"
  },
  "202415": {
    en: "Login to host /ip/ through SSH error. Please check SSH configuration.",
    zh: "SSH登录主机/ip/失败，请检查 SSH 配置或查看网络是否互通"
  },
  "202416": {
    en: "Save agency data into DB error.",
    zh: "插入新机构信息到数据库失败"
  },
  "202417": {
    en: "Save group data into DB error.",
    zh: "插入新群组信息到数据库失败"
  },
  "202418": {
    en: "Save host data into DB error.",
    zh: "插入主机信息到数据库失败"
  },
  "202419": {
    en: "Save front data into DB error.",
    zh: "插入前置信息到数据库失败"
  },
  "202420": {
    en: "Save node data into DB error.",
    zh: "插入节点信息到数据库失败"
  },
  "202421": {
    en: "Save node and front mapping data into DB error.",
    zh: "插入前置和群组映射关系到数据库失败"
  },
  "202422": {
    en: "Parse node index from directory error.",
    zh: "从目录获取节点序号失败"
  },
  "202423": {
    en: "A single host IP only belongs to one agency.",
    zh: "一个 IP 主机，只能属于一个机构"
  },
  "202424": {
    en: "Unknown error during deploying.",
    zh: "部署时发生未知错误，请重试或查看后台日志进行排查"
  },
  "202425": {
    en: "SSH login through username and password is unsupported yet.",
    zh: "不支持使用 SSH 密码登录主机，请配置ssh免密登录"
  },
  "202426": {
    en: "Chain has no agency.",
    zh: "当前链没有所属机构"
  },
  "202427": {
    en: "No deployed chain,",
    zh: "链未部署或链不存在"
  },
  "202428": {
    en: "IP format error.",
    zh: "IP 格式错误"
  },
  "202429": {
    en: "Agency name cannot be blank when IP is new.",
    zh: "主机 IP 是新 IP 时，机构名称不能为空"
  },
  "202430": {
    en: "Agency name already exists.",
    zh: "存在同名机构"
  },
  "202431": {
    en: "Add new node error.",
    zh: "新增节点错误，请重试或查看后台日志进行排查"
  },
  "202432": {
    en: "No valid chain certification.",
    zh: "链证书无效"
  },
  "202433": {
    en: "Generate agency private key and crt file error.",
    zh: "生成机构私钥和证书失败，请重试或查看后台日志进行排查"
  },
  "202434": {
    en: "Host without agency error.",
    zh: "主机所属机构为空"
  },
  "202435": {
    en: "Node num should be positive integer, and less then 10.",
    zh: "主机数量格式错误，正整数，并且小于 10"
  },
  "202436": {
    en: "Generate sdk ",
    zh: "生成主机 SDK 私钥和证书失败，请重试或查看后台日志进行排查"
  },
  "202437": {
    en: "Generate node private key and crt files error.",
    zh: "生成新节点私钥和证书失败，请重试或查看后台日志进行排查"
  },
  "202438": {
    en: "Copy SDK files error.",
    zh: "拷贝 SDK 证书和私钥失败，请重试或查看后台日志进行排查"
  },
  "202439": {
    en: "Upload SDK files error.",
    zh: "上传 SDK 证书和私钥失败，请重试或查看后台日志进行排查"
  },
  "202440": {
    en: "Upload node config files error.",
    zh: "上传节点证书和私钥失败，请重试或查看后台日志进行排查"
  },
  "202441": {
    en: "Copy group config files from original node error.",
    zh: "从旧节点复制群组配置文件失败，请重试或查看后台日志进行排查"
  },
  "202442": {
    en: "Delete tmp directory of agency error.",
    zh: "删除机构临时目录失败，请重试或查看后台日志进行排查"
  },
  "202443": {
    en: "Delete tmp directory of SDK error.",
    zh: "删除 SDK 临时目录失败，请重试或查看后台日志进行排查"
  },
  "202444": {
    en: "Delete tmp directory of node error.",
    zh: "删除节点临时目录失败，请重试或查看后台日志进行排查"
  },
  "202445": {
    en: "Unknown nodeid.",
    zh: "无法识别的的节点编号（nodeid），请重试或查看后台日志进行排查"
  },
  "202446": {
    en: "Stop node error.",
    zh: "停止节点失败（停止容器），请重试或查看后台日志进行排查"
  },
  "202447": {
    en: "Start node error.",
    zh: "启动节点失败（启动容器），请重试或查看后台日志进行排查"
  },
  "202448": {
    en: "Both new image tag and old are the same.",
    zh: "链升级的新版本和链的现有版本相同"
  },
  "202449": {
    en: "Upgrade chain to new image tag error.",
    zh: "链升级失败，请重试或查看后台日志进行排查"
  },
  "202450": {
    en: "Delete node failed, node is still in group.",
    zh: "节点仍属于群组，删除失败。请先将节点移出群组再操作"
  },
  "202451": {
    en: "Parse node's config files error.",
    zh: "读取节点配置文件失败，请重试或查看后台日志进行排查"
  },
  "202452": {
    en: "Delete node's config error.",
    zh: "删除节点配置文件失败，请重试或查看后台日志进行排查"
  },
  "202453": {
    en: "Stop node before deleting.",
    zh: "节点正在运行，删除失败，请先停止节点"
  },
  "202454": {
    en: "Update p2p part of related nodes error.",
    zh: "更新关联节点 P2P 配置失败，请重试或查看后台日志进行排查"
  },
  "202455": {
    en: "Delete chain error.",
    zh: "删除链失败，请重试或查看后台日志进行排查"
  },
  "202456": {
    en: "Node is still a sealer or observer, delete failed.",
    zh: "节点处于观察或共识状态，删除失败。请先将节点移出群组再操作"
  },
  "202457": {
    en: "Fetch node list from host's configuration files.",
    zh: "从主机配置文件获取节点列表失败，请重试或查看后台日志进行排查"
  },
  "202458": {
    en: "Generate application.yml for front error.",
    zh: "生成前置 application.yml 配置文件失败，请重试或查看后台日志进行排查"
  },
  "202459": {
    en: "Init host with shell script error.",
    zh: "通过脚本初始化主机失败，请重试或查看后台日志进行排查"
  },
  "202460": {
    en: "Sync files error.",
    zh: "传输文件失败，请重试、检查网络状态或查看后台日志进行排查"
  },
  "202461": {
    en: "Host must be all localhost(127.0.0.1) or all non-localhost",
    zh: "主机必须全都是127.0.0.1或都不是127.0.0.1，不能混用"
  },
  "202462": {
    en: "Two nodes at least.",
    zh: "至少两个共识节点才能开始部署"
  },
  "202463": {
    en: "Group need two sealers at least.",
    zh: "群组至少需要两个共识节点。"
  },
  "202464": {
    en: "WebaseSignAddess configuration error in Application.yml",
    zh: "application.yml中的webaseSignAddess配置错误，请检查配置"
  },
  "202465": {
    en:
      "webaseSignAddress cannot be 127.0.0.1 or localhost in application.yml file",
    zh:
      "配置项application.yml文件中webaseSign的地址不能是127.0.0.1或localhost，请修改后台配置"
  },
  "202466": {
    en: "Please pull the Docker image manually in host /ip/",
    zh: "主机上的节点镜像不存在，请检查/ip/！"
  },
  "202467": {
    en: "Max 4 nodes on a single host",
    zh: "单个主机最多部署 4 个节点"
  },
  "202468": {
    en: "Host of WeBASE-Node-Manager's ip is already existed.",
    zh: "节点管理服务主机IP(127.0.0.1)已存在。"
  },
  "202469": {
    en: "Check docker installed and running of host.",
    zh: "检查docker主机的安装和运行情况。"
  },
  "202470": {
    en: "Check host memory not enough for nodes(s).",
    zh:
      "检查主机的free内存不足，无法容纳节点。请切换主机或进行当前主机的内存释放"
  },
  "202471": {
    en: "Check host cpu core count not enough for node.",
    zh: "检查节点的主机cpu核心数不足，请切换主机"
  },
  "202472": {
    en: "Host check had been interrupt.",
    zh: "主机检查被中断，请重试或查看后台日志进行排查。"
  },
  "202473": {
    en: "Host check fail for inpurt param.",
    zh: "检测主机参数错误，请重试或查看后台日志进行排查"
  },
  "202475": {
    en: "Fail to generate chain and front config locally.",
    zh: "本地生成链和前置配置失败，请重试或查看后台日志进行排查。"
  },
  "202476": {
    en: "Not all host init success.",
    zh: "部分主机初始化失败，请重试或查看后台日志进行排查。"
  },
  "202477": {
    en: "Ipconf's node port config error.",
    zh: "Ipconf的节点端口配置错误，请重试或查看后台日志进行排查。"
  },
  "202478": {
    en: "Ipconf not match with deploy info list.",
    zh: "Ipconf与部署信息列表不匹配，请重试或查看后台日志进行排查。"
  },
  "202479": {
    en: "Delete host fail for host contains node(front).",
    zh: "删除主机失败，主机仍包含节点。请先停止主机上的节点"
  },
  "202480": {
    en: "Ansible not installed!",
    zh: "Ansible未安装！"
  },
  "202481": {
    en: "Ansible fetch not support fetch directory.",
    zh: "Ansible fetch不支持拉取目录。"
  },
  "202482": {
    en: "Ansible ping cannot reach target ip.",
    zh: "主机节点无法连通，请检查ansible hosts免密配置。"
  },
  "202483": {
    en: "Ansible init host of image and scp config not all success.",
    zh: "Ansible 初始化主机镜像和scp配置没有全部成功。"
  },
  "202484": {
    en: "Ansible pull docker hub fail.",
    zh: "Ansible连接DockerHub错误。"
  },
  "202485": {
    en: "Ansible pull docker cdn fail.",
    zh: "Ansible连接CDN错误。"
  },
  "202486": {
    en: "Ansible run docker command fail.",
    zh: "Ansible run docker命令失败。"
  },
  "202487": {
    en: "Ansible exec command error.",
    zh: "Ansible 执行远端命令失败。"
  },
  "202488": {
    en: "Ansible exec scp(copy) error.",
    zh: "Ansible 执行 scp（复制）错误。"
  },
  "202489": {
    en: "Ansible exec scp(fetch) error",
    zh: "Ansible 执行 scp (拉取)错误。"
  },
  "202491": {
    en: "Ansible check image exist error for param.",
    zh: "Ansible检查镜像的参数错误。"
  },
  "202492": {
    en: "Ansible check docker container exist error for param.",
    zh: "Ansible检查docker容器的参数错误。"
  },
  "202493": {
    en: "Check host not pass, please check host remark.",
    zh: "主机检测未通过，请查看操作日志。"
  },
  "202494": {
    en: "Check host port is in use, please check host remark.",
    zh: "检测到接口已使用，请查看操作日志。"
  },
  "202495": {
    en: "Host already exist",
    zh: "主机已存在"
  },
  "202496": {
    en: "Host root dir access denied.",
    zh: "主机安装目录无权限，请重试或查看后台日志进行排查。"
  },
  "202497": {
    en: "Host not exist or already been deleted.",
    zh: "主机不存在或已被删除，请重试或查看后台日志进行排查。"
  },
  "202501": {
    en: "Contract path is exists.",
    zh: "目录已存在。"
  },
  "202502": {
    en: "version cannot be empty.",
    zh: "版本不能为空"
  },
  "202503": {
    en: "cns name cannot be empty.",
    zh: "CNS 名不能为空"
  },
  "202504": {
    en: "version already exists.",
    zh: "版本已存在"
  },
  "202511": {
    en: "Front's sdk cert and key not found!",
    zh: "找不到前置sdk证书和密钥，请重试或查看后台日志进行排查"
  },
  "202512": {
    en: "Write front's sdk cert and key fail!",
    zh: "生成前置的sdk证书和密钥失败，请重试或查看后台日志进行排查！"
  },
  "202513": {
    en: "Write private key file fail!",
    zh: "写入密钥文件失败，请重试或查看后台日志进行排查！"
  },
  "202514": {
    en: "Group genesis conf not found",
    zh: "群组配置文件不存在，无法添加该节点为共识节点"
  },
  "202516": {
    en: "app name exists ",
    zh: "应用名称已存在"
  },
  "202517": {
    en: "app name not exists",
    zh: "应用名称不存在"
  },
  "202518": {
    en: "app id not exists",
    zh: "应用编号不存在"
  },
  "202519": {
    en: "link format invalid",
    zh: "链接格式错误"
  },
  "202531": {
    en: "Generate project failed in scaffold",
    zh: "项目Scaffold脚手架生成失败"
  },
  "202532": {
    en: "Get sdk cert/key content map failed",
    zh: "获取SDK证书私钥失败"
  },
  "202534": {
    en: "contract path not exists.",
    zh: "合约路径不存在"
  },
  "202550": {
    en: "Liquid compile error",
    zh: "liquid编译错误，请查看前置或mgr后台日志进行排查"
  },
  "202551": {
    en: "When deploying liquid, contract address must not be empty",
    zh: "部署liquid时，合约地址不得为空"
  },
  "202560": {
    en: "Only support developer or visitor register",
    zh: "只支持开发者或访问者注册"
  },
  "202561": {
    en: "Only admin or self could update account status",
    zh: "只有管理员或自己可以更新帐户状态"
  },
  "202562": {
    en:
      "Account is invalid, please check if frozen or canceld or beyond expiredTime",
    zh: "帐户无效，请检查是否被冻结或取消或超过过期时间"
  },
  "202563": {
    en: "Loading privacy doc of template failed",
    zh: "模板的隐私文档加载失败"
  },
  "202564": {
    en:
      "Send mail failed, please check receiver address or check mail server config",
    zh: "发送邮件失败，请检查收件人地址或检查邮件服务器配置"
  },
  "202565": {
    en: "Account's mobile is empty",
    zh: "用户的手机号为空"
  },
  "202566": {
    en: "Account's mobile already exist!",
    zh: "用户的手机号已存在"
  },
  "203003": {
    en: "Param exception",
    zh: "参数异常，请检查参数格式、类型是否匹配"
  },
  "203004": {
    en: "Sign user id cannot be blank",
    zh: "签名服务的signUserId不能为空"
  },
  "203005": {
    en:
      "Invalid sign user id (max length of 64, only support letter and digit)",
    zh: "错误的签名用户signUserId（最大长度为64，仅支持字母和数字）"
  },
  "203006": {
    en: "App id cannot be blank",
    zh: "应用id不能为空"
  },
  "203007": {
    en: "App id invalid, only support letter and digit",
    zh: "应用id无效，仅支持字母和数字"
  },
  "203008": {
    en: "Encrypt type should be 0 (ecdsa) or 1 (guomi)",
    zh: "加密类型应为0（ecdsa）或1（guomi）"
  },
  "203009": {
    en: "Encoded data string must be hex string",
    zh: "编码的交易字符串必须是十六进制字符串"
  },
  "302000": {
    en: "user not logged in",
    zh: "用户未登录，请先登录后再进行操作"
  },
  "302001": {
    en: "Access denied",
    zh: "没有权限"
  },
  "303001": {
    en: "User of this sign user id is already exists",
    zh: "此用户id的在签名服务中已存在"
  },
  "303002": {
    en: "User does not exist or already been disable",
    zh: "用户不存在或已被禁用"
  },
  "303003": {
    en: "PrivateKey is null",
    zh: "用户的PrivateKey为空，请检查用户私钥是否存在或存在脏数据"
  },
  "303004": {
    en: "PrivateKey decode fail",
    zh: "私钥base64解码失败"
  },
  "303005": {
    en: "PrivateKey format error",
    zh: "PrivateKey base64格式错误"
  },
  "303006": {
    en: "privateKey not support transfer",
    zh: "后台已配置为私钥不支持导出，请先修改配置再进行私钥导出操作"
  },
  "402000": {
    en: "param exception",
    zh: "参数错误，请检查参数格式、类型是否匹配"
  }
};
export function chooseLang(code, value) {
  let lang = localStorage.getItem("lang");
  if (!lang) {
    lang = "zh";
  }
  let message = errCode[code][lang];
  if (value) {
    let oldMessage;
    let arry = message.split("/");
    oldMessage = arry[0] + value + arry[2];
    return oldMessage;
  } else {
    return message;
  }
}
