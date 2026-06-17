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
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre de la farmacia es obligatorio' }
    }
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La dirección es obligatoria' }
    }
  },
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La ciudad es obligatoria' }
    }
  },
  estado: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El estado es obligatorio' }
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El teléfono es obligatorio' }
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: { msg: 'Email inválido' }
    }
  },
  sitio_web: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  numero_licencia: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'El número de licencia ya está registrado'
    },
    validate: {
      notEmpty: { msg: 'El número de licencia es obligatorio' }
    }
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

// Relaciones
Farmacia.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasOne(Farmacia, { foreignKey: 'usuario_id' });

export default Farmacia;