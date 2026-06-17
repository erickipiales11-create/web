import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/User.js';
import Farmacia from '../models/Pharmacy.js';

// Registrar usuario normal
export const registrar = async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    // Verificar campos obligatorios
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        mensaje: 'Faltan campos obligatorios',
        error: 'VALIDATION_MISSING_FIELDS'
      });
    }

    // Verificar si ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ 
        mensaje: 'El email ya está registrado',
        error: 'REGISTER_EMAIL_EXISTS'
      });
    }

    const passwordHasheada = await bcrypt.hash(password, 10);
    
    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordHasheada,
      telefono: telefono || null,
      rol: 'usuario'
    });

    // Generar token
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: '✅ Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        telefono: usuario.telefono
      }
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al registrar usuario',
      error: error.message 
    });
  }
};

// Registrar farmacia
export const registrarFarmacia = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      telefono,
      nombre_farmacia,
      direccion,
      ciudad,
      estado,
      telefono_farmacia,
      email_farmacia,
      sitio_web,
      numero_licencia,
      horario,
      latitud,
      longitud
    } = req.body;

    // Validar campos obligatorios
    if (!nombre || !email || !password || !nombre_farmacia || 
        !direccion || !ciudad || !estado || !telefono_farmacia || 
        !numero_licencia) {
      return res.status(400).json({ 
        mensaje: 'Faltan campos obligatorios',
        error: 'VALIDATION_MISSING_FIELDS',
        campos_requeridos: ['nombre', 'email', 'password', 'nombre_farmacia', 
                           'direccion', 'ciudad', 'estado', 'telefono_farmacia', 
                           'numero_licencia']
      });
    }

    // Verificar si ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ 
        mensaje: 'El email ya está registrado',
        error: 'REGISTER_EMAIL_EXISTS'
      });
    }

    const passwordHasheada = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordHasheada,
      telefono: telefono || null,
      rol: 'farmacia'
    });

    // Crear farmacia
    const farmacia = await Farmacia.create({
      usuario_id: usuario.id,
      nombre_farmacia,
      direccion,
      ciudad,
      estado,
      telefono: telefono_farmacia,
      email: email_farmacia || email,
      sitio_web: sitio_web || null,
      numero_licencia,
      horario: horario || null,
      latitud: latitud || null,
      longitud: longitud || null
    });

    // Generar token
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: '✅ Farmacia registrada exitosamente',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        telefono: usuario.telefono
      },
      farmacia: {
        id: farmacia.id,
        nombre_farmacia: farmacia.nombre_farmacia,
        direccion: farmacia.direccion,
        ciudad: farmacia.ciudad,
        estado: farmacia.estado,
        telefono: farmacia.telefono,
        numero_licencia: farmacia.numero_licencia
      }
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al registrar farmacia',
      error: error.message 
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        mensaje: 'Email y contraseña son obligatorios',
        error: 'LOGIN_MISSING_FIELDS'
      });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ 
        mensaje: 'Credenciales inválidas',
        error: 'LOGIN_INVALID_CREDENTIALS'
      });
    }

    if (!usuario.activo) {
      return res.status(401).json({ 
        mensaje: 'Usuario desactivado',
        error: 'LOGIN_USER_INACTIVE'
      });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ 
        mensaje: 'Credenciales inválidas',
        error: 'LOGIN_INVALID_CREDENTIALS'
      });
    }

    // Actualizar último login
    await usuario.update({ ultimo_login: new Date() });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Si es farmacia, obtener datos de la farmacia
    let datosFarmacia = null;
    if (usuario.rol === 'farmacia') {
      datosFarmacia = await Farmacia.findOne({ 
        where: { usuario_id: usuario.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });
    }

    res.json({
      mensaje: '✅ Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        telefono: usuario.telefono
      },
      farmacia: datosFarmacia
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al iniciar sesión',
      error: error.message 
    });
  }
};

// Obtener perfil del usuario autenticado
export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password'] }
    });

    let datosFarmacia = null;
    if (usuario.rol === 'farmacia') {
      datosFarmacia = await Farmacia.findOne({ 
        where: { usuario_id: usuario.id },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });
    }

    res.json({
      usuario,
      farmacia: datosFarmacia
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener perfil',
      error: error.message 
    });
  }
};