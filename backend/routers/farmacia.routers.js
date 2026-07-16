const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');
const { auth, checkRole } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas públicas (para todos los usuarios autenticados)
router.get('/', pharmacyController.getAllPharmacies);
router.get('/:id', pharmacyController.getPharmacyById);

// Rutas solo para admin
router.post('/', checkRole('admin'), pharmacyController.createPharmacy);
router.put('/:id', checkRole('admin'), pharmacyController.updatePharmacy);
router.delete('/:id', checkRole('admin'), pharmacyController.deletePharmacy);
router.post('/assign-worker', checkRole('admin'), pharmacyController.assignWorker);

module.exports = router;