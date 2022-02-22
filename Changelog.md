### v1.5.4(2022-02-22)

**Add**
- 新增右边栏的管理台操作指引

**Fix**
- 优化合约IDE与发交易提示
- 优化登录页“忘记密码“与”验证码加载失败“提示

**兼容性**
- 支持FISCO-BCOS v2.4.x 及以上版本
- WeBASE-Node-Manager v1.5.4+

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。

### v1.5.3(2021-09-27)

**Add**
- 新增数据监控大屏
- 新增导出私钥功能，导出格式为p12
- 新增公钥用户绑定私钥功能
- 新增系统管理中的共识超时时间配置
- 新增WeBASE-Web docker镜像，`webasepro/webase-web:v1.5.3`

**Fix**
- 优化合约IDE回退问题，仅回退到后台记录版本
- 修复合约IDE页面事件bus重复问题
- 修复全量合约/全量用户搜索问题
- 修复合约IDE创建文件夹未自动刷新问题
- 修复交易回执解析中int类型显示为string的显示问题

**兼容性**
- 支持FISCO-BCOS v2.4.x 及以上版本
- WeBASE-Node-Manager v1.5.3+

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。

### v1.5.2(2021-07-16)

**Add**
- 优化合约Java项目导出功能，支持批量编译合约，支持多用户与channel端口检查
- 合约仓库新增资产合约模板
- 优化交易弹窗，支持无私钥用户时直接创建私钥
- 支持开发者导出私钥、支持合约IDE绑定合约地址

**Fix**
- 修复异常合约列表排序
- 修复权限管理页面切换群组问题

**兼容性**
- 支持FISCO-BCOS v2.4.x 及以上版本
- WeBASE-Node-Manager v1.5.2+

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。


### v1.5.1(2021-05-28)

**Add**
- 支持导出合约的Java工程脚手架
- 新增合约仓库
- 新增全量用户/合约通过地址搜索功能

**Fix**
- 合约IDE编译器js切换至WASM版本，并采用Worker加载方式
- 修复部分chrome浏览器加载失败问题
- 修复手机版登陆态过期未跳转到登录页
- 修复无法删除合约目录问题
- 优化开发者模式下数据展示
- 修复合约IDE中合约调用参数为字符串时不能输入空格

**兼容性**
- 支持FISCO-BCOS v2.4.x 及以上版本
- WeBASE-Node-Manager v1.5.1+

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。


### v1.5.0(2021-04-06)

**Add**
- 新增应用管理，支持WeIdentity模板和自定义应用接入
- 新增适配移动端的WeBASE管理台
- 新增节点监控的链上TPS、出块周期、块大小的统计
- 新增合约列表中的已登记合约与链上全量合约视图、新增私钥用户列表中的已登记私钥与链上全量私钥视图
- 支持导出Txt/Pem/P12/WeID私钥文件、支持导出前置的SDK证书

**Fix**
- 支持合约的重复编译、部署等操作
- 修复合约列表搜索合约问题
- 优化设置共识节点的配置文件检测

**兼容性**
- 支持FISCO-BCOS v2.4.x 及以上版本
- WeBASE-Node-Manager v1.5.0+

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。

### v1.4.3(2021-01-27)

**Add**
- 新增主机管理页面，优化可视化部署操作流程，支持同机部署节点、自动拉取镜像等
- 支持明文私钥导入
- 合约编译结果信息显示优化
- 系统合约地址注册合约名称显示
- 支持注册CNS合约

**Fix**
- 修复一些已知bug 
- 合约IDE支持空数组输入

**兼容性**
- 支持FISCO-BCOS v2.4.x 及以上版本
- WeBASE-Node-Manager v1.4.3+

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。


### v1.4.2(2020-12-03)

**Add**
- 支持solidity v0.6版本
- 新增EventLog查询功能
- 合约文件导出

**Fix**
- 优化合约IDE合约加载
- 合约中使用了结构体，不能部署bug修改
- 

**兼容性**
- 支持FISCO-BCOS v2.4.x 及以上版本
- WeBASE-Node-Manager v1.4.2+

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。

### v1.4.1(2020-09-18)

**Add**
- 支持FISCO BCOS 2.5.x及以上版本的权限管理
- 支持动态选择solidity版本
- 新增合约冻结功能
- 新增开发者模式，开发者拥有数据概览、合约部署与调用、私钥管理等功能

**Fix**
- 修复合约IDE在mac无法打开菜单问题

**兼容性**
- 支持FISCO-BCOS v2.4.x 及以上版本
- WeBASE-Node-Manager v1.4.1+

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。



### v1.4.0(2020-08-06)

**Add**
- 在原有先部署链，后添加前置方式的基础上，新增可视化部署界面操作；
- 可视化部署链后，节点的管理操作，包括：新增，启动，停止；
- 可视化部署链后，重置链后重新部署的功能；

**Optimization & Bugfix**
- 兼容 FISCO-BCOS v2.5.x 版本
- 添加前置节点时，增加默认 IP 和 端口提示；
- 左下角展示 WeBASE-Front 和 FISCO-BCOS 版本号

**兼容性**
- 支持FISCO-BCOS v2.4.x（推荐）
- 支持FISCO-BCOS v2.5.x 及以上版本
- WeBASE-Node-Manager v1.4.0+

详细了解,请阅读[**技术文档**](https://webasedoc.readthedocs.io/zh_CN/latest/)。



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

