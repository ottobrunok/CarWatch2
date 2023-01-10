// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Listing, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  listings: Listing[]

}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const listings = await getListings({ search: req.query.search as string, price: Number(req.query.price as string) })
  if (!listings) {
    return res.status(404).end()
  }
  //console.log(listings)
  res.status(200).json({ listings })
}
export async function getListings({ price, search }: { price?: number, search?: string }) {
  try {
    //const listings = await new PrismaClient().listing.findMany({ where: {OR:[{ price { lt: price }}], OR: [{ brand: { contains: search } }, { model: { contains: search } }] }, include:{site: true} })
    const listings = await new PrismaClient().listing.findMany({
      where: {
        AND: [
          { price: price ? { lt: price } : { not: -1 } },
          //&&
          {
            OR: [
              { brand: { contains: search } },
              // OR
              { model: { contains: search } }
            ]
          }
        ]
      },
      include: { site: true }
    })
    return listings
  }
  catch (e) {
    console.log(e)
    console.error("ei tööta lel XD")
  }
}
