const app = require('./app');

if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
  console.error('Missing JWT_SECRET or DATABASE_URL. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const { sequelize } = require('./models');
const PORT = process.env.PORT || 5000;

sequelize
  .sync() // creates tables in PostgreSQL if they do not exist
  .then(() => {
    console.log('PostgreSQL connected, tables ready');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
