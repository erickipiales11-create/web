import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Farmacia from '../models/Farmacia.js';

// ==================== REGISTRO GENERAL ====================
export const registrar = async (req, res) => {
  try {
    const { nombre, email, password, telefono, rol } = req.body;

    // Validar que el email no exista
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    // Validar password
    if (!password || password.length < 6) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Hashear password
    const passwordHasheada = await bcrypt.hash(password, 10);
    
    // ✅ Lista de roles permitidos en tu sistema
    const rolesPermitidos = ['usuario', 'paciente', 'medico', 'farmacia', 'administrador'];
    
    // ✅ Validar y asignar rol
    let rolAsignado = 'usuario';
    if (rol && rolesPermitidos.includes(rol)) {
      rolAsignado = rol;
    } else if (rol && !rolesPermitidos.includes(rol)) {
      return res.status(400).json({ 
        mensaje: `Rol inválido. Roles permitidos: ${rolesPermitidos.join(', ')}` 
      });
    }

    // Crear usuario con el rol asignado
    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordHasheada,
      telefono,
      rol: rolAsignado
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'mi-clave-secreta',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: `✅ Usuario registrado exitosamente como ${rolAsignado}`,
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
    console.error('❌ Error en registro:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== REGISTRO DE FARMACIA ====================
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

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const passwordHasheada = await bcrypt.hash(password, 10);
    
    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordHasheada,
      telefono,
      rol: 'farmacia'
    });

    const farmacia = await Farmacia.create({
      usuario_id: usuario.id,
      nombre_farmacia,
      direccion,
      ciudad,
      estado,
      telefono: telefono_farmacia,
      email: email_farmacia || email,
      sitio_web,
      numero_licencia,
      horario,
      latitud,
      longitud
    });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'mi-clave-secreta',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: '✅ Farmacia registrada exitosamente',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      farmacia
    });
  } catch (error) {
    console.error('❌ Error en registro de farmacia:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    await usuario.update({ ultimo_login: new Date() });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'mi-clave-secreta',
      { expiresIn: '7d' }
    );

    let datosFarmacia = null;
    if (usuario.rol === 'farmacia') {
      datosFarmacia = await Farmacia.findOne({ where: { usuario_id: usuario.id } });
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
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== OBTENER PERFIL ====================
export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    let datosFarmacia = null;
    if (usuario.rol === 'farmacia') {
      datosFarmacia = await Farmacia.findOne({ where: { usuario_id: usuario.id } });
    }

    res.json({
      usuario,
      farmacia: datosFarmacia
    });
  } catch (error) {
    console.error('❌ Error en perfil:', error);
    res.status(500).json({ error: error.message });
  }
};