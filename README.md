# ptt登入爬蟲

利用 Node.js + [GoogleChrome/puppeteer](https://github.com/GoogleChrome/puppeteer)
至 https://term.ptt.cc/ 進行登入後隨即登出，配合pm2設置排程可用來做每日登入。


# 使用說明

## Init/建立檔案

1. env 未加入 git，請參考 .env.sample

2. yarn install or npm install 安裝node套件

    * 如果你遭遇 node-gyp build 失敗的問題，嘗試安裝 python 2.7 後

        ``` shell
        npm config set python python2.7
        npm install
        ```

## 使用的套件
 
 - puppeteer
 
 - sleep
 
 - dotenv


## 執行

```shell
node index
```

GET 127.0.0.1:3000

## Demo

![](https://i.imgur.com/3tfzD7O.png)
