import { transporter } from "../config/Gmail.js";

export const sendMailTicket = async (Code, generateDate, totalAmount, purchaserEmail) => {
    const email = await transporter.sendMail({
        from:"Guitar Store",
        to:`${purchaserEmail}`,
        subject:"Tu compra",
        html: `<div>
        <h1>Muchas gracias por tu compra!</h1>
        <p>Tu compra fue realizada exitosamente.</p>
        <p>Datos importantes de tu compra:</p>
        <p>Codigo de compra: ${Code}</p>
        <p>Compra realizada el: ${generateDate}</p>
        <p>Total de compra: ${totalAmount}</p>
        </div>`
    });
    return email;
}