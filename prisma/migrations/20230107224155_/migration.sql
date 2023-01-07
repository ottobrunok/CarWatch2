-- CreateEnum
CREATE TYPE "DriveType" AS ENUM ('FrontWheel', 'FourWheel', 'RearWheel');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('Diesel', 'Petrol', 'CNGLNG', 'Hybrid', 'Electric');

-- CreateEnum
CREATE TYPE "Transmission" AS ENUM ('Manual', 'Automatic', 'SemiAutomatic');

-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('Sedan', 'Hatchback', 'Touring', 'Minivan', 'Coupe', 'Cabriolet', 'Pickup', 'Limousine', 'Van');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "bodyType" "BodyType",
ADD COLUMN     "driveType" "DriveType",
ADD COLUMN     "engineKW" INTEGER,
ADD COLUMN     "fuelType" "FuelType",
ADD COLUMN     "imageLink" TEXT,
ADD COLUMN     "link" TEXT,
ADD COLUMN     "mileage" INTEGER,
ADD COLUMN     "transmission" "Transmission",
ADD COLUMN     "year" INTEGER;
