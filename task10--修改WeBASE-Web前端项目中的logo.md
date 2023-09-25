# Second quarter 第二季

## task11：修改WeBASE-Web前端项目中的logo

### 第一步：克隆WeBASE-Web项目

``git clone https://gitee.com/WeBank/WeBASE-Web.git``

#### 进入目录：

`cd WeBASE-Web`

#### 然后 下载solc-bin
执行脚本get_solc_js.sh会自动下载solc-bin，即下面v0.4.25.js等文件。 在WeBASE-Web/目录中直接执行脚本get_solc_js.sh（（脚本与dist文件夹同级））

```bash
./get_solc_js.sh
```

### 第二步：修改配置

> 需要安装 nginx [安装教程](https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Web/appendix.html#code_fail)
> 若已安装nginx 可以输入 ``ps -ef | grep nginx`` 查看nginx的安装目录 nginx.config
> 查看配置文件 nginx.conf 路径 ``nginx -t``

在docs目录下有配置文件nginx.conf，修改完后替换安装的nginx的配置文件nginx.conf（这里nginx安装配置文件在/usr/local/nginx/conf下面，如果这里没找到，可以到/etc下寻找，如有权限问题，请加上sudo）。

修改配置：

```bash
# 修改服务器ip，也可以使用域名
sed -i "s%127.0.0.1%${your_ip}%g" docs/nginx.conf

# 修改WeBASE-Web服务端口（端口需要开通策略且不能被占用）
sed -i "s%5000%${your_port}%g" docs/nginx.conf

# 修改静态文件路径（文件需要有权限访问）
sed -i "s%/data/WeBASE-Web/dist%${your_file_dir}%g" docs/nginx.conf

# 节点管理服务ip和端口
sed -i "s%10.0.0.1:5001%${your_node_manager}%g" docs/nginx.conf

```

第一种情况：
复制配置文件nginx.conf到默认配置目录中
也可以直接通过nginx -c docs/nginx.conf命令加载docs/nginx.conf配置
```bash
cp -rf docs/nginx.conf /usr/local/nginx/conf
```

第二种情况：可在原配置文件nginx.conf增加一个server


```lombok.config
    upstream node_mgr_server{
        server 10.0.0.1:5001; # 节点管理服务ip和端口
    }
    server {
        listen       5000 default_server; # 前端端口（端口需要开通策略且不能被占用）
        server_name  127.0.0.1;           # 服务器ip，也可配置为域名
        location / {
            root   /data/WeBASE-Web/dist;   # 前端文件路径(文件需要有权限访问)
            # 下面是移动端nginx配置
             if ( $http_user_agent ~ "(MIDP)|(WAP)|(UP.Browser)|(Smartphone)|(Obigo)|(Mobile)|(AU.Browser)|(wxd.Mms)|(WxdB.Browser)|(CLDC)|(UP.Link)|(KM.Browser)|(UCWEB)|(SEMC-Browser)|(Mini)|(Symbian)|(Palm)|(Nokia)|(Panasonic)|(MOT-)|(SonyEricsson)|(NEC-)|(Alcatel)|(Ericsson)|(BENQ)|(BenQ)|(Amoisonic)|(Amoi-)|(Capitel)|(PHILIPS)|(SAMSUNG)|(Lenovo)|(Mitsu)|(Motorola)|(SHARP)|(WAPPER)|(LG-)|(LG/)|(EG900)|(CECT)|(Compal)|(kejian)|(Bird)|(BIRD)|(G900/V1.0)|(Arima)|(CTL)|(TDG)|(Daxian)|(DAXIAN)|(DBTEL)|(Eastcom)|(EASTCOM)|(PANTECH)|(Dopod)|(Haier)|(HAIER)|(KONKA)|(KEJIAN)|(LENOVO)|(Soutec)|(SOUTEC)|(SAGEM)|(SEC-)|(SED-)|(EMOL-)|(INNO55)|(ZTE)|(iPhone)|(Android)|(Windows CE)|(Wget)|(Java)|(curl)|(Opera)" )
           {
            root   /data/WeBASE-Web-Mobile/dist;
           }
            index  index.html index.htm;
            try_files $uri $uri/ /index.html =404;
        }

        include /etc/nginx/default.d/*.conf;

        location /mgr {
            proxy_pass    http://node_mgr_server/;    		
            proxy_set_header		Host			 $host;
            proxy_set_header		X-Real-IP		 $remote_addr;
            proxy_set_header		X-Forwarded-For	 $proxy_add_x_forwarded_for;
        }
    }
```


### 第三步：修改WeBASE-Web前端项目logo

> 注意：修改的logo图片类型以及名称需要跟原来的一致

在 /WeBASE-Web/dist/static/image 目录下找到 webase_logo.png 将其替换调即可

### 第四步：重启nginx

```bash
/usr/sbin/nginx -s reload

# usr 为你nginx安装的nginx目录
# 如：我安装的nginx目录在 /root 下
# 则 我重启nginx的命令应该为：/root/nginx/sbin/nginx -s reload
```
#### 第五步：访问页面
``http://{deployIP}:{webPort}``
``示例：http://127.0.0.1:5000``

> 如果是在原配置文件nginx.conf增加一个server出现 403 状态
> 需要修改用户为root ``user root``


