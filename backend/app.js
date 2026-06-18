import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';

import authRoutes from './routers/auth.routers.js';
import farmaciaRoutes from './routers/farmacia.routers.js';
import medicamentoRoutes from './routers/medicamento.routers.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/farmacias', farmaciaRoutes);
app.use('/api/medicamentos', medicamentoRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: '🏥 API del Sistema Clínico funcionando 🚀' });
});

const sincronizarBaseDatos = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados');
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

sincronizarBaseDatos();

export default app;S