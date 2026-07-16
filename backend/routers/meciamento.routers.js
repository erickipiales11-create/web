const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const { auth, checkRole } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas públicas (para todos los usuarios autenticados)
router.get('/', medicineController.getAllMedicines);
router.get('/:id', medicineController.getMedicineById);

// Rutas para workers y admin
router.post('/', checkRole('admin', 'worker'), medicineController.createMedicine);
router.put('/:id', checkRole('admin', 'worker'), medicineController.updateMedicine);
router.delete('/:id', checkRole('admin', 'worker'), medicineController.deleteMedicine);

module.exports = router;