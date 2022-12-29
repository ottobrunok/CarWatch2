import puppeteer from 'puppeteer';
export async function run(){
    // First, we must launch a browser instance
    const browser = await puppeteer.launch({
        // Headless option allows us to disable visible GUI, so the browser runs in the "background"
        // for development lets keep this to true so we can see what's going on but in
        // on a server we must set this to true
        headless: false,
        // This setting allows us to scrape non-https websites easier
        ignoreHTTPSErrors: true,
    })
    // then we need to start a browser tab
    let page = await browser.newPage();
    // and tell it to go to some URL
    await page.goto('http://httpbin.org/html', {
        waitUntil: 'domcontentloaded',
    });
    // print html content of the website
    console.log(await page.content());
    // close everything
    await page.close();
    await browser.close();
}
