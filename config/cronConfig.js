import cron from 'node-cron';
import userModel from '../Daos/Models/User.js';

export function configureCron(){
// Define una tarea programada para ejecutar cada día a la medianoche
cron.schedule('*/2 * * * *', async () => {
    try {
      const inactivityPeriod = 30; // Duración del período de inactividad en minutos
  
      // Calcular la fecha límite para la inactividad (1 minuto antes de la hora actual)
      const deadlineDate = new Date();
      deadlineDate.setMinutes(deadlineDate.getMinutes() - inactivityPeriod);
      console.log(deadlineDate)
  
      // Buscar usuarios inactivos con rol "user" que no han iniciado sesión desde la fecha límite
      const inactiveUsers = await userModel.find({
        rol: 'user',
        lastLogin: { $lt: deadlineDate },
      });
  
      // Eliminar los usuarios inactivos encontrados
      if (inactiveUsers.length > 0) {
        const result = await userModel.deleteMany({
          _id: { $in: inactiveUsers.map((user) => user._id) },
        });
  
        console.log(`Usuarios eliminados: ${result.deletedCount}`);
      }
  
      console.log(`Tarea programada ejecutada a las ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error('Error en la tarea programada:', error);
    }
  });

  }
  
  
  
  
  
  
  