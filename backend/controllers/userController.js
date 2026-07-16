const { User, Pharmacy } = require('../models');

exports.getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const where = { is_active: true };
        
        if (role) where.role = role;

        const users = await User.findAll({
            where,
            attributes: { exclude: ['password'] },
            include: [{
                model: Pharmacy,
                attributes: ['id', 'name', 'address'],
            }],
        });

        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

exports.getWorkers = async (req, res) => {
    try {
        const workers = await User.findAll({
            where: { role: 'worker', is_active: true },
            attributes: { exclude: ['password'] },
            include: [{
                model: Pharmacy,
                attributes: ['id', 'name', 'address'],
            }],
        });

        res.json(workers);
    } catch (error) {
        console.error('Error al obtener trabajadores:', error);
        res.status(500).json({ error: 'Error al obtener trabajadores' });
    }
};

exports.assignPharmacy = async (req, res) => {
    try {
        const { userId, pharmacyId } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (user.role !== 'worker') {
            return res.status(400).json({ error: 'Solo se pueden asignar farmacias a trabajadores' });
        }

        const pharmacy = await Pharmacy.findByPk(pharmacyId);
        if (!pharmacy) {
            return res.status(404).json({ error: 'Farmacia no encontrada' });
        }

        await user.update({ pharmacy_id: pharmacyId });

        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [{ model: Pharmacy }],
        });

        res.json({ message: 'Farmacia asignada correctamente', user: updatedUser });
    } catch (error) {
        console.error('Error al asignar farmacia:', error);
        res.status(500).json({ error: 'Error al asignar farmacia' });
    }
};

exports.deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ error: 'No se puede desactivar un administrador' });
        }

        await user.update({ is_active: false });
        res.json({ message: 'Usuario desactivado correctamente' });
    } catch (error) {
        console.error('Error al desactivar usuario:', error);
        res.status(500).json({ error: 'Error al desactivar usuario' });
    }
};