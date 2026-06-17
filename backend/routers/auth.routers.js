import express from "express";
import { 
  registrar, 
  registrarFarmacia, 
  login, 
  obtenerPerfil 
} from "../controllers/authController.js";
import { autenticar } from "../middlewares/auth.js";

const router = express.Router();

// Rutas públicas
router.post("/registrar", registrar);
router.post("/registrar-farmacia", registrarFarmacia);
router.post("/login", login);

// Rutas protegidas
router.get("/perfil", autenticar, obtenerPerfil);

export default router;