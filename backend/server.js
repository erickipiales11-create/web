const express = require("express")
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get("/", (req, res) => {
    return res.status(200).json({message: "Hola mi nombre es Erick"
    });
});
app.listen(port,() => {
    console.log("Servidor escuchando en el puerto" + port);
    console.log("Has click aqui para ingresar: http://localhost:" + port);
});