const { Order, Medicine, Pharmacy, User } = require('../models');

exports.createOrder = async (req, res) => {
    try {
        const {
            pharmacy_id,
            medicine_id,
            quantity,
            prescription_image,
            notes,
        } = req.body;

        const patient_id = req.user.id;

        // Verificar que el medicamento existe y tiene stock
        const medicine = await Medicine.findByPk(medicine_id);
        if (!medicine) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }

        if (medicine.stock < quantity) {
            return res.status(400).json({ error: 'Stock insuficiente' });
        }

        // Calcular total
        const total = medicine.price * quantity;

        const order = await Order.create({
            patient_id,
            pharmacy_id,
            medicine_id,
            quantity,
            total,
            prescription_image: prescription_image || null,
            requires_prescription: medicine.requires_prescription,
            notes: notes || null,
            status: medicine.requires_prescription ? 'pending' : 'processing',
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Error al crear orden:', error);
        res.status(500).json({ error: 'Error al crear orden' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const { status } = req.query;
        const where = {};

        if (req.user.role === 'patient') {
            where.patient_id = req.user.id;
        } else if (req.user.role === 'worker') {
            where.pharmacy_id = req.user.pharmacy_id;
        }

        if (status) where.status = status;

        const orders = await Order.findAll({
            where,
            include: [
                { model: User, as: 'patient', attributes: ['id', 'name', 'email'] },
                { model: Medicine, attributes: ['id', 'name', 'price'] },
                { model: Pharmacy, attributes: ['id', 'name', 'address'] },
            ],
            order: [['created_at', 'DESC']],
        });

        res.json(orders);
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        // Verificar permisos
        if (req.user.role === 'worker' && order.pharmacy_id !== req.user.pharmacy_id) {
            return res.status(403).json({ error: 'No tienes permisos para esta orden' });
        }

        await order.update({ status });

        // Si la orden se completa, reducir el stock del medicamento
        if (status === 'completed') {
            const medicine = await Medicine.findByPk(order.medicine_id);
            if (medicine) {
                await medicine.update({
                    stock: medicine.stock - order.quantity,
                });
            }
        }

        res.json(order);
    } catch (error) {
        console.error('Error al actualizar orden:', error);
        res.status(500).json({ error: 'Error al actualizar orden' });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        // Solo el paciente puede cancelar su orden
        if (req.user.role === 'patient' && order.patient_id !== req.user.id) {
            return res.status(403).json({ error: 'No puedes cancelar esta orden' });
        }

        if (order.status === 'completed') {
            return res.status(400).json({ error: 'No se puede cancelar una orden completada' });
        }

        await order.update({ status: 'cancelled' });
        res.json({ message: 'Orden cancelada correctamente' });
    } catch (error) {
        console.error('Error al cancelar orden:', error);
        res.status(500).json({ error: 'Error al cancelar orden' });
    }
};