import { Router } from "express";

import UserManager from "../Daos/Controllers/UserManager.js";


const users = new UserManager()

const userList = Router();


//vista home users

userList.get("/", async (req, res) => {
  try {
    const usersRaw = await users.getAllUsers();
    const usersFiltered = usersRaw.filter(user => user.rol !== 'admin');
    const usersToRender = usersFiltered.map(user => user.toObject());
    res.render("users", { productos: usersToRender });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

userList.put("/:id/upgradeToPremium", async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUser = await users.updateUserToPremium(userId);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      return res.status(200).json({ message: "Usuario actualizado a premium", user: updatedUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });
  userList.put("/:id/returnToUser", async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUser = await users.updatePremiumToUser(userId);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      return res.status(200).json({ message: "Usuario actualizado a premium", user: updatedUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });
userList.get
export default userList;