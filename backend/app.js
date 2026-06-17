import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';

// Importar rutas
import authRoutes from './routers/auth.routers.js';
import farmaciaRoutes from './routers/farmacia.routers.js';
import medicamentoRoutes from './routers/medicamento.routers.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// RUTAS
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/farmacias', farmaciaRoutes);
app.use('/api/medicamentos', medicamentoRoutes);

// ============================================
// RUTA DE PRUEBA
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '🏥 API del Sistema Clínico funcionando 🚀',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      farmacias: '/api/farmacias',
      medicamentos: '/api/medicamentos'
    }
  });
});

// ============================================
// MANEJO DE ERRORES 404
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    mensaje: 'Ruta no encontrada',
    error: 'ROUTE_NOT_FOUND'
  });
});

// ============================================
// SINCRONIZAR MODELOS
// ============================================
const sincronizarBaseDatos = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    // Sincronizar modelos (sin forzar)
    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
};

sincronizarBaseDatos();

export default app;