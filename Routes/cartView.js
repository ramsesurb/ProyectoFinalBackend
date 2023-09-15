import { Router } from "express";
import CartManagerMongo from "../Daos/Controllers/CartManagerMongo.js";
import ProductManagerMongo from "../Daos/Controllers/ProductManagerMongo.js";
import cartModel from "../Daos/Models/cart.js";
const productos = new CartManagerMongo();
const prods = new ProductManagerMongo();

import { adminAccess ,adminOrPremiumAccess,privateAccess,userAccess } from "../Middlewares/accessRole.js";

const cartView = Router();

//vista home productos

cartView.get("/",adminAccess, async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const prodsRaw = await productos.getProducts(limit);

  const prods = prodsRaw.map((item) => item.toObject());
  console.log(prods);
  res.render("carts", { productos: prods });
});

cartView.get("/:id",userAccess, async (req, res) => {
  const id = req.params.id;
  const cart = await productos.getByid(id);
  const productsInCart = cart.productos.map((item) => item.toObject());

  console.log(productsInCart);

  res.render("singleCart", {
    productos: productsInCart,
    user: req.session.user,
  });
});
cartView.get;
export default cartView;
