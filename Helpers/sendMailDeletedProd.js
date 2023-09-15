import { transporter } from "../config/Gmail.js";

export const sendMailDeleted = async ( date,titulo,code,precio,ownerEmail) => {
    const emailDel = await transporter.sendMail({
        from:"Guitar Store",
        to:`${ownerEmail}`,
        subject:"producto eliminado",
        html: `<div>
        <h1>tu producto ha sido eliminado de la base de datos en la fecha: ${date} </h1>
        <p>Datos importantes de tu producto:</p>
        <p>Titulo: ${titulo}</p>
        <p>Precio: ${precio}</p>
        <p>Codigo${code}</p>      
        </div>`
    });
    return emailDel;
}