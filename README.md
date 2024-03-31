# am I the roll king(我是卷王吗)

# installation
```
npm i -g am-i-the-roll-king
```
# usage
正常使用

```
aitrk
```

查看参数
```
aitrk -h
```

# options

```
     _                   ___    _____ _                ____       _ _       _  ___             
    / \   _ __ ___      |_ _|  |_   _| |__   ___      |  _ \ ___ | | |     | |/ (_)_ __   __ _ 
   / _ \ | '_ ` _ \ _____| |_____| | | '_ \ / _ \_____| |_) / _ \| | |_____| ' /| | '_ \ / _` |
  / ___ \| | | | | |_____| |_____| | | | | |  __/_____|  _ < (_) | | |_____| . \| | | | | (_| |
 /_/   \_\_| |_| |_|    |___|    |_| |_| |_|\___|     |_| \_\___/|_|_|     |_|\_\_|_| |_|\__, |
                                                                                         |___/ 
Usage: aitrk [options]

我是卷王吗？

Options:
  -p, --path <string>        扫描的文件夹路径，如："/user/projects"，默认是当前目录 
  -s, --since <date>         开始时间(YYYY-MM-DD)，默认是当天
  -u, --until <date>         结束时间(YYYY-MM-DD)，默认是当天
  -d, --deep <number>        扫描文件夹深度，默认扫描3层
  -a, --author <string>      作者，会取git config中的user.name，如果想匹配多个作者，可以用逗号分隔，如"zhangesan,lisi"
  -i, --ignoreFile <string>  忽略统计的文件，会忽略文件名中包含指定字符串的文件，多个字符串用逗号分隔，如"yarn.lock,package-lock.json"，默认不统计package-lock.json,yarn.lock
  -ip,--ignoreProject <string>  忽略统计的项目名称，多个字符串用逗号分隔，如"project1,project2"，默认不忽略任何项目
  -v, --version              版本号
  -h, --help                 帮助文档

示例:
    $ aitrk //统计当前用户，当前文件夹下，当天的代码提交情况，忽略package-lock.json,yarn.lock文件，扫描文件夹深度是3
    $ aitrk -s 2024-01-01 -u 2024-12-29 //统计当前用户，当前文件夹下，2024年1月1日到2024年12月29日的代码提交情况，忽略package-lock.json,yarn.lock文件，扫描文件夹深度是3
    $ aitrk -p "/user/project" //统计当前用户，/user/project文件夹下，2024年1月1日到2024年12月29日的代码提交情况，忽略package-lock.json,yarn.lock文件，扫描文件夹深度是3
    $ aitrk -d 5 //统计当前用户，当前文件夹下，当天的代码提交情况，忽略package-lock.json,yarn.lock文件，扫描文件夹深度是5
    $ aitrk -a "zhangsan,lisi" //统计zhangsan,lisi用户，当前文件夹下，当天的代码提交情况，忽略package-lock.json,yarn.lock文件，扫描文件夹深度是3
    $ aitrk -i "yarn.lock,package-lock.json,aaa.js" //统计当前用户，当前文件夹下，当天的代码提交情况，忽略yarn.lock,package-lock.json,aaa.js文件，扫描文件夹深度是3
    $ aitrk -ip "project1,project2" //统计当前用户，当前文件夹下，当天的代码提交情况，忽略project1,project2项目，忽略package-lock.json,yarn.lock文件，扫描文件夹深度是3
    $ aitrk -s 2024-01-01 -u 2024-12-29 -p "/user/project" -d 5 -a "zhangsan,lisi" -i "yarn.lock,package-lock.json,aaa.js" //统计zhangsan,lisi用户，/user/project文件夹下，2024年1月1日到2024年12月29日的代码提交情况，忽略yarn.lock,package-lock.json,aaa.js文件，扫描文件夹深度是5

```

# screenshot
![img](https://gezichenshan.oss-cn-beijing.aliyuncs.com/public/screenshot.jpeg)