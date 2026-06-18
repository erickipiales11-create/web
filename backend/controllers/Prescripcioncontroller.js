import Prescription from '../models/Prescription.js';
import Usuario from '../models/Usuario.js';
import InventoryMovement from '../models/InventoryMovement.js';
import Medicamento from '../models/Medicamento.js';

// GET /prescripciones
export const obtenerPrescripciones = async (req, res) => {
  try {
    const { rol, id: usuarioId } = req.usuario;

    let whereClause = {};

    if (rol === 'paciente') {
      whereClause.paciente_id = usuarioId;
    }
    // medico, farmacia y administrador ven todas

    const prescripciones = await Prescription.findAll({
      where: whereClause,
      include: [
        { model: Usuario, as: 'paciente', attributes: ['id', 'nombre', 'email'] },
        { model: Usuario, as: 'medico', attributes: ['id', 'nombre', 'email'] },
        {
          model: InventoryMovement,
          where: { tipo: 'salida' },
          required: false,
          attributes: ['id', 'cantidad'],
          include: [
            { model: Medicamento, attributes: ['id', 'nombre', 'nombre_generico', 'dosis', 'presentacion'] }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ mensaje: 'Prescripciones obtenidas ✅', prescripciones });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener prescripciones', error: error.message });
  }
};

// GET /prescripciones/:id
export const obtenerPrescripcionPorId = async (req, res) => {
  try {
    const { rol, id: usuarioId } = req.usuario;

    const prescripcion = await Prescription.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'paciente', attributes: ['id', 'nombre', 'email'] },
        { model: Usuario, as: 'medico', attributes: ['id', 'nombre', 'email'] },
        {
          model: InventoryMovement,
          where: { tipo: 'salida' },
          required: false,
          attributes: ['id', 'cantidad'],
          include: [
            { model: Medicamento, attributes: ['id', 'nombre', 'nombre_generico', 'dosis', 'presentacion'] }
          ]
        }
      ]
    });

    if (!prescripcion) {
      return res.status(404).json({ mensaje: 'Prescripción no encontrada', codigo: 'PRESCRIPCION_NO_ENCONTRADA' });
    }

    // Paciente solo puede ver la suya
    if (rol === 'paciente' && prescripcion.paciente_id !== usuarioId) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver esta prescripción', codigo: 'PERMISO_DENEGADO' });
    }

    res.json({ mensaje: 'Prescripción obtenida ✅', prescripcion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener prescripción', error: error.message });
  }
};

// POST /prescripciones
export const crearPrescripcion = async (req, res) => {
  try {
    const { id: medicoId } = req.usuario;
    const { paciente_id, fecha, observacion } = req.body;

    if (!paciente_id || !fecha) {
      return res.status(400).json({ mensaje: 'paciente_id y fecha son obligatorios', codigo: 'CAMPOS_REQUERIDOS' });
    }

    const paciente = await Usuario.findByPk(paciente_id);
    if (!paciente) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado', codigo: 'PACIENTE_NO_ENCONTRADO' });
    }

    const prescripcion = await Prescription.create({
      paciente_id,
      medico_id: medicoId,
      fecha,
      observacion
    });

    res.status(201).json({ mensaje: 'Prescripción creada ✅', prescripcion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear prescripción', error: error.message });
  }
};

// PUT /prescripciones/:id — nadie puede editar
export const actualizarPrescripcion = async (req, res) => {
  return res.status(403).json({
    mensaje: 'Las prescripciones no pueden ser modificadas una vez creadas',
    codigo: 'OPERACION_NO_PERMITIDA'
  });
};

// DELETE /prescripciones/:id — nadie puede eliminar
export const eliminarPrescripcion = async (req, res) => {
  return res.status(403).json({
    mensaje: 'Las prescripciones no pueden ser eliminadas',
    codigo: 'OPERACION_NO_PERMITIDA'
  });
};