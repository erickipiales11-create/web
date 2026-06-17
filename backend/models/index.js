import sequelize from "../config/databaser.js";
import User from "./User.js";
import Category from "./Category.js";
import Farmacia from "./Pharmacy.js";
import Medicamento from "./Medicine.js";
import InventoryMovement from "./InventoryMovement.js";
import Prescription from "./Prescription.js";

// Usuario - Farmacia
User.hasOne(Farmacia, { foreignKey: 'usuario_id' });
Farmacia.belongsTo(User, { foreignKey: 'usuario_id' });

// Farmacia - Medicamento
Farmacia.hasMany(Medicamento, { foreignKey: 'farmacia_id' });
Medicamento.belongsTo(Farmacia, { foreignKey: 'farmacia_id' });

// Category - Medicamento
Category.hasMany(Medicamento, { foreignKey: 'category_id' });
Medicamento.belongsTo(Category, { foreignKey: 'category_id' });

// Medicamento - InventoryMovement
Medicamento.hasMany(InventoryMovement, { foreignKey: 'medicine_id' });
InventoryMovement.belongsTo(Medicamento, { foreignKey: 'medicine_id' });

// Usuario - Prescription (como paciente y como médico)
User.hasMany(Prescription, { as: 'recetasComoPaciente', foreignKey: 'paciente_id' });
Prescription.belongsTo(User, { as: 'paciente', foreignKey: 'paciente_id' });

User.hasMany(Prescription, { as: 'recetasComoMedico', foreignKey: 'medico_id' });
Prescription.belongsTo(User, { as: 'medico', foreignKey: 'medico_id' });

export { sequelize, User, Category, Farmacia, Medicamento, InventoryMovement, Prescription };