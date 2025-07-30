import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function validateEnvironment() {
    const required = ['STRIPE_SECRET_KEY', 'FRONTEND_URL'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(', ')}`);
        console.error('Please copy .env.example to .env and fill in the values');
        process.exit(1);
    }
}

async function startServer() {
    validateEnvironment();
    
    const app = express();
    const port = process.env.PORT || 8080;
    const isProduction = process.env.NODE_ENV === 'production';

    const checkoutRouter = (await import('./routes/checkout.js')).default;

    // Security middleware
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'", "https://js.stripe.com"],
                connectSrc: ["'self'", "https://api.stripe.com"],
                frameSrc: ["https://js.stripe.com"],
                imgSrc: ["'self'", "data:", "https://js.stripe.com", "https://*.stripe.com"]
            }
        },
        crossOriginEmbedderPolicy: false
    }));

    // CORS configuration
    const corsOptions = {
        origin: isProduction 
            ? [process.env.FRONTEND_URL] 
            : ['http://localhost:3000'],
        credentials: true,
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));

    // Rate limiting configuration
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: {
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: '15 minutes'
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        handler: (req, res) => {
            console.log(`${new Date().toISOString()} [${req.correlationId || 'unknown'}] Rate limit exceeded for IP: ${req.ip}`);
            res.status(429).json({
                error: 'Too many requests from this IP, please try again later.',
                retryAfter: '15 minutes'
            });
        }
    });

    // Stricter rate limiting for checkout endpoint
    const checkoutLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // Limit each IP to 5 checkout requests per 15 minutes
        message: {
            error: 'Too many checkout attempts, please try again later.',
            retryAfter: '15 minutes'
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            console.log(`${new Date().toISOString()} [${req.correlationId || 'unknown'}] Checkout rate limit exceeded for IP: ${req.ip}`);
            res.status(429).json({
                error: 'Too many checkout attempts, please try again later.',
                retryAfter: '15 minutes'
            });
        }
    });

    app.use(limiter);
    
    // Request correlation middleware for logging
    app.use((req, res, next) => {
        req.correlationId = randomUUID();
        res.setHeader('X-Correlation-ID', req.correlationId);
        console.log(`${new Date().toISOString()} [${req.correlationId}] ${req.method} ${req.path}`);
        next();
    });
    
    app.use(express.json({ limit: '10mb' }));

    // Serve the static files from the React app
    app.use(express.static(join(__dirname, 'public')));

    app.use('/api/checkout', checkoutLimiter, checkoutRouter);

    // Handles any requests that don't match the ones above
    app.get('*', (req,res) =>{
        res.sendFile(join(__dirname, 'public', 'index.html'));
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
}

startServer();
