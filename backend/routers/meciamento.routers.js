import express from 'express';
import { 
  getMedicamentos, 
  getMedicamento, 
  createMedicamento, 
  updateMedicamento, 
  deleteMedicamento 
} from '../controllers/medicamentoController.js';
import { autenticar } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', autenticar, getMedicamentos);
router.get('/:id', autenticar, getMedicamento);
router.post('/', autenticar, createMedicamento);
router.put('/:id', autenticar, updateMedicamento);
router.delete('/:id', autenticar, deleteMedicamento);

export default router;
