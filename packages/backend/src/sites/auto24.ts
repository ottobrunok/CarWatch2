import { Site } from "../interfaces/site";
import { addListings, Listing } from "../Listings";
import { ScrapeReturn } from "../interfaces/site";
import puppeteer, { Browser } from "puppeteer";
import { PrismaClient } from "@prisma/client";


declare var document: Document;
const name = "Auto24"
const url = "https://eng.auto24.ee/kasutatud/nimekiri.php?bn=2&a=101102&aj=&ssid=85236845&ae=1&af=20&by=2&otsi=search"
const baseurl = "https://eng.auto24.ee" 

async function scrape(lastLink: string, browser: Browser): Promise<ScrapeReturn> {
    //start a browser tab
    let page = await browser.newPage();

    //tell it to go to the URL
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
    });


    console.log(await page.content())
    //getting the links into a list
    const links = await page.evaluate(() => {
        let links = []
        document.querySelectorAll(`.${"row-link"}`).forEach(element => {
            links.push(element.getAttribute('href'))
        });
        return links
    })
    console.log(links)

    const  listings : Listing[] = []
    
    //if there is no new listings,then we return none
    if (links[0] == lastLink)
        return { listings: [], newlastLink: lastLink }

    //iterate through all links until the end or if the link matches current last link
    var counter = 0    
    for (const link of links) {
        if (link == lastLink)
            break
        if(counter==0)
            lastLink = link[0]
        await page.goto(baseurl+link, {
            waitUntil: 'domcontentloaded',
        });
        const data = await page.evaluate((link) => {
            const brand : string = document.querySelectorAll(`.b-breadcrumbs__item`)?.[1]?.textContent
            const model : string = document.querySelectorAll(`.b-breadcrumbs__item`)?.[2]?.textContent
            const bodyType : string = document.querySelectorAll(`.value`)?.[1]?.textContent
            const year : string = document.querySelectorAll(`.value`)?.[2]?.textContent?.split('/')?.[1]
            const engineL : string = document.querySelectorAll(`.value`)?.[3]?.textContent?.split(' ')?.[0]+"L"
            const fuelType : string = document.querySelectorAll(`.value`)?.[4]?.textContent

            //because engineKW is the last string, we have to get the length of it and select the last string from the query
            const values = document.querySelectorAll('.value')?.[3]?.textContent?.split(" ")
            const len = values.length
            const engineKW : string = document.querySelectorAll('.value')?.[3]?.textContent?.split(" ")[len-1]

            const mileage : string = document.querySelectorAll(`.value`)?.[5]?.textContent
            const drive : string = document.querySelectorAll(`.value`)?.[6]?.textContent
            const transmission : string = document.querySelectorAll(`.value`)?.[7]?.textContent
            const color : string = document.querySelectorAll(`.value`)?.[8]?.textContent
            let imageLink : string = ""
            try {
                const element = document.querySelector('.vImages__item')
                imageLink = element.getAttribute('href')
            } catch (error) {
                console.log("Couldn't get the listing link")
            }

            const carLink : string = "https://eng.auto24.ee"+link
            counter += 1
            return {carLink, brand, model, bodyType, year, engineL, engineKW, fuelType, mileage, drive, transmission, color, imageLink}
          },link);
        
        console.log(data)
        
        
        
        

    }

    //close page
    await page.close();

    return { listings: [], newlastLink: "" }
}

export const auto24: Site = {
    name,
    url,
    baseurl,
    scrape
}
