import userModel from "../Models/User.js";

class UserManager {
  async getAllUsers() {
    try {
      const content = await userModel.find()
      return content
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async getByid(uid) {
    try {
      
      const getByid =await userModel.findOne({id:uid})

      //const getByid = await cartModel.findById(id).populate("productos.producto")
      console.log("producto buscado", getByid);
      return getByid;
    } catch (error) {
      console.log(error);
    }
  }
  
  async getUser() {
    try {
      const getUser = { user: req.session.user }
      console.log("usuario", getUser);
      return getUser;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserToPremium(userId) {
    try {
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: userId },
        { $set: { rol: 'premium' } },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteById(id) {
    try {
      const deleteByid = await userModel.findOneAndDelete({_id:id})
      return deleteByid;
    } catch (error) {
      console.log(error);
    }
  }

  async updatePremiumToUser(userId) {
    try {
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: userId },
        { $set: { rol: 'user' } },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }
}


export default UserManager;
