import Farmacia from '../models/Pharmacy.js';
import Usuario from '../models/User.js';
import { Op } from 'sequelize';

// Obtener todas las farmacias (público)
export const obtenerTodasFarmacias = async (req, res) => {
  try {
    const farmacias = await Farmacia.findAll({
      include: [{
        model: Usuario,
        attributes: ['id', 'nombre', 'email', 'telefono']
      }],
      where: { activo: true },
      order: [['nombre_farmacia', 'ASC']]
    });
    res.json({
      total: farmacias.length,
      farmacias
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener farmacias',
      error: error.message 
    });
  }
};

// Obtener una farmacia por ID
export const obtenerFarmaciaPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        mensaje: 'ID inválido',
        error: 'INVALID_ID'
      });
    }

    const farmacia = await Farmacia.findByPk(id, {
      include: [{
        model: Usuario,
        attributes: ['id', 'nombre', 'email', 'telefono']
      }]
    });

    if (!farmacia) {
      return res.status(404).json({ 
        mensaje: 'Farmacia no encontrada',
        error: 'PHARMACY_NOT_FOUND'
      });
    }

    res.json(farmacia);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener farmacia',
      error: error.message 
    });
  }
};

// Actualizar farmacia (solo el dueño)
export const actualizarFarmacia = async (req, res) => {
  try {
    const farmacia = await Farmacia.findOne({
      where: { usuario_id: req.usuario.id }
    });

    if (!farmacia) {
      return res.status(404).json({ 
        mensaje: 'Farmacia no encontrada',
        error: 'PHARMACY_NOT_FOUND'
      });
    }

    // Campos permitidos para actualizar
    const camposPermitidos = [
      'nombre_farmacia', 'direccion', 'ciudad', 'estado',
      'telefono', 'email', 'sitio_web', 'horario',
      'latitud', 'longitud'
    ];

    const datosActualizar = {};
    camposPermitidos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        datosActualizar[campo] = req.body[campo];
      }
    });

    await farmacia.update(datosActualizar);
    
    res.json({ 
      mensaje: '✅ Farmacia actualizada exitosamente', 
      farmacia 
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al actualizar farmacia',
      error: error.message 
    });
  }
};

// Buscar farmacias por ciudad
export const obtenerFarmaciasPorCiudad = async (req, res) => {
  try {
    const { ciudad } = req.params;
    const farmacias = await Farmacia.findAll({
      where: {
        ciudad: {
          [Op.iLike]: `%${ciudad}%`
        },
        activo: true
      },
      include: [{
        model: Usuario,
        attributes: ['id', 'nombre', 'email', 'telefono']
      }]
    });
    
    res.json({
      ciudad: ciudad,
      total: farmacias.length,
      farmacias
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al buscar farmacias',
      error: error.message 
    });
  }
};

// Buscar farmacias por nombre
export const buscarFarmacias = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        mensaje: 'Se requiere un término de búsqueda',
        error: 'SEARCH_QUERY_REQUIRED'
      });
    }

    const farmacias = await Farmacia.findAll({
      where: {
        [Op.or]: [
          { nombre_farmacia: { [Op.iLike]: `%${query}%` } },
          { direccion: { [Op.iLike]: `%${query}%` } },
          { ciudad: { [Op.iLike]: `%${query}%` } }
        ],
        activo: true
      },
      include: [{
        model: Usuario,
        attributes: ['id', 'nombre', 'email', 'telefono']
      }]
    });
    
    res.json({
      busqueda: query,
      total: farmacias.length,
      farmacias
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al buscar farmacias',
      error: error.message 
    });
  }
};