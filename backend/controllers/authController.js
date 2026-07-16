const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

exports.register = async (req, res) => {
    try {
        const { email, password, name, role, pharmacy_id } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Solo admin puede crear workers
        if (role === 'worker' && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Only admin can create workers' });
        }

        const user = await User.create({
            email,
            password,
            name,
            role: role || 'patient',
            pharmacy_id: role === 'worker' ? pharmacy_id : null,
        });

        const userResponse = user.toJSON();
        delete userResponse.password;

        const token = generateToken(user);

        res.status(201).json({
            user: userResponse,
            token,
        });
    } catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user || !user.is_active) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const userResponse = user.toJSON();
        delete userResponse.password;

        const token = generateToken(user);

        res.json({
            user: userResponse,
            token,
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
};

exports.me = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
        });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Error getting user info' });
    }
};

exports.validateToken = async (req, res) => {
    try {
        res.json({ valid: true });
    } catch (error) {
        res.status(500).json({ valid: false });
    }
};