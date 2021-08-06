'use strict'
require('dotenv').config();
const sleep = require('sleep');
const chromium = require('./chromium').default;

async function init() {
    await chromium.init();
}

async function login(accounts, passwords) {
    const account = accounts[0];
    accounts.splice(0, 1);
    const password = passwords[0];
    passwords.splice(0, 1);
    let page = await chromium.getPage(`page_${account}`); //預留擴充多開頁面登入
    let loginTimes = 0;
    await page.goto('https://term.ptt.cc/');

    let pressEnter = false;
    let action = true;

    page.on('console', async msg => {
        let consoleMsg = msg.text();
        if (/view update/g.test(consoleMsg) && action) {
            action = false;
            await sleep.sleep(1)
            if (pressEnter) {
                await page.keyboard.press('Enter');
                pressEnter = false;
                action = true;
            } else {
                let pageContent = await page.content();
                switch (true) {
                    case /請輸入代號，或以 guest 參觀，或以 new 註冊:/g.test(pageContent) && !(/請輸入您的密碼/g.test(pageContent)):
                        console.log(`輸入帳號...${account}`);
                        loginTimes++;
                        if (loginTimes <= 3) {
                            await page.type('html', account);
                            pressEnter = true;
                            action = true;
                        } else {
                            loginTimes = 0;
                            action = true;
                            await page.reload()
                        }
                        break;
                    case /請輸入您的密碼:/g.test(pageContent):
                        console.log(`輸入密碼...`);
                        await page.type('html', password);
                        await page.keyboard.press('Enter');
                        action = true;
                        break;
                    case /請按任意鍵繼續/g.test(pageContent):
                        console.log(`請按任意鍵繼續`);
                        await page.keyboard.press('Enter');
                        action = true;
                        break;
                    case /您要刪除以上錯誤嘗試的記錄嗎/g.test(pageContent):
                    case /您確定要離開/g.test(pageContent):
                    case /您想刪除其他重複登入的連線嗎/g.test(pageContent):
                        console.log(`輸入一個Y`);
                        await page.type('html', 'y');
                        pressEnter = true;
                        action = true;
                        break;
                    case /離開，再見/g.test(pageContent):
                        console.log(`沈睡的毛利小五郎 讓他睡一下 ${process.env.STAYINGTIME}s`)
                        await sleep.sleep(process.env.STAYINGTIME * 1)
                        await page.type('html', 'g');
                        pressEnter = true;
                        action = true;
                        break;
                    case /此次停留時間/g.test(pageContent):
                        console.log(pageContent.match(/此次停留時間: ((.*?)分)/g)[0]);
                        await page.keyboard.press('Enter');
                        await chromium.closePage(`page_${account}`)
                        if (accounts.length > 0) {
                            await this.login(accounts, passwords)
                        }
                        break;
                    case /請仔細回憶您的密碼/g.test(pageContent):
                        action = true;
                        await page.reload()
                        break;
                    default:
                        break;
                }
            }
        }
    });

}

async function close() {
    await chromium.close();
}

exports.init = init;
exports.login = login;
exports.close = close;