import { Site } from "../interfaces/site";
import { addListings, Listing } from "../Listings";
import { ScrapeReturn } from "../interfaces/site";
import puppeteer, { Browser } from "puppeteer";
import { FuelType,BodyType, DriveType, PrismaClient, Transmission } from "@prisma/client";


declare var document: Document;
const name = "Auto24"
const url = "https://eng.auto24.ee/kasutatud/nimekiri.php?bn=2&a=101102&aj=&ssid=85236845&ae=1&af=20&by=2&otsi=search"
const baseurl = "https://eng.auto24.ee" 


function colorChoice(input: string): string {
    const colors = ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 'DarkGrey', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen', 'DarkOrange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkSlateGray', 'DarkSlateGrey', 'DarkTurquoise', 'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue', 'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'Gainsboro', 'GhostWhite', 'Gold', 'GoldenRod', 'Gray', 'Grey', 'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed', 'Indigo', 'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGrey', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSlateGrey', 'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'Metallic', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin', 'NavajoWhite', 'Navy', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue', 'SlateGray', 'SlateGrey', 'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'WhiteSmoke', 'Yellow', 'YellowGreen'];
    let color: string = undefined
    colors.forEach(element => {
        if (input.includes(element.toLowerCase())) {
            color = element
            return color
        }
    })
    return color

}


const scrapER = (link: string) => {
    const brand : string = document.querySelectorAll(`.b-breadcrumbs__item`)?.[1]?.textContent
    const model : string = document.querySelectorAll(`.b-breadcrumbs__item`)?.[2]?.textContent
    const bodyType : string = document.querySelectorAll(`.value`)?.[1]?.textContent
    const year : number = parseInt(document.querySelectorAll(`.value`)?.[2]?.textContent?.split('/')?.[1])
    const engineL : number = parseFloat(document.querySelectorAll(`.value`)?.[3]?.textContent?.split(' ')?.[0]+"L")
    const fuelType : string = document.querySelectorAll(`.value`)?.[4]?.textContent

    //because engineKW is the last string, we have to get the length of it and select the last string from the query
    const values = document.querySelectorAll('.value')?.[3]?.textContent?.split(" ")
    const len = values.length
    const engineKW : number = parseInt(document.querySelectorAll('.value')?.[3]?.textContent?.split(" ")[len-1])

    const mileage : number = parseInt(document.querySelectorAll(`.value`)?.[5]?.textContent)
    const driveType : string = document.querySelectorAll(`.value`)?.[6]?.textContent
    const transmission : string = document.querySelectorAll(`.value`)?.[7]?.textContent
    const color : string = document.querySelectorAll(`.value`)?.[8]?.textContent
    let imageLink : string = ""
    try {
        const element = document.querySelector('.vImages__item')
        imageLink = element.getAttribute('href')
    } catch (error) {
        console.log("Couldn't get the listing link")
    }

    //const link : string = "https://eng.auto24.ee"+link
    
    return {brand, model, bodyType, year, engineL, engineKW, fuelType, mileage, driveType, transmission, color, imageLink}


}
async function scrape(lastLink: string, browser: Browser): Promise<ScrapeReturn> {
    //start a browser tab
    let page = await browser.newPage();

    //tell it to go to the URL
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
    });


    await page.content()
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
    var counter = 1    
    var returnLink = ""
    for (const link1 of links) {
        const link = "https://eng.auto24.ee"+link1
        if (link == lastLink)
            break
        if (counter == 1)
            returnLink = link
        await page.goto(link, {
            waitUntil: 'domcontentloaded',
        });
        const data = await page.evaluate(scrapER,link)
        //colorchange
        let color: string
        console.log(data.color)
        if (data.color != undefined) {
            color = colorChoice(data.color.toLowerCase())
            console.log(color)
        }
        let transmission : Transmission = "Automatic"
        let fuelType : FuelType = "Diesel"
        let bodyType : BodyType = "Sedan"
        let driveType : DriveType = "FourWheel"


        listings.push({ ...data, bodyType, fuelType, transmission, driveType, color,link })
        
        console.log(data)
        console.log(counter + ":")
        counter += 1

    }
    if (links[0] == lastLink) {
        console.log("There is no new listings")
        return { listings: [], newlastLink: returnLink }
    }

    //close page
    await page.close();

    return { listings: listings, newlastLink: returnLink }
}

export const auto24: Site = {
    name,
    url,
    baseurl,
    scrape
}
