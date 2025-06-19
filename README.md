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

## Browser Reader

This project includes a sophisticated browser-based reader that provides an excellent reading experience for the book content.

### Features

- **Direct Markdown Reading**: The reader now directly loads content from the `/book` folder markdown files instead of requiring a separate JSON file
- **Automatic Structure Detection**: Uses `book/index.md` to understand the book's structure and sections
- **Collapsible Exercises**: All exercises are presented in collapsible sections for better reading flow
- **Enhanced Tables**: Markdown tables are automatically converted to beautifully styled HTML tables
- **Section Organization**: Chapters are organized by sections (Mindset, Skillset, Field Guide, Practice)
- **Reading Progress Tracking**: Tracks which chapters you've read and total reading time
- **Search Functionality**: Search through all chapters
- **Reading Mode**: Distraction-free reading experience
- **Theme Toggle**: Light and dark themes
- **Responsive Design**: Works great on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Navigate with arrow keys, toggle theme with 'T', etc.

### How It Works

1. **Content Source**: All content is stored as markdown files in the `/book` directory
2. **Structure Definition**: The `book/index.md` file defines the book structure with sections and chapter order
3. **Dynamic Loading**: Chapters are loaded on-demand when selected
4. **Markdown Processing**: Built-in markdown parser handles:
   - Headers, paragraphs, lists
   - Tables with proper styling
   - Blockquotes with enhanced design
   - Collapsible `<details>` sections for exercises
   - Bold, italic, and code formatting

### Usage

1. Simply open `index.html` in a modern web browser
2. The reader will automatically load the book structure from `/book/index.md`
3. Click any chapter in the sidebar to read it
4. Use the navigation buttons or arrow keys to move between chapters
5. Use the search bar to find specific content
6. Toggle reading mode with the floating action button or 'F' key

### Development

The system is fully self-contained and doesn't require any build process:

- `index.html` - Main application structure
- `style.css` - Complete styling including responsive design
- `script.js` - Full application logic with markdown parsing
- `book/` - All book content as markdown files
- `book/index.md` - Book structure definition

### Adding New Content

1. Add new markdown files to the `/book` directory
2. Update `book/index.md` to include the new chapters in the table of contents
3. The reader will automatically detect and load the new content

### Keyboard Shortcuts

- `←/→` - Navigate between chapters
- `T` - Toggle theme
- `M` - Toggle sidebar (mobile)
- `F` - Toggle reading mode
- `Esc` - Close overlays
- `/` - Focus search bar

This system provides a maintainable, elegant way to present the book content while keeping the source files in clean, editable markdown format. 