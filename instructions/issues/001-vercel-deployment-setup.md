# Issue #001: Setup Vercel Deployment for Static Site

## Priority: High
## Estimated Time: 2-3 hours
## Labels: `deployment`, `infrastructure`, `setup`

## Description
Set up the repository for easy deployment on Vercel as a static site to make the digital book accessible online.

## Current State
- We have a working prototype in `redesigned-prototype/` folder
- The site currently requires a local server to run due to CORS restrictions with JSON loading
- No deployment configuration exists

## Acceptance Criteria

### ✅ Vercel Configuration
- [ ] Create `vercel.json` configuration file
- [ ] Set up proper routing for SPA (Single Page Application)
- [ ] Configure build settings if needed
- [ ] Set up custom domain (optional)

### ✅ Repository Structure
- [ ] Move prototype files to root or create proper build structure
- [ ] Ensure all assets are properly referenced
- [ ] Test that JSON loading works in production environment
- [ ] Add deployment status badge to README

### ✅ CI/CD Pipeline
- [ ] Set up automatic deployments on main branch pushes
- [ ] Configure preview deployments for feature branches
- [ ] Add deployment status checks

### ✅ Documentation
- [ ] Update README with deployment instructions
- [ ] Document the deployment process
- [ ] Add troubleshooting guide for common deployment issues

## Technical Requirements

### File Structure Options
1. **Option A**: Move redesigned-prototype contents to root
2. **Option B**: Configure Vercel to serve from subdirectory
3. **Option C**: Create build process to generate dist folder

### Vercel Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Testing Checklist
- [ ] Site loads correctly on Vercel
- [ ] All chapters load properly
- [ ] Navigation works as expected
- [ ] Theme switching persists
- [ ] Mobile responsiveness maintained
- [ ] Performance metrics are acceptable

## Related Issues
- Will enable easier testing for future UI/UX improvements
- Required for public access and feedback collection

## Notes
- Consider using Vercel's edge functions if needed for any dynamic content
- Ensure proper caching headers are set for optimal performance
- Test with different browsers and devices after deployment 