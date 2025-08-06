const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
require('dotenv').config({ path: envFile });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const ticketRoutes = require('./routes/tickets');
const authRoutes = require('./routes/auth');

const app = express();

// Swagger setup
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: { title: 'Helpdesk API', version: '1.0.0' },
        servers: [{ url: `/api` }],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
            },
            schemas: {
                Ticket: { /* your existing Ticket schema */ },
                Login: { /* your Login schema */ },
                LoginResponse: { /* your LoginResponse schema */ }
            }
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./routes/*.js']
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 429, message: 'Too many requests, please try again later.' }
}));

// JSON error handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ status: 400, message: err.message });
    }
    next(err);
});


// // MongoDB connection
// mongoose.connection
//     .on('connected', () => console.log('Mongoose: connected'))
//     .on('error', (err) => console.error('Mongoose error:', err))
//     .on('disconnected', () => console.log('Mongoose: disconnected'));

// mongoose.connect(process.env.MONGODB_URI).catch(() => { });

// Connect to MongoDB or Test
const uri = process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ Missing Mongo URI. NODE_ENV =', process.env.NODE_ENV);
    process.exit(1);
}

// Log which DB we're using
console.log(`🔌 Connecting to MongoDB (${process.env.NODE_ENV}) →`, uri);

mongoose.connection
    .on('connected', () => console.log('✅ Mongoose connected'))
    .on('error', err => console.error('⚠️ Mongoose error:', err))
    .on('disconnected', () => console.log('⚠️ Mongoose disconnected'));

mongoose.connect(uri, {
    // you can pass extra options here (e.g., serverSelectionTimeoutMS)
}).catch(err => console.error('Initial connection failed:', err));


// API routes
app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
