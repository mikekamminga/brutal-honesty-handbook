document.addEventListener('DOMContentLoaded', () => {
    const tocContainer = document.getElementById('toc');
    const contentContainer = document.getElementById('content');
    const searchBar = document.getElementById('search-bar');

    let chapters = [];
    let tocLinks = [];

    // Fetch and process book content
    fetch('book.json')
        .then(response => response.json())
        .then(data => {
            chapters = data;
            generateToc(chapters);
            // Load content based on hash or default to first chapter
            const initialChapterId = window.location.hash.substring(1) || chapters[0].id;
            loadChapter(initialChapterId);
        })
        .catch(error => {
            console.error("Failed to load book content:", error);
            contentContainer.innerHTML = `<p>Error: Could not load book content. Please check the console.</p>`;
        });

    // Generate Table of Contents
    function generateToc(chaptersData) {
        const ul = document.createElement('ul');
        chaptersData.forEach(chapter => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${chapter.id}`;
            a.textContent = chapter.title.replace(/CHAPTER \d+: /, ''); // Clean up title for TOC
            a.dataset.id = chapter.id;
            li.appendChild(a);
            ul.appendChild(li);
        });
        tocContainer.appendChild(ul);
        tocLinks = Array.from(tocContainer.querySelectorAll('a'));
    }

    // Load chapter content into the main area
    function loadChapter(id) {
        const chapter = chapters.find(c => c.id === id);
        if (chapter) {
            // Create a new container for the content to help re-trigger animations
            const chapterContentEl = document.createElement('div');
            chapterContentEl.innerHTML = chapter.content;

            // Clear old content and append the new
            contentContainer.innerHTML = '';
            contentContainer.appendChild(chapterContentEl);
            
            updateActiveLink(id);
            setupScrollAnimations(chapterContentEl);

            contentContainer.scrollTop = 0; // Scroll to top of content
            window.location.hash = id;
        }
    }

    // Set up scroll animations for elements in a container
    function setupScrollAnimations(container) {
        const elementsToAnimate = container.querySelectorAll('h2, h3, p, blockquote, li');

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elementsToAnimate.forEach(el => {
            el.classList.add('reveal-on-scroll');
            observer.observe(el);
        });
    }

    // Update active state in TOC
    function updateActiveLink(activeId) {
        tocLinks.forEach(link => {
            if (link.dataset.id === activeId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Handle clicks on TOC links
    tocContainer.addEventListener('click', e => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const chapterId = e.target.dataset.id;
            loadChapter(chapterId);
        }
    });
    
    // Handle search/filter functionality
    searchBar.addEventListener('input', e => {
        const searchTerm = e.target.value.toLowerCase();
        tocLinks.forEach(link => {
            const title = link.textContent.toLowerCase();
            const parentLi = link.parentElement;
            if (title.includes(searchTerm)) {
                parentLi.style.display = 'block';
            } else {
                parentLi.style.display = 'none';
            }
        });
    });

    // Handle clicks for interactive elements
    contentContainer.addEventListener('click', e => {
        const lieElement = e.target.closest('.lie');
        if (lieElement) {
            const container = lieElement.closest('.interactive-lie');
            if (container) {
                container.classList.add('is-revealed');
            }
        }
    });

    // Listen for hash changes to support back/forward buttons
    window.addEventListener('hashchange', () => {
        const chapterId = window.location.hash.substring(1);
        if (chapterId) {
            loadChapter(chapterId);
        }
    });

    const filterTOC = (query) => {
        tocLinks.forEach(link => {
            const title = link.textContent.toLowerCase();
            const parentLi = link.parentElement;
            if (title.includes(query)) {
                parentLi.style.display = 'block';
            } else {
                parentLi.style.display = 'none';
            }
        });
    };
}); 