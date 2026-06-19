import { Sequelize } from "sequelize";
import dotenv from "dotenv"

detenv.config();

const sequelize =new Sequelize(
    process.env.DN_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false
    }
)
export default sequelize;