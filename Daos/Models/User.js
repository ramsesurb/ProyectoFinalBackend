import mongoose from 'mongoose';
import cartModel from './cart.js';
const { Schema } = mongoose;

const collection = 'User';

function getCurrentTimestamp() {
  return new Date();
}

const schema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  lastLogin: { type: Date, default: getCurrentTimestamp() },
  rol: {
    type: String,
    default: 'user' // Valor predeterminado 'user' para el campo 'rol'
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  }
});

const generateUniqueCartId = async () => {
  const cart = await cartModel.findOne().sort({ id: -1 }).exec();
  return cart ? cart.id + 1 : 1;
};

schema.pre('save', async function (next) {
  if (!this.cart) {
    const Cart = mongoose.model('Cart');
    const newCart = new Cart({ id: await generateUniqueCartId() });
    await newCart.save();
    this.cart = newCart._id;
  }
  next();
});

const userModel = mongoose.model(collection, schema);

export default userModel;
