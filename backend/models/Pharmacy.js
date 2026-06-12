import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Pharmacy = sequelize.define('Pharmacy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  pharmacy_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  pharmacy_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pharmacy_phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  pharmacy_license_number: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'pharmacies',
  timestamps: true
});

export default Pharmacy;