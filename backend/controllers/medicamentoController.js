import Medicamento from '../models/Medicamento.js';
import { Op } from 'sequelize';

export const getMedicamentos = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll();
    res.json({ medicamentos });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const buscarMedicamentos = async (req, res) => {
  try {
    const { query } = req.query;
    const medicamentos = await Medicamento.findAll({
      where: {
        nombre: { [Op.iLike]: `%${query}%` }
      }
    });
    res.json({ medicamentos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMedicamento = async (req, res) => {
  try {
    const medicamento = await Medicamento.findByPk(req.params.id);
    if (!medicamento) {
      return res.status(404).json({ mensaje: 'No encontrado' });
    }
    res.json(medicamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMedicamento = async (req, res) => {
  try {
    const medicamento = await Medicamento.create({
      farmacia_id: req.body.farmacia_id || 1,
      nombre: req.body.nombre || 'Sin nombre',
      cantidad: parseInt(req.body.cantidad) || 0,
      precio: parseFloat(req.body.precio) || 0,
      categoria: req.body.categoria || 'General',
      numero_lote: req.body.numero_lote || 'LOTE-' + Date.now(),
      fecha_caducidad: req.body.fecha_caducidad || '2026-12-31'
    });
    res.status(201).json(medicamento);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateMedicamento = async (req, res) => {
  try {
    const medicamento = await Medicamento.findByPk(req.params.id);
    if (!medicamento) {
      return res.status(404).json({ mensaje: 'No encontrado' });
    }
    await medicamento.update(req.body);
    res.json(medicamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMedicamento = async (req, res) => {
  try {
    const medicamento = await Medicamento.findByPk(req.params.id);
    if (!medicamento) {
      return res.status(404).json({ mensaje: 'No encontrado' });
    }
    await medicamento.destroy();
    res.json({ mensaje: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
