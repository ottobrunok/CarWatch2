// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const listings = await getListings({ search: req.query.search as string, price: Number (req.query.price as string)})
  if (!listings) {
    return res.status(404).end()
  }
  //console.log(listings)
  res.status(200).json({listings: listings as any })
}
export async function getListings({ price, search }: { price?: number, search?: string }) {
  try {
    const listings = await new PrismaClient().listing.findMany({ where: { price: { lt: price }, OR: [{ brand: { contains: search } }, { model: { contains: search } }] } })
    return listings
  }
  catch (e) {
    console.log(e)
    console.error("ei tööta lel XD")
  }
}
