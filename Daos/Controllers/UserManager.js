import usermodel from "./dao/controllers/userManager.js"

class UserManager {
  
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
      const updatedUser = await usermodel.findOneAndUpdate(
        { _id: userId },
        { $set: { rol: 'premium' } },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserManager;
