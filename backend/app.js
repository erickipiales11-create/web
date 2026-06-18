import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/databaser.js';

// Importar rutas
import authRoutes from './routers/auth.routers.js';
import farmaciaRoutes from './routers/pharmacy.routers.js';
import medicamentoRoutes from './routers/medicine.routers.js';
import categoriasRoutes from './routers/categorias.routers.js';
import movimientosRoutes from './routers/Movimientos.routers.js';
import prescripcionesRoutes from './routers/Prescripciones.routers.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/farmacias', farmaciaRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/prescripciones', prescripcionesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '🏥 API del Sistema Clínico funcionando 🚀',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      farmacias: '/api/farmacias',
      medicamentos: '/api/medicamentos',
      categorias: '/api/categorias',
      movimientos: '/api/movimientos',
      prescripciones: '/api/prescripciones'
    }
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ 
    mensaje: 'Ruta no encontrada',
    error: 'ROUTE_NOT_FOUND'
  });
});

// Conectar DB
const sincronizarBaseDatos = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
};

sincronizarBaseDatos();

export default app;