import express from 'express';
import {
  obtenerTodasFarmacias,
  obtenerFarmaciaPorId,
  actualizarFarmacia,
  obtenerFarmaciasPorCiudad
} from '../controllers/farmaciaController.js';
import { autenticar, autorizar } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', obtenerTodasFarmacias);
router.get('/ciudad/:ciudad', obtenerFarmaciasPorCiudad);
router.get('/:id', obtenerFarmaciaPorId);
router.put('/actualizar', autenticar, autorizar('farmacia'), actualizarFarmacia);

export default router;