#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

const OUTPUT_DIR = 'dist';
const STATIC_DIR = 'static';
const LANGUAGES = [
  { code: 'en', dir: 'book', name: 'English' },
  { code: 'nl', dir: 'book/nl', name: 'Dutch' }
];

class StaticSiteGenerator {
  constructor() {
    this.chapters = {};
    LANGUAGES.forEach(lang => { this.chapters[lang.code] = []; });
    this.baseTemplates = {};
  }

  async generate() {
    console.log('🚀 Starting static site generation for all languages...');

    try {
      await this.ensureDirectories();
      await this.loadBaseTemplates();

      for (const lang of LANGUAGES) {
        console.log(`\nProcessing language: ${lang.name}`);
        try {
            await this.parseBookStructure(lang);
            await this.generatePages(lang);
        } catch (error) {
            console.warn(`⚠️ Could not process language '${lang.code}'. Skipping. Error: ${error.message}`);
            continue;
        }
      }

      await this.copyStaticAssets();

      console.log('\n✅ All languages processed successfully!');
      console.log(`📁 Static site generated in ${OUTPUT_DIR}/`);

    } catch (error) {
      console.error('❌ Static site generation failed:', error);
      process.exit(1);
    }
  }

  async ensureDirectories() {
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    for (const lang of LANGUAGES) {
      const langDir = path.join(OUTPUT_DIR, lang.code === 'en' ? '' : lang.code);
      if (lang.code !== 'en') {
        await fs.mkdir(langDir, { recursive: true });
      }
      await fs.mkdir(path.join(langDir, 'book'), { recursive: true });
    }
    await fs.mkdir(path.join(OUTPUT_DIR, STATIC_DIR), { recursive: true });
  }

  async loadBaseTemplates() {
    this.baseTemplates.en = await fs.readFile('index.html', 'utf-8');
    try {
      this.baseTemplates.nl = await fs.readFile('nl/index.html', 'utf-8');
    } catch (error) {
      console.warn('Warning: nl/index.html not found. Dutch version will use the English template as a fallback.');
      this.baseTemplates.nl = this.baseTemplates.en;
    }
  }

  async parseBookStructure(lang) {
    const indexContent = await fs.readFile(path.join(lang.dir, 'index.md'), 'utf-8');
    this.chapters[lang.code] = this.parseBookIndex(indexContent);
    console.log(`  - Found ${this.chapters[lang.code].length} chapters.`);
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
        
        chapters.push({ id, title, filename, section: currentSection });
      }
    }
    return chapters;
  }

  async generatePages(lang) {
    await this.generateIndexPage(lang);
    
    for (let i = 0; i < this.chapters[lang.code].length; i++) {
      await this.generateChapterPage(this.chapters[lang.code][i], i, lang);
    }
    console.log(`  - Generated ${this.chapters[lang.code].length + 1} pages.`);
  }

  async generateIndexPage(lang) {
    const chapters = this.chapters[lang.code];
    if (chapters.length === 0) return;

    const tocHtml = this.generateTableOfContents(lang);
    const firstChapterContent = await this.loadChapterContent(chapters[0], lang);
    const baseTemplate = this.baseTemplates[lang.code];

    const html = baseTemplate
      .replace('<!-- TOC -->', tocHtml)
      .replace(/<div class="loading-state">[\s\S]*?<\/div>/, `<div class="chapter-content">${firstChapterContent}</div>`)
      .replace(/<script src="[^"]*script\.js"[^>]*><\/script>/, this.getStaticScript(0));

    const outputPath = path.join(OUTPUT_DIR, lang.code === 'en' ? '' : lang.code, 'index.html');
    await fs.writeFile(outputPath, html);
  }

  async generateChapterPage(chapter, index, lang) {
    const tocHtml = this.generateTableOfContents(lang);
    const chapterContent = await this.loadChapterContent(chapter, lang);
    // Always use the English base template for individual chapter pages for consistency in structure.
    const baseTemplate = this.baseTemplates.en;

    const html = baseTemplate
      .replace(/<title>.*<\/title>/, `<title>${chapter.title} - Brutal Honesty</title>`)
      .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${this.generateMetaDescription(chapterContent)}">`)
      .replace('<!-- TOC -->', tocHtml)
      .replace(/<div class="loading-state">[\s\S]*?<\/div>/, `<div class="chapter-content">${chapterContent}</div>`)
      .replace(/<script src="[^"]*script\.js"[^>]*><\/script>/, this.getStaticScript(index, lang.code));

    const bookPath = lang.code === 'en' ? 'book' : `${lang.code}/book`;
    const outputPath = path.join(OUTPUT_DIR, bookPath, `${chapter.id}.html`);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html);
  }

  async loadChapterContent(chapter, lang) {
    const markdownPath = path.join(lang.dir, chapter.filename);
    const markdownContent = await fs.readFile(markdownPath, 'utf-8');
    return marked(markdownContent);
  }

  generateTableOfContents(lang) {
    let html = '<ul class="chapter-list">';
    let currentSection = null;
    
    for (const chapter of this.chapters[lang.code]) {
      if (chapter.section !== currentSection) {
        if (currentSection !== null) html += '</ul></li>';
        currentSection = chapter.section;
        html += `<li class="section-item"><h4>${currentSection || 'Introduction'}</h4><ul>`;
      }
      
      const cleanTitle = chapter.title.replace(/^Chapter \d+:\s*/, '');
      const chapterUrl = lang.code === 'en' ? `/book/${chapter.id}.html` : `/${lang.code}/book/${chapter.id}.html`;

      html += `<li><a href="${chapterUrl}" data-chapter-id="${chapter.id}">${cleanTitle}</a></li>`;
    }
    
    if (currentSection !== null) html += '</ul></li>';
    html += '</ul>';
    
    return html;
  }

  generateMetaDescription(content) {
    const textContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return textContent.substring(0, 155) + '...';
  }

  getStaticScript(currentChapterIndex = 0, lang = 'en') {
    return `
    <script>
      // Minimal static-site interactivity
      (function() {
        const theme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);

        const lang = "${lang}";
        const chapterIndex = ${currentChapterIndex};
        
        const activeLink = document.querySelector(\`a[data-chapter-id="\${chapterIndex}"]\`);
        if (activeLink) activeLink.classList.add('active');
      })();
    </script>
    `;
  }

  async copyStaticAssets() {
    await fs.copyFile('style.css', path.join(OUTPUT_DIR, 'style.css'));
    await fs.copyFile('script.js', path.join(OUTPUT_DIR, 'script.js'));
    await fs.copyFile('robots.txt', path.join(OUTPUT_DIR, 'robots.txt'));
    
    try {
        const staticFiles = await fs.readdir(STATIC_DIR);
        await fs.mkdir(path.join(OUTPUT_DIR, STATIC_DIR), { recursive: true });
        for (const file of staticFiles) {
          await fs.copyFile(
            path.join(STATIC_DIR, file), 
            path.join(OUTPUT_DIR, STATIC_DIR, file)
          );
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
        // 'static' directory doesn't exist, which is fine.
    }
    
    console.log('  - Copied static assets.');
  }
}

const generator = new StaticSiteGenerator();
generator.generate(); 