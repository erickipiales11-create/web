import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Farmacia from '../models/Farmacia.js';

export const registrar = async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;

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
      rol: 'usuario'
    });

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
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
        rol: usuario.rol
      },
      farmacia
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
      process.env.JWT_SECRET,
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
    res.status(500).json({ error: error.message });
  }
};

export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password'] }
    });

    let datosFarmacia = null;
    if (usuario.rol === 'farmacia') {
      datosFarmacia = await Farmacia.findOne({ where: { usuario_id: usuario.id } });
    }

    res.json({
      usuario,
      farmacia: datosFarmacia
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};