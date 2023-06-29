const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';




require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.PGDATABASE_URL) {
  throw new Error('PGDATABASE or URL not set');
}

config = {}

if (ENV === 'production'){
  console.log('production')
  config.connectionString = process.env.PGDATABASE_URL
  config.max = 2
}

module.exports = new Pool(config);
