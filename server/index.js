require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ticketRoutes = require('./routes/tickets');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Debug logging
mongoose.connection
    .on('connected', () => console.log('Mongoose: connected'))
    .on('error', (err) => console.error('Mongoose error:', err))
    .on('disconnected', () => console.log('Mongoose: disconnected'));

mongoose
    .connect(process.env.MONGODB_URI)
    .catch(() => { }); // connection events will log

app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);

const PORT = parseInt(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
