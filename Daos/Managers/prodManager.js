import ProductManagerMongo from "../Controllers/ProductManagerMongo.js";

const productManagerMongo = new ProductManagerMongo();

export default class ProductController{
    async getProducts() {
        try {
          const products = await productManagerMongo.getProducts();
          return products
        } catch (error) {
          console.error(error);
        }
      }
      async  addProduct(prod){
        const products = await productManagerMongo.addProduct(prod)
        return products
    }
      async  getByid(id){
        const products = await productManagerMongo.getByid(id)
        return products
    }
    async  deleteById(id){
        const products = await productManagerMongo.deleteById(id)
        return products
    }
    async  deleteAll(){
        const products = await productManagerMongo.deleteAll() 
        return products
    }
}