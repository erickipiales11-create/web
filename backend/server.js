import dotenv from "dotenv"
import app from"./app.js"

import {sequelize, User }from "./models/index.js"

const port = process.env.PORT || 3000;
try{
   await sequelize.authenticate();
   console.log ("Conexion a la base de datos exitosa!!");

   await sequelize.sync({
    alter: true
   })

} catch (error){
    console.error("Ocurrio un error",error);
}

app.listen(port,() => {
    console.log("Servidor escuchando en el puerto" + port);
    console.log("Has click aqui para ingresar: http://localhost:" + port);
});