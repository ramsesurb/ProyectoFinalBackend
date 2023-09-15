import { Router } from "express";
import ProductManagerMongo from "../Daos/Controllers/ProductManagerMongo.js"
const productos = new ProductManagerMongo("../Controllers/ProductManagerMongo.js");

const realTime = Router();

import { adminAccess ,adminOrPremiumAccess,privateAccess } from "../Middlewares/accessRole.js";
//vista realtime
realTime.get("/",adminOrPremiumAccess, async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const prodsRaw = await productos.getProducts(limit);
  const prods = prodsRaw.map(item=>item.toObject())
  res.render("realTimeProducts", { productos: prods ,user: req.session.user });
});

export default realTime;
