import { BodyType, DriveType, FuelType, PrismaClient, Transmission } from "@prisma/client";
export type Listing = {
    link: string;
    brand: string;
    model: string;
    bodyType?: BodyType;
    year: number;
    engineL?: number;
    engineKW?: number;
    mileage?: number;
    fuelType?: FuelType;
    driveType?: DriveType;
    transmission?: Transmission;
    color?: string;
    imageLink: string;

}

export async function addListings(data: Listing[],siteName:string) {
    await new PrismaClient().listing.createMany({ data:data.map(listing=>({...listing,siteName})) })
    console.log("Added new listings")
}
//
export async function getListings({ price, search }: { price?: number, search?: string }) {
    try {
        const listings = await new PrismaClient().listing.findMany({ where: { price: { lt: price }, OR: [{ brand: { contains: search } }, { model: { contains: search } }] } })
        return listings
    }
    catch(e) {
        console.log(e)
        console.error("ei tööta lel XD")
    }
}