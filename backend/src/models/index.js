const { sequelize } = require('../config/database');
const User = require('./User');
const Pharmacy = require('./Pharmacy');
const Medicine = require('./Medicine');
const Category = require('./Category');
const Order = require('./Order');

// Definir relaciones
User.belongsTo(Pharmacy, { foreignKey: 'pharmacy_id', as: 'pharmacy' });
Pharmacy.hasMany(User, { foreignKey: 'pharmacy_id', as: 'workers' });

Medicine.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Medicine.belongsTo(Pharmacy, { foreignKey: 'pharmacy_id', as: 'pharmacy' });
Category.hasMany(Medicine, { foreignKey: 'category_id', as: 'medicines' });

Order.belongsTo(User, { foreignKey: 'patient_id', as: 'patient' });
Order.belongsTo(Pharmacy, { foreignKey: 'pharmacy_id', as: 'pharmacy' });
Order.belongsTo(Medicine, { foreignKey: 'medicine_id', as: 'medicine' });

module.exports = {
    sequelize,
    User,
    Pharmacy,
    Medicine,
    Category,
    Order,
};