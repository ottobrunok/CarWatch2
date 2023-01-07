import { Browser } from "puppeteer";
import { Listing } from "../Listings";

export interface Site{
    name: string;
    url: string;
    baseurl: string;
    scrape: (lastLink: string,browser:Browser)=> Promise<ScrapeReturn>
}
export type ScrapeReturn = {
    listings:Listing[],newlastLink?:string
}
