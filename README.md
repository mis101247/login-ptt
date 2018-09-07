# ptt登入爬蟲

利用Node.js+ GoogleChrome/puppeteer https://github.com/GoogleChrome/puppeteer
至 https://term.ptt.cc/ 進行登入後隨即登出，
配合pm2設置排程可用來做每日登入。


# 使用說明

## Init/建立檔案

1. env未加入git，請參考.env.sample
2. yarn install or npm install 安裝node套件


## 使用的套件
 - puppeteer
 - sleep
 - dotenv
 
 
## 執行

```shell
node start
```

## Demo
<img src="https://i.imgur.com/3tfzD7O.png">
