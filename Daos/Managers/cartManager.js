import CartManagerMongo from "../Controllers/CartManagerMongo.js";

const cartManagerMongo = new CartManagerMongo();

export default class CartController{
    async getProducts() {
        try {
          const products = await cartManagerMongo.getProducts();
          return products
        } catch (error) {
          console.error(error);
        }
      }
      async  addProduct(cid, newProducts,pid){
        const products = await cartManagerMongo.addProduct(cid, newProducts,pid)
        return products
    }
    async createCart() {
        try {
          const products = await cartManagerMongo.createCart();
          return products
        } catch (error) {
          console.error(error);
        }
      }
      async deleteProductById(cid, pid) {
        try {
          const products = await cartManagerMongo.deleteProductById(cid, pid);
          return products
        } catch (error) {
          console.error(error);
        }
      }
      async emptyCart(cid) {
        try {
          const products = await cartManagerMongo.emptyCart(cid);
          return products
        } catch (error) {
          console.error(error);
        }
      }
      async updateCart(cid, productos) {
        try {
          const products = await cartManagerMongo.updateCart(cid, productos);
          return products
        } catch (error) {
          console.error(error);
        }
      }
      async updateProductQuantity(cid, pid, quantity) {
        try {
          const products = await cartManagerMongo.updateProductQuantity(cid, pid, quantity);
          return products
        } catch (error) {
          console.error(error);
        }
      }
      async  getByid(id){
        const products = await cartManagerMongo.getByid(id)
        return products
    }
    async  deleteById(id){
        const products = await cartManagerMongo.deleteById(id)
        return products
    }
    async  deleteAll(){
        const products = await cartManagerMongo.deleteAll() 
        return products
    }
}