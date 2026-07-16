const { Medicine, Category, Pharmacy, sequelize } = require('../models');

exports.getAllMedicines = async (req, res) => {
    try {
        const { pharmacy_id, category_id, search } = req.query;
        
        const where = { is_active: true };
        if (pharmacy_id) where.pharmacy_id = pharmacy_id;
        if (category_id) where.category_id = category_id;
        
        let medicines = await Medicine.findAll({
            where,
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Pharmacy, attributes: ['id', 'name'] },
            ],
            order: [['name', 'ASC']],
        });

        // Búsqueda por nombre o componente activo
        if (search) {
            medicines = medicines.filter(m => 
                m.name.toLowerCase().includes(search.toLowerCase()) ||
                (m.active_ingredient && m.active_ingredient.toLowerCase().includes(search.toLowerCase()))
            );
        }

        res.json(medicines);
    } catch (error) {
        console.error('Error al obtener medicamentos:', error);
        res.status(500).json({ error: 'Error al obtener medicamentos' });
    }
};

exports.getMedicineById = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await Medicine.findByPk(id, {
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Pharmacy, attributes: ['id', 'name'] },
            ],
        });

        if (!medicine) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }

        // Buscar medicamentos equivalentes (mismo componente activo)
        const equivalents = await Medicine.findAll({
            where: {
                active_ingredient: medicine.active_ingredient,
                is_active: true,
                id: { [sequelize.Op.ne]: medicine.id },
            },
            attributes: ['id', 'name', 'gramaje', 'price'],
        });

        res.json({ ...medicine.toJSON(), equivalents });
    } catch (error) {
        console.error('Error al obtener medicamento:', error);
        res.status(500).json({ error: 'Error al obtener medicamento' });
    }
};

exports.createMedicine = async (req, res) => {
    try {
        const {
            name,
            category_id,
            description,
            price,
            stock,
            requires_prescription,
            gramaje,
            tipo,
            pharmacy_id,
            expiration_date,
            active_ingredient,
            laboratory,
        } = req.body;

        // Verificar que el trabajador solo pueda agregar a su farmacia
        if (req.user.role === 'worker' && req.user.pharmacy_id !== parseInt(pharmacy_id)) {
            return res.status(403).json({ error: 'No puedes agregar medicamentos a otra farmacia' });
        }

        const medicine = await Medicine.create({
            name,
            category_id,
            description,
            price,
            stock,
            requires_prescription: requires_prescription || false,
            gramaje,
            tipo,
            pharmacy_id,
            expiration_date,
            active_ingredient,
            laboratory,
        });

        res.status(201).json(medicine);
    } catch (error) {
        console.error('Error al crear medicamento:', error);
        res.status(500).json({ error: 'Error al crear medicamento' });
    }
};

exports.updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const medicine = await Medicine.findByPk(id);
        if (!medicine) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }

        // Verificar permisos
        if (req.user.role === 'worker') {
            if (medicine.pharmacy_id !== req.user.pharmacy_id) {
                return res.status(403).json({ error: 'No puedes editar medicamentos de otra farmacia' });
            }
            // Worker no puede cambiar la farmacia
            delete updates.pharmacy_id;
        }

        await medicine.update(updates);
        res.json(medicine);
    } catch (error) {
        console.error('Error al actualizar medicamento:', error);
        res.status(500).json({ error: 'Error al actualizar medicamento' });
    }
};

exports.deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;

        const medicine = await Medicine.findByPk(id);
        if (!medicine) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }

        // Verificar permisos
        if (req.user.role === 'worker' && medicine.pharmacy_id !== req.user.pharmacy_id) {
            return res.status(403).json({ error: 'No puedes eliminar medicamentos de otra farmacia' });
        }

        await medicine.update({ is_active: false });
        res.json({ message: 'Medicamento eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar medicamento:', error);
        res.status(500).json({ error: 'Error al eliminar medicamento' });
    }
};