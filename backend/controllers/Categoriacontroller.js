import Category from '../models/Category.js';

// GET /categorias
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Category.findAll({ where: { activo: true } });
    res.json({ mensaje: 'Categorías obtenidas ✅', categorias });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener categorías', error: error.message });
  }
};

// GET /categorias/:id
export const obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Category.findOne({ where: { id: req.params.id, activo: true } });
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada', codigo: 'CATEGORIA_NO_ENCONTRADA' });
    }
    res.json({ mensaje: 'Categoría obtenida ✅', categoria });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener categoría', error: error.message });
  }
};

// POST /categorias
export const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ mensaje: 'El nombre es obligatorio', codigo: 'NOMBRE_REQUERIDO' });
    }

    const existe = await Category.findOne({ where: { nombre, activo: true } });
    if (existe) {
      return res.status(409).json({ mensaje: 'Ya existe una categoría con ese nombre', codigo: 'CATEGORIA_DUPLICADA' });
    }

    const categoria = await Category.create({ nombre, descripcion });
    res.status(201).json({ mensaje: 'Categoría creada ✅', categoria });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear categoría', error: error.message });
  }
};

// PUT /categorias/:id
export const actualizarCategoria = async (req, res) => {
  try {
    const categoria = await Category.findOne({ where: { id: req.params.id, activo: true } });
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada', codigo: 'CATEGORIA_NO_ENCONTRADA' });
    }

    const CAMPOS_PERMITIDOS = ['nombre', 'descripcion'];
    const actualizacion = {};
    CAMPOS_PERMITIDOS.forEach(campo => {
      if (req.body[campo] !== undefined) actualizacion[campo] = req.body[campo];
    });

    if (Object.keys(actualizacion).length === 0) {
      return res.status(400).json({ mensaje: 'No se enviaron campos válidos para actualizar', codigo: 'CAMPOS_VACIOS' });
    }

    await categoria.update(actualizacion);
    res.json({ mensaje: 'Categoría actualizada ✅', categoria });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar categoría', error: error.message });
  }
};

// DELETE /categorias/:id
export const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Category.findOne({ where: { id: req.params.id, activo: true } });
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada', codigo: 'CATEGORIA_NO_ENCONTRADA' });
    }

    await categoria.update({ activo: false });
    res.json({ mensaje: 'Categoría eliminada ✅', categoria });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar categoría', error: error.message });
  }
};