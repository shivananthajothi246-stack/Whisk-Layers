// run `node seeder.js` from server folder to insert demo products
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import Bakery from "./models/Bakery.js";

dotenv.config();

const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/whisklayers";

const seed = async () => {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

  await Product.deleteMany();
  await Bakery.deleteMany();

  // Create more bakeries
  const bakeries = [
    { name: "Sweet Spot", location: "MG Road", image: "/images/bakery1.jpg", description: "Local bakery" },
    { name: "Bake House", location: "Main Street", image: "/images/bakery2.jpg", description: "Homestyle treats" },
    { name: "Golden Oven", location: "North Side", image: "/images/bakery3.jpg", description: "Premium cakes" },
    { name: "Choco House", location: "Mall Road", image: "/images/bakery4.jpg", description: "Chocolate specialists" },
    { name: "Cake Cottage", location: "River Road", image: "/images/bakery5.jpg", description: "Riverside bakery" },
    { name: "Heavenly Bakes", location: "Oak Avenue", image: "/images/bakery6.jpg", description: "Heavenly treats" }
  ];
  const createdBakeries = await Bakery.insertMany(bakeries);

  // Only cake products for all bakeries
  const cakeImages = [
    "/images/cake1.jpg", "/images/cake2.jpg", "/images/cake3.jpg", "/images/cake4.jpg", "/images/cake5.jpg", "/images/cake6.jpg", "/images/cake7.jpg", "/images/cake8.jpg", "/images/success.png"
  ];
  const cakeNames = [
    "Chocolate Dream Cake", "Strawberry Delight", "Vanilla Classic", "Red Velvet Supreme", "Blueberry Cheesecake", "Lemon Drizzle", "Black Forest", "Nutty Brownie", "Opera Cake", "Mille Feuille", "Success Cake", "Tiramisu", "Carrot Cake"
  ];
  let products = [];
  for (let b = 0; b < createdBakeries.length; b++) {
    for (let i = 0; i < cakeNames.length; i++) {
      products.push({
        name: cakeNames[i],
        description: `Delicious ${cakeNames[i].toLowerCase()}`,
        flavour: cakeNames[i].split(' ')[0],
        price: 400 + (i * 50) % 800,
        image: cakeImages[i % cakeImages.length],
        customizable: true,
        bakery: createdBakeries[b]._id
      });
    }
  }
  await Product.insertMany(products);

  console.log("Seeder done");
  mongoose.disconnect();
};

seed().catch(err => { console.error(err); process.exit(1); });
