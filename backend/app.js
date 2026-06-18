import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';

import authRoutes from './routers/auth.routers.js';
import farmaciaRoutes from './routers/farmacia.routers.js';
import medicamentoRoutes from './routers/meciamento.routers.js';
import categoriasRoutes from './routers/categorias.routers.js';
import movimientosRoutes from './routers/Movimientos.routers.js';
import prescripcionesRoutes from './routers/Prescripciones.routers.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/farmacias', farmaciaRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/prescripciones', prescripcionesRoutes);

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

export default app;