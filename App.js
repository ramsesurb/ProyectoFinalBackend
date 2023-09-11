import express from "express";
import handlebars from "express-handlebars";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import "./config/database.js"
import configureWebSocketServer from "./config/SocketProd.js";
import swaggerUi from 'swagger-ui-express';
import initializePassport from './config/passport.js';
import passport from 'passport';

import userList from "./Routes/UserList.js";
import staticProd from "./Routes/StaticProd.js";
import realTime from "./Routes/realTime.js";
import routerCart from "./Routes/Cart.js";
import routerProd from "./Routes/Productos.js";
import realTimeChat from "./Routes/Chat.js";
import cartView from "./Routes/cartView.js";
import sessionRouter from "./Routes/sessions.js";

import { errorHandler } from "./Middlewares/errorHandler.js";

import __dirname from "./utils.js";




import { config } from "./config/Config,.js";
import { addLogger } from "./utils/logger.js";
import { swaggerSpecs } from "./config/docConfig.js";


const MONGO = config.mongo.url;

//express
const app = express();
const PORT = config.server.port;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//socketIo
const { server } = configureWebSocketServer(app);

//handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: "./views/layouts",
    partialsDir: "views",
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
//mongo session
app.use(session({
  store: new MongoStore({
      mongoUrl: MONGO,
      ttl:3600
  }),
  secret:'CoderSecret',
  resave:false,
  saveUninitialized:false
}));
//passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/session', sessionRouter);
//websocket
app.use("/realTimeProducts", realTime);
app.use("/chat",realTimeChat)
//express estatico
app.use("/", staticProd);
app.use("/cart",cartView);
app.use("/users",userList)
//rutas api
app.use("/api/cart", routerCart);
app.use("/api/productos", routerProd);
app.use('/api/docs', swaggerUi.serve,swaggerUi.setup(swaggerSpecs));
//middlewares generales
app.use(errorHandler);
app.use(addLogger);
app.get("/Testlogger", (req, res) => {
  req.logger.warn("!Alerta!");
  req.logger.info("Info");
  req.logger.error("Error");
  req.logger.debug("Debug");
  req.logger.silly("Silly");
  req.logger.verbose("Verbose");
  req.logger.http("Http");
  req.logger.fatal("Fatal");

  res.send("Prueba de logger");
});
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
