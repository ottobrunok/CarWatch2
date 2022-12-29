import { PrismaClient } from "@prisma/client";
type Listing = {
    price: number
    brand: string | null
    model: string
    engineL: number | null
}
export async function addListing(data: Listing) {
    await new PrismaClient().listing.create({ data })
    console.log("Hello world lel Xd")
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