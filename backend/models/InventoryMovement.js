import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const InventoryMovement = sequelize.define(
  'InventoryMovement',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    medicine_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    prescription_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipo: {
      type: DataTypes.ENUM('entrada', 'salida'),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    observacion: {
      type: DataTypes.TEXT
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'inventory_movements',
    timestamps: true
  }
);

export default InventoryMovement;