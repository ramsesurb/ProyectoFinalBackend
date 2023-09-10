import { Router } from "express";

import ProductManagerMongo from "../Daos/Controllers/ProductManagerMongo.js";
import CartController from "../Daos/Managers/cartManager.js";
import cartModel from "../Daos/Models/cart.js";
import userModel from "../Daos/Models/User.js";
import ticketModel from "../Daos/Models/tickets.js";

import { sendMailTicket } from "../Helpers/sendMailTicket.js";
import { date } from "../Helpers/generateDate.js";


import { Errors } from "../enums/Errors.js";
import { generateCartErrorParam } from "../services/ErrorParam.js";
import { generateCartNfErrorParam } from "../services/ErrorParam.js";
import { generateProductNfErrorParam } from "../services/ErrorParam.js";
import { generateProductErrorParam } from "../services/ErrorParam.js";
import { CustomError } from "../services/customError.service.js";



const productos = new CartController();
const prods = new ProductManagerMongo();

const routerCart = Router();

// POST ticket
routerCart.post("/:cid/purchase", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel
      .findById(cartId)
      .populate("productos.producto");
    const user = await userModel.findOne({ cart: cartId });
    const purchaserEmail = user.email;
    let totalAmount = 0;
    const productsWithStock = [];
    for (const productInCart of cart.productos) {
      const product = productInCart.producto;
      if (productInCart.quantity <= product.stock) {
        product.stock -= productInCart.quantity;
        await product.save();
        totalAmount += product.precio * productInCart.quantity;
      } else {
        totalAmount += product.precio * product.stock;
        productsWithStock.push(productInCart);
        product.stock -= product.stock;
        await product.save();
      }
    }
    const code = Math.floor(Math.random() * 1000000000000000)
      .toString()
      .padStart(15, "0");
      const generateDate = await date();
    const ticketData = {
      code: code,
      purchase_dateTime: generateDate,
      amount: totalAmount,
      purchaser: purchaserEmail
    };
    console.log(ticketData);
   await sendMailTicket(code, generateDate, totalAmount, purchaserEmail);
    const ticket = await ticketModel.create(ticketData);

    cart.productos = productsWithStock;
    await cart.save();

    res.status(200).json(ticket);
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

//get productos cart
routerCart.get("/", async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const prods = await productos.getProducts(limit);
  res.send(prods);
});
//save new product
routerCart.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const newProducts = req.body;
    const cart = await productos.addProduct(cid, newProducts,pid);
    res.send(cart); 
  } catch (error) {
    // Manejar el error adecuadamente
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});
//post in cart
routerCart.post("/api/cart/:cartId/product/:productId", async (req, res) => {
  const { cartId, productId } = req.params;
  const newProducts = req.body;
  if (!cartId || cartId.length !== 24) {
    res.json({ status: "error", message: "el id del carrito no es valido" });
    CustomError.createError({
      name: "product get by id error",
      cause: generateCartErrorParam(),
      message: "Error obteniendo el carrito por el id",
      errorCode: Errors.INVALID_PARAM,
    });
  }
  if (!productId || productId.length !== 24) {
    res.json({ status: "error", message: "el id del carrito no es valido" });
    CustomError.createError({
      name: "product get by id error",
      cause: generateCartErrorParam(),
      message: "Error obteniendo el carrito por el id",
      errorCode: Errors.INVALID_PARAM,
    });
  }
  try {
    const updatedCart = await productos.addProduct(
      cartId,
      newProducts,
      productId
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});


//delete productos del array by id
routerCart.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const findCart = await productos.getByid(cid)
    const pid = req.params.pid;
    const findprod = await prods.getByid(pid)
    if (!cid || cid.length !== 24) {
      res.json({ status: "error", message: "el id del carrito  no es valido" });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartErrorParam(cid),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    if (!findCart) {
      res.json({
        status: "error",
        message: "no se encontro un carrito con este valor",
      });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartNfErrorParam(cid),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    if (!pid || pid.length !== 24) {
      res.json({ status: "error", message: "el id del producto no es valido" });
      CustomError.createError({
        name: "product get by id error",
        cause: generateProductErrorParam(),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    if (!findprod) {
      res.json({
        status: "error",
        message: "no se encontro un producto con este valor",
      });
      CustomError.createError({
        name: "product get by id error",
        cause: generateProductNfErrorParam(cid),
        message: "El producto no fue encontrado",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    const cart = await productos.deleteProductById(cid, pid);

    res.send(cart);
  } catch (error) {}
  
});

//vaciar carito
routerCart.delete("del/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const findCart = await productos.getByid(cid)
    
    console.log(cid);
    if (!cid || cid.length !== 24) {
      res.json({ status: "error", message: "el id no es valido" });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartErrorParam(cid),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    const cart = await productos.emptyCart(cid);
    if (!findCart) {
      res.json({
        status: "error",
        message: "no se encontro un carrito con este valor",
      });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartNfErrorParam(cid),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    res.send(cart);
  } catch (error) {}
  
});

//actualizar carrito
routerCart.put("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const products = req.body.productos;
  if (!cid || cid.length !== 24) {
    res.json({ status: "error", message: "el id del carrito no es valido" });
    CustomError.createError({
      name: "product get by id error",
      cause: generateCartErrorParam(),
      message: "Error obteniendo el carrito por el id",
      errorCode: Errors.INVALID_PARAM,
    });
  }

  try {
    const cart = await productos.updateCart(cid, products);

    res.send(cart);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al actualizar el carrito");
  }
});
//actualizar cantidad

routerCart.put("/:cid/product/:pid", async (req, res) => {
  const { pid, cid } = req.params;
  const { quantity } = req.body;
  console.log(pid, cid, quantity);
  if (!cid || cid.length !== 24) {
    res.json({ status: "error", message: `el id: ${cid} no es valido` });
    CustomError.createError({
      name: "product get by id error",
      cause: generateCartErrorParam(cid),
      message: "Error obteniendo el carrito por el id",
      errorCode: Errors.INVALID_PARAM,
    });
  }
  
  if (!pid || pid.length !== 24) {
    res.json({ status: "error", message: `el id: ${cid} no es valido` });
    CustomError.createError({
      name: "product get by id error",
      cause: generateCartErrorParam(cid),
      message: "Error obteniendo el carrito por el id",
      errorCode: Errors.INVALID_PARAM,
    });
  }

  try {
    const response = await productos.updateProductQuantity(cid, pid, quantity);

    if (response === null)
      return res.status(404).send({ error: "Producto no encontrado" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500);
  }
});
//get by id cart 
routerCart.get("/:cid", async (req, res, next) => {
  const { cid } = req.params;
  try {
    if (!cid || cid.length !== 24) {
      res.json({ status: "error", message: `el id: ${cid} no es valido` });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartErrorParam(cid),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    const cart = await cartModel
      .findOne({ _id: cid })
      .populate("productos.producto");
    if (!cart) {
      res.json({
        status: "error",
        message: `no se encontro ningun carrito con el id: ${cid}`,
      });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartNfErrorParam(cid),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    res.send(cart);
  } catch (error) {}
});

export default routerCart;
