# webase前端部署文档

本项目是fisco-bcos应用平台项目，使用框架`vue-cli`。

兼容浏览器IE9及以上，360浏览器兼容版（IE9内核），360浏览器极速版，chrome浏览器。

## 1、功能

本代码仅支持fisco-bcos 2.0以上版本，支持群组和群组切换

1. 区块链概览，可以查看区块链信息。点击左上角交易信息和区块信息界面，可以跳转到区块或交易信息列表页，交易信息支持input解码和event解码。

2. 前置管理，可以新增前置，新增前置成功后，可以拉取改链的所有群组和节点。点击ip可以查看该前置所在服务器状态相关信息。

4. 合约管理，合约IDE支持本地编写，编译合约。部署合约后该合约会被保存，在历史合约中，可以查看该合约。

5. 私钥管理，管理所有可以发交易的帐号，公钥用户是其他机构的帐号，无法在本机构发交易，可以通过手动绑定和自动同步获取。私钥用户为本机构发交易的用户。

6. 联盟治理，主要监控整条链所有机构所有用户发送交易行为，查看是否有异常用户和异常合约。

7. 帐号管理，只有admin帐号才能查看此功能，可以新增帐号（登录此系统帐号），修改密码等等。


## 2、部署

### 2.1 依赖环境

| 环境     | 版本              |
| ------ | --------------- |
| nginx   | nginx1.6或以上版本    |

nginx安装请参考附录

### 2.2 拉取代码

代码可以放在/data下面
执行命令：

    git clone https://github.com/WeBankFinTech/webase-web.git

在代码库中docs文件下有nginx配置文件，直接可以拿来替换安装的nginx的配置文件nginx.conf；
然后修改nginx.conf；

进入nginx配置文件（这里nginx安装在/usr/local下面，如果这里没找到，可以到/etc下寻找,如有权限问题，请加上sudo）
```
    cd /usr/local/nginx/conf
```

1、 修改web服务端口（端口需要开通策略且不能被占用）
```
    sed -i "s/3002/${your_server_port}/g" nginx.conf
```
例如：
```
    sed -i "s/3002/8080/g" nginx.conf   你修改的服务端口是8080
```

2、 修改服务ip
```
    sed -i "s/ 10.0.0.1 /${your_server_ip}/g" nginx.conf
```
例如： 
```
    sed -i "s/10.0.0.1/192.168.0.1/g" nginx.conf
```
你修改的服务ip是192.168.0.1,也可以修改成域名

3、 修改静态文件路径
```
    sed -i "s/\/data\/webase-web\/dist/${your_file_route}/g" nginx.conf
```

4、 修改mgr服务ip和端口
```
sed -i "s/10.0.0.1:8083/${your_mgrServer_ipPort}/g" nginx.conf
````

按照上面的步骤执行后，可以直接跳过这一步骤，直接启动nginx。若服务器已有nginx可按照以下修改，增加一条server
```Nginx

    upstream node_mgr_server{
        server 10.0.0.1:8083; #步骤三 节点管理服务地址及端口
    }
    server {
        listen       3002 default_server;   #步骤一 前端端口（端口需要开通策略且不能被占用）
        server_name  10.0.0.1;         #步骤一 前端地址，可配置为域名
        location / {
                root    /data/webase-web/dist;   #步骤二 前端文件路径(文件需要有权限访问)
                index  index.html index.htm;
                try_files $uri $uri/ /index.html =404;
                }

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location /mgr {
                    proxy_pass    http://node_mgr_server/;    		
                    proxy_set_header		Host				$host;
                        proxy_set_header		X-Real-IP			$remote_addr;
                        proxy_set_header		X-Forwarded-For		$proxy_add_x_forwarded_for;
                }
        }
```

### 2.4 启动nginx

(1)、启动nginx。
启动命令：

	/usr/local/nginx/sbin/nginx    (nginx下载在/usr/local目录下)

检查nginx是否启动成功

```
    ps -ef | grep nginx
```
观察进程是否起来

启动报错重点排查：日志路径是否正确（error.log和access.log）,nginx有没有添加用户权限。

(2)、打开页面，页面url是nginx配置的前端ip和端口。
例如:上面配置文件的url为   http://10.0.0.1:3002

(3)、打开页面后，请找运维提供帐号和密码登录(默认账号密码：admin/Abcd1234)。


## 3、附录
### 3.1 安装nginx（可参考[网络教程](http://www.runoob.com/linux/nginx-install-setup.html)）
#### 3.1.1 下载nginx依赖
在安装nginx前首先要确认系统中安装了gcc、pcre-devel、zlib-devel、openssl-devel。如果没有，请执行命令

	yum -y install gcc pcre-devel zlib-devel openssl openssl-devel
执行命令时注意权限问题，如遇到，请加上sudo
#### 3.1.2 下载nginx
nginx下载地址：https://nginx.org/download/（下载最新稳定版本即可）
或者使用命令：

	wget http://nginx.org/download/nginx-1.9.9.tar.gz  (版本号可换)
将下载的包移动到/usr/local/下
#### 3.1.3 安装nginx
##### 3.1.3.1解压
	tar -zxvf nginx-1.9.9.tar.gz

##### 3.1.3.2进入nginx目录

	cd nginx-1.9.9
##### 3.1.3.3配置

	./configure --prefix=/usr/local/nginx

##### 3.1.3.4make

	make
	make install
##### 3.1.3.5测试是否安装成功
使用命令：

	/usr/local/nginx/sbin/nginx –t
正常情况的信息输出：

	nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
	nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful

##### 3.1.3.6 nginx几个常见命令
```shell
/usr/local/nginx/sbin/nginx -s reload            # 重新载入配置文件
/usr/local/nginx/sbin/nginx -s reopen            # 重启 Nginx
/usr/local/nginx/sbin/nginx -s stop              # 停止 Nginx
ps -ef | grep nginx                              # 查看nginx进程
```
