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

        const config = (process.env.ENVIRONMENT == 0) ? { devtools: true } : { devtools: false};

        browser = await puppeteer.launch(config);
        return browser
    },
    get browser() {
        return browser
    },
    getPage: async tag => {
        if (pages[tag])
            return pages[tag]

        let page = await createPage(tag);
        page.setDefaultNavigationTimeout(0)
        pages[tag] = page
        return page
    },
    close: async () => {
        if (browser)
            await browser.close();
    }

}

exports.default =  chromium