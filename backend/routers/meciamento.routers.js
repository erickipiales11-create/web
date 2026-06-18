import express from 'express';
import {
  crearMedicamento,
  obtenerMedicamentosFarmacia,
  obtenerTodosMedicamentos,
  buscarMedicamentos,
  actualizarMedicamento,
  eliminarMedicamento,
  actualizarStock,
  obtenerMedicamentosPorVencer
} from '../controllers/medicamentoController.js';
import { autenticar, autorizar } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', obtenerTodosMedicamentos);
router.get('/buscar', buscarMedicamentos);
router.post('/', autenticar, autorizar('farmacia'), crearMedicamento);
router.get('/mis-medicamentos', autenticar, autorizar('farmacia'), obtenerMedicamentosFarmacia);
router.get('/por-vencer', autenticar, autorizar('farmacia'), obtenerMedicamentosPorVencer);
router.put('/:id', autenticar, autorizar('farmacia'), actualizarMedicamento);
router.put('/:id/stock', autenticar, autorizar('farmacia'), actualizarStock);
router.delete('/:id', autenticar, autorizar('farmacia'), eliminarMedicamento);

export default router;