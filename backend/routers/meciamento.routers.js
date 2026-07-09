import express from 'express';
import {
    getMedicamentos,
    getMedicamento,
    buscarMedicamentos,
    createMedicamento,
    updateMedicamento,
    deleteMedicamento
} from '../controllers/medicamentoController.js';
import { autenticar } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getMedicamentos);
router.get('/buscar', buscarMedicamentos);
router.get('/:id', getMedicamento);
router.post('/', autenticar, createMedicamento);
router.put('/:id', autenticar, updateMedicamento);
router.delete('/:id', autenticar, deleteMedicamento);

export default router;
