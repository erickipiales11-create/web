const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, checkRole } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas para pacientes
router.post('/', checkRole('patient'), orderController.createOrder);
router.put('/:id/cancel', checkRole('patient'), orderController.cancelOrder);

// Rutas para workers y admin
router.get('/', orderController.getOrders);
router.put('/:id/status', checkRole('admin', 'worker'), orderController.updateOrderStatus);

module.exports = router;