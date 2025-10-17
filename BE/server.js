require('dotenv').config(); // Loads .env by default
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Import routes
const schemesRoutes = require('./routes/schemes');
const geminiKeyRoute = require('./api-gemini-key');
const authRoutes = require('./routes/auth');
const Scheme = require('./models/Scheme');


const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'http://localhost:5001',
        'file://',
        'https://smartscheme.vercel.app'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Ensure OPTIONS (preflight) requests are handled and return proper CORS headers
app.options('*', cors(corsOptions));


// Optional: In production you may want to control allowed origins via an env var
// const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:5500,file://,https://smartscheme.vercel.app').split(',');
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('CORS not allowed for origin ' + origin));
//         }
//     },
//     credentials: true,
//     optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api/', limiter);

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
const connectDB = async (retries = 5, delayMs = 5000) => {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not set. Please set the environment variable.');
        // If running in Render, we want to fail fast so user can see the config mistake.
        process.exit(1);
    }

    try {
        // Add explicit timeouts so failed server selection surfaces more clearly
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Wait up to 30s to find a suitable server before timing out
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`MongoDB connection error (attempts left: ${retries}):`, error && error.stack ? error.stack : error);
        if (retries > 0) {
            console.log(`Retrying MongoDB connection in ${delayMs / 1000}s...`);
            await new Promise(res => setTimeout(res, delayMs));
            return connectDB(retries - 1, Math.min(delayMs * 2, 60000));
        } else {
            console.error('Failed to connect to MongoDB after multiple attempts. Exiting.');
            process.exit(1);
        }
    }
};

// Connect to MongoDB
connectDB();

// Mongoose connection event listeners for clearer runtime logs
mongoose.connection.on('connected', () => {
    console.log('Mongoose event: connected');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose event: error', err && err.message ? err.message : err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('Mongoose event: disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('Mongoose event: reconnected');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

    // Debug endpoint (safe: does not return secrets)
    app.get('/api/debug', async (req, res) => {
        try {
            const mongooseState = mongoose.connection.readyState; // 0 = disconnected, 1 = connected
            const hasMongoUri = !!process.env.MONGODB_URI;
            const nodeEnv = process.env.NODE_ENV || 'undefined';

            let schemesCount = null;
            try {
                schemesCount = await Scheme.countDocuments();
            } catch (err) {
                schemesCount = `error: ${err && err.message ? err.message : String(err)}`;
            }

            return res.status(200).json({
                success: true,
                mongooseState,
                hasMongoUri,
                nodeEnv,
                schemesCount
            });
        } catch (err) {
            console.error('/api/debug error:', err);
            return res.status(500).json({ success: false, message: 'Debug check failed' });
        }
    });

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Smart Scheme API Documentation'
}));

// API Routes
app.use('/api/v2/schemes', schemesRoutes);
app.use(geminiKeyRoute);
app.use('/api/v2/auth', authRoutes);


// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // If request origin is allowed, echo it back on error responses so browser accepts them
    try {
        const allowedOrigins = corsOptions.origin || [];
        const requestOrigin = req.headers.origin;
        if (requestOrigin && allowedOrigins.indexOf(requestOrigin) !== -1) {
            res.setHeader('Access-Control-Allow-Origin', requestOrigin);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        }
    } catch (hdrErr) {
        console.error('Error setting CORS headers on error response:', hdrErr);
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});

// No changes needed. This is your main backend file.
// Make sure your `/api/get-gemini-key` route is defined in `api-gemini-key.js` and imported/used here.