import {run} from "./scrape"
import { addListing, getListings } from "./Listings"

async function Main() {
    console.log("enne")
    //await addListing({brand:"Volkswagen",price:500,model:"Bora",engineL:2.4})
    console.log("pärast")
    const Listing = await getListings({price:5000,search:"Bora"})
    console.log(Listing)
    //run()
}
Main()
