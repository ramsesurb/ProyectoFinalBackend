import productoModel from "../Models/mongo.js";
import { sendMailDeleted } from "../../Helpers/sendMailDeletedProd.js";
import userModel from "../Models/User.js";

class ProductManagerMongo {
  async getProducts(limit, sort, descripcion) {
    try {
      let query = productoModel.find().populate("owner");

      if (sort) {
        query = query.sort(sort);
      }

      if (limit) {
        query = query.limit(limit);
      }

      if (descripcion) {
        query = query.find({ descripcion });
      }

      const content = await query.exec();

      return content;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async addProduct(prod, oid) {
    try {
      const saveCont = await this.getProducts();
      const getByid = await userModel.findOne({ _id: oid });
      const codeExists = saveCont.some((product) => product.code === prod.code);

      if (getByid === "user") {
        console.log("no esta autorizado para agregar productos");
      }
      if (codeExists) {
        const errorMsg = `Ya existe un producto con el código ${prod.code}`;

        console.log(errorMsg);
        return { error: errorMsg };
      }

      if (
        !prod.titulo ||
        !prod.descripcion ||
        !prod.precio ||
        !prod.code ||
        !prod.thumbnail ||
        !prod.stock
      ) {
        console.log("Todos los campos son obligatorios");
      }

      const newProduct = {
        id: Math.floor(Math.random() * 10000000001),
        titulo: prod.titulo,
        descripcion: prod.descripcion,
        precio: prod.precio,
        code: prod.code,
        thumbnail: prod.thumbnail,
        stock: prod.stock,
        owner: oid,
        status: true,
      };
      const result = await productoModel.create(newProduct);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getByid(id) {
    try {
      const getByid = await productoModel.findById(id).populate("owner");
      console.log(getByid.owner.rol)
      return getByid;
    } catch (error) {}
  }
  async deleteById(id) {
    try {
      const deletedProduct = await productoModel
        .findOneAndDelete({ _id: id })
        .populate("owner");
      if (deletedProduct.owner.rol === "premium") {
        await sendMailDeleted(
          new Date().toLocaleDateString(), 
          deletedProduct.titulo,
          deletedProduct.code,
          deletedProduct.precio, 
          deletedProduct.owner.email 
        );
      }

      return deletedProduct;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async deleteAll() {
    try {
      let products = await this.getProducts();
      products.splice(0, products.length);
    } catch (error) {
      console.log(error);
    }
  }
}
export default ProductManagerMongo;
const rute = new ProductManagerMongo("./Data/Productos.json");
