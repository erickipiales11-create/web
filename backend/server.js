import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('═'.repeat(50));
  console.log('🚀 Servidor corriendo en http://localhost:' + PORT);
  console.log('📋 Documentación: http://localhost:' + PORT + '/');
  console.log('═'.repeat(50));
});