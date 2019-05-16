# 一键部署说明

## 1、前提条件

| 环境   | 版本                   |
| ------ | ---------------------- |
| nginx   | nginx1.6或以上版本 |

## 2、拉取代码

获取安装包：
```shell
wget https://github.com/mingzhenliu/webase-transcation/releases/tag/testV0.7/webase-web.zip
```
解压安装包：
```shell
unzip webase-web.zip
```
进入目录：
```shell
cd webase-web
```

## 3、修改配置（没有变化的可以不修改）：

```shell
部署ip：sed -i "s%127.0.0.1%${your_deploy_ip}%g" common.properties
前端端口：sed -i "s%3002%${your_server_port}%g" common.properties
节点管理服务的IP端口：sed -i "s%10.0.0.1:8083%${your_mgr_ip_port}%g" common.properties

例子（将前端端口由3002改为3003）：sed -i "s%3002%3003%g" common.properties
```

## 4、部署
进入工程根目录：
```shell
cd webase-web
```
使用以下命令进行部署：
```shell
python deploy.py start
```
相关命令和说明可查看帮助：
```shell
python deploy.py help
```

## 5、日志路径
```
部署日志：log/
前端日志：dist/log/
```


