const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas para pacientes
router.post('/', checkRole('patient'), orderController.createOrder);
router.put('/:id/cancel', checkRole('patient'), orderController.cancelOrder);

// Subir imagen de receta
router.post(
    '/:id/prescription',
    checkRole('patient'),
    upload.single('image'),
    orderController.uploadPrescription
);

// Rutas para workers y admin
router.get('/', orderController.getOrders);
router.put('/:id/status', checkRole('admin', 'worker'), orderController.updateOrderStatus);

module.exports = router;
const { Order, Medicine, Pharmacy, User } = require('../models');

// ... (código existente)

exports.uploadPrescription = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
        }

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        // Verificar que el paciente es dueño de la orden
        if (order.patient_id !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permiso para modificar esta orden' });
        }

        // Verificar que la orden está pendiente
        if (order.status !== 'pending') {
            return res.status(400).json({ error: 'Solo se pueden subir recetas a órdenes pendientes' });
        }

        // Guardar la ruta de la imagen
        const imagePath = req.file.path.replace(/\\/g, '/');
        order.prescription_image = imagePath;
        await order.save();

        res.json({ 
            message: 'Receta subida correctamente',
            imagePath: imagePath,
            order: order
        });
    } catch (error) {
        console.error('Error al subir receta:', error);
        res.status(500).json({ error: 'Error al subir receta' });
    }
};