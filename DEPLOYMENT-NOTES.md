# Deployment Notes

## 🚨 Critical Pre-Deployment Tasks

### 1. Replace Stripe Placeholder Price IDs
**Location**: `client/src/pages/checkout.tsx:333`

**Current Issue**:
```javascript
skuId: 'price_example'  // ❌ This will fail in production
```

**Required Fix**:
```javascript
skuId: 'price_1234567890abcdef'  // ✅ Use real Stripe price ID
```

**Steps to Fix**:
1. Login to Stripe Dashboard
2. Go to Products → Create products for each t-shirt design
3. Create prices for each product variant (size, color, etc.)
4. Copy the price IDs (format: `price_xxxxxxxxxxxxx`)
5. Replace `price_example` in the code with actual price IDs

### 2. Environment Variables Status
- ✅ **Server**: Production Stripe secret key configured
- ✅ **Client**: Production Stripe publishable key configured
- ⚠️ **URLs**: Currently set to localhost - update for production

## 🌐 Alternative Deployment Options

### Option 1: Cloudflare Pages (Frontend Only)
**Best for**: Quick demo deployment, static frontend hosting
**Limitations**: Backend API needs separate hosting

**Steps**:
1. Build Next.js as static export
2. Deploy to Cloudflare Pages
3. Deploy backend separately (Railway, Render, etc.)

### Option 2: Railway (Full-Stack)
**Best for**: Simple full-stack deployment with database
**Cost**: ~$5-20/month

**Steps**:
1. Connect GitHub repository
2. Deploy both services
3. Add environment variables
4. Auto-deploys on git push

### Option 3: Render (Full-Stack)
**Best for**: Easy deployment with built-in database
**Cost**: Free tier available, then ~$7-25/month

### Option 4: Vercel + Railway/Render
**Best for**: Optimized frontend + reliable backend
**Frontend**: Vercel (free tier)
**Backend**: Railway/Render (~$5-15/month)

## 🚀 Quick Demo Deployment (Recommended)

### Railway Deployment (Easiest)
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy from project root
railway project create
railway up

# 4. Add environment variables in Railway dashboard
# - STRIPE_SECRET_KEY
# - STRIPE_PUBLISHABLE_KEY
# - Frontend/backend URLs
```

### Render Deployment
1. Go to render.com
2. Connect GitHub repository
3. Create Web Service from `server/` directory
4. Create Static Site from `client/` directory
5. Configure environment variables

## 📋 Deployment Checklist

### Before Any Deployment:
- [ ] Replace `price_example` with real Stripe price IDs
- [ ] Test checkout flow locally with real Stripe keys
- [ ] Update FRONTEND_URL and API_URL for production
- [ ] Verify all environment variables are set

### For Client Demo:
- [ ] Choose deployment platform (Railway recommended)
- [ ] Deploy to staging/demo environment
- [ ] Test all functionality works
- [ ] Share demo URL with client

### For Production:
- [ ] Set up custom domain
- [ ] Enable HTTPS/SSL
- [ ] Configure monitoring and alerts
- [ ] Set up backup and recovery
- [ ] Document production procedures

## 💰 Cost Comparison

| Platform | Frontend | Backend | Database | Total/Month |
|----------|----------|---------|----------|-------------|
| Railway | Included | $5-20 | $5+ | $10-25 |
| Render | Free | $7+ | $7+ | $14+ |
| Google Cloud Run | $5-15 | $10-30 | $10+ | $25-55 |
| Cloudflare + Railway | Free | $5-20 | $5+ | $10-25 |

## 🎯 Immediate Next Steps

1. **Fix Stripe Price IDs** (blocks all payment functionality)
2. **Choose deployment platform** based on budget/requirements
3. **Deploy to demo environment** for client review
4. **Test payment flow** with small test transaction
5. **Share demo URL** with client for feedback

## 📞 Client Demo Strategy

1. Deploy to Railway/Render with test Stripe keys
2. Create demo products with $0.50 prices for testing
3. Walk client through full user journey
4. Collect feedback before production deployment
5. Switch to live Stripe keys only after approval

---

**Status**: Ready for demo deployment after fixing Stripe price IDs
**Recommended Platform**: Railway (easiest) or Render (free tier available)
**Timeline**: 1-2 hours to deploy demo, 1 day for production setup