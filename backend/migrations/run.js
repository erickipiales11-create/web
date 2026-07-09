import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !line.startsWith('#')) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const { Client } = pg;

async function ejecutarMigraciones() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_HOST?.includes('railway') ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('📦 Conectado a la base de datos');

    await client.query(`
      CREATE TABLE IF NOT EXISTS migraciones (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL UNIQUE,
        ejecutado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const ejecutadas = await client.query('SELECT nombre FROM migraciones');
    const nombresEjecutados = ejecutadas.rows.map(row => row.nombre);

    const migracionesDir = __dirname;
    const archivos = fs.readdirSync(migracionesDir)
      .filter(f => f.endsWith('.sql') && f !== 'run.js')
      .sort();

    for (const archivo of archivos) {
      if (nombresEjecutados.includes(archivo)) {
        console.log(`⏭️ Saltando ${archivo} (ya ejecutado)`);
        continue;
      }
      console.log(`▶️ Ejecutando ${archivo}`);
      const sql = fs.readFileSync(path.join(migracionesDir, archivo), 'utf8');
      await client.query(sql);
      await client.query('INSERT INTO migraciones (nombre) VALUES ($1)', [archivo]);
      console.log(`✅ ${archivo} completado`);
    }

    console.log('🎉 Todas las migraciones ejecutadas correctamente');

    const resultado = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log('\n📋 Tablas creadas:');
    resultado.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

ejecutarMigraciones();
