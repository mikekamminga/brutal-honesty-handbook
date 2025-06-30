#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

const BOOK_DIR = 'book';
const OUTPUT_DIR = 'dist';
const STATIC_DIR = 'static';

class StaticSiteGenerator {
  constructor() {
    this.chapters = [];
    this.baseTemplate = '';
  }

  async generate() {
    console.log('🚀 Starting static site generation...');
    
    try {
      // Ensure output directories exist
      await this.ensureDirectories();
      
      // Load base template
      await this.loadBaseTemplate();
      
      // Parse book structure
      await this.parseBookStructure();
      
      // Generate static pages
      await this.generatePages();
      
      // Copy static assets
      await this.copyStaticAssets();
      
      console.log('✅ Static site generation complete!');
      console.log(`📁 Generated ${this.chapters.length} pages in ${OUTPUT_DIR}/`);
      
    } catch (error) {
      console.error('❌ Static site generation failed:', error);
      process.exit(1);
    }
  }

  async ensureDirectories() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.mkdir(path.join(OUTPUT_DIR, 'book'), { recursive: true });
    await fs.mkdir(STATIC_DIR, { recursive: true });
  }

  async loadBaseTemplate() {
    this.baseTemplate = await fs.readFile('index.html', 'utf-8');
  }

  async parseBookStructure() {
    try {
      const indexContent = await fs.readFile(path.join(BOOK_DIR, 'index.md'), 'utf-8');
      this.chapters = this.parseBookIndex(indexContent);
      console.log(`📖 Found ${this.chapters.length} chapters`);
    } catch (error) {
      console.error('Failed to parse book structure:', error);
      throw error;
    }
  }

  parseBookIndex(indexContent) {
    const chapters = [];
    const lines = indexContent.split('\n');
    let currentSection = null;
    
    for (const line of lines) {
      const sectionMatch = line.match(/^### (.+)$/);
      if (sectionMatch && sectionMatch[1] !== '—') {
        currentSection = sectionMatch[1];
        continue;
      }
      
      const chapterMatch = line.match(/^\*\s+\[([^\]]+)\]\(([^)]+\.md)\)$/);
      if (chapterMatch) {
        const title = chapterMatch[1];
        const filename = chapterMatch[2];
        const id = filename.replace('.md', '');
        
        chapters.push({
          id,
          title,
          filename,
          section: currentSection
        });
      }
    }
    
    return chapters;
  }

  async generatePages() {
    // Generate main index page
    await this.generateIndexPage();
    
    // Generate individual chapter pages
    for (let i = 0; i < this.chapters.length; i++) {
      await this.generateChapterPage(this.chapters[i], i);
    }
  }

  async generateIndexPage() {
    const tocHtml = this.generateTableOfContents();
    const firstChapterContent = await this.loadChapterContent(this.chapters[0]);
    
    const html = this.baseTemplate
      .replace('<!-- Table of Contents will be generated here by JS -->', tocHtml)
      .replace('<div class="loading-state">', `<div class="static-content">`)
      .replace('<h2>Loading your reading experience...</h2>', firstChapterContent)
      .replace('<p>Preparing the handbook for you.</p>', '')
      .replace('</div>', '</div>')
      .replace('<script src="script.js"></script>', this.getStaticScript());

    await fs.writeFile(path.join(OUTPUT_DIR, 'index.html'), html);
    console.log('📄 Generated index.html');
  }

  async generateChapterPage(chapter, index) {
    const tocHtml = this.generateTableOfContents();
    const chapterContent = await this.loadChapterContent(chapter);
    
    const html = this.baseTemplate
      .replace('<title>The Handbook of Brutal Honesty</title>', 
               `<title>${chapter.title} - The Handbook of Brutal Honesty</title>`)
      .replace('<meta name="description" content="A practical guide to building honest, genuine relationships through the art of brutal honesty.">', 
               `<meta name="description" content="${this.generateMetaDescription(chapterContent)}">`)
      .replace('<!-- Table of Contents will be generated here by JS -->', tocHtml)
      .replace('<div class="loading-state">', `<div class="static-content">`)
      .replace('<h2>Loading your reading experience...</h2>', chapterContent)
      .replace('<p>Preparing the handbook for you.</p>', '')
      .replace('</div>', '</div>')
      .replace('<script src="script.js"></script>', this.getStaticScript(index));

    const outputPath = path.join(OUTPUT_DIR, 'book', `${chapter.id}.html`);
    await fs.writeFile(outputPath, html);
    console.log(`📄 Generated ${chapter.id}.html`);
  }

  async loadChapterContent(chapter) {
    try {
      const markdownPath = path.join(BOOK_DIR, chapter.filename);
      const markdownContent = await fs.readFile(markdownPath, 'utf-8');
      return marked(markdownContent);
    } catch (error) {
      console.error(`Failed to load ${chapter.filename}:`, error);
      return '<p>Chapter content not available.</p>';
    }
  }

  generateTableOfContents() {
    let html = '<nav class="chapter-nav">';
    let currentSection = null;
    
    for (const chapter of this.chapters) {
      if (chapter.section !== currentSection) {
        if (currentSection !== null) {
          html += '</div>';
        }
        html += `<div class="nav-section">
          <div class="nav-section-title">${chapter.section || 'Chapters'}</div>`;
        currentSection = chapter.section;
      }
      
      const cleanTitle = chapter.title.replace(/^Chapter \d+:\s*/, '');
      html += `<a href="/book/${chapter.id}.html" class="nav-item" data-chapter="${chapter.id}">
        <div class="nav-item-content">
          <div class="nav-item-title">${cleanTitle}</div>
        </div>
      </a>`;
    }
    
    if (currentSection !== null) {
      html += '</div>';
    }
    html += '</nav>';
    
    return html;
  }

  generateMetaDescription(content) {
    // Extract first paragraph as meta description
    const textContent = content.replace(/<[^>]*>/g, '');
    const firstParagraph = textContent.split('\n\n')[0] || textContent;
    return firstParagraph.substring(0, 160).trim() + '...';
  }

  getStaticScript(currentChapterIndex = 0) {
    return `
    <script>
      // Static site enhancements
      document.addEventListener('DOMContentLoaded', function() {
        // Initialize theme
        const savedTheme = localStorage.getItem('reading-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Set current chapter
        const currentChapter = ${currentChapterIndex};
        
        // Update active nav item
        const navItems = document.querySelectorAll('.nav-item');
        if (navItems[currentChapter]) {
          navItems[currentChapter].classList.add('active');
        }
        
        // Basic interactivity
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
          themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('reading-theme', newTheme);
          });
        }
        
        // Menu toggle for mobile
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (menuToggle && sidebar) {
          menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
          });
        }
      });
    </script>
    `;
  }

  async copyStaticAssets() {
    // Copy CSS
    await fs.copyFile('style.css', path.join(OUTPUT_DIR, 'style.css'));
    
    // Copy any other static assets
    try {
      const staticFiles = await fs.readdir(STATIC_DIR);
      for (const file of staticFiles) {
        await fs.copyFile(
          path.join(STATIC_DIR, file), 
          path.join(OUTPUT_DIR, file)
        );
      }
    } catch (error) {
      // Static directory might not exist, that's okay
    }
    
    console.log('📁 Copied static assets');
  }
}

// Run the generator
if (require.main === module) {
  const generator = new StaticSiteGenerator();
  generator.generate();
}

module.exports = StaticSiteGenerator; 