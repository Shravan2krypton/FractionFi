# Vercel Deployment Checklist

## Required Environment Variables
Set these in your Vercel project settings:

1. **DATABASE_URL** - PostgreSQL connection string
   - Format: `postgresql://username:password@host:port/database`
   - Must include SSL configuration

2. **NODE_ENV** - Set to `production`
3. **FRONTEND_URL** - Your frontend URL (optional, defaults to deployed URL)
4. **JWT_SECRET** - Secret for JWT tokens
5. **ETHERS_PRIVATE_KEY** - Private key for blockchain operations

## Common Issues & Solutions

### 404 NOT_FOUND Error
This error typically occurs when:

1. **Missing Environment Variables**
   - Check Vercel dashboard > Settings > Environment Variables
   - Ensure DATABASE_URL is set and valid

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Ensure database allows SSL connections
   - Check if database is accessible from Vercel

3. **Build Failures**
   - Run `npm run build` locally to verify
   - Check Vercel build logs for specific errors

### Debugging Steps

1. **Check Vercel Function Logs**
   - Go to Vercel dashboard > Functions tab
   - Look for error messages in function logs

2. **Test API Endpoint**
   ```bash
   curl https://your-backend-url.vercel.app/api/health
   ```

3. **Verify Environment Variables**
   - Add temporary logging to check env vars
   - Remove sensitive logs before production

## File Structure Verification
Ensure these files exist and are accessible:
- `/api/index.ts` - Main Vercel handler
- `/src/routes/*.ts` - Route handlers
- `/src/models/database.ts` - Database initialization
- `/src/config/database.ts` - Database connection

## Quick Fix Commands
```bash
# Redeploy with latest changes
vercel --prod

# Check build locally
npm run build

# Test database connection
node -e "require('./src/config/database').testConnection()"
```
