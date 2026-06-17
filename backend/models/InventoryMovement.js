import { DataTypes } from "sequelize";
import sequelize from "../config/databaser.js";

const InventoryMovement = sequelize.define(
  "InventoryMovement",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    medicine_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    tipo: {
      type: DataTypes.ENUM("entrada", "salida"),
      allowNull: false,
    },

    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    observacion: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "inventory_movements",
    timestamps: true,
  }
);

export default InventoryMovement;