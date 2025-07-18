require('dotenv').config();
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
const PORT = parseInt(process.env.PORT) || 3000;

// Swagger/OpenAPI setup with Bearer authentication
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Helpdesk API',
            version: '1.0.0',
        },
        servers: [
            { url: `http://localhost:${PORT}/api`, description: 'Local API server' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Ticket: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        status: {
                            type: 'string',
                            enum: ['open', 'in progress', 'closed']
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        createdBy: { type: 'string' },
                        assignedTo: { type: 'string' }
                    }
                },
                Login: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 6 }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' }
                    }
                }
            }
        },
        security: [
            { bearerAuth: [] }
        ]
    },
    apis: ['./routes/*.js']
});


// Serve the Swagger UI at /api-docs
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true })
);

// Basic security headers
app.use(helmet());

// CORS configuration
app.use(cors());
app.use(express.json());

//Rate limiting: 100 requests per IP per 15 minutes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        message: 'Too many requests, please try again later.'
    }
});
app.use('/api/', apiLimiter);

// Catch invalid JSON body errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ status: 400, message: err.message });
    }
    next(err);
});


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

// Fallback for unmatched routes
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
