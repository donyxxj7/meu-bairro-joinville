// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Configuração para desenvolvimento (usando .env)
const devConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

// Configuração para produção (usando a URL do Render)
const prodConfig = {
  connectionString: process.env.DATABASE_URL, // Render injeta esta variável
  ssl: {
    rejectUnauthorized: false
  }
};

// Usa a configuração de produção se a variável NODE_ENV for 'production'
// Senão, usa a configuração de desenvolvimento
const pool = new Pool(process.env.NODE_ENV === 'production' ? prodConfig : devConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
};