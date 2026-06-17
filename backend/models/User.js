import { DataTypes } from 'sequelize';
import sequelize from '../config/databaser.js';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es obligatorio' }
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      msg: 'El email ya está registrado'
    },
    validate: {
      isEmail: { msg: 'Email inválido' },
      notEmpty: { msg: 'El email es obligatorio' }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La contraseña es obligatoria' },
      len: {
        args: [6, 255],
        msg: 'La contraseña debe tener al menos 6 caracteres'
      }
    }
  },
  rol: {
  type: DataTypes.ENUM('usuario', 'farmacia', 'administrador', 'medico'),
  defaultValue: 'usuario'
},
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ultimo_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

export default Usuario;