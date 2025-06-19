// ===== GLOBAL STATE =====
let chapters = [];
let currentChapterIndex = 0;
let readingStats = {
  chaptersRead: new Set(),
  totalReadingTime: 0,
  sessionStartTime: Date.now()
};

// Reading preferences
let readingPreferences = {
  fontSize: 'default',
  lineHeight: 'default',
  theme: 'light'
};

// ===== DOM ELEMENTS =====
const elements = {
  sidebar: document.getElementById('sidebar'),
  toc: document.getElementById('toc'),
  content: document.getElementById('content'),
  searchBar: document.getElementById('search-bar'),
  progressFill: document.getElementById('progress-fill'),
  progressText: document.getElementById('progress-text'),
  chaptersRead: document.getElementById('chapters-read'),
  readingTime: document.getElementById('reading-time'),
  prevButton: document.getElementById('prev-chapter'),
  nextButton: document.getElementById('next-chapter'),
  themeToggle: document.querySelector('.theme-toggle'),
  menuToggle: document.querySelector('.menu-toggle'),
  fab: document.getElementById('reading-mode-toggle'),
  readingMode: document.getElementById('reading-mode'),
  readingContent: document.getElementById('reading-content'),
  closeReadingMode: document.getElementById('close-reading-mode')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  loadBookContent();
  initializeTheme();
  startReadingTimer();
  loadReadingPreferences();
});

function initializeApp() {
  // Add initial animations
  document.body.classList.add('fade-in');
  
  // Create mobile overlay
  createMobileOverlay();
  
  // Setup intersection observer for scroll animations
  setupScrollAnimations();
  
  // Load saved reading progress
  loadReadingProgress();
  
  // Add reading mode enhancements
  setupReadingModeEnhancements();
}

function createMobileOverlay() {
  // Create overlay element for mobile sidebar
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.addEventListener('click', closeSidebar);
  document.body.appendChild(overlay);
}

function setupEventListeners() {
  // Navigation
  elements.prevButton?.addEventListener('click', navigateToPrevious);
  elements.nextButton?.addEventListener('click', navigateToNext);
  
  // Theme toggle
  elements.themeToggle?.addEventListener('click', toggleTheme);
  
  // Refresh toggle
  document.getElementById('refresh-content')?.addEventListener('click', handleRefreshClick);
  
  // Menu toggle (mobile)
  elements.menuToggle?.addEventListener('click', toggleSidebar);
  
  // Search functionality
  elements.searchBar?.addEventListener('input', handleSearch);
  
  // Reading mode
  elements.fab?.addEventListener('click', toggleReadingMode);
  elements.closeReadingMode?.addEventListener('click', closeReadingMode);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
  
  // Hash change for navigation
  window.addEventListener('hashchange', handleHashChange);
  
  // Reading progress tracking
  elements.content?.addEventListener('scroll', updateReadingProgress);
  
  // Resize handler for responsive behavior
  window.addEventListener('resize', handleResize);
  
  // Enhanced scroll behavior
  elements.content?.addEventListener('scroll', debounce(handleScroll, 16));
  
  // Sidebar resizing
  setupSidebarResizing();
}

// ===== BOOK CONTENT LOADING =====
async function loadBookContent() {
  try {
    // Load the book structure from index.md
    const indexResponse = await fetch('book/index.md');
    const indexContent = await indexResponse.text();
    
    // Parse the index to get chapter structure
    chapters = parseBookIndex(indexContent);
    
    generateTableOfContents();
    
    // Load initial chapter
    const initialChapterId = window.location.hash.substring(1) || chapters[0]?.id;
    const initialIndex = chapters.findIndex(chapter => chapter.id === initialChapterId);
    currentChapterIndex = initialIndex >= 0 ? initialIndex : 0;
    
    await loadChapter(currentChapterIndex);
    updateNavigationButtons();
    
  } catch (error) {
    console.error('Failed to load book content:', error);
    elements.content.innerHTML = `
      <div class="error-message">
        <h2>Unable to load content</h2>
        <p>Please check your connection and try again.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}

function parseBookIndex(indexContent) {
  const chapters = [];
  const lines = indexContent.split('\n');
  let currentSection = null;
  
  for (const line of lines) {
    // Look for section headers (### Part I: Mindset)
    const sectionMatch = line.match(/^### (.+)$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      continue;
    }
    
    // Look for chapter links (*   [Chapter 1: What Brutal Honesty Is—and Is Not](01_what_brutal_honesty_is.md))
    const chapterMatch = line.match(/^\*\s+\[([^\]]+)\]\(([^)]+)\)$/);
    if (chapterMatch) {
      const title = chapterMatch[1];
      const filename = chapterMatch[2];
      const id = filename.replace('.md', '');
      
      chapters.push({
        id,
        title,
        filename,
        section: currentSection,
        content: null // Will be loaded when needed
      });
    }
  }
  
  return chapters;
}

async function loadChapterContent(chapter, forceRefresh = false) {
  if (chapter.content && !forceRefresh) {
    return chapter.content; // Already loaded and not forcing refresh
  }
  
  try {
    // Add cache-busting parameter to prevent browser caching issues
    const timestamp = new Date().getTime();
    const url = `book/${chapter.filename}?t=${timestamp}`;
    
    const response = await fetch(url, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    const markdownContent = await response.text();
    const htmlContent = parseMarkdown(markdownContent);
    
    chapter.content = htmlContent;
    return htmlContent;
  } catch (error) {
    console.error(`Failed to load chapter ${chapter.filename}:`, error);
    return `<p>Error loading chapter content.</p>`;
  }
}

function parseMarkdown(markdown) {
  // Configure marked.js
  marked.setOptions({
    breaks: true,
    gfm: true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    tables: true
  });

  // Create custom renderer for specific elements
  const renderer = new marked.Renderer();
  
  // Customize table rendering to use our existing CSS classes
  renderer.table = function(header, body) {
    return `<table class="content-table">
      <thead>${header}</thead>
      <tbody>${body}</tbody>
    </table>`;
  };
  
  // Customize blockquote rendering
  renderer.blockquote = function(quote) {
    return `<blockquote>${quote}</blockquote>`;
  };
  
  // Customize list rendering to handle special patterns
  renderer.list = function(body, ordered, start) {
    const type = ordered ? 'ol' : 'ul';
    const startatt = (ordered && start !== 1) ? ` start="${start}"` : '';
    return `<${type}${startatt}>${body}</${type}>`;
  };
  
  // Parse with marked.js
  let html = marked.parse(markdown, { renderer });
  
  // Post-process for custom elements
  html = postProcessMarkdown(html);
  
  return html;
}

function postProcessMarkdown(html) {
  // Handle details/summary sections with custom classes
  html = html.replace(/<details>/g, '<details class="exercise-section">');
  html = html.replace(/<summary>([^<]+)<\/summary>/g, '<summary>$1</summary><div class="exercise-content">');
  html = html.replace(/<\/details>/g, '</div></details>');
  
  // Handle special formatting patterns for declarative statements
  html = html.replace(/<ul>\s*<li>(It is [^<]+)<\/li>\s*<li>(It is [^<]+)<\/li>/g, 
    '<ul><li>$1</li><li>$2</li>');
  
  // Handle "Instead of:" and "Try:" patterns
  html = html.replace(/<p><strong>(Instead of|Try):<\/strong>\s*([^<]+)<\/p>/g, 
    '<div class="example-block"><strong class="example-label">$1:</strong> $2</div>');
  
  return html;
}



function generateTableOfContents() {
  if (!elements.toc) return;
  
  const ul = document.createElement('ul');
  let currentSection = null;
  
  chapters.forEach((chapter, index) => {
    // Add section header if this is a new section
    if (chapter.section && chapter.section !== currentSection) {
      const sectionLi = document.createElement('li');
      sectionLi.className = 'section-header';
      sectionLi.textContent = chapter.section;
      ul.appendChild(sectionLi);
      currentSection = chapter.section;
    }
    
    const li = document.createElement('li');
    const a = document.createElement('a');
    
    a.href = `#${chapter.id}`;
    a.textContent = cleanChapterTitle(chapter.title);
    a.dataset.id = chapter.id;
    a.dataset.index = index;
    
    // Add completion status
    if (readingStats.chaptersRead.has(chapter.id)) {
      a.classList.add('completed');
    }
    
    li.appendChild(a);
    ul.appendChild(li);
  });
  
  elements.toc.appendChild(ul);
  
  // Add click listeners
  elements.toc.addEventListener('click', handleTocClick);
}

function cleanChapterTitle(title) {
  return title
    .replace(/^Chapter \d+:\s*/, '')
    .replace(/^Prologue:\s*/, 'Prologue: ')
    .replace(/^Introduction:\s*/, 'Introduction: ')
    .replace(/^Epilogue:\s*/, 'Epilogue: ');
}

// ===== ENHANCED CONTENT PROCESSING =====
async function loadChapter(index, forceRefresh = false) {
  if (!chapters[index]) return;
  
  const chapter = chapters[index];
  
  try {
    const content = await loadChapterContent(chapter, forceRefresh);
    
    // Create chapter HTML structure
    const chapterHtml = `
      <div class="chapter-content fade-in">
        <div class="chapter-header">
          <h1>${cleanChapterTitle(chapter.title)}</h1>
          <div class="chapter-meta">
            <span class="chapter-number">${index + 1} of ${chapters.length}</span>
            <span class="reading-time">${estimateReadingTime(content)} min read</span>
            ${chapter.section ? `<span class="chapter-section">${chapter.section}</span>` : ''}
          </div>
        </div>
        <div class="chapter-body">
          ${content}
        </div>
      </div>
    `;
    
    elements.content.innerHTML = chapterHtml;
    
    // Update URL hash
    window.history.replaceState(null, null, `#${chapter.id}`);
    
    // Update active chapter in TOC
    updateActiveChapter(chapter.id);
    
    // Mark as read and update progress
    markChapterAsRead(chapter.id);
    updateProgress();
    
    // Scroll to top
    elements.content.scrollTo(0, 0);
    
    // Setup lazy loading for images
    lazyLoadImages();
    
    // Add scroll reveal animations
    setupScrollAnimations();
    
  } catch (error) {
    console.error('Error loading chapter:', error);
    elements.content.innerHTML = `
      <div class="error-message">
        <h2>Error Loading Chapter</h2>
        <p>Could not load "${chapter.title}". Please try again.</p>
      </div>
    `;
  }
}

function estimateReadingTime(content) {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function navigateToPrevious() {
  if (currentChapterIndex > 0) {
    currentChapterIndex--;
    loadChapter(currentChapterIndex);
    updateNavigationButtons();
  }
}

function navigateToNext() {
  if (currentChapterIndex < chapters.length - 1) {
    currentChapterIndex++;
    loadChapter(currentChapterIndex);
    updateNavigationButtons();
  }
}

function updateNavigationButtons() {
  if (elements.prevButton) {
    elements.prevButton.disabled = currentChapterIndex === 0;
    if (currentChapterIndex > 0) {
      const prevChapter = chapters[currentChapterIndex - 1];
      elements.prevButton.title = `Previous: ${cleanChapterTitle(prevChapter.title)}`;
    }
  }
  
  if (elements.nextButton) {
    elements.nextButton.disabled = currentChapterIndex === chapters.length - 1;
    if (currentChapterIndex < chapters.length - 1) {
      const nextChapter = chapters[currentChapterIndex + 1];
      elements.nextButton.title = `Next: ${cleanChapterTitle(nextChapter.title)}`;
    }
  }
}

function updateActiveChapter(chapterId) {
  // Remove active class from all TOC links
  elements.toc.querySelectorAll('a').forEach(link => {
    link.classList.remove('active');
  });
  
  // Add active class to current chapter
  const activeLink = elements.toc.querySelector(`a[data-id="${chapterId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  const tocLinks = elements.toc.querySelectorAll('a');
  
  tocLinks.forEach(link => {
    const chapterTitle = link.textContent.toLowerCase();
    const listItem = link.parentElement;
    
    if (!searchTerm || chapterTitle.includes(searchTerm)) {
      listItem.style.display = '';
    } else {
      listItem.style.display = 'none';
    }
  });
  
  // Show/hide section headers based on whether they have visible chapters
  const sectionHeaders = elements.toc.querySelectorAll('.section-header');
  sectionHeaders.forEach(header => {
    let hasVisibleChapters = false;
    let nextElement = header.nextElementSibling;
    
    while (nextElement && !nextElement.classList.contains('section-header')) {
      if (nextElement.style.display !== 'none') {
        hasVisibleChapters = true;
        break;
      }
      nextElement = nextElement.nextElementSibling;
    }
    
    header.style.display = hasVisibleChapters ? '' : 'none';
  });
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  readingPreferences.theme = savedTheme;
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  readingPreferences.theme = newTheme;
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const themeIcon = elements.themeToggle?.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
  }
}

function updateProgress() {
  const totalChapters = chapters.length;
  const readChapters = readingStats.chaptersRead.size;
  const percentage = totalChapters > 0 ? (readChapters / totalChapters) * 100 : 0;
  
  if (elements.progressFill) {
    elements.progressFill.style.width = `${percentage}%`;
  }
  
  if (elements.progressText) {
    elements.progressText.textContent = `${Math.round(percentage)}% Complete`;
  }
  
  if (elements.chaptersRead) {
    elements.chaptersRead.textContent = readChapters;
  }
  
  // Save progress
  saveReadingProgress();
}

function markChapterAsRead(chapterId) {
  if (!readingStats.chaptersRead.has(chapterId)) {
    readingStats.chaptersRead.add(chapterId);
    
    // Update TOC to show completion
    const tocLink = elements.toc.querySelector(`a[data-id="${chapterId}"]`);
    if (tocLink) {
      tocLink.classList.add('completed');
    }
    
    // Add completion animation
    setTimeout(() => {
      if (tocLink) {
        tocLink.style.animation = 'completionPulse 0.6s ease-out';
      }
    }, 500);
  }
}

function saveReadingProgress() {
  const progressData = {
    chaptersRead: Array.from(readingStats.chaptersRead),
    totalReadingTime: readingStats.totalReadingTime,
    lastChapter: currentChapterIndex,
    timestamp: Date.now()
  };
  
  localStorage.setItem('readingProgress', JSON.stringify(progressData));
}

function loadReadingProgress() {
  const saved = localStorage.getItem('readingProgress');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      readingStats.chaptersRead = new Set(data.chaptersRead || []);
      readingStats.totalReadingTime = data.totalReadingTime || 0;
      
      // Update display
      updateReadingTimeDisplay();
    } catch (error) {
      console.error('Error loading reading progress:', error);
    }
  }
}

function startReadingTimer() {
  setInterval(() => {
    readingStats.totalReadingTime += 1; // seconds
    updateReadingTimeDisplay();
    
    // Save progress every minute
    if (readingStats.totalReadingTime % 60 === 0) {
      saveReadingProgress();
    }
  }, 1000);
}

function updateReadingTimeDisplay() {
  if (elements.readingTime) {
    const minutes = Math.floor(readingStats.totalReadingTime / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      elements.readingTime.textContent = `${hours}h ${minutes % 60}m`;
    } else {
      elements.readingTime.textContent = `${minutes}m`;
    }
  }
}

function setupReadingModeEnhancements() {
  // Add reading mode specific styles and functionality
  if (elements.readingMode) {
    elements.readingMode.addEventListener('click', (e) => {
      if (e.target === elements.readingMode) {
        closeReadingMode();
      }
    });
  }
}

function toggleReadingMode() {
  if (!elements.readingMode || !elements.readingContent) return;
  
  // Copy current chapter content to reading mode
  const currentContent = elements.content.querySelector('.chapter-content');
  if (currentContent) {
    elements.readingContent.innerHTML = currentContent.outerHTML;
    elements.readingMode.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Apply reading mode enhancements
    applyReadingModeEnhancements();
  }
}

function applyReadingModeEnhancements() {
  const readingContent = elements.readingContent;
  if (!readingContent) return;
  
  // Add enhanced typography classes
  readingContent.classList.add('reading-mode-enhanced');
  
  // Focus on the content
  readingContent.scrollTo(0, 0);
  readingContent.focus();
}

function closeReadingMode() {
  if (elements.readingMode) {
    elements.readingMode.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function loadReadingPreferences() {
  const saved = localStorage.getItem('readingPreferences');
  if (saved) {
    try {
      readingPreferences = { ...readingPreferences, ...JSON.parse(saved) };
      applyReadingPreferences();
    } catch (error) {
      console.error('Error loading reading preferences:', error);
    }
  }
}

function saveReadingPreferences() {
  localStorage.setItem('readingPreferences', JSON.stringify(readingPreferences));
}

function applyReadingPreferences() {
  const contentArea = elements.content;
  if (!contentArea) return;
  
  // Remove existing preference classes
  contentArea.classList.remove('font-small', 'font-large', 'line-height-tight', 'line-height-loose');
  
  // Apply font size
  if (readingPreferences.fontSize === 'small') {
    contentArea.classList.add('font-small');
  } else if (readingPreferences.fontSize === 'large') {
    contentArea.classList.add('font-large');
  }
  
  // Apply line height
  if (readingPreferences.lineHeight === 'tight') {
    contentArea.classList.add('line-height-tight');
  } else if (readingPreferences.lineHeight === 'loose') {
    contentArea.classList.add('line-height-loose');
  }
}

function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const animateElements = elements.content.querySelectorAll('h2, h3, p, blockquote, .exercise-section');
  animateElements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

function handleScroll() {
  const scrolled = elements.content.scrollTop;
  const maxScroll = elements.content.scrollHeight - elements.content.clientHeight;
  const percentage = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
  
  updateScrollProgress(percentage);
}

function updateScrollProgress(percentage) {
  // Update reading progress indicator if needed
  // This could be used for within-chapter progress
}

function toggleSidebar() {
  if (!elements.sidebar) return;
  
  const isOpen = elements.sidebar.classList.contains('open');
  
  if (isOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

function openSidebar() {
  elements.sidebar?.classList.add('open');
  document.querySelector('.sidebar-overlay')?.classList.add('active');
  elements.menuToggle?.classList.add('active');
}

function closeSidebar() {
  elements.sidebar?.classList.remove('open');
  document.querySelector('.sidebar-overlay')?.classList.remove('active');
  elements.menuToggle?.classList.remove('active');
}

function handleResize() {
  // Close sidebar on larger screens
  if (window.innerWidth > 1024) {
    closeSidebar();
  }
}

function handleTocClick(e) {
  e.preventDefault();
  
  if (e.target.tagName === 'A' && e.target.dataset.index) {
    const index = parseInt(e.target.dataset.index);
    currentChapterIndex = index;
    loadChapter(index);
    updateNavigationButtons();
    
    // Close sidebar on mobile
    if (window.innerWidth <= 1024) {
      closeSidebar();
    }
  }
}

function handleHashChange() {
  const hash = window.location.hash.substring(1);
  if (hash) {
    const chapterIndex = chapters.findIndex(ch => ch.id === hash);
    if (chapterIndex >= 0 && chapterIndex !== currentChapterIndex) {
      currentChapterIndex = chapterIndex;
      loadChapter(chapterIndex);
      updateNavigationButtons();
    }
  }
}

function handleKeyboardShortcuts(e) {
  // Don't trigger shortcuts when typing in inputs
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return;
  }
  
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      navigateToPrevious();
      break;
    case 'ArrowRight':
      e.preventDefault();
      navigateToNext();
      break;
    case 't':
    case 'T':
      e.preventDefault();
      toggleTheme();
      break;
    case 'm':
    case 'M':
      e.preventDefault();
      toggleSidebar();
      break;
    case 'f':
    case 'F':
      e.preventDefault();
      toggleReadingMode();
      break;
    case 'Escape':
      e.preventDefault();
      closeReadingMode();
      closeSidebar();
      break;
    case '/':
      e.preventDefault();
      elements.searchBar?.focus();
      break;
    case 'r':
    case 'R':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        refreshCurrentChapter();
      }
      break;
  }
}

function updateReadingProgress() {
  // This function can be used to track reading progress within a chapter
  // For now, we'll just mark the chapter as read when scrolled to bottom
  const scrolled = elements.content.scrollTop;
  const maxScroll = elements.content.scrollHeight - elements.content.clientHeight;
  
  if (maxScroll > 0 && scrolled / maxScroll > 0.9) {
    const currentChapter = chapters[currentChapterIndex];
    if (currentChapter) {
      markChapterAsRead(currentChapter.id);
    }
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function lazyLoadImages() {
  const images = elements.content.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ===== CONTENT REFRESH FUNCTIONS =====
function handleRefreshClick() {
  const refreshButton = document.getElementById('refresh-content');
  if (refreshButton) {
    refreshButton.classList.add('refreshing');
    
    // Remove animation after refresh completes
    setTimeout(() => {
      refreshButton.classList.remove('refreshing');
    }, 1000);
  }
  
  refreshCurrentChapter();
}

function refreshCurrentChapter() {
  console.log('Refreshing current chapter...');
  
  // Clear the current chapter's cached content
  if (chapters[currentChapterIndex]) {
    chapters[currentChapterIndex].content = null;
  }
  
  // Show loading state
  elements.content.innerHTML = `
    <div class="loading-state">
      <h2>Refreshing chapter...</h2>
      <p>Loading latest content from files.</p>
    </div>
  `;
  
  // Reload the chapter with force refresh
  loadChapter(currentChapterIndex, true);
}

function refreshAllChapters() {
  console.log('Clearing all cached content...');
  
  // Clear all cached content
  chapters.forEach(chapter => {
    chapter.content = null;
  });
  
  // Reload current chapter
  refreshCurrentChapter();
}

function setupSidebarResizing() {
  const sidebar = elements.sidebar;
  const resizer = document.querySelector('.sidebar-resizer');
  const mainContent = document.querySelector('.main-content');
  
  if (!sidebar || !resizer || !mainContent) return;
  
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;
  
  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
    
    sidebar.classList.add('resizing');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    
    const width = startWidth + e.clientX - startX;
    const minWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-min-width'));
    const maxWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-max-width'));
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width));
    
    sidebar.style.width = `${clampedWidth}px`;
    mainContent.style.marginLeft = `${clampedWidth}px`;
    
    // Update CSS custom property
    document.documentElement.style.setProperty('--sidebar-width', `${clampedWidth}px`);
  });
  
  document.addEventListener('mouseup', () => {
    if (!isResizing) return;
    
    isResizing = false;
    sidebar.classList.remove('resizing');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // Save the sidebar width to localStorage
    const currentWidth = sidebar.style.width;
    if (currentWidth) {
      localStorage.setItem('sidebarWidth', currentWidth);
    }
  });
  
  // Restore saved width on load
  const savedWidth = localStorage.getItem('sidebarWidth');
  if (savedWidth) {
    sidebar.style.width = savedWidth;
    mainContent.style.marginLeft = savedWidth;
    document.documentElement.style.setProperty('--sidebar-width', savedWidth);
  }
}

 