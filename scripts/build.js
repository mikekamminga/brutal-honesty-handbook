#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const StaticSiteGenerator = require('./generate-static');

async function build() {
  console.log('🔨 Starting build process...');
  
  try {
    // Clean dist directory
    await cleanDist();
    
    // Run static site generation
    const generator = new StaticSiteGenerator();
    await generator.generate();
    
    // Copy additional assets
    await copyAdditionalAssets();
    
    // Generate sitemap
    await generateSitemap();
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Output directory: dist/');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

async function cleanDist() {
  try {
    await fs.rm('dist', { recursive: true, force: true });
    console.log('🧹 Cleaned dist directory');
  } catch (error) {
    // Directory might not exist, that's okay
  }
}

async function copyAdditionalAssets() {
  // Copy vercel.json if it exists
  try {
    await fs.copyFile('vercel.json', 'dist/vercel.json');
  } catch (error) {
    // File might not exist
  }
  
  // Copy any additional static files
  const staticFiles = ['robots.txt', 'favicon.ico', 'manifest.json'];
  
  for (const file of staticFiles) {
    try {
      await fs.copyFile(file, path.join('dist', file));
      console.log(`📋 Copied ${file}`);
    } catch (error) {
      // File might not exist, that's okay
    }
  }
}

async function generateSitemap() {
  try {
    const indexContent = await fs.readFile('book/index.md', 'utf-8');
    const chapters = parseBookIndex(indexContent);
    
    const sitemap = generateSitemapXML(chapters);
    await fs.writeFile('dist/sitemap.xml', sitemap);
    console.log('🗺️ Generated sitemap.xml');
    
  } catch (error) {
    console.error('Warning: Could not generate sitemap:', error.message);
  }
}

function parseBookIndex(indexContent) {
  const chapters = [];
  const lines = indexContent.split('\n');
  
  for (const line of lines) {
    const chapterMatch = line.match(/^\*\s+\[([^\]]+)\]\(([^)]+\.md)\)$/);
    if (chapterMatch) {
      const title = chapterMatch[1];
      const filename = chapterMatch[2];
      const id = filename.replace('.md', '');
      
      chapters.push({ id, title, filename });
    }
  }
  
  return chapters;
}

function generateSitemapXML(chapters) {
  const baseUrl = 'https://your-domain.com'; // Update this with your actual domain
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  for (const chapter of chapters) {
    xml += `  <url>
    <loc>${baseUrl}/book/${chapter.id}.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  xml += '</urlset>';
  return xml;
}

// Run if called directly
if (require.main === module) {
  build();
}

module.exports = { build }; 