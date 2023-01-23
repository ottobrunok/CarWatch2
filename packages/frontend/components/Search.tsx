import React, { useState } from 'react';
import { FuelType, Transmission, BodyType, DriveType } from '@prisma/client'

interface Props {
  setSearch: (search: string) => void;
  setPrice: (price: number | undefined) => void;
  setFuelType: (srcFuelType: FuelType| undefined) => void;
  setBodyType: (srcBodyType: BodyType| undefined) => void;
  setTransmission: (srcTransmission: Transmission| undefined) => void;
  setDriveType: (srcDriveType: DriveType| undefined) => void;
}

const Search: React.FC<Props> = ({ setSearch, setPrice, setFuelType, setBodyType, setTransmission, setDriveType }) => {

  return (
    <div className="">
      <table className="table-row-group w-auto text-center">
        <thead>
          <tr className="bg-gray-100 ">
            <th className="px-4 py-2">Brand/Model</th>
            <th className="px-4 py-2">Max Price</th>
            <th className="px-4 py-2">Gearbox</th>
            <th className="px-4 py-2">Fuel type</th>
            <th className="px-4 py-2">Body type</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-gray-700">
            <td className=" px-4 py-2">
              <input type="text" className="w-full border-2 border-gray-300 rounded-lg p-2 transition duration-500 hover:scale-125 hover:bg-slate-200 flex justify-center items-center" onChange={e => setSearch(e.currentTarget.value)} placeholder="Brand/Model" />
            </td>
            
            <td className="px-4 py-2">
              <input type="number" className="w-full border-2 border-gray-300 rounded-lg p-2 transition duration-500 hover:scale-125 hover:bg-slate-200 flex justify-center items-center" onChange={e => setPrice(e.currentTarget.value ? Number(e.currentTarget.value) : undefined)} placeholder="Price" />
            </td>

            <td className="px-4 py-2">
              <select className="w-full border-2 border-gray-300 rounded-lg p-2  transition duration-500 hover:scale-125 hover:bg-slate-200 flex justify-center items-center outline-none " onChange={e => {
                switch (e.currentTarget.value) {
                  case 'Manual':
                    setTransmission(Transmission.Manual);
                    break;
                  case 'Automatic':
                    setTransmission(Transmission.Automatic);
                    break;
                  case 'SemiAutomatic':
                    setTransmission(Transmission.SemiAutomatic);
                    break;
                  case 'any':
                    setTransmission(undefined);
                    break;
                }
              }}>
                <option className="text-gray-400" value="any" >All</option>
                <option value="Manual" >Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="SemiAutomatic">Semi-Automatic</option>
              </select>
            </td>

            <td className="px-4 py-2">
              <select className="w-full border-2 border-gray-300 rounded-lg p-2  transition duration-500 hover:scale-125 hover:bg-slate-200 flex justify-center items-center outline-none " onChange={e => {
                switch (e.currentTarget.value) {
                  case 'Petrol':
                    setFuelType(FuelType.Petrol);
                    break;
                  case 'Diesel':
                    setFuelType(FuelType.Diesel);
                    break;
                  case 'Hybrid':
                    setFuelType(FuelType.Hybrid);
                    break;
                  case 'Electric':
                    setFuelType(FuelType.Electric);
                    break;
                  case 'CNGLNG':
                    setFuelType(FuelType.CNGLNG);
                    break;
                  case 'any':
                    setFuelType(undefined);
                    break;
                }
              }}>
                <option className="text-gray-400" value="any" >All</option>
                <option value="Petrol" >Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
                <option value="CNGLNG">CNG/LNG</option>
              </select>
            </td>

            <td className="px-4 py-2">
              <select className="w-full border-2 border-gray-300 rounded-lg p-2  transition duration-500 hover:scale-125 hover:bg-slate-200 flex justify-center items-center outline-none " onChange={e => {
                setBodyType(BodyType[e.currentTarget.value as keyof typeof BodyType]);
              }}>
                <option className="text-gray-400" value="any" >All</option>
                <option value="Sedan" >Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="StationWagon">Station Wagon</option>
                <option value="Coupe">Coupe</option>
                <option value="Touring">Touring</option>
                <option value="AllTerrain">All-Terrain</option>
                <option value="Minivan">Minivan</option>
                <option value="Van">Van</option>
                <option value="MPV">MPV</option>
                <option value="Cabriolet">Cabriolet</option>
                <option value="Pickup">Pickup</option>
                <option value="Limousine">Limousine</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export default Search;
