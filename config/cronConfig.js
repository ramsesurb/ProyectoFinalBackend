import cron from "node-cron";
import userModel from "../Daos/Models/User.js";

export function configureCron() {
  cron.schedule("*/2 * * * *", async () => {
    try {
      const inactivityPeriod = 15; // Duración del período de inactividad en minutos para probar

      const deadlineDate = new Date();
      deadlineDate.setMinutes(deadlineDate.getMinutes() - inactivityPeriod);
      console.log(deadlineDate);

      const inactiveUsers = await userModel.find({
        $or: [{ rol: "user" }, { rol: "premium" }],
        lastLogin: { $lt: deadlineDate },
      });

      if (inactiveUsers.length > 0) {
        const result = await userModel.deleteMany({
          _id: { $in: inactiveUsers.map((user) => user._id) },
        });

        console.log(`Usuarios eliminados: ${result.deletedCount}`);
      }

      console.log(
        `Tarea programada ejecutada a las ${new Date().toLocaleTimeString()}`
      );
    } catch (error) {
      console.error("Error en la tarea programada:", error);
    }
  });
}
