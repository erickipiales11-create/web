const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, checkRole } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas solo para admin
router.get('/', checkRole('admin'), userController.getAllUsers);
router.get('/workers', checkRole('admin'), userController.getWorkers);
router.post('/assign-pharmacy', checkRole('admin'), userController.assignPharmacy);
router.delete('/:id', checkRole('admin'), userController.deactivateUser);

module.exports = router;