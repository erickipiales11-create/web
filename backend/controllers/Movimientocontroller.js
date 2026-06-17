import InventoryMovement from '../models/InventoryMovement.js';
import Medicine from '../models/Medicine.js';
import Prescription from '../models/Prescription.js';

// GET /movimientos
export const obtenerMovimientos = async (req, res) => {
  try {
    const { rol, id: usuarioId } = req.usuario;

    let whereClause = {};

    if (rol === 'farmacia') {
      // Obtener solo medicamentos de esta farmacia
      const medicamentosDeLaFarmacia = await Medicine.findAll({
        where: { usuario_id: usuarioId, activo: true },
        attributes: ['id']
      });
      const ids = medicamentosDeLaFarmacia.map(m => m.id);
      whereClause.medicine_id = ids;
    }

    const movimientos = await InventoryMovement.findAll({
      where: whereClause,
      include: [
        { model: Medicine, attributes: ['id', 'nombre'] },
        { model: Prescription, attributes: ['id', 'fecha', 'paciente_id'], required: false }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ mensaje: 'Movimientos obtenidos ✅', movimientos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener movimientos', error: error.message });
  }
};

// GET /movimientos/:id
export const obtenerMovimientoPorId = async (req, res) => {
  try {
    const { rol, id: usuarioId } = req.usuario;

    const movimiento = await InventoryMovement.findByPk(req.params.id, {
      include: [
        { model: Medicine, attributes: ['id', 'nombre', 'usuario_id'] },
        { model: Prescription, attributes: ['id', 'fecha', 'paciente_id'], required: false }
      ]
    });

    if (!movimiento) {
      return res.status(404).json({ mensaje: 'Movimiento no encontrado', codigo: 'MOVIMIENTO_NO_ENCONTRADO' });
    }

    // Farmacia solo puede ver movimientos de sus propios medicamentos
    if (rol === 'farmacia' && movimiento.Medicine.usuario_id !== usuarioId) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este movimiento', codigo: 'PERMISO_DENEGADO' });
    }

    res.json({ mensaje: 'Movimiento obtenido ✅', movimiento });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener movimiento', error: error.message });
  }
};

// POST /movimientos
export const crearMovimiento = async (req, res) => {
  try {
    const { id: usuarioId, rol } = req.usuario;
    const { medicine_id, tipo, cantidad, prescription_id, observacion } = req.body;

    if (!medicine_id || !tipo || !cantidad) {
      return res.status(400).json({ mensaje: 'medicine_id, tipo y cantidad son obligatorios', codigo: 'CAMPOS_REQUERIDOS' });
    }

    if (!['entrada', 'salida'].includes(tipo)) {
      return res.status(400).json({ mensaje: 'El tipo debe ser "entrada" o "salida"', codigo: 'TIPO_INVALIDO' });
    }

    if (cantidad <= 0) {
      return res.status(400).json({ mensaje: 'La cantidad debe ser mayor a 0', codigo: 'CANTIDAD_INVALIDA' });
    }

    const medicamento = await Medicine.findOne({ where: { id: medicine_id, activo: true } });
    if (!medicamento) {
      return res.status(404).json({ mensaje: 'Medicamento no encontrado', codigo: 'MEDICAMENTO_NO_ENCONTRADO' });
    }

    // Farmacia solo puede registrar movimientos de sus propios medicamentos
    if (rol === 'farmacia' && medicamento.usuario_id !== usuarioId) {
      return res.status(403).json({ mensaje: 'No puedes registrar movimientos de medicamentos que no son tuyos', codigo: 'PERMISO_DENEGADO' });
    }

    if (tipo === 'salida') {
      if (!prescription_id) {
        return res.status(400).json({ mensaje: 'Una salida debe estar vinculada a una prescripción', codigo: 'PRESCRIPCION_REQUERIDA' });
      }

      const prescripcion = await Prescription.findByPk(prescription_id);
      if (!prescripcion) {
        return res.status(404).json({ mensaje: 'Prescripción no encontrada', codigo: 'PRESCRIPCION_NO_ENCONTRADA' });
      }

      if (medicamento.stock < cantidad) {
        return res.status(400).json({ mensaje: 'Stock insuficiente para registrar la salida', codigo: 'STOCK_INSUFICIENTE' });
      }

      await medicamento.update({ stock: medicamento.stock - cantidad });
    }

    if (tipo === 'entrada') {
      await medicamento.update({ stock: medicamento.stock + cantidad });
    }

    const movimiento = await InventoryMovement.create({
      medicine_id,
      prescription_id: prescription_id || null,
      tipo,
      cantidad,
      observacion,
      activo: true
    });

    res.status(201).json({ mensaje: 'Movimiento registrado ✅', movimiento });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar movimiento', error: error.message });
  }
};

// PUT /movimientos/:id
export const actualizarMovimiento = async (req, res) => {
  try {
    const { rol, id: usuarioId } = req.usuario;

    const movimiento = await InventoryMovement.findByPk(req.params.id, {
      include: [{ model: Medicine, attributes: ['id', 'usuario_id'] }]
    });

    if (!movimiento) {
      return res.status(404).json({ mensaje: 'Movimiento no encontrado', codigo: 'MOVIMIENTO_NO_ENCONTRADO' });
    }

    if (!movimiento.activo) {
      return res.status(400).json({ mensaje: 'No se puede editar un movimiento anulado', codigo: 'MOVIMIENTO_ANULADO' });
    }

    if (rol === 'farmacia' && movimiento.Medicine.usuario_id !== usuarioId) {
      return res.status(403).json({ mensaje: 'No puedes editar movimientos de medicamentos que no son tuyos', codigo: 'PERMISO_DENEGADO' });
    }

    const CAMPOS_PERMITIDOS = ['observacion'];
    const actualizacion = {};
    CAMPOS_PERMITIDOS.forEach(campo => {
      if (req.body[campo] !== undefined) actualizacion[campo] = req.body[campo];
    });

    if (Object.keys(actualizacion).length === 0) {
      return res.status(400).json({ mensaje: 'No se enviaron campos válidos para actualizar', codigo: 'CAMPOS_VACIOS' });
    }

    await movimiento.update(actualizacion);
    res.json({ mensaje: 'Movimiento actualizado ✅', movimiento });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar movimiento', error: error.message });
  }
};

// DELETE /movimientos/:id — anula sin revertir stock
export const anularMovimiento = async (req, res) => {
  try {
    const { rol, id: usuarioId } = req.usuario;

    const movimiento = await InventoryMovement.findByPk(req.params.id, {
      include: [{ model: Medicine, attributes: ['id', 'usuario_id'] }]
    });

    if (!movimiento) {
      return res.status(404).json({ mensaje: 'Movimiento no encontrado', codigo: 'MOVIMIENTO_NO_ENCONTRADO' });
    }

    if (!movimiento.activo) {
      return res.status(400).json({ mensaje: 'El movimiento ya está anulado', codigo: 'MOVIMIENTO_YA_ANULADO' });
    }

    if (rol === 'farmacia' && movimiento.Medicine.usuario_id !== usuarioId) {
      return res.status(403).json({ mensaje: 'No puedes anular movimientos de medicamentos que no son tuyos', codigo: 'PERMISO_DENEGADO' });
    }

    await movimiento.update({ activo: false });
    res.json({ mensaje: 'Movimiento anulado ✅ (el stock no fue revertido)', movimiento });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al anular movimiento', error: error.message });
  }
};