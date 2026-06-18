import { sequelize } from "../config/database.js";
import Usuario from "./Usuario.js";
import Category from "./Category.js";
import Farmacia from "./Farmacia.js";
import Medicamento from "./Medicamento.js";
import InventoryMovement from "./InventoryMovement.js";
import Prescription from "./Prescription.js";

// Usuario - Farmacia
Usuario.hasOne(Farmacia, { foreignKey: 'usuario_id' });
Farmacia.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Farmacia - Medicamento
Farmacia.hasMany(Medicamento, { foreignKey: 'farmacia_id' });
Medicamento.belongsTo(Farmacia, { foreignKey: 'farmacia_id' });

// Category - Medicamento
Category.hasMany(Medicamento, { foreignKey: 'category_id' });
Medicamento.belongsTo(Category, { foreignKey: 'category_id' });

// Medicamento - InventoryMovement
Medicamento.hasMany(InventoryMovement, { foreignKey: 'medicine_id' });
InventoryMovement.belongsTo(Medicamento, { foreignKey: 'medicine_id' });

// Prescription - InventoryMovement
Prescription.hasMany(InventoryMovement, { foreignKey: 'prescription_id' });
InventoryMovement.belongsTo(Prescription, { foreignKey: 'prescription_id' });

// Usuario - Prescription (como paciente y como médico)
Usuario.hasMany(Prescription, { as: 'recetasComoPaciente', foreignKey: 'paciente_id' });
Prescription.belongsTo(Usuario, { as: 'paciente', foreignKey: 'paciente_id' });

Usuario.hasMany(Prescription, { as: 'recetasComoMedico', foreignKey: 'medico_id' });
Prescription.belongsTo(Usuario, { as: 'medico', foreignKey: 'medico_id' });

export { sequelize, Usuario, Category, Farmacia, Medicamento, InventoryMovement, Prescription };