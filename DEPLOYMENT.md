# Deployment Guide

This document provides step-by-step instructions for deploying "The Original Field Guide for Brutal Honesty" to various platforms.

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Repository pushed to GitHub

### Method 1: One-Click Deploy
1. Click the "Deploy with Vercel" button in the README
2. Connect your GitHub account if not already connected
3. Select the repository
4. Configure project settings (defaults should work)
5. Click "Deploy"
6. Wait for deployment to complete
7. Visit your live site!

### Method 2: Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project directory
cd brutal-honesty-handbook

# Deploy (first time will require login and setup)
vercel

# For production deployment
vercel --prod
```

### Method 3: GitHub Integration
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Configure settings (defaults work)
6. Deploy

### Vercel Configuration

The `vercel.json` file includes:
- **Static File Serving**: All assets served efficiently
- **SPA Routing**: Hash-based navigation works correctly
- **Caching Headers**: Optimal performance with 1-year cache
- **Security Headers**: Basic security improvements

## 🌐 Alternative Deployment Options

### Netlify
1. Connect GitHub repository to Netlify
2. Build settings: None needed (static files)
3. Publish directory: `/` (root)
4. Deploy

### GitHub Pages
```bash
# Create gh-pages branch
git checkout -b gh-pages

# Push to GitHub
git push origin gh-pages

# Enable GitHub Pages in repository settings
# Select gh-pages branch as source
```

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy
```

## 🔧 Configuration Details

### File Structure for Deployment
```
/ (root directory)
├── index.html          # Entry point
├── style.css           # Styles
├── script.js           # Application logic
├── book.json           # Content data
├── vercel.json         # Vercel configuration
├── package.json        # Project metadata
└── README.md           # Documentation
```

### Environment Variables
No environment variables are required for the basic deployment. The application is fully static.

### Custom Domain Setup (Vercel)
1. Go to your project dashboard on Vercel
2. Click on "Settings" tab
3. Click on "Domains" in the sidebar
4. Add your custom domain
5. Configure DNS records as instructed
6. Wait for DNS propagation

## 🧪 Testing Deployment

### Pre-deployment Checklist
- [ ] All files are in root directory
- [ ] `book.json` loads correctly
- [ ] Navigation works between chapters
- [ ] Theme switching functions
- [ ] Mobile responsive design works
- [ ] Search functionality operates
- [ ] Reading progress saves

### Local Testing
```bash
# Test with Python
python3 -m http.server 8000

# Test with Node.js
npx serve .

# Test with PHP
php -S localhost:8000

# Visit http://localhost:8000
```

### Post-deployment Testing
1. **Functionality Test**:
   - Load the site
   - Navigate between chapters
   - Test search functionality
   - Toggle themes
   - Test mobile responsiveness

2. **Performance Test**:
   - Check loading speed
   - Verify caching headers
   - Test on slow connections

3. **Browser Compatibility**:
   - Test on Chrome, Firefox, Safari, Edge
   - Test on mobile browsers
   - Verify on different screen sizes

## 🚨 Troubleshooting

### Common Issues

#### JSON Loading Errors
- **Problem**: `book.json` fails to load
- **Solution**: Ensure file is in root directory and properly formatted
- **Check**: Browser network tab for 404 or CORS errors

#### Routing Issues
- **Problem**: Direct URLs don't work
- **Solution**: Verify `vercel.json` routing configuration
- **Check**: SPA routing redirects all paths to `index.html`

#### Font Loading Issues
- **Problem**: Fonts don't load properly
- **Solution**: Check Google Fonts URLs in HTML head
- **Check**: Network tab for font loading errors

#### Mobile Layout Issues
- **Problem**: Layout breaks on mobile
- **Solution**: Test responsive CSS media queries
- **Check**: Browser dev tools mobile simulation

### Performance Optimization

#### Caching
- Static assets cached for 1 year
- HTML cached for shorter periods
- JSON content cached appropriately

#### Font Loading
- Fonts preconnected for faster loading
- Fallback fonts specified
- Font-display: swap for better performance

#### Image Optimization
- No images currently used
- Future images should be optimized and use modern formats

## 📊 Monitoring

### Analytics Setup
To add analytics, include your tracking code in `index.html`:

```html
<!-- Google Analytics example -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Performance Monitoring
- Use Vercel Analytics (if available)
- Monitor Core Web Vitals
- Track loading performance

## 🔄 Updates and Maintenance

### Content Updates
1. Update `book.json` with new content
2. Commit changes to repository
3. Push to main branch
4. Automatic deployment will trigger

### Code Updates
1. Make changes to HTML, CSS, or JS files
2. Test locally
3. Commit and push changes
4. Verify deployment

### Rollback Process
If deployment issues occur:
1. Revert to previous commit
2. Push the revert
3. Or use Vercel dashboard to rollback to previous deployment

---

## 📞 Support

For deployment issues:
1. Check this guide first
2. Review Vercel documentation
3. Check GitHub Issues for known problems
4. Create new issue with deployment details 