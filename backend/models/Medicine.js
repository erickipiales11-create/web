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
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del medicamento es obligatorio' }
    }
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
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'La cantidad no puede ser negativa'
      }
    }
  },
  unidad: {
    type: DataTypes.STRING(50),
    defaultValue: 'unidades'
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'El precio no puede ser negativo'
      },
      notEmpty: { msg: 'El precio es obligatorio' }
    }
  },
  precio_compra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'El precio de compra no puede ser negativo'
      }
    }
  },
  numero_lote: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El número de lote es obligatorio' }
    }
  },
  fecha_caducidad: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: 'Fecha inválida' },
      notEmpty: { msg: 'La fecha de caducidad es obligatoria' }
    }
  },
  fecha_fabricacion: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: { msg: 'Fecha inválida' }
    }
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
    unique: {
      msg: 'El código de barras ya está registrado'
    }
  },
  url_imagen: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'medicamentos',
  timestamps: true
});

// Relaciones
Medicamento.belongsTo(Farmacia, { foreignKey: 'farmacia_id' });
Farmacia.hasMany(Medicamento, { foreignKey: 'farmacia_id' });

export default Medicamento;