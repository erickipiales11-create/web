import { Router } from "express";

import {
  registrar,
  registrarFarmacia,
  login
} from "../controllers/authController.js";

import categoriasRouter from "../routers/categorias.routers.js";
import movimientosRouter from "../routers/movimientos.routers.js";
import prescripcionesRouter from "../routers/prescripciones.routers.js";

const router = Router();

// Auth
router.post("/register", registrar);
router.post("/register/farmacia", registrarFarmacia);
router.post("/login", login);

// Recursos
router.use("/categorias", categoriasRouter);
router.use("/movimientos", movimientosRouter);
router.use("/prescripciones", prescripcionesRouter);

export default router;