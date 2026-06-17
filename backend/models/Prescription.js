import { DataTypes } from "sequelize";
import sequelize from "../config/databaser.js";

const Prescription = sequelize.define(
  "Prescription",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    paciente: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    medico: {
      type: DataTypes.STRING,
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