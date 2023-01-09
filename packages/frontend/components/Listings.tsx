import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Listing } from '@prisma/client';
import { Site } from '@prisma/client';
// Assume that you have an array of auction listings called `listings`

const AuctionListings: NextPage<{listings: (Listing & {site: Site }) []}> = ({ listings }) => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Auction Listings</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        {listings.map((listing) => (
          <Link href={listing.link ?? listing.site.baseurl}  key={listing.id} className="block bg-white rounded-lg shadow-lg overflow-hidden">
              <Image src={listing.imageLink ?? "/defaultcar.jpg"} alt={`${listing.brand} ${listing.model}`} width={400} height={400} className="imageSize object-cover aspect-square" />
                    <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-6 ">
                <h2 className="text-2xl font-bold text-gray-900 ">{listing.brand} {listing.model}</h2>
                <p className="text-gray-900 font-semibold text-2xl">{listing.price}€</p>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                <p className="text-gray-700 text-base mb-2">{listing.engineL?.toFixed(1)+"L "+ listing.engineKW + "kW"}</p>
                </div></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AuctionListings;