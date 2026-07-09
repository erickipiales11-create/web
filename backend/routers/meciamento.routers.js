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

// Rutas públicas (sin autenticación)
router.get('/', getMedicamentos);
router.get('/:id', getMedicamento);

// Rutas protegidas (requieren autenticación)
router.post('/', autenticar, createMedicamento);
router.put('/:id', autenticar, updateMedicamento);
router.delete('/:id', autenticar, deleteMedicamento);

export default router;
