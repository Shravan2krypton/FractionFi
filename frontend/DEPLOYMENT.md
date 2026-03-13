# Vercel Deployment Guide for FractionFi Frontend

## Prerequisites
- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository with your code
- Backend API deployed and accessible
- Smart contract deployed to blockchain

## Deployment Steps

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from Frontend Directory
```bash
cd frontend
vercel
```

### 4. Configure Environment Variables
During deployment, set these environment variables:
- `NEXT_PUBLIC_API_URL`: Your deployed backend URL
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Your deployed smart contract address

### 5. Deploy to Production
```bash
vercel --prod
```

## Alternative: GitHub Integration

### 1. Connect Your GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the `frontend` directory as root

### 2. Configure Build Settings
Vercel will automatically detect Next.js. Ensure:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3. Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL`: Your backend URL
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Your contract address

### 4. Deploy
Push to your main branch or trigger deployment from Vercel dashboard.

## Post-Deployment Checklist

- [ ] Backend API is accessible from the deployed frontend
- [ ] Smart contract address is correctly set
- [ ] All pages load without errors
- [ ] MetaMask connection works
- [ ] Asset browsing and investment flows work
- [ ] Responsive design works on mobile

## Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate issuance

## Troubleshooting

### Build Errors
- Check `package.json` for correct build scripts
- Ensure all dependencies are installed
- Verify TypeScript configuration

### Runtime Errors
- Check environment variables in Vercel dashboard
- Verify backend API is accessible
- Check browser console for errors

### API Connection Issues
- Ensure CORS is configured on backend
- Verify API URL is correct and accessible
- Check network requests in browser dev tools

## Next Steps

After frontend deployment:
1. Deploy your backend to Vercel/Railway/Render
2. Deploy smart contracts to mainnet/testnet
3. Update environment variables with production URLs
4. Test the complete application flow
