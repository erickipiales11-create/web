import { sequelize } from '../config/database.js';
import Usuario from './Usuario.js';
import Farmacia from './Farmacia.js';
import Medicamento from './Medicamento.js';
import Category from './Category.js';
import InventoryMovement from './InventoryMovement.js';
import Prescription from './Prescription.js';

// Asociaciones simples
Usuario.hasMany(Farmacia, { foreignKey: 'usuario_id' });
Farmacia.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Farmacia.hasMany(Medicamento, { foreignKey: 'farmacia_id' });
Medicamento.belongsTo(Farmacia, { foreignKey: 'farmacia_id' });

export {
  sequelize,
  Usuario,
  Farmacia,
  Medicamento,
  Category,
  InventoryMovement,
  Prescription
};
