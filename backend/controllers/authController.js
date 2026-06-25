import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario, Farmacia } from '../models/index.js';

// Registrar usuario normal
export const registrar = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'usuario'
    });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'mi_secreto_super_seguro_123',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Registrar farmacia
export const registrarFarmacia = async (req, res) => {
  try {
    const { nombre, direccion, telefono, email, password } = req.body;
    
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario con rol farmacia
    const usuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: 'farmacia'
    });

    // Crear farmacia asociada al usuario
    const farmacia = await Farmacia.create({
      nombre,
      direccion,
      telefono,
      email,
      usuarioId: usuario.id
    });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'mi_secreto_super_seguro_123',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        farmacia: farmacia
      }
    });
  } catch (error) {
    console.error('Error en registro farmacia:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // 🔥 TEMPORAL: Aceptar 'admin123' como contraseña mágica
    if (password === 'admin123') {
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET || 'mi_secreto_super_seguro_123',
        { expiresIn: '24h' }
      );
      return res.json({ 
        token, 
        user: { 
          id: usuario.id, 
          nombre: usuario.nombre, 
          email: usuario.email,
          rol: usuario.rol 
        } 
      });
    }

    // Verificar contraseña con bcrypt
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'mi_secreto_super_seguro_123',
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: usuario.id, 
        nombre: usuario.nombre, 
        email: usuario.email,
        rol: usuario.rol 
      } 
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener perfil
export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ['id', 'nombre', 'email', 'rol', 'activo', 'ultimo_login'],
      include: [{
        model: Farmacia,
        as: 'farmacia',
        attributes: ['id', 'nombre', 'direccion', 'telefono']
      }]
    });
    
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
