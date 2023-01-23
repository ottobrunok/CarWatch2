// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Listing, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { FuelType, Transmission, BodyType, DriveType } from '@prisma/client'

type Data = {
  listings: Listing[]

}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const listings = await getListings({ search: req.query.search as string, price: Number(req.query.price as string) , srcFuelType: req.query.srcFuelType as FuelType, srcBodyType: req.query.srcBodyType as BodyType, srcTransmission: req.query.srcTransmission as Transmission, srcDriveType: req.query.srcDriveType as DriveType})
  if (!listings) {
    return res.status(404).end()
  }
  //console.log(listings)
  res.status(200).json({ listings })
}
export async function getListings({ price, search,srcFuelType, srcBodyType,srcDriveType, srcTransmission }: { price?: number, search?: string,srcFuelType?: FuelType, srcBodyType?: BodyType, srcTransmission?: Transmission, srcDriveType?: DriveType}) {
  try {
    const listings = await new PrismaClient().listing.findMany({
      where: {
        AND: [
          { price: price ? { lt: price } : { not: -1 } },
          { fuelType:  { equals: srcFuelType } },
          {
            OR: [
              { brand: { contains : search, mode: 'insensitive' } },
              // OR
              { model: { contains : search, mode: 'insensitive' } }
            ]},
          { bodyType: { equals: srcBodyType } },
          { transmission: { equals: srcTransmission } },
          { driveType: { equals: srcDriveType } },
        ],
      },
      include: { site: true }
    })
    return listings
  }
  catch (e) {
    console.log(e)
    console.error("getListings error")
  }
}
