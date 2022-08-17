const puppeteer = require('puppeteer');
const request_client = require('request-promise-native');
const fs = require('fs');

fs.writeFile('url.txt', '', function (err) {});

const regex = /https:\/\/wapi.kurashiru.com(.+)/;
const url = 'https://www.kurashiru.com/';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on('request', request => {
    request_client({
      uri: request.url(),
      resolveWithFullResponse: true,
    }).then(response => {
      const request_url = request.url();

      console.log(request_url);
      if(regex.test(request_url)) {
        fs.appendFile("url.txt", request_url+"\n", (err)=>{console.log(err)})
      }
      request.continue();
    }).catch(error => {
      // console.log(request_url)
      if(regex.test(error.options.uri)) {
        fs.appendFile("url.txt", error.options.uri+"\n", (err)=>{console.log(err)})
      }
      // console.error(error.options.uri)
      request.abort();
    });
  });

  // await page.waitForTimeout(10000);

  await page.goto(url, {
    waitUntil: 'networkidle0',
    timeout: 0
  });

  await browser.close();
})();
