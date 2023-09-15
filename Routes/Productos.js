import { Router } from "express";
import { CustomError } from "../services/customError.service.js";
import ProductController from "../Daos/Managers/prodManager.js";


import  {getSessionUser}  from "../Helpers/sessionUser.js";

const productController = new ProductController();



const routerProd = Router();

//getAll productos
routerProd.get("/", async (req, res) => {
  try {
    const sessionUser = getSessionUser(req);
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const prodsRaw = await productController.getProducts(limit);
    const prods = prodsRaw.map((item) => item.toObject());
    res.send(prods);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});
//get by id
routerProd.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const prodById = await productController.getByid(id);

    if (!id || id.length !== 24) {
      res.json({ status: "error", message: `el id: ${id} no es valido` });
      CustomError.createError({
        name: "product get by id error",
        cause: generateCartErrorParam(id),
        message: "Error obteniendo el carrito por el id",
        errorCode: Errors.INVALID_PARAM,
      });
    }
    if (!prodById) {
      res.json({
        status: "error",
        message: `no se encontro un producto con el id : ${id}`,
      });
      ;
    }
    res.send(prodById);
  } catch (error) {}
});

//save new product
routerProd.post("/owner/:oid", async (req, res, next) => {
  const prod = req.body;
  const { oid } = req.params;
  const sessionUser = getSessionUser(req);
    console.log(sessionUser)
  try {
    const saveProd = await productController.addProduct(prod,oid);
    if (!prod) {
      ;
    }
    res.send(saveProd);
  } catch (error) {
    res.json({
      status: "error",
      message: `Faltan datos para agregar producto`,
    });
  }
});
//delete by id
routerProd.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const pid = id;
  try {
    const prodById = await productController.getByid(id);
    const deleteProd = await productController.deleteById(pid);
    if (!id || id.length !== 24) {
      res.json({ status: "error", message: `el id: ${id} no es valido` });
      ;
    }
    if (!prodById) {
      res.json({
        status: "error",
        message: `no se encontro un producto con el valor: ${id}`,
      });
      ;
    }
    res.send(deleteProd);
  } catch (error) {}
});

export default routerProd;
