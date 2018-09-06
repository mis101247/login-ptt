'use strict'
require('dotenv').config();
const sleep = require('sleep');
const chromium = require('./chromium').default;

(async () => {
    await chromium.init();
    let page = await chromium.getPage(`page_${process.env.ACCOUNT}`); //預留擴充多開頁面登入
    await page.goto('https://term.ptt.cc/');

    let pressEnter = false;

    page.on('console',async msg => {
        let consoleMsg = msg.text();
        if (/view update/g.test(consoleMsg)) {
            if (pressEnter) {
                await page.keyboard.press('Enter');
                pressEnter = false;
            } else {
                let pageContent = await page.content();
                switch (true) {
                    case /請輸入代號，或以 guest 參觀，或以 new 註冊:/g.test(pageContent) && !(/請輸入您的密碼/g.test(pageContent)):
                        console.log(`輸入帳號...${process.env.ACCOUNT}`);
                        await page.type('html', process.env.ACCOUNT);
                        pressEnter = true;
                        break;
                    case /請輸入您的密碼:/g.test(pageContent):
                        console.log(`輸入密碼...`);                        
                        await page.type('html', process.env.PASSWORD);
                        await page.keyboard.press('Enter');
                        break;
                    case /請按任意鍵繼續/g.test(pageContent):
                        console.log(`請按任意鍵繼續`);                        
                        await page.keyboard.press('Enter');
                        break;
                    case /離開，再見…/g.test(pageContent):
                        console.log(`沈睡的毛利小五郎 讓他睡一下 ${process.env.STAYING_TIME}s`)
                        await sleep.sleep(process.env.STAYING_TIME * 1)
                        await page.type('html', 'g');
                        pressEnter = true;
                        break;
                    case /您要刪除以上錯誤嘗試的記錄嗎/g.test(pageContent):
                    case /您確定要離開/g.test(pageContent):
                        console.log(`輸入一個Y`);
                        await page.type('html', 'y');
                        pressEnter = true;
                        break;
                    case /此次停留時間/g.test(pageContent):
                        console.log(pageContent.match(/此次停留時間: ((.*?)分)/g)[0]);
                        await page.keyboard.press('Enter');
                        await chromium.close();
                        break;
                    default:
                        break;
                }
            } 
        }
    });
})();