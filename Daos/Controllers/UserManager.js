

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
  }


export default UserManager
const rute = new UserManager();
