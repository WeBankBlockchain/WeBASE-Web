export default {
  newNode: [{
    title: '部署节点',
    content: `<div>自动各个主机安装FISCO BCOS 区块链节点 和 WeBASE-Front 节点前置服务
           <br/><br/>
           <p> 部署节点包含三步操作：</p>
           <p>1.&nbsp添加主机</p>
           <p>2.&nbsp选择镜像拉取方式、链版本，在“节点列表”添加节点，初始化主机。各个主机间的P2P端口和前置端口互通，否则将影响节点正常运行</p>
           <p>3.&nbsp初始化完成后，点击“部署”节点，静候几分钟完成搭链</p>
            <br/>
           <p> 检测步骤：</p>
           <p>检测失败的信息将在操作日志中显示：</p>
           <p>-&nbsp如果提示内存不足(Free memory too low)，需要释放主机内存，一节点至少 1G 可用内存(Free memory)</p>
           <p> -&nbsp如果提示端口被占用，可根据提示的端口号，在主机释放端口或删除填入的节点信息，修改后重新填入</p>
           <p> -&nbsp如果提示Docker相关错误，需要到主机确认已安装Docker并已启用，是否已配置Docker组，确保能拉取并运行hello-world镜像</p>
           <p>-&nbsp部分虚拟机缺少bc依赖(提示bc command not found)，需要手动安装bc</p>
           <br/>
           <p> 排除错误原因后，可以点击“检测”按钮，再次检测</p>
           <br/>
           <p> 初始化步骤：</p>
           <p>-&nbsp自动检测并安装相关系统依赖，如netstat, wget等</p>
           <p>-&nbsp加载节点镜像：根据选中的镜像加载方式进行加载（若手动加载则检测镜像已存在于节点主机）</p>
           <p>-&nbsp自动加载镜像时，会在节点主机指定目录中创建download目录，并下载镜像的tar包保存于此；若已存在同名tar包将不重复下载，直接使用已有tar包(docker-fisco-webase.tar)</p>
           <br/>
           <p> 初始化操作预计在两到三分钟内完成，若网速过慢或不稳定建议通过手动加载镜像方式拉取 若初始化失败，则需要结合操作日志排查上述步骤的错误原因，排除主机中存在的问题后，重新执行检测，初始化操作</p>
           <br/>
           <p>“初始化”变成“部署”：</p>
           <p> -&nbsp根据填入的节点信息自动生成链配置与证书</p>
           <p> -&nbsp通过SCP将节点与前置的配置文件、证书传输到各个主机的指定目录下</p>
           <br/>
           <p>生成配置与传输配置完成后，将自动进入链初始化页面，届时将自动启动各个主机的节点，此过程预计需要几分钟时间，直到链状态为“运行”</p>
           <br/>
           <p> 若出现启动失败，需要结合报错提示，检查节点主机状态正常，各个节点主机间端口互通，网速过慢或网络丢包严重等等，排查后，点击“删除链”重置当前的链后，重新尝试建链}}</p></div>`
  }, {
    title: '新增节点',
    content: `<div>完成搭链后，可以通过新增节点给已有链扩容节点，具体操作与“部署节点”相似
            <br/>
            <p>-&nbsp若新节点启动失败，将新节点删除并重新尝试添加即可</p>
            -&nbsp新增节点完成后，需要创建私钥或使用已有私钥，将新节点设为共识节点或观察节点</div>
            `
  }, {
    title: '删除链',
    content: `<div>搭链失败或需要重新建链时，可以删除链后重新搭建。
            <br/>
            <p>详情请参考WeBASE的可视化部署文档。</p>
            <a target='_blank' href='https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Install/visual_deploy.html'>https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Install/visual_deploy.html</a>       
            `
  }, {
    title: '节点列表',
    content: `支持修改节点的共识类型、重启节点、修改节点备注信息（展示于数据大屏）`
  }, {
    title: '新增节点前置',
    content: `<div>WeBASE需要添加节点前置后才能对链进行管理
            <br/>
            <p>点击“添加节点前置”后，填入节点前置所在主机的IP和端口号即可。</p>
            <p>-&nbsp前置列表中展示该前置绑定的链上节点ID</p>
            <p>-&nbsp前置状态展示了前置是否可以访问，若异常则需要检查前置状态</p></div>
            `
  }],
  newNodes: [{
    title: '节点列表',
    content: `节点列表中展示了链网络中的所有节点。
        <br/>
        <br/>
        节点列表可以修改节点的共识类型、修改节点备注信息（展示于数据大屏）。
        <br/>
        <p>-&nbsp节点类型包括“共识”、“观察”、“游离”三种类型；可通过向链上发起交易修改节点的类型</p>
        <p>-&nbsp节点状态定时根据节点出块或视图切换进行判断，若出现异常需要检查节点共识是否正常</p>
         `
  }],
  host: [{
    title: '主机管理',
    content: `<div>主机管理中的主机是用于可视化部署中安装节点的主机（以下简称节点主机）
                <br/>
                <br/>
                <p> “添加主机”时需要填入主机的公网IP或内网IP，并填入保存节点数据的目录</p>
                <br/>
                <p>注意：</p>
                <p>-&nbsp节点主机需要保证WeBASE所在主机的免密登录</p>
                <p>-&nbsp节点主机需要安装docker、配置docker用户组、配置Ansible用户的sudo权限、安装FISCO BOCS节点依赖等</p>
                <p>-&nbsp若填写的是127.0.0.1的主机，则所有节点将只能安装在WeBASE服务所在机器上</p>
                <br/>
                <p>详情请参考WeBASE的可视化部署文档。</p>
                <a target='_blank' href='https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Install/visual_deploy.html'>https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Install/visual_deploy.html</a>s    
                `
  }],
  contractList: [{
      title: '已登记合约列表',
      content: `<div>包含使用WeBASE管理台部署的合约（不包含在WeBASE-Front页面部署的合约）
                <br/>
                <p>-&nbsp可以通过“导入ABI”按钮将节点前置或控制台等其他方式部署的合约导入到WeBASE中进行管理</p>
                <p>-&nbspABI编码功能可以根据合约的ABI与合约方法的入参编码得到交易的input值</p>               
                `
    },
    {
      title: '全量合约列表',
      content: `<div>包含链上部署的所有合约，其中已登记合约会排序在前，未登记的合约（不在WeBASE中部署的合约）
                <br/>
                <p>-&nbsp可以通过“导入ABI”按钮，填入合约ABI和合约名称后导入到WeBASE进行管理</p>                          
                `
    }
  ],
  cnsManagement: [{
    title: 'CNS查询',
    content: `<div>可以根据合约名和合约版本查询CNS记录的所有合约，在WeBASE的“合约IDE”中部署合约时可以勾选“CNS”选项，进行合约部署的同时也注册CNS
                <br/>
                <p>-&nbsp链上CNS可以查询链上CNS注册的合约</p>
                <p>-&nbsp本地CNS会记录在WeBASE中缓存的CNS数据</p>                                         
                `
  }],
  CRUDServiceManagement: [{
    title: 'CRUD',
    content: `<div>CRUD功能通过预编译合约在链上直接创建数据表
                <br/>
                <br/>
                <p> 例如：</p>  
                <p>创建表： create table t_demo(name varchar, item_id varchar, item_name varchar, primary key(name)) </p>  
                <p>插入表记录： insert into t_demo (name, item_id, item_name) values (fruit, 1, apple1) </p>  
                <p>查询表记录： select * from t_demo where name = fruit </p>  
                <p>更新表记录： update t_demo set item_name = orange where name = fruit and item_id = 1 </p>  
                <p>删除表记录： delete from t_demo where name = fruit and item_id = 1 </p>  
                <p>显示表详情： desc t_demo</p>  
                                                        
                `
  }],
  eventCheck: [{
    title: 'Event查看',
    content: `<div>根据合约地址、合约ABI及合约event在指定的区块范围内过滤得到合约事件列表。
                <br/>
                 <p>-&nbsp选中WeBASE中已有的合约地址可以自动填入合约ABI，并根据下拉框的event名来进行event过滤；也可以手动填入相应的信息</p>
                 <p>-&nbsp此功能仅用于页面展示event信息，若需要使用event的事件推送功能，则参考WeBASE-Front的事件订阅功能，详情可在WeBASE-Front文档-附录中的“链上事件订阅”查看</p>
                 <p>-&nbsp也可以使用java-sdk直连节点后进行事件订阅并接收事件推送</p></div>
                                                
                `
  }],
  privateKeyManagement: [{
      title: '已登记列表',
      content: `显示在WeBASE管理台创建的私钥用户，包含私钥用户和公钥用户两种。私钥用户代表拥有私钥信息的用户，私钥托管在WeBASE-Sign服务中；公钥用户则只保存了地址信息。
                <br/>
                 <p>-&nbsp新增用户：可以创建一个新的随机的私钥并保存，也可以输入一个地址创建一个公钥用户</p>
                 <p>-&nbsp导入私钥：支持导入十六进制/十进制明文私钥、.pem格式、.p12格式私钥文件，也可以导入WeIdentity的十进制.txt格式私钥文件</p>
                 <p>-&nbsp导出私钥：支持将WeBASE中记录的私钥导出为.p12格式的私钥文件（要求WeBASE-Sign配置允许导出私钥</p>
                 <p>-&nbsp绑定私钥：支持为公钥用户绑定一个私钥，其格式与“导入私钥”一致 </p>                                       
                `
    },
    {
      title: '全量列表',
      content: `显示所有链上发交易的私钥地址，包括已登记和未登记的私钥信息。可以通过“导入”按钮将未登记的私钥导入到WeBASE中。                                  
                `
    }
  ],
  newPermission: [{
    title: '权限管理',
    content: `<div>FISCO BCOS v2.5.0及以上支持管理链委员会管理和运维管理员管理：
                <br/> <br/>
                链委员会管理：链委员会的修改操作均需要通过多个委员投票完成，链委员拥有投票权，可以增删节点、修改链配置、添加撤销运维、冻结解冻合约、对用户表的写权限控制；
                 <p>-&nbsp修改委员会成员（新增/撤销委员）、修改委员投票阈值、修改委员投票权重值等操作均需要通过投票进行修改；</p>
                 <p>-&nbsp投票阈值为投票生效的阈值，有效投票权重数/委员总权重数>生效阈值投票才能生效，阈值为开区间，即：投票权重比例必须大于阈值（不包含等于）；</p>
                 <p>-&nbsp每次投票操作，如果是委员投票，则记录操作内容和投票委员，不重复计票；</p>
                 <p>-&nbsp投票设置过期时间，根据块高，blockLimit的10倍(即10000)，固定不可改；</p>
                 <p>-&nbsp用户不能同时成为链委员和运维管理员； </p>    
                 <br/>
                运维管理：维由链委员直接赋予（无需通过投票赋予），运维可以部署合约、创建表、管理合约版本、冻结解冻本账号部署的合约；
                <br/>
                <br/>
                 <p>-&nbsp注：链委员会为空时，不作链委员会权限限制，所有用户拥有委员权限，可以自由给自身或其他用户添加链委员权限；设置了第一个链委员后，非链委员用户无权限；请妥善保管链委员的私钥！</p>
                 <p>-&nbsp运维管理员为空时，所有用户拥有运维权限；同理，设置了第一个运维管理员后，非运维用户无权限；</p>
                 <br/>
                FISCO BCOS v2.5.0以前的版本，则使用基于表的权限管理
                基于FISCO BCOS 2.0.0 - 2.4.x版本的基于表的权限管理：支持链权限管理和普通权限（四种）管理：
                <p>-&nbsp链权限管理为分配权限的链管理员，可以使用权限分配功能，非链管理员账户无权限分配功能；</p>
                <p>-&nbsp普通权限管理包含四种权限： 部署合约和创建用户表权限, 节点管理权限, CNS管理权限, 系统参数管理权限；</p>
                <br/>
                注：链管理员为空时，不作权限限制，所有用户拥有权限，可以自由给自身或其他用户添加权限；设置了第一个链管理员后，非管理员用户无权限分配功能；请谨慎设置第一个链管理员;
                <br/>
                <br/>
                 普通权限管理员为空时，所有用户拥有特定功能，如：节点管理员为空时，所有用户可以管理节点状态，设置了第一个节点管理员后，非节点管理员不可管理节点状态;
                <br/>
                <br/>
                 <p>详情请参考WeBASE的可视化部署文档</p>
                 <a target='_blank' href='https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/manual/permission_control.html'>https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/manual/permission_control.html</a>
      
                `
  }],
  configManagement: [{
    title: '配置管理',
    content: `系统配置管理：系统属性包含FISCO-BCOS链的区块最大交易数tx_count_limit、交易gas限制tx_gas_limit、共识超时时间consensus_timeout属性值的配置。
                <br/>
                <br/>
                <p>注：一般不建议随意修改这些配置，如下情况可修改这些参数：</p>
                 <p>-&nbsp机器网络或CPU等硬件性能有限：调小tx_count_limit，降低业务压力</p>
                 <p>-&nbsp合约代码逻辑太复杂，执行区块时报错gas不足：调大tx_gas_limit</p>
                 <p>-&nbsp共识节点中部分节点性能较差，需要加大共识超时时间：调大consensus_timeout</p>
                                          
                `
  }],
  certificate: [{
    title: '证书管理',
    content: `证书管理：支持导入和查看证书信息，包括查看Front的sdk证书、Front对应节点的链证书、机构证书、节点证书，可查看证书内容、证书有效期、证书链关系等信息；
                 <p>-&nbsp证书链关系可通过比对父证书指纹与证书指纹查找；</p>
                平台将默认加载所有Front的证书，需要在Webase-Front配置文件中配置nodePath节点路径；</p>
                 <p>-&nbsp导出SDK证书：支持导出节点前置的SDK证书zip包，可用于连接节点 </p>                                 
                `
  }],
  emailAlarm: [{
    title: '邮件告警配置',
    content: `可配置邮件告警所用到的邮件服务器相关参数，包含邮件协议类型protocol、邮件服务器地址host、服务使用端口port、用户邮箱地址username、用户邮箱授权码password；鉴权选项包含Authentication验证开关authentication（默认开启）：
                <br/>
                <br/>
                 <p>-&nbsp邮件告警的邮箱协议类型默认使用SMTP协议，使用25默认端口，默认使用username/password进行用户验证，目前仅支持通过TLS/SSL连接邮件服务器；</p>
                 <p>-&nbsp目前仅支持更新原有的邮件服务器配置，不支持新增配置；</p>
                 <br/>
                使用测试功能前，需要到“告警类型配置”页面的左上角开启邮件服务总开关。
                <br/>
                <br/>
                <p>详情请参考WeBASE的可视化部署文档</p>
                <a target='_blank' href='https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Console-Suit/index.html#mail-use'>https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Console-Suit/index.html#mail-use</a>
       `
  }],
  emailAlarmType: [{
    title: '告警类型配置',
    content: `包含了告警类型的配置（节点状态告警、审计告警、证书有效期告警三种），告警日志的查看；
                <br/>
                可配置告警类型的参数值，包含告警邮件标题ruleName，告警邮件内容alertContent，告警邮件发送时间间隔alertIntervalSeconds（单位：秒），上次告警时间lastAlertTime，目标告警邮箱地址userList，是否启用该类型的邮件告警enable，告警等级alertLevel等；
                <br/>
                 <p>-&nbsp目前仅支持更新原有的三个邮件告警的配置，不支持新增配置；点击告警标题可查看详细配置内容；</p>
                 <p>-&nbsp需要先在左上角开启邮件服务才可以开启各个类型的邮件告警以及发送测试邮件；</p>
                 <p>-&nbsp告警日志的内容，可查看告警邮件的具体内容；告警项已处理后，可以点击确认键确认已消除异常；</p>
                 <p>-&nbsp修改告警内容时，大括号{}以及里面的变量名不可去除，否则无法正常发送告警邮件。</p>
                 <br/>
                 <br/>
                其中在WeBASE-Node-Manager的配置文件application.yml的constant可以配置定时任务定时监控节点状态、审计状态、证书有效期的频率，监控到异常状态时将触发邮件告警，发送告警邮件到联系人邮箱，同时按配置的间隔时间定时重复发送告警邮件，直到异常状态消除；
                <br/>
                注：定时任务的频率为检查系统是否异常的频率，而配置不同的告警类型中的告警时间间隔是发送告警邮件的频率，如，设置检查频率为1h，配置的告警频率为6h，那么，系统会每小时检查一次系统状态，若出现异常，在定时任务检查到异常时，距离上次告警邮件超过6小时，则会发送一次告警邮件。                                                 
                `
  }],
  transactionCharts: [{
    title: '用户交易',
    content: `交易审计是结合区块链数据，私钥管理和合约管理三者的数据，以区块链数据为原材料，以私钥管理和合约管理为依据做的一个综合性的数据分析功能。交易审计提供可视化的去中心化合约部署和交易监控、审计功能，方便识别链资源被滥用的情况，为联盟链治理提供依据。
                <br/>
                <br/>
                用户交易的统计包括：
                <br/>
                 <p>-&nbsp用户交易总量数量统计，监控链上各个外部交易账号的每日交易量</p>
                 <p>-&nbsp用户子类交易数量统计，监控链上各个外部交易账号的每种类型的每日交易量</p>
                `
  }],
  unusualUser: [{
    title: '异常用户',
    content: `交易审计是结合区块链数据，私钥管理和合约管理三者的数据，以区块链数据为原材料，以私钥管理和合约管理为依据做的一个综合性的数据分析功能。交易审计提供可视化的去中心化合约部署和交易监控、审计功能，方便识别链资源被滥用的情况，为联盟链治理提供依据。
                <br/><br/>
                异常用户会统计监控链上出现的异常交易用户，即：没在WeBASE登记的交易用户。
                <br/><br/>
                若异常用户数达到后台配置的最大值，异常过多时(默认大于等于20)，会停止审计。
                <br/>
                此时需要查看交易情况，找出异常原因后，导入异常用户的地址到WeBASE中即可清理异常记录。                
                `
  }],
  unusualContract: [{
    title: '异常合约',
    content: `交易审计是结合区块链数据，私钥管理和合约管理三者的数据，以区块链数据为原材料，以私钥管理和合约管理为依据做的一个综合性的数据分析功能。交易审计提供可视化的去中心化合约部署和交易监控、审计功能，方便识别链资源被滥用的情况，为联盟链治理提供依据。
                <br/><br/>
                异常合约会统计监控链上合约部署情况，标记非白名单合约为异常用户，即：没在WeBASE中登记的合约
                <br/><br/>
                若异常合约数达到后台配置的最大值，异常过多时(默认大于等于20)，会停止审计。
                <br/>
                此时需要查看交易情况，找出异常原因后，导入异常合约的地址到WeBASE中即可清理异常记录。                               
                `
  }],

  blockEvent: [{
    title: '区块事件',
    content: `订阅事件管理：可查看前置中已订阅的链上事件通知，包括出块事件列表和合约Event事件列表。
                <br/>
                <p>详情请参考节点前置-链上事件订阅和通知</p>
                <a target='_blank' href='https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Front/appendix.html#event_subscribe'>https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Front/appendix.html#event_subscribe</a>
       `
  }],
  contractEvent: [{
    title: '合约事件',
    content: `订阅事件管理：可查看前置中已订阅的链上事件通知，包括出块事件列表和合约Event事件列表。
                <br/>
                <p>详情请参考节点前置-链上事件订阅和通知</p>
                <a target='_blank' href='https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Front/appendix.html#event_subscribe'>https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Front/appendix.html#event_subscribe</a>
       `
  }],
  accountInfo: [{
    title: '账号管理',
    content: `账号管理提供管理台登陆账号的管理功能。管理台用户分为三种角色：
                <br/>
                 <p>-&nbsp普通用户，只有查看权限；</p>
                 <p>-&nbsp管理员用户，拥有管理平台的读写权限；</p>
                 <p>-&nbsp开发者用户，拥有开发者自身的合约和私钥用户的读写权限，数据概览权限；</p>
                 <br/>
                开发者模式默认关闭。如需开启此功能，可以在WeBASE-Node-Manager配置文件application.yml中修改developerModeEnable为true，然后重启服务。
                <br/><br/>
                注：此处账号与私钥管理的私钥用户为两种不同的概念，账号用于管理台权限控制，私钥用户为区块链账户。                                                                        
                `
  }],
  groupManagement: [{
    title: '群组管理',
    content: `群组管理提供动态管理群组的功能，包含：生成群组（生成群组配置文件到单个或多个节点）、启动群组、停止群组、移除群组（标记为移除）、恢复群组、删除群组数据等操作
                <br/>
                <br/>
                 进入群组管理后，可以看到群组列表中有“运行”、“维护中”、“异常”的三种状态。
                <br/>
                 <br/>
                 <p> 1.	正常运行的群组为“运行”； </p>
                 <p>2.	群组中所有节点（节点前置）已停止了群组，会显示为“维护中”，此时只需要将节点的群组重新启动即可恢复正常； </p>
                 <p>3.	本地群组数据与链上数据冲突时，会显示为“异常”： </p>
                 <br/>
                删除群组数据：
                <br/>
                 <p>-&nbsp删除群组数据，将删除后台数据库中保存的群组数据，不会删除链数据。</p>
                 <p>-&nbsp如果未停止所有节点的群组就删除群组，会在删除后重新拉取数据</p>
                 <br/>
                动态群组管理，包含在多个节点中批量生成群组、节点加入已有群组：
                <br/>
                批量生成群组
                <br/>
                 <p>-&nbsp选中节点后，生成群组将自动创建群组、启动群组、并通过创世块配置将节点设置为共识节点</p>
                 <br/>
                节点加入已有群组
                <br/>
                 <p>-&nbsp点击群组状态/修改群组，可以查看群组中各个节点的状态；也可以在该页面启动/停止/删除/恢复节点的群组，或添加节点到已有群组（不属于当前群组的节点中会显示“添加”，可以将节点加入该群组）</p>
                 <br/>
                节点加入已有群组操作实际上包含三个步骤，创建与启动是加入的同时自动完成的，用户需要确保新节点加入新群组的共识节点/观察节点
                <br/>
                 <p>-&nbsp加入群组操作会在该节点的conf目录下生成群组创世块文件，并启动群组</p>
                 <p>-&nbsp创世块文件的配置需和加入群组的原有配置完全一致，可通过群组列表中导出配置后导入配置，或到群组中节点conf目录下查看群组的时间戳与共识节点列表</p>
                 <p>-&nbsp创建并启动群组后，需要将节点加入到新群组的共识节点/观察节点：</p>
                 <p>&nbsp&nbsp-&nbsp若本地有新群组的节点前置，则可以通过切换到相应群组的“节点管理”中设置新节点为共识节点；</p>
                 <p>&nbsp&nbsp-&nbsp如果本地没有新群组的节点前置，则需要到已加入该群组的节点的控制台或节点管理平台将新节点加入到共识节点/观察节点</p>
                <br/>
                 <p>详情使用说明可以WeBASE使用手册文档中的附录-动态群组管理使用指南</p>
                 <a target='_blank' href='https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Console-Suit/index.html#dynamic_group_use'>https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Console-Suit/index.html#dynamic_group_use</a>
                                                                            
                `
  }],
}
