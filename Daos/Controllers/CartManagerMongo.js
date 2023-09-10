import cartModel from "../Models/cart.js";
import productoModel from "../Models/mongo.js";
import { promises as fs } from "fs";
class CartManagerMongo {
  async getProducts(limit) {
    try {
      const content = await cartModel.find(limit).populate("productos.producto")
      
    
      if (limit) {
        return content.slice(0, limit);
      }
      return content;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async  addProduct(cid, newProducts, pid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      const findProduct = await productoModel.findOne({ _id: pid });
  
      if (!cart) {
        const newCart = await cartModel.create({
          productos: newProducts,
        });
        return newCart;
      }
  
      const existingProductIndex = cart.productos.findIndex(
        (item) => item.producto.toString() === pid.toString()
      );
  
      if (existingProductIndex !== -1) {
        // Si el producto ya existe en el carrito, aumenta la cantidad en 1
        cart.productos[existingProductIndex].quantity += 1;
      } else {
        // Si el producto no existe en el carrito, agrégalo con cantidad 1
        cart.productos.push({ producto: pid, quantity: 1 });
      }
  
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async createCart() {
    try {
      
      const newProduct = {
        id: (Math.floor(Math.random() * 1000) % 1000).toString().padStart(3, '0'),
        productos: [],
      };
      const result = await cartModel.create(newProduct)
      console.log("producto nuevo", newProduct);
      return result
      
    } catch (error) {
      console.log(error);
    }
  }

  async getByid(id) {
    try {
      
      //const getByid =await cartModel.findOne({id:id})

      const getByid = await cartModel.findById(id).populate("productos.producto")
      console.log("producto buscado", getByid);
      return getByid;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteById(id) {
    try {
      const deleteByid = await cartModel.findOneAndDelete({_id:id})
      return deleteByid;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductById(cid, pid) {
    try {
      const cart = await cartModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { productos: { producto: [{_id:pid}] } } },
        { new: true }
      );
      
      return cart;
    } catch (error) {
      console.log(error);
    }
  }
  async emptyCart(cid) {
    try {
      const cart = await cartModel.updateOne(
        { _id: cid },
        { $set: { productos: [] } }
      );
      return cart;
    } catch (error) {
      console.log(error);
    }
  }
  async updateCart(cid, products) {
    try {
      const cart = await cartModel.findOneAndUpdate(
        { _id: cid },
        { productos: products },
        { new: true }
      );
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    const productExist = await productoModel.findById(pid);
    if (!productExist) return null;
    try {
      const cart = await cartModel.findById(cid);
      const product = cart.productos.find((p) => p.producto.equals(pid));
      if (product) {
        product.quantity = quantity;
        await cart.save();
        return cart;
      }
      return null;
    } catch (error) {
      console.log(error + "error en el update product in cartDB ");
      return null;
    }
  }
}

 
export default CartManagerMongo;
const rute = new CartManagerMongo();

