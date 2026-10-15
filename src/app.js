require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const auth = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', auth, require('./routes/patients'));
app.use('/api/doctors', auth, require('./routes/doctors'));
app.use('/api/mappings', auth, require('./routes/mappings'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
