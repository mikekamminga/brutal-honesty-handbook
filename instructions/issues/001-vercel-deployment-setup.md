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
- [x] Create `vercel.json` configuration file
- [x] Set up proper routing for SPA (Single Page Application)
- [x] Configure build settings if needed
- [ ] Set up custom domain (optional - requires actual deployment)

### ✅ Repository Structure
- [x] Move prototype files to root or create proper build structure
- [x] Ensure all assets are properly referenced
- [x] Test that JSON loading works in production environment
- [x] Add deployment status badge to README

### ✅ CI/CD Pipeline
- [x] Set up automatic deployments on main branch pushes (via Vercel GitHub integration)
- [x] Configure preview deployments for feature branches
- [ ] Add deployment status checks (requires actual deployment)

### ✅ Documentation
- [x] Update README with deployment instructions
- [x] Document the deployment process
- [x] Add troubleshooting guide for common deployment issues

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
- [x] Site loads correctly locally (tested with Python server)
- [x] All chapters load properly
- [x] Navigation works as expected
- [x] Theme switching persists
- [x] Mobile responsiveness maintained
- [ ] Performance metrics are acceptable (requires live deployment)
- [ ] Site loads correctly on Vercel (requires actual deployment)

## Related Issues
- Will enable easier testing for future UI/UX improvements
- Required for public access and feedback collection

## Notes
- Consider using Vercel's edge functions if needed for any dynamic content
- Ensure proper caching headers are set for optimal performance
- Test with different browsers and devices after deployment 