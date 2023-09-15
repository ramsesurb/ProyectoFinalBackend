import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";



const Collection = 'Products'

const productoSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  
  stock: {
    type: Number,
    required: true,
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    enum: ['admin', 'Premium'],
    ref: 'User'
},
  status: {
    type: Boolean,
    required: true,
  },
});

productoSchema.plugin(mongoosePaginate)
  
const productoModel = mongoose.model(Collection, productoSchema);
 

  export default productoModel