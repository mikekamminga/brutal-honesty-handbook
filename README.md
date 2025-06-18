# The Original Field Guide for Brutal Honesty

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/brutal-honesty-handbook)

A premium digital reading experience for "The Original Field Guide for Brutal Honesty" by Mike Kamminga aka The Cult Leader.

## 🚀 Live Demo

Visit the live site: [Coming Soon - Deploy to see URL]

## ✨ Features

### 📖 Premium Reading Experience
- **Advanced Typography**: Professional font system with Inter, Crimson Text, and JetBrains Mono
- **Dual Themes**: Light and dark mode with smooth transitions
- **Reading Progress**: Track your progress through each chapter
- **Focus Mode**: Distraction-free reading overlay
- **Reading Stats**: Track reading time and chapter completion

### 🎨 Modern Design
- **Glassmorphism UI**: Beautiful backdrop blur effects
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Smooth Animations**: Polished micro-interactions throughout
- **Custom Scrollbars**: Styled for a cohesive experience

### ⚡ Advanced Functionality
- **Smart Search**: Real-time chapter and content search
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Progress Persistence**: Your reading progress is saved locally
- **Mobile Navigation**: Touch-optimized sidebar and navigation

## 🛠️ Development

### Local Development
```bash
# Clone the repository
git clone [repository-url]
cd brutal-honesty-handbook

# Serve locally (requires a local server due to JSON loading)
# Option 1: Using Python
python -m http.server 8000

# Option 2: Using Node.js
npx serve .

# Option 3: Using PHP
php -S localhost:8000

# Visit http://localhost:8000
```

### Project Structure
```
├── index.html          # Main application
├── style.css           # Complete styling system
├── script.js           # Application logic
├── book.json           # Book content and chapters
├── vercel.json         # Deployment configuration
├── instructions/       # Project documentation
│   └── issues/         # Detailed task breakdown
├── redesigned-prototype/ # Original prototype files
├── prototype/          # Initial prototype
├── book/              # Source markdown files
└── sources/           # Additional content sources
```

## 🚀 Deployment

### Deploy to Vercel

1. **One-Click Deploy**:
   - Click the "Deploy with Vercel" button above
   - Connect your GitHub account
   - Deploy automatically

2. **Manual Deploy**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   
   # Follow the prompts
   ```

3. **GitHub Integration**:
   - Connect repository to Vercel
   - Automatic deployments on push to main
   - Preview deployments for pull requests

### Configuration

The `vercel.json` file includes:
- Static file serving with optimal caching
- SPA routing (all routes serve index.html)
- Security headers
- Performance optimizations

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Previous/Next chapter |
| `F` | Toggle focus mode |
| `T` | Toggle theme |
| `M` | Toggle mobile menu |
| `Esc` | Close modals/overlays |
| `/` | Focus search |

## 📱 Mobile Experience

- **Touch Navigation**: Swipe-friendly interface
- **Responsive Typography**: Scales beautifully on all screen sizes
- **Mobile Menu**: Animated hamburger menu with overlay
- **Touch Targets**: All interactive elements are touch-optimized

## 🎯 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features Used**: CSS Custom Properties, Intersection Observer, Local Storage

## 📊 Performance

- **Optimized Assets**: Efficient CSS and JavaScript
- **Font Loading**: Optimized web font loading with fallbacks
- **Caching**: Static assets cached for 1 year
- **Lazy Loading**: Images and content loaded as needed

## 🔧 Technical Details

### Built With
- **Vanilla JavaScript**: No frameworks, pure performance
- **Modern CSS**: Custom properties, Grid, Flexbox
- **HTML5**: Semantic markup with accessibility features

### Architecture
- **Component-Based CSS**: Organized, maintainable stylesheets
- **Progressive Enhancement**: Works without JavaScript
- **Accessibility First**: WCAG 2.1 AA compliant
- **Mobile First**: Responsive design from the ground up

## 📋 Roadmap

See [instructions/issues/](./instructions/issues/) for detailed development tasks:

- [x] ✅ Initial prototype with advanced typography
- [ ] 🚀 Vercel deployment setup (In Progress)
- [ ] 📝 Content architecture refactor (Markdown-based)
- [ ] 📊 Content versioning and changelog
- [ ] 🎨 UI/UX improvements and CSS refactor
- [ ] 🏷️ Book title and branding update

## 🤝 Contributing

1. Check the [issues directory](./instructions/issues/) for available tasks
2. Create a feature branch: `git checkout -b feature/issue-number`
3. Make your changes following the existing patterns
4. Test thoroughly on multiple devices
5. Submit a pull request with clear description

## 📄 License

[Add your license information here]

## 👨‍💻 Author

**Mike Kamminga** aka The Cult Leader

---

*Built with ❤️ for readers who appreciate brutal honesty and beautiful typography.* 