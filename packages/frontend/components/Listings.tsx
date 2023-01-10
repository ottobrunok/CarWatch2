import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Listing } from '@prisma/client';
import { Site } from '@prisma/client';
import { useEffect, useState } from 'react';
// Assume that you have an array of auction listings called `listings`

const AuctionListings: NextPage<{ listings: (Listing & { site: Site })[] }> = ({ listings }) => {

  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth / 50);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-bold text-gray-900 mb-6">Auction Listings</h1>
      <div className=" grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {listings.map((listing) => (
          <Link href={listing.link ?? listing.site.baseurl} key={listing.id} className="block bg-slate-200 rounded-lg shadow-lg overflow-hidden">
            <Image src={listing.imageLink ?? "/defaultcar.jpg"} alt={`${listing.brand} ${listing.model}`} width={400} height={400} className="imageSize object-cover aspect-square" />
            <div className="px-6 py-4">
              <div className="flex-col justify-between items-center mb-6 ">
                <h2 className="text-2xl font-bold text-gray-900 ">{listing.brand} {listing.model}</h2>
                <p className="text-gray-900 font-semibold text-2xl">{listing.price}€</p>
                <p className="text-stone-600 font-semibold text-xl">{listing.siteName}</p>
              </div>
              <div className=" grid gap-1 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 whitespace-nowrap ">
                {listing.year != null && <div className="inline-block"><p className="text-gray-700 text-base mb-2"> <strong className="">Year:</strong> {listing.year}</p></div>}
                {typeof listing.engineL === 'number' && typeof listing.engineKW === 'number' && <div className="inline-block"><p className="text-gray-700 text-base mb-2 inline-block"><strong>Engine:</strong> {listing.engineL.toFixed(1) + "L " + listing.engineKW + "kW"}</p></div>}
                {listing.fuelType != null && <p className="text-gray-700 text-base mb-2"><strong>Fuel:</strong> {listing.fuelType}</p>}
                {listing.mileage != null && <div className="inline-block"><p className="text-gray-700 text-base mb-2"><strong>Mileage:</strong> {listing.mileage} km</p></div>}
                {listing.bodyType != null && <p className="text-gray-700 text-base mb-2"><strong>Type:</strong> {listing.bodyType}</p>}

                {listing.transmission != null && <p className="text-gray-700 text-base mb-2"><strong>Gearbox:</strong> {listing.transmission}</p>}
                {listing.driveType != null && <p className="text-gray-700 text-base mb-2"><strong>Drive:</strong> {listing.driveType}</p>}

              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AuctionListings;