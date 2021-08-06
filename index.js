'use strict';

const express = require('express');
const { sleep } = require('sleep');
const browser = require('./browser');
const chromium = require('./chromium');

const app = express();

app.get('/', async (req, res) => {
  const accounts = process.env.ACCOUNTS || '';
  const accountArray = accounts.split(',');
  const passwords = process.env.PASSWORDS || '';
  const passwordArray = passwords.split(',');

  try {
    if (accounts && passwords && accountArray.length === passwordArray.length) {
      await browser.login(accountArray, passwordArray);
      res.json({
        status: 'success',
        message: '開始執行！'
      });
    } else {
      throw Error('環境變數錯誤');
    }
  } catch (error) {
    console.error('error=>', error);
    res.json({
      status: 'fail',
      message: error.message || ''
    });
  }

});

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  browser.init();
  console.log(`login init!`);
  console.log(`listening on ${port}`);
});
