import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { config, validateConfig } from '@/utils/config';
import { log } from '@/utils/logger';
import { initializeFirebase } from '@/services/firebase';
import { errorHandler, notFoundHandler } from '@/middleware/error';
import { userRateLimitMiddleware } from '@/middleware/auth';

// Import routes
import authRoutes from '@/routes/auth';
import portfolioRoutes from '@/routes/portfolio';

// Validate configuration
try {
  validateConfig();
} catch (error) {
  log.error('Configuration validation failed', { error });
  process.exit(1);
}

// Initialize Firebase
try {
  initializeFirebase();
} catch (error) {
  log.error('Firebase initialization failed', { error });
  process.exit(1);
}

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.maxRequests,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (config.logging.enableRequestLogging) {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => {
        log.info(message.trim(), { category: 'request' });
      },
    },
  }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: config.server.nodeEnv,
    },
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'QuantAI Backend API',
      version: '1.0.0',
      description: 'Backend API for MetaMask and Smart Contract Integration',
      endpoints: {
        auth: '/api/auth',
        portfolio: '/api/portfolio',
        health: '/health',
      },
      chainId: config.blockchain.chainId,
      contractAddress: config.contracts.portfolioManager,
    },
  });
});

// User rate limiting middleware
app.use(userRateLimitMiddleware);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.server.port;

app.listen(PORT, () => {
  log.info('QuantAI Backend API started', {
    port: PORT,
    environment: config.server.nodeEnv,
    chainId: config.blockchain.chainId,
    contractAddress: config.contracts.portfolioManager,
  });

  console.log(`
🚀 QuantAI Backend API is running!

📍 Server: http://localhost:${PORT}
🔗 API Info: http://localhost:${PORT}/api
❤️  Health: http://localhost:${PORT}/health

🔧 Environment: ${config.server.nodeEnv}
⛓️  Chain ID: ${config.blockchain.chainId}
📝 Contract: ${config.contracts.portfolioManager}

📖 API Endpoints:
   POST /api/auth/generate-message
   POST /api/auth/authenticate
   GET  /api/auth/me
   POST /api/auth/logout
   GET  /api/auth/verify

   GET  /api/portfolio/balances/:address
   GET  /api/portfolio/balance/:address/:token
   POST /api/portfolio/deposit/tokens (admin)
   POST /api/portfolio/deposit/eth (admin)
   POST /api/portfolio/withdraw/tokens (admin)
   POST /api/portfolio/withdraw/eth (admin)
   POST /api/portfolio/transfer (admin)
   GET  /api/portfolio/tokens/supported
   POST /api/portfolio/tokens/add (admin)
   GET  /api/portfolio/transaction/:hash
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  log.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;