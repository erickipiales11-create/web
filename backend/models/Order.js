const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    pharmacy_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pharmacies',
            key: 'id',
        },
    },
    medicine_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'medicines',
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'ready', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    prescription_image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    requires_prescription: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    pickup_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'orders',
    timestamps: true,
});

module.exports = Order;