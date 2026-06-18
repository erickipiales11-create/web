import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.js';
import {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../controllers/CategoriaController.js';

const router = Router();

router.get('/',       autenticar,                                         obtenerCategorias);
router.get('/:id',    autenticar,                                         obtenerCategoriaPorId);
router.post('/',      autenticar, autorizar('farmacia', 'administrador'), crearCategoria);
router.put('/:id',    autenticar, autorizar('farmacia', 'administrador'), actualizarCategoria);
router.delete('/:id', autenticar, autorizar('farmacia', 'administrador'), eliminarCategoria);

export default router;