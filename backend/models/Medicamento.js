import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Farmacia from './Farmacia.js';

const Medicamento = sequelize.define('Medicamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  farmacia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'farmacias',
      key: 'id'
    }
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  nombre_generico: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  marca: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  unidad: {
    type: DataTypes.STRING(50),
    defaultValue: 'unidades'
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  precio_compra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  numero_lote: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fecha_caducidad: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_fabricacion: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  subcategoria: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  principio_activo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dosis: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  presentacion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  requiere_receta: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  stock_maximo: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  condiciones_almacenamiento: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  codigo_barras: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  url_imagen: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'medicamentos',
  timestamps: true
});

Medicamento.belongsTo(Farmacia, { foreignKey: 'farmacia_id' });
Farmacia.hasMany(Medicamento, { foreignKey: 'farmacia_id' });

export default Medicamento;