import { DataTypes } from "sequelize";
import sequelize from "../config/databaser.js";

const User = sequelize.define("User", {
    id: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    name: DataTypes.STRING,
    allowNull: false,
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    tableName: "users",
}    
);

export default User;