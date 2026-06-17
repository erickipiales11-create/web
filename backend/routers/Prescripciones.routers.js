import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import {
  obtenerPrescripciones,
  obtenerPrescripcionPorId,
  crearPrescripcion,
  actualizarPrescripcion,
  eliminarPrescripcion
} from '../controllers/PrescripcionController.js';

const router = Router();

router.get('/',       autenticar, autorizar('medico', 'farmacia', 'administrador', 'paciente'), obtenerPrescripciones);
router.get('/:id',    autenticar, autorizar('medico', 'farmacia', 'administrador', 'paciente'), obtenerPrescripcionPorId);
router.post('/',      autenticar, autorizar('medico'),                                          crearPrescripcion);
router.put('/:id',    autenticar,                                                               actualizarPrescripcion);
router.delete('/:id', autenticar,                                                               eliminarPrescripcion);

export default router;