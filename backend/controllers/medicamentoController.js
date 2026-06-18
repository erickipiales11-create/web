import Medicamento from '../models/Medicine.js';
import Farmacia from '../models/Pharmacy.js';
import sequelize from '../config/databaser.js';
import { Op } from 'sequelize';

// Crear medicamento (solo farmacia)
export const crearMedicamento = async (req, res) => {
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

    // Validar campos obligatorios
    const camposObligatorios = ['nombre', 'precio', 'numero_lote', 'fecha_caducidad'];
    const faltantes = camposObligatorios.filter(campo => !req.body[campo]);
    
    if (faltantes.length > 0) {
      return res.status(400).json({
        mensaje: 'Faltan campos obligatorios',
        error: 'VALIDATION_MISSING_FIELDS',
        campos_faltantes: faltantes
      });
    }

    const medicamento = await Medicamento.create({
      ...req.body,
      farmacia_id: farmacia.id
    });

    res.status(201).json({ 
      mensaje: '✅ Medicamento creado exitosamente', 
      medicamento 
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al crear medicamento',
      error: error.message 
    });
  }
};

// Obtener todos los medicamentos de una farmacia
export const obtenerMedicamentosFarmacia = async (req, res) => {
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

    const medicamentos = await Medicamento.findAll({
      where: { farmacia_id: farmacia.id },
      order: [['nombre', 'ASC']]
    });

    res.json({
      total: medicamentos.length,
      medicamentos
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener medicamentos',
      error: error.message 
    });
  }
};

// Obtener todos los medicamentos (público)
export const obtenerTodosMedicamentos = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll({
      include: [{
        model: Farmacia,
        attributes: ['nombre_farmacia', 'direccion', 'ciudad', 'telefono']
      }],
      where: { activo: true },
      order: [['nombre', 'ASC']]
    });
    
    res.json({
      total: medicamentos.length,
      medicamentos
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener medicamentos',
      error: error.message 
    });
  }
};

// Buscar medicamentos por nombre
export const buscarMedicamentos = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        mensaje: 'Se requiere un término de búsqueda',
        error: 'SEARCH_QUERY_REQUIRED'
      });
    }

    const medicamentos = await Medicamento.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.iLike]: `%${query}%` } },
          { nombre_generico: { [Op.iLike]: `%${query}%` } },
          { marca: { [Op.iLike]: `%${query}%` } },
          { categoria: { [Op.iLike]: `%${query}%` } }
        ],
        activo: true
      },
      include: [{
        model: Farmacia,
        attributes: ['nombre_farmacia', 'direccion', 'ciudad', 'telefono']
      }]
    });
    
    res.json({
      busqueda: query,
      total: medicamentos.length,
      medicamentos
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al buscar medicamentos',
      error: error.message 
    });
  }
};

// Actualizar medicamento
export const actualizarMedicamento = async (req, res) => {
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

    const medicamento = await Medicamento.findOne({
      where: { 
        id: req.params.id,
        farmacia_id: farmacia.id
      }
    });

    if (!medicamento) {
      return res.status(404).json({ 
        mensaje: 'Medicamento no encontrado',
        error: 'MEDICINE_NOT_FOUND'
      });
    }

    // Campos permitidos para actualizar
    const camposPermitidos = [
      'nombre', 'nombre_generico', 'marca', 'cantidad', 'unidad',
      'precio', 'precio_compra', 'numero_lote', 'fecha_caducidad',
      'fecha_fabricacion', 'categoria', 'subcategoria', 'principio_activo',
      'dosis', 'presentacion', 'requiere_receta', 'stock_minimo',
      'stock_maximo', 'condiciones_almacenamiento', 'codigo_barras',
      'url_imagen'
    ];

    const datosActualizar = {};
    camposPermitidos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        datosActualizar[campo] = req.body[campo];
      }
    });

    await medicamento.update(datosActualizar);
    
    res.json({ 
      mensaje: '✅ Medicamento actualizado exitosamente', 
      medicamento 
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al actualizar medicamento',
      error: error.message 
    });
  }
};

// Eliminar medicamento (soft delete)
export const eliminarMedicamento = async (req, res) => {
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

    const medicamento = await Medicamento.findOne({
      where: { 
        id: req.params.id,
        farmacia_id: farmacia.id
      }
    });

    if (!medicamento) {
      return res.status(404).json({ 
        mensaje: 'Medicamento no encontrado',
        error: 'MEDICINE_NOT_FOUND'
      });
    }

    await medicamento.update({ activo: false });
    
    res.json({ 
      mensaje: '✅ Medicamento desactivado exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al eliminar medicamento',
      error: error.message 
    });
  }
};

// Actualizar stock
export const actualizarStock = async (req, res) => {
  try {
    const { cantidad } = req.body;
    
    if (cantidad === undefined || cantidad < 0) {
      return res.status(400).json({
        mensaje: 'La cantidad debe ser un número positivo',
        error: 'STOCK_INVALID_QUANTITY'
      });
    }

    const farmacia = await Farmacia.findOne({
      where: { usuario_id: req.usuario.id }
    });

    if (!farmacia) {
      return res.status(404).json({ 
        mensaje: 'Farmacia no encontrada',
        error: 'PHARMACY_NOT_FOUND'
      });
    }

    const medicamento = await Medicamento.findOne({
      where: { 
        id: req.params.id,
        farmacia_id: farmacia.id
      }
    });

    if (!medicamento) {
      return res.status(404).json({ 
        mensaje: 'Medicamento no encontrado',
        error: 'MEDICINE_NOT_FOUND'
      });
    }

    await medicamento.update({ cantidad });
    
    // Verificar si está por debajo del stock mínimo
    const alertaStock = medicamento.cantidad <= medicamento.stock_minimo;
    
    res.json({ 
      mensaje: '✅ Stock actualizado exitosamente',
      medicamento: {
        id: medicamento.id,
        nombre: medicamento.nombre,
        cantidad: medicamento.cantidad,
        stock_minimo: medicamento.stock_minimo,
        alerta_stock: alertaStock
      }
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al actualizar stock',
      error: error.message 
    });
  }
};

// Obtener medicamentos próximos a vencer
export const obtenerMedicamentosPorVencer = async (req, res) => {
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

    const treintaDias = new Date();
    treintaDias.setDate(treintaDias.getDate() + 30);

    const medicamentos = await Medicamento.findAll({
      where: {
        farmacia_id: farmacia.id,
        fecha_caducidad: {
          [Op.lte]: treintaDias,
          [Op.gte]: new Date()
        },
        activo: true
      },
      order: [['fecha_caducidad', 'ASC']]
    });

    res.json({
      total: medicamentos.length,
      medicamentos
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener medicamentos por vencer',
      error: error.message 
    });
  }
};

// Obtener medicamentos con bajo stock
export const obtenerMedicamentosBajoStock = async (req, res) => {
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

    const medicamentos = await Medicamento.findAll({
      where: {
        farmacia_id: farmacia.id,
        cantidad: {
          [Op.lte]: sequelize.col('stock_minimo')
        },
        activo: true
      },
      order: [['cantidad', 'ASC']]
    });

    res.json({
      total: medicamentos.length,
      medicamentos
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener medicamentos con bajo stock',
      error: error.message 
    });
  }
};