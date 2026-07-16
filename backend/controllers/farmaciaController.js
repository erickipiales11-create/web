const { Pharmacy, User } = require('../models');

exports.getAllPharmacies = async (req, res) => {
    try {
        const pharmacies = await Pharmacy.findAll({
            where: { is_active: true },
            include: [{
                model: User,
                as: 'workers',
                attributes: ['id', 'name', 'email'],
                where: { role: 'worker' },
                required: false,
            }],
        });
        res.json(pharmacies);
    } catch (error) {
        console.error('Error al obtener farmacias:', error);
        res.status(500).json({ error: 'Error al obtener farmacias' });
    }
};

exports.getPharmacyById = async (req, res) => {
    try {
        const { id } = req.params;
        const pharmacy = await Pharmacy.findByPk(id, {
            include: [{
                model: User,
                as: 'workers',
                attributes: ['id', 'name', 'email'],
                where: { role: 'worker' },
                required: false,
            }],
        });
        
        if (!pharmacy) {
            return res.status(404).json({ error: 'Farmacia no encontrada' });
        }
        
        res.json(pharmacy);
    } catch (error) {
        console.error('Error al obtener farmacia:', error);
        res.status(500).json({ error: 'Error al obtener farmacia' });
    }
};

exports.createPharmacy = async (req, res) => {
    try {
        const { name, address, phone, latitude, longitude } = req.body;

        const pharmacy = await Pharmacy.create({
            name,
            address,
            phone,
            latitude,
            longitude,
        });

        res.status(201).json(pharmacy);
    } catch (error) {
        console.error('Error al crear farmacia:', error);
        res.status(500).json({ error: 'Error al crear farmacia' });
    }
};

exports.updatePharmacy = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, phone, latitude, longitude } = req.body;

        const pharmacy = await Pharmacy.findByPk(id);
        if (!pharmacy) {
            return res.status(404).json({ error: 'Farmacia no encontrada' });
        }

        await pharmacy.update({
            name,
            address,
            phone,
            latitude,
            longitude,
        });

        res.json(pharmacy);
    } catch (error) {
        console.error('Error al actualizar farmacia:', error);
        res.status(500).json({ error: 'Error al actualizar farmacia' });
    }
};

exports.deletePharmacy = async (req, res) => {
    try {
        const { id } = req.params;

        const pharmacy = await Pharmacy.findByPk(id);
        if (!pharmacy) {
            return res.status(404).json({ error: 'Farmacia no encontrada' });
        }

        // Soft delete
        await pharmacy.update({ is_active: false });

        res.json({ message: 'Farmacia eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar farmacia:', error);
        res.status(500).json({ error: 'Error al eliminar farmacia' });
    }
};

exports.assignWorker = async (req, res) => {
    try {
        const { userId, pharmacyId } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (user.role !== 'worker') {
            return res.status(400).json({ error: 'El usuario debe ser un trabajador' });
        }

        const pharmacy = await Pharmacy.findByPk(pharmacyId);
        if (!pharmacy) {
            return res.status(404).json({ error: 'Farmacia no encontrada' });
        }

        await user.update({ pharmacy_id: pharmacyId });

        res.json({ message: 'Trabajador asignado correctamente', user });
    } catch (error) {
        console.error('Error al asignar trabajador:', error);
        res.status(500).json({ error: 'Error al asignar trabajador' });
    }
};