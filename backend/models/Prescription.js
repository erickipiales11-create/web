import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Prescription = sequelize.define(
  "Prescription",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    paciente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    medico_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    observacion: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "prescriptions",
    timestamps: true,
  }
);

export default Prescription;