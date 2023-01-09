import { runScrape } from "./scrape"
import { getListings, addListings } from "./Listings"
import { Listing } from "./Listings";
import { Site } from "./interfaces/site";
import { auto24 } from "./sites/auto24";
import { addSite } from "./sites";
import { PrismaClient } from "@prisma/client";
import { exit } from "process";
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { nettiauto } from "./sites/nettiauto";


//const sites = [auto24]
const sites = [auto24,nettiauto]
async function Main() {
    console.log("enne")

    //adding sites to db
    //await addSite("Auto24","https://eng.auto24.ee/kasutatud/nimekiri.php?bn=2&a=101102&aj=&ssid=85236845&ae=1&af=20&by=2&otsi=search","https://eng.auto24.ee")
    //await addSite("Nettiauto", "https://www.nettiauto.com/en/vaihtoautot?id_country[]=73&chargingPowerFrom=&chargingPowerTo=&sortCol=enrolldate&ord=DESC", "https://www.nettiauto.com/en")


    puppeteer.use(StealthPlugin())
    //opening browser
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: "C:/Program Files/Google/Chrome/Application/Chrome.exe",
        //scrape non-https websites easier
        ignoreHTTPSErrors: true,
    })
    //sites
    for (const site of sites) {

        //võtame iga saidi kohta lastlingi andmebaasist
        let currentSite = await new PrismaClient().site.findUnique({ where: { name: site.name }, })
        //if currentsite doesnt exist, then we add it
        if (!currentSite) {
            await addSite(site.name, site.url, site.baseurl)
        }
        const currentLastLink = currentSite?.lastLink ?? ""
        const { listings, newlastLink } = await site.scrape(currentLastLink, browser)
        console.log("New Listings from " + site + "\nNew last link: \n" + newlastLink)
        console.log(listings)


        await addListings(listings, site.name)
        //updating lastlink for current site
        if (newlastLink)
            await new PrismaClient().site.update({ where: { name: site.name }, data: { lastLink: newlastLink } })

    }

    // close browser
    await browser.close();


    //runScrape()
}
Main()
