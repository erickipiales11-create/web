const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Medicine = sequelize.define('Medicine', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id',
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    requires_prescription: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    gramaje: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    tipo: {
        type: DataTypes.ENUM('tableta', 'capsula', 'liquido', 'crema', 'inyectable', 'polvo'),
        allowNull: true,
    },
    pharmacy_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'pharmacies',
            key: 'id',
        },
    },
    expiration_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    active_ingredient: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    laboratory: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'medicines',
    timestamps: true,
});

module.exports = Medicine;