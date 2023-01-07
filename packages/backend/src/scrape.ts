import puppeteer from 'puppeteer';
import { Listing } from './Listings';

/**
 * @param {string} url
 * @param {string} lastLink
 * @returns {Listings} Listings
 */
export async function runScrape(url : string, lastLink : string){
    //launch a browser instance
    const browser = await puppeteer.launch({
        headless: false,
        //scrape non-https websites easier
        ignoreHTTPSErrors: true,
    })
    //start a browser tab
    let page = await browser.newPage();
    //tell it to go to the URL
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
    });
    // print html content of the website
    console.log(await page.content());
    // close everything
    await page.close();
    await browser.close();
}

