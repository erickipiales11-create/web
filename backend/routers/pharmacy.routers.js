import express from 'express';
import {
  obtenerTodasFarmacias,
  obtenerFarmaciaPorId,
  actualizarFarmacia,
  obtenerFarmaciasPorCiudad,
  buscarFarmacias
} from '../controllers/farmaciaController.js';
import { autenticar, autorizar } from '../middlewares/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', obtenerTodasFarmacias);
router.get('/buscar', buscarFarmacias);
router.get('/ciudad/:ciudad', obtenerFarmaciasPorCiudad);
router.get('/:id', obtenerFarmaciaPorId);

// Rutas protegidas (solo farmacia dueña)
router.put('/actualizar', autenticar, autorizar('farmacia'), actualizarFarmacia);

export default router;