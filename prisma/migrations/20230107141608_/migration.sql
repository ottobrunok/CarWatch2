-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "brand" TEXT,
    "model" TEXT,
    "engineL" DOUBLE PRECISION,
    "siteName" TEXT NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "baseurl" TEXT NOT NULL,
    "lastLink" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Site_pkey" PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_siteName_fkey" FOREIGN KEY ("siteName") REFERENCES "Site"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
