import { PrismaClient } from "@prisma/client";


export async function addSite(name:string, url:string, baseurl:string) {
    await new PrismaClient().site.create({
         data:{name,url,baseurl} })
    console.log("Added new site")
}