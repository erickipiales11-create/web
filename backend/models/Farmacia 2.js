import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Usuario from './Usuario.js';

const Farmacia = sequelize.define('Farmacia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  nombre_farmacia: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  sitio_web: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  numero_licencia: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  horario: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  latitud: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitud: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'farmacias',
  timestamps: true
});

Farmacia.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasOne(Farmacia, { foreignKey: 'usuario_id' });

export default Farmacia;