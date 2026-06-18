import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import {
  obtenerMovimientos,
  obtenerMovimientoPorId,
  crearMovimiento,
  actualizarMovimiento,
  anularMovimiento
} from '../controllers/Movimientocontroller.js';
const router = Router();

router.get('/',       autenticar, autorizar('farmacia', 'administrador'), obtenerMovimientos);
router.get('/:id',    autenticar, autorizar('farmacia', 'administrador'), obtenerMovimientoPorId);
router.post('/',      autenticar, autorizar('farmacia', 'administrador'), crearMovimiento);
router.put('/:id',    autenticar, autorizar('farmacia', 'administrador'), actualizarMovimiento);
router.delete('/:id', autenticar, autorizar('farmacia', 'administrador'), anularMovimiento);

export default router;