const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pharmacy = sequelize.define('Pharmacy', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(300),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'pharmacies',
    timestamps: true,
});

module.exports = Pharmacy;