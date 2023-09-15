import { Router } from "express";
import productoModel from "../Daos/Models/mongo.js";
import { productsService} from "../Repository/index.js";
import { CreateUserDto } from "../Daos/Dto/usersDto.js";
import { generateProduct } from '../utils.js';
import  {getSessionUser}  from "../Helpers/sessionUser.js";
import ProductManagerMongo from "../Daos/Controllers/ProductManagerMongo.js";

const productos = new ProductManagerMongo()

import { adminAccess ,adminOrPremiumAccess,privateAccess ,userAccess} from "../Middlewares/accessRole.js";

const staticProd = Router();


staticProd.get('/mockingproducts',adminAccess, (req,res)=>{
    const cant = parseInt(req.query.cant) || 100;
    let productos = [];
    for (let i = 0; i < cant; i++) {
        const user = generateProduct();
        productos.push(user)
    }
    res.json({productos})
})

staticProd.get('/compra', (req,res)=>{
  res.render('compra')
})

staticProd.get('/register', (req,res)=>{
  res.render('register') 
  
})

staticProd.get('/', (req,res)=>{
  res.render('login')
})
staticProd.get('/current',userAccess, async (req,res)=>{

  let{ first_name,last_name,email,age} = req.session.user
  let user = new CreateUserDto({first_name,last_name,email,age})
  res.render('profile',{user})
})
staticProd.get("/prods",privateAccess,   async (req, res) => {
  const { page = 1, limit: queryLimit, sort, descripcion } = req.query;

  const options = { limit: 6, page, lean: true };

  if (queryLimit) {
    options.limit = parseInt(queryLimit);
  }

  if (sort) {
    options.sort = sort;
  }

 
  const query = {};
  if (descripcion) {
    query.descripcion = descripcion;
  }

  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productoModel.paginate(query, options);

  const prodsRaw = await productsService.getProducts(queryLimit, sort);
  const prods = prodsRaw.map(item => item.toObject());
  const sessionUser = getSessionUser(req);
    console.log(sessionUser)
  res.render("home", {
    productos: docs,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    user: req.session.user,
    
  });
});


export default staticProd;