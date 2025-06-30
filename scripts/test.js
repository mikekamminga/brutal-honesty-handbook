#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function runTests() {
  console.log('🧪 Running tests...');
  
  let passed = 0;
  let failed = 0;
  
  const tests = [
    { name: 'Book index exists', test: testBookIndexExists },
    { name: 'Book chapters exist', test: testBookChaptersExist },
    { name: 'Static assets exist', test: testStaticAssetsExist },
    { name: 'HTML is valid', test: testHtmlValidity },
    { name: 'Content is readable', test: testContentReadability }
  ];
  
  for (const { name, test } of tests) {
    try {
      await test();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

async function testBookIndexExists() {
  const indexPath = 'book/index.md';
  await fs.access(indexPath);
  const content = await fs.readFile(indexPath, 'utf-8');
  if (content.length < 100) {
    throw new Error('Book index appears to be empty or too short');
  }
}

async function testBookChaptersExist() {
  const indexContent = await fs.readFile('book/index.md', 'utf-8');
  // More precise regex to only match markdown links with .md extension
  const chapterMatches = indexContent.match(/\[([^\]]+)\]\(([^)]+\.md)\)/g);
  
  if (!chapterMatches || chapterMatches.length === 0) {
    throw new Error('No chapters found in book index');
  }
  
  let missingChapters = 0;
  
  for (const match of chapterMatches) {
    const filenameMatch = match.match(/\(([^)]+\.md)\)/);
    if (filenameMatch) {
      const filename = filenameMatch[1];
      try {
        await fs.access(`book/${filename}`);
      } catch (error) {
        missingChapters++;
        console.warn(`  ⚠️ Missing chapter file: ${filename}`);
      }
    }
  }
  
  if (missingChapters > 0) {
    throw new Error(`${missingChapters} chapter files are missing`);
  }
  
  console.log(`  📚 Found ${chapterMatches.length} chapters`);
}

async function testStaticAssetsExist() {
  const requiredAssets = ['index.html', 'style.css', 'script.js'];
  
  for (const asset of requiredAssets) {
    await fs.access(asset);
  }
}

async function testHtmlValidity() {
  const indexContent = await fs.readFile('index.html', 'utf-8');
  
  // Basic HTML validation
  if (!indexContent.includes('<!DOCTYPE html>')) {
    throw new Error('Missing DOCTYPE declaration');
  }
  
  if (!indexContent.includes('<html')) {
    throw new Error('Missing html tag');
  }
  
  if (!indexContent.includes('<head>') || !indexContent.includes('</head>')) {
    throw new Error('Missing or malformed head section');
  }
  
  if (!indexContent.includes('<body>') || !indexContent.includes('</body>')) {
    throw new Error('Missing or malformed body section');
  }
  
  // Check for meta tags
  if (!indexContent.includes('<meta charset="UTF-8">')) {
    throw new Error('Missing charset meta tag');
  }
  
  if (!indexContent.includes('<meta name="viewport"')) {
    throw new Error('Missing viewport meta tag');
  }
}

async function testContentReadability() {
  // Test if we can parse the book structure
  const indexContent = await fs.readFile('book/index.md', 'utf-8');
  const chapterMatches = indexContent.match(/\[([^\]]+)\]\(([^)]+)\)/g);
  
  if (!chapterMatches || chapterMatches.length === 0) {
    throw new Error('Cannot parse chapter structure');
  }
  
  // Test if first chapter is readable
  const firstChapterMatch = chapterMatches[0].match(/\(([^)]+)\)/);
  if (firstChapterMatch) {
    const filename = firstChapterMatch[1];
    const chapterContent = await fs.readFile(`book/${filename}`, 'utf-8');
    
    if (chapterContent.length < 100) {
      throw new Error('First chapter appears to be empty or too short');
    }
    
    // Check for basic markdown structure
    if (!chapterContent.includes('#') && !chapterContent.includes('##')) {
      console.warn('  ⚠️ First chapter may be missing headers');
    }
  }
}

// Run if called directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests }; 