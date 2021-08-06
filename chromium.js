'use strict'
require('dotenv').config();
const puppeteer = require('puppeteer');

let browser
let pages = {} 

const createPage = async tag => {
    let page = await browser.newPage();
    page.name = tag
    page.setExtraHTTPHeaders({'Pragma': 'no-cache'})

    return pages[tag] = page
}

const chromium = {
    init: async () => {
        if (browser) return browser

        const useDevTools = (process.env.ENVIRONMENT == 0);
        const config = {
            headless: true,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-dev-shm-usage',
            ],
            devtools: useDevTools,
        }

        browser = await puppeteer.launch(config);        
        return browser
    },
    get browser() {
        return browser
    },
    getPage: async tag => {
        if (pages[tag]){
            await pages[tag].close()
            delete pages[tag]
        }

        let page = await createPage(tag);
        page.setDefaultNavigationTimeout(0)
        pages[tag] = page
        return page
    },
    close: async () => {
        if (browser)
            await browser.close();
    },
    closePage: async tag => {
        if (pages[tag]){
            await pages[tag].close()
            delete pages[tag]
        }
        return null;
    }
}

exports.default =  chromium
exports.pages =  pages