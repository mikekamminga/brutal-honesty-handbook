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
}

// ===== BOOK CONTENT LOADING =====
async function loadBookContent() {
  try {
    const response = await fetch('book.json');
    chapters = await response.json();
    
    generateTableOfContents();
    
    // Load initial chapter
    const initialChapterId = window.location.hash.substring(1) || chapters[0]?.id;
    const initialIndex = chapters.findIndex(chapter => chapter.id === initialChapterId);
    currentChapterIndex = initialIndex >= 0 ? initialIndex : 0;
    
    loadChapter(currentChapterIndex);
    updateNavigationButtons();
    
  } catch (error) {
    console.error('Failed to load book content:', error);
    elements.content.innerHTML = `
      <div class="error-message">
        <h2>Unable to load content</h2>
        <p>Please check your connection and try again.</p>
      </div>
    `;
  }
}

function generateTableOfContents() {
  if (!elements.toc) return;
  
  const ul = document.createElement('ul');
  
  chapters.forEach((chapter, index) => {
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
    .replace(/^##\s*/, '')
    .replace(/^CHAPTER \d+:\s*/, '')
    .replace(/^PROLOGUE:\s*/, 'Prologue: ')
    .replace(/^INTRODUCTION$/, 'Introduction');
}

// ===== ENHANCED CONTENT PROCESSING =====
function processChapterContent(rawContent) {
  // Decode HTML entities
  let content = rawContent
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\\/g, '');

  // Remove redundant h3 tags that duplicate the title
  content = content.replace(/<p><h3>[^<]*<\/h3><\/p>/g, '');
  
  // Convert content to proper structure
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  
  // Process the content to improve formatting
  const processedContent = document.createElement('div');
  
  // Extract paragraphs and other elements
  const elements = Array.from(doc.body.children);
  
  elements.forEach(element => {
    if (element.tagName === 'P') {
      const text = element.innerHTML;
      
      // Check if this is a heading (starts with ###)
      if (text.startsWith('###')) {
        const heading = document.createElement('h3');
        heading.textContent = text.replace(/^###\s*/, '');
        processedContent.appendChild(heading);
      }
      // Check if this is a subheading or emphasis
      else if (text.includes('<strong>') && text.match(/^<strong>[^<]+<\/strong>$/)) {
        const subheading = document.createElement('h4');
        subheading.innerHTML = text;
        processedContent.appendChild(subheading);
      }
      // Check if this is a list item (starts with *)
      else if (text.trim().startsWith('*')) {
        // Find or create current list
        let currentList = processedContent.lastElementChild;
        if (!currentList || currentList.tagName !== 'UL') {
          currentList = document.createElement('ul');
          processedContent.appendChild(currentList);
        }
        
        const listItem = document.createElement('li');
        listItem.innerHTML = text.replace(/^\s*\*\s*/, '');
        currentList.appendChild(listItem);
      }
      // Check if this is a numbered list item
      else if (text.match(/^\d+\.\s/)) {
        // Find or create current list
        let currentList = processedContent.lastElementChild;
        if (!currentList || currentList.tagName !== 'OL') {
          currentList = document.createElement('ol');
          processedContent.appendChild(currentList);
        }
        
        const listItem = document.createElement('li');
        listItem.innerHTML = text.replace(/^\d+\.\s*/, '');
        currentList.appendChild(listItem);
      }
      // Regular paragraph
      else if (text.trim()) {
        const paragraph = document.createElement('p');
        paragraph.innerHTML = text;
        processedContent.appendChild(paragraph);
      }
    }
    // Handle blockquotes
    else if (element.tagName === 'BLOCKQUOTE') {
      processedContent.appendChild(element.cloneNode(true));
    }
  });
  
  // Enhanced text processing with better typography
  const finalContent = processedContent.innerHTML
    // Convert *text* to <em>text</em>
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Convert **text** to <strong>text</strong>
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Convert "text" to proper quotes with smart typography
    .replace(/\"([^"]+)\"/g, '"$1"')
    // Add proper spacing for dialogue
    .replace(/\. \"/g, '. "')
    .replace(/\? \"/g, '? "')
    .replace(/\! \"/g, '! "')
    // Add non-breaking spaces for better typography
    .replace(/\s—\s/g, ' — ')
    .replace(/\s--\s/g, ' — ')
    // Fix common typography issues
    .replace(/\.\.\./g, '…')
          .replace(/'/g, '\'')
      .replace(/'/g, '\'');
  
  return finalContent;
}

// ===== CHAPTER NAVIGATION =====
function loadChapter(index) {
  if (index < 0 || index >= chapters.length) return;
  
  const chapter = chapters[index];
  currentChapterIndex = index;
  
  // Update content with enhanced animation
  elements.content.style.opacity = '0';
  elements.content.style.transform = 'translateY(30px)';
  
  setTimeout(() => {
    const processedContent = processChapterContent(chapter.content);
    const chapterTitle = cleanChapterTitle(chapter.title);
    const readingTime = estimateReadingTime(processedContent);
    
    elements.content.innerHTML = `
      <article class="chapter-content fade-in">
        <header class="chapter-header">
          <h1>${chapterTitle}</h1>
          <div class="chapter-meta">
            <span class="chapter-number">
              <span class="meta-icon">📖</span>
              Chapter ${index + 1} of ${chapters.length}
            </span>
            <span class="reading-time">
              <span class="meta-icon">⏱️</span>
              ${readingTime} min read
            </span>
          </div>
        </header>
        <div class="chapter-body">
          ${processedContent}
        </div>
      </article>
    `;
    
    // Animate content in with stagger
    requestAnimationFrame(() => {
      elements.content.style.opacity = '1';
      elements.content.style.transform = 'translateY(0)';
    });
    
    // Setup scroll animations for new content
    setTimeout(() => setupScrollAnimations(), 100);
    
    // Update UI
    updateActiveChapter(chapter.id);
    updateNavigationButtons();
    updateProgress();
    
    // Track reading
    markChapterAsRead(chapter.id);
    
    // Update URL
    window.history.replaceState(null, null, `#${chapter.id}`);
    
    // Smooth scroll to top
    elements.content.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Apply reading preferences
    applyReadingPreferences();
    
  }, 200);
}

function estimateReadingTime(content) {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function navigateToPrevious() {
  if (currentChapterIndex > 0) {
    loadChapter(currentChapterIndex - 1);
  }
}

function navigateToNext() {
  if (currentChapterIndex < chapters.length - 1) {
    loadChapter(currentChapterIndex + 1);
  }
}

function updateNavigationButtons() {
  if (elements.prevButton) {
    elements.prevButton.disabled = currentChapterIndex === 0;
  }
  
  if (elements.nextButton) {
    elements.nextButton.disabled = currentChapterIndex === chapters.length - 1;
  }
}

function updateActiveChapter(chapterId) {
  const tocLinks = elements.toc?.querySelectorAll('a');
  tocLinks?.forEach(link => {
    if (link.dataset.id === chapterId) {
      link.classList.add('active');
      // Scroll active chapter into view in sidebar
      link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      link.classList.remove('active');
    }
  });
}

// ===== SEARCH FUNCTIONALITY =====
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const tocLinks = elements.toc?.querySelectorAll('li');
  
  tocLinks?.forEach(li => {
    const link = li.querySelector('a');
    const title = link.textContent.toLowerCase();
    
    if (title.includes(searchTerm)) {
      li.style.display = 'block';
      li.classList.add('slide-in-left');
    } else {
      li.style.display = 'none';
      li.classList.remove('slide-in-left');
    }
  });
}

// ===== THEME MANAGEMENT =====
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  readingPreferences.theme = savedTheme;
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  readingPreferences.theme = newTheme;
  updateThemeIcon(newTheme);
  saveReadingPreferences();
}

function updateThemeIcon(theme) {
  const icon = elements.themeToggle?.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// ===== READING PROGRESS =====
function updateProgress() {
  const totalChapters = chapters.length;
  const completedChapters = readingStats.chaptersRead.size;
  const progressPercentage = Math.round((completedChapters / totalChapters) * 100);
  
  if (elements.progressFill) {
    elements.progressFill.style.width = `${progressPercentage}%`;
  }
  
  if (elements.progressText) {
    elements.progressText.textContent = `${progressPercentage}% Complete`;
  }
  
  if (elements.chaptersRead) {
    elements.chaptersRead.textContent = completedChapters;
  }
}

function markChapterAsRead(chapterId) {
  readingStats.chaptersRead.add(chapterId);
  saveReadingProgress();
  updateProgress();
  
  // Update TOC visual with animation
  const tocLink = elements.toc?.querySelector(`[data-id="${chapterId}"]`);
  if (tocLink && !tocLink.classList.contains('completed')) {
    tocLink.classList.add('completed');
    // Add a subtle animation
    tocLink.style.animation = 'completionPulse 0.6s ease-out';
    setTimeout(() => {
      tocLink.style.animation = '';
    }, 600);
  }
}

function saveReadingProgress() {
  const progressData = {
    chaptersRead: Array.from(readingStats.chaptersRead),
    totalReadingTime: readingStats.totalReadingTime,
    lastUpdated: Date.now()
  };
  
  localStorage.setItem('reading-progress', JSON.stringify(progressData));
}

function loadReadingProgress() {
  const saved = localStorage.getItem('reading-progress');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      readingStats.chaptersRead = new Set(data.chaptersRead || []);
      readingStats.totalReadingTime = data.totalReadingTime || 0;
      updateProgress();
    } catch (error) {
      console.error('Failed to load reading progress:', error);
    }
  }
}

// ===== READING TIMER =====
function startReadingTimer() {
  setInterval(() => {
    readingStats.totalReadingTime += 1;
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

// ===== ENHANCED READING MODE =====
function setupReadingModeEnhancements() {
  // Add CSS for completion animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes completionPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); background-color: rgba(16, 185, 129, 0.1); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

function toggleReadingMode() {
  if (elements.readingMode) {
    elements.readingMode.classList.add('active');
    
    // Copy current chapter content with enhanced formatting
    const currentContent = elements.content.querySelector('.chapter-content');
    if (currentContent && elements.readingContent) {
      elements.readingContent.innerHTML = currentContent.innerHTML;
      
      // Apply reading mode specific enhancements
      applyReadingModeEnhancements();
    }
    
    document.body.style.overflow = 'hidden';
  }
}

function applyReadingModeEnhancements() {
  if (!elements.readingContent) return;
  
  // Add reading mode class for specific styling
  elements.readingContent.classList.add('reading-mode-enhanced');
  
  // Enhance typography for reading mode
  const style = elements.readingContent.style;
  style.fontSize = '1.1em';
  style.lineHeight = '1.7';
  style.maxWidth = '65ch';
  style.margin = '0 auto';
}

function closeReadingMode() {
  if (elements.readingMode) {
    elements.readingMode.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clean up reading mode enhancements
    if (elements.readingContent) {
      elements.readingContent.classList.remove('reading-mode-enhanced');
      elements.readingContent.style.cssText = '';
    }
  }
}

// ===== READING PREFERENCES =====
function loadReadingPreferences() {
  const saved = localStorage.getItem('reading-preferences');
  if (saved) {
    try {
      readingPreferences = { ...readingPreferences, ...JSON.parse(saved) };
      applyReadingPreferences();
    } catch (error) {
      console.error('Failed to load reading preferences:', error);
    }
  }
}

function saveReadingPreferences() {
  localStorage.setItem('reading-preferences', JSON.stringify(readingPreferences));
}

function applyReadingPreferences() {
  const contentArea = elements.content;
  if (!contentArea) return;
  
  // Apply font size preference
  contentArea.classList.remove('font-small', 'font-large');
  if (readingPreferences.fontSize === 'small') {
    contentArea.classList.add('font-small');
  } else if (readingPreferences.fontSize === 'large') {
    contentArea.classList.add('font-large');
  }
  
  // Apply line height preference
  contentArea.classList.remove('line-height-tight', 'line-height-loose');
  if (readingPreferences.lineHeight === 'tight') {
    contentArea.classList.add('line-height-tight');
  } else if (readingPreferences.lineHeight === 'loose') {
    contentArea.classList.add('line-height-loose');
  }
}

// ===== SCROLL ANIMATIONS =====
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe all content elements with staggered delays
  const elementsToAnimate = document.querySelectorAll('.chapter-body h1, .chapter-body h2, .chapter-body h3, .chapter-body h4, .chapter-body p, .chapter-body blockquote, .chapter-body li');
  elementsToAnimate.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.animationDelay = `${index * 50}ms`;
    observer.observe(el);
  });
}

function handleScroll() {
  // Add scroll-based enhancements
  const scrollTop = elements.content.scrollTop;
  const scrollHeight = elements.content.scrollHeight - elements.content.clientHeight;
  const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  
  // Update reading progress indicator
  updateScrollProgress(scrollPercentage);
  
  // Mark chapter as read when scrolled 80% through
  if (scrollPercentage > 80 && chapters[currentChapterIndex]) {
    markChapterAsRead(chapters[currentChapterIndex].id);
  }
}

function updateScrollProgress(percentage) {
  // Could add a reading progress indicator here if desired
  // For now, we'll use this for chapter completion tracking
}

// ===== MOBILE NAVIGATION =====
function toggleSidebar() {
  const sidebar = elements.sidebar;
  const overlay = document.querySelector('.sidebar-overlay');
  const menuToggle = elements.menuToggle;
  
  if (sidebar && overlay && menuToggle) {
    const isOpen = sidebar.classList.contains('open');
    
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

function openSidebar() {
  const sidebar = elements.sidebar;
  const overlay = document.querySelector('.sidebar-overlay');
  const menuToggle = elements.menuToggle;
  
  if (sidebar && overlay && menuToggle) {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    menuToggle.classList.add('active');
  }
}

function closeSidebar() {
  const sidebar = elements.sidebar;
  const overlay = document.querySelector('.sidebar-overlay');
  const menuToggle = elements.menuToggle;
  
  if (sidebar && overlay && menuToggle) {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    menuToggle.classList.remove('active');
  }
}

function handleResize() {
  // Close sidebar on desktop
  if (window.innerWidth > 1024) {
    closeSidebar();
  }
}

// ===== EVENT HANDLERS =====
function handleTocClick(e) {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    const index = parseInt(e.target.dataset.index);
    loadChapter(index);
    
    // Close sidebar on mobile
    if (window.innerWidth <= 1024) {
      closeSidebar();
    }
  }
}

function handleHashChange() {
  const chapterId = window.location.hash.substring(1);
  const index = chapters.findIndex(chapter => chapter.id === chapterId);
  if (index >= 0) {
    loadChapter(index);
  }
}

function handleKeyboardShortcuts(e) {
  // Only handle shortcuts when not typing in inputs
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
    case ' ':
      // Space bar for page down
      if (!elements.readingMode.classList.contains('active')) {
        e.preventDefault();
        elements.content.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
      }
      break;
  }
}

function updateReadingProgress() {
  // Update reading progress based on scroll position
  const scrollTop = elements.content.scrollTop;
  const scrollHeight = elements.content.scrollHeight - elements.content.clientHeight;
  const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  
  // Mark chapter as read when scrolled 80% through
  if (scrollPercentage > 80 && chapters[currentChapterIndex]) {
    markChapterAsRead(chapters[currentChapterIndex].id);
  }
}

// ===== UTILITY FUNCTIONS =====
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

// Debounced search
elements.searchBar?.addEventListener('input', debounce(handleSearch, 300));

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy load images if any
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages); 