### v1.3.2 (2020-06-22)

支持WeBASE v1.3.2

**Fix**
- 修复页面展示bugs
- 优化交易调用代码

**兼容性**
- 支持FISCO-BCOS v2.4.0 及以上版本
- WeBASE-Node-Manager v1.3.1+

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。

### v1.3.1 (2020-06-01)

支持WeBASE v1.3.1

**Add**
- 新增合约abi管理，abi解析
- 支持导入.pem/.p12/.txt私钥
- 新增群组管理页面，增加群组状态，用于动态增删启停群组
- 新增节点前置状态展示

**Fix**
- 优化错误提示，在浏览器F12开发模式下可查看具体错误内容

**兼容性**
- 支持FISCO-BCOS v2.2.0 及以上版本
- WeBASE-Node-Manager v1.3.1+
- WeBASE-Front v1.3.0+
- WeBASE-Sign v1.3.0+
- WeBASE-Transaction v1.3.0+

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。

### v1.3.0 (2020-04-29)

支持WeBASE v1.3.0

**Add**
- 新增链上事件通知页面
- 私钥用户新增`signUserId`字段

**Fix**
- 修复solc js文件在国密与非国密的缓存问题
- 完善错误码提示

**兼容性**
- 支持FISCO-BCOS v2.0.0-rc1 版本
- 支持FISCO-BCOS v2.0.0-rc2 版本
- 支持FISCO-BCOS v2.0.0-rc3 版本
- 支持FISCO-BCOS v2.0.0 及以上版本
- WeBASE-Node-Manager v1.3.0+
- WeBASE-Front v1.3.0+
- WeBASE-Sign v1.3.0+
- WeBASE-Transaction v1.3.0+

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。

### v1.2.4 (2020-04-08)

**Fix**
- bugifx: 请求的headers中token字段由“Authorization”改成“AuthorizationToken”
- bugifx: 发交易接口在前后端增加`contractAbi`字段，修复合约重载函数与获取abi失败的问题

**兼容性**
- 支持FISCO-BCOS v2.0.0-rc1 版本
- 支持FISCO-BCOS v2.0.0-rc2 版本
- 支持FISCO-BCOS v2.0.0-rc3 版本
- 支持FISCO-BCOS v2.0.0 及以上版本
- WeBASE-Web v1.2.2+
- WeBASE-Node-Manager v1.2.2+
- WeBASE-Sign v1.2.2+
- WeBASE-Transaction v1.2.2+

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。

### v1.2.2 (2020-01-02)

**Add**
- 支持国密（IDE合约编译）
- 支持中英文切换
- 增加添加前置引导页

**Fix**
- 优化：前置列表增加节点版本

**兼容性**
- 支持FISCO-BCOS v2.0.0-rc1 版本
- 支持FISCO-BCOS v2.0.0-rc2 版本
- 支持FISCO-BCOS v2.0.0-rc3 版本
- 支持FISCO-BCOS v2.0.0 及以上版本
- WeBASE-Front v1.2.2
- WeBASE-Node-Manager v1.2.2

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。


### v1.2.1 (2019-11-22)

**Add**
- 系统监控：邮件服务模块
- 系统监控：邮件告警与告警日志
- 证书管理增加SDK证书

**Fix**
- 优化：节点列表接口增加离线的共识/观察节点
- bugfix：修复区块搜索
- 优化：调整权限管理页面

**兼容性**
- 支持FISCO-BCOS v2.0.0-rc1 版本
- 支持FISCO-BCOS v2.0.0-rc2 版本
- 支持FISCO-BCOS v2.0.0-rc3 版本
- 支持FISCO-BCOS v2.0.0 及以上版本
- WeBASE-Front v1.2.1
- WeBASE-Node-Manager v1.2.1

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。

### v1.2.0 (2019-10-29)

**Add**
- 证书管理页面

**Fix**
- 编译信息显示不全（目前只显示第一条错误）
- 编译信息显示界面优化

**兼容性**
- 支持FISCO-BCOS v2.0.0-rc1 版本
- 支持FISCO-BCOS v2.0.0-rc2 版本
- 支持FISCO-BCOS v2.0.0-rc3 版本
- 支持FISCO-BCOS v2.0.0 及以上版本
- WeBASE-Front v1.2.0
- WeBASE-Node-Manager v1.2.0

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。


### v1.1.0 (2019-09-09)
**Add**
- 查询cns
- 节点共识状态管理
- 配置修改
- CRUD

**Fix**
- 优化：引导用户导入已部署的合约
- bugfix：概览页面节点正常，节点管理界面节点异常
- 优化：默认>=20个就不审计了。此时需要提示用户
- 优化：引导用户导入外部用户
- 批量upload合约


**兼容性**
- 支持FISCO-BCOS v2.0.0-rc1 版本
- 支持FISCO-BCOS v2.0.0-rc2 版本
- 支持FISCO-BCOS v2.0.0-rc3 版本
- 支持FISCO-BCOS v2.0.0 及以上版本
- WeBASE-Node-Manager v1.1.0
- WeBASE-Front v1.1.0

- 详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。


### v1.0.0

(2019-06-27)

WeBASE-Web（微众区块链中间件平台-WeBASE管理平台），使用vue-cli框架，主要提供以下功能：
1. 区块链概览：查看区块链信息；
2. 前置管理：新增前置、拉取该链的所有群组和节点；
3. 合约管理：合约IDE支持本地编写，编译合约，查看历史合约；
4. 私钥管理：管理所有可以发交易的帐号；
5. 联盟治理：监控整条链所有机构所有用户发送交易行为，查看是否有异常用户和异常合约；
6. 帐号管理：只有admin帐号才能查看此功能，可以新增帐号（登录此系统帐号），修改密码等。

