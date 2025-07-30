# Security Guide

## Environment Variables & Secrets Management

### Development Setup
1. Copy `.env.example` files to `.env` in both `client/` and `server/` directories
2. Replace placeholder values with your actual keys
3. Never commit `.env` files to version control

### Production Deployment

#### Google Cloud Run (Recommended)
```bash
# Set environment variables in Cloud Run
gcloud run deploy tshirt-api \
  --set-env-vars="STRIPE_SECRET_KEY=sk_live_..." \
  --set-env-vars="FRONTEND_URL=https://yourdomain.com" \
  --set-env-vars="NODE_ENV=production"
```

#### Docker Secrets (Alternative)
```bash
# Create Docker secrets
echo "sk_live_your_key" | docker secret create stripe_secret_key -
echo "https://yourdomain.com" | docker secret create frontend_url -

# Use in docker-compose.prod.yml
services:
  server:
    secrets:
      - stripe_secret_key
      - frontend_url
```

#### Environment Variables Validation
The application validates required environment variables on startup:
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `FRONTEND_URL` - URL of your frontend application

Missing variables will cause the application to exit with an error message.

## Security Headers
The application implements security headers via Helmet.js:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- HSTS (in production)

## CORS Configuration
- Development: Allows localhost:3000 and 127.0.0.1:3000
- Production: Only allows the configured FRONTEND_URL

## API Security
- Input validation on all endpoints
- Rate limiting (recommended for production)
- Request size limits (10MB max)
- No sensitive data in error responses

## Deployment Checklist
- [ ] Environment variables set via secure method (not .env files)
- [ ] HTTPS enabled
- [ ] Database connections encrypted
- [ ] Regular security updates
- [ ] Monitoring and logging enabled
- [ ] Backup strategy implemented