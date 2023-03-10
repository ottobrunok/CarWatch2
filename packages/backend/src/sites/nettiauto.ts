import { Site } from "../interfaces/site";
import { addListings, Listing } from "../Listings";
import { ScrapeReturn } from "../interfaces/site";
import puppeteer, { Browser } from "puppeteer";
import { BodyType, FuelType, Transmission, DriveType, PrismaClient } from "@prisma/client";

declare var document: Document;
const name = "Nettiauto"
const url = "https://www.nettiauto.com/en/vaihtoautot?id_country[]=73&chargingPowerFrom=&chargingPowerTo=&sortCol=enrolldate&ord=DESC"
const baseurl = "https://www.nettiauto.com/en"

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
const scrapER = () => {
    const brand: string = document.querySelector('div.bigger_lsize > div#pagelink > a:nth-of-type(2) > span')?.textContent;
    const modelArray = document.querySelector('div.bigger_lsize > div#pagelink > a:nth-of-type(3) > span')?.textContent?.split(" ")?.slice(1);
    const model: string = modelArray?.join(" ")
    const price: number = parseInt(document.querySelector("#rightLogoWrap > span > span > span")?.textContent?.replace(/[^0-9.]/g, ''))
    const bodyType: string = document.querySelector("#srch_id_car_type option[selected]")?.textContent
    const imageLink: string = document.querySelector('li.flex-active-slide div#img_0')?.getAttribute('data-ipath');
    let engineKW: number = undefined;

    let engineKWtxt = document.querySelector("div.acc_det > div > b")?.textContent
    if (engineKWtxt != "Left Hand Drive" && engineKWtxt.includes("kW"))
        engineKW = parseInt(engineKWtxt.split(" ")[0]);

    const allTr = document.querySelectorAll("tr > .bold")
    const year: number = parseInt(allTr?.[0]?.textContent?.split("(")?.[0].trim())

    const color: string = document.querySelectorAll('div.grey_text > span > span')[0]?.textContent?.split(" ")?.[0]

    const tdElements = document.getElementsByTagName('td');
    let mileageElement;
    let engineLElement;
    let fuelTypeElement;
    let driveTypeElement;
    let gearboxElement;
    for (let i = 0; i < tdElements.length; i++) {
        if (tdElements[i].textContent.includes('Mileage')) {
            mileageElement = tdElements[i];
        }
        else if (tdElements[i].textContent.includes('Engine')) {
            engineLElement = tdElements[i];
            fuelTypeElement = tdElements[i];
        }
        else if (tdElements[i].textContent.includes('Drive type')) {
            driveTypeElement = tdElements[i];
        }
        else if (tdElements[i].textContent.includes('Gearbox')) {
            gearboxElement = tdElements[i];
        }
    }
    const mileage: number = parseInt(mileageElement?.nextElementSibling?.textContent?.replace(/[^0-9.]/g, ''))
    const engineL: number = parseFloat(engineLElement?.nextElementSibling?.textContent?.split(" ")?.[0]?.trim())
    //const engineL : number = +engineLstring
    const driveType: string = driveTypeElement?.nextElementSibling?.textContent;
    const transmission: string = gearboxElement?.nextElementSibling?.textContent;
    const fuelType: string = fuelTypeElement?.nextElementSibling?.textContent?.split(" ")[2]

    // ? engineKW, mileage, engineL, fuelType, drive, transmission,
    return { price, brand, model, bodyType, year, engineL, engineKW, mileage, fuelType, driveType, transmission, color, imageLink }
}

async function scrape(lastLink: string, browser: Browser): Promise<ScrapeReturn> {
    //start a browser tab
    let page = await browser.newPage();

    //tell it to go to the URL
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
    });



    const links = await page.evaluate(() => {
        const anchors = document.querySelectorAll('.childVifUrl.tricky_link');
        return Array.from(anchors).map(anchor => anchor.getAttribute('href'));
    });
    links.splice(0, 2);
    const listings: Listing[] = []
    console.log(links)

    //if there is no new listings,then we return none
    if (links[0] == lastLink) {
        console.log("There is no new listings")
        return { listings: [], newlastLink: lastLink }
    }


    //iterate through all links until the end or if the link matches current last link
    var counter = 1
    var returnLink = ""
    for (const link of links) {
        if (link == lastLink)
            break
        if (counter == 1)
            returnLink = link
        await page.goto(link, {
            waitUntil: 'domcontentloaded',
        });
        //data sees funktsioon pasa jaoks
        const data = await page.evaluate(scrapER, link);
        //colorchange
        let color: string
        console.log(data.color)
        if (data.color != undefined) {
            color = colorChoice(data.color.toLowerCase())
            console.log(color)
        }
        //ifelse ":"
        const bodyData = data?.bodyType?.toLocaleLowerCase()
        const bodyType: BodyType = bodyData?.includes("sedan") ? "Sedan" :
            bodyData?.includes("mpv") ? "MPV" :
                bodyData?.includes("terrain") ? "AllTerrain" :
                    bodyData?.includes("hatchback") ? "Hatchback" :
                        bodyData?.includes("station") ? "StationWagon" :
                            bodyData?.includes("wagon") ? "StationWagon" :
                                bodyData?.includes("touring") ? "Touring" :
                                    bodyData?.includes("minivan") ? "Minivan" :
                                        bodyData?.includes("coup") ? "Coupe" :
                                            bodyData?.includes("cabriolet") ? "Cabriolet" :
                                                bodyData?.includes("limousine") ? "Limousine" :
                                                    bodyData?.includes("van") ? "Van":
                                                        bodyData?.includes("pickup") ? "Pickup" : undefined

        const fuelData = data?.fuelType?.toLocaleLowerCase()
        const fuelType: FuelType = fuelData?.includes("diesel") ? "Diesel" :
            fuelData?.includes("petrol") ? "Petrol" :
                fuelData?.includes("gas") ? "CNGLNG" :
                    fuelData?.includes("hybrid") ? "Hybrid" :
                        fuelData?.includes("electric") ? "Electric" : undefined
        
        const transmissionData = data?.transmission?.toLocaleLowerCase()
        const transmission: Transmission = transmissionData?.includes("manual") ? "Manual" :
            transmissionData?.includes("automatic") ? "Automatic" :
                transmissionData?.includes("semi") ? "SemiAutomatic" : undefined

        const driveData = data?.driveType?.toLocaleLowerCase()
        const driveType: DriveType = driveData?.includes("front") ? "FrontWheel" :
            driveData?.includes("rear") ? "RearWheel" :
                driveData?.includes("four") ? "FourWheel" : undefined
                

        listings.push({ ...data, bodyType, fuelType, transmission, driveType, color,link })
        console.log(data)
        console.log(counter + ":")
        counter += 1
    }

    //if there is no new listings,then we return none
    if (links[0] == lastLink) {
        console.log("There is no new listings")
        return { listings: [], newlastLink: returnLink }
    }
    //adding data listings to a listing[]

    //close page
    await page.close();

    return { listings: listings, newlastLink: returnLink }
}

export const nettiauto: Site = {
    name,
    url,
    baseurl,
    scrape
}
