# Issue #005: Update Book Title and Branding

## Priority: Medium
## Estimated Time: 1-2 hours
## Labels: `branding`, `content`, `ui-update`

## Description
Update the book title from "The Handbook of Brutal Honesty" to "The Original Field Guide for Brutal Honesty" by Mike Kamminga aka The Cult Leader, and ensure all branding elements reflect this change consistently.

## Current State
- Book title: "The Handbook of Brutal Honesty"
- No author attribution visible in UI
- Generic branding throughout the application
- Title appears in multiple locations (HTML title, sidebar header, navigation, etc.)

## New Branding Requirements

### Updated Title
**From**: "The Handbook of Brutal Honesty"  
**To**: "The Original Field Guide for Brutal Honesty"

### Author Attribution
**Author**: Mike Kamminga aka The Cult Leader

### Branding Considerations
- Maintain professional appearance while incorporating personality
- "The Cult Leader" should be presented tastefully (perhaps as subtitle or tagline)
- Consider how the longer title affects mobile layouts
- Ensure title hierarchy is clear and readable

## Acceptance Criteria

### ✅ Title Updates
- [ ] Update HTML document title in all pages
- [ ] Update sidebar header with new title
- [ ] Update any navigation breadcrumbs or references
- [ ] Update meta tags (title, description, og:title)
- [ ] Update any JSON/config files with book metadata

### ✅ Author Attribution
- [ ] Add author name to sidebar or header area
- [ ] Include author attribution in footer or about section
- [ ] Add author meta tags (author, og:author if applicable)
- [ ] Consider adding author bio or link

### ✅ Visual Design Updates
- [ ] Ensure new title fits well in current layout
- [ ] Adjust typography hierarchy if needed
- [ ] Update mobile responsive design for longer title
- [ ] Maintain visual balance and readability

### ✅ Content Updates
- [ ] Update any references to the book title within content
- [ ] Update book.json or content metadata
- [ ] Update README and documentation
- [ ] Update any generated content that includes the title

## Technical Implementation

### Files to Update

#### HTML Files
```html
<!-- Update document title -->
<title>The Original Field Guide for Brutal Honesty - Mike Kamminga</title>

<!-- Update meta tags -->
<meta name="description" content="The Original Field Guide for Brutal Honesty by Mike Kamminga aka The Cult Leader">
<meta property="og:title" content="The Original Field Guide for Brutal Honesty">
<meta property="og:description" content="A comprehensive guide to implementing brutal honesty in your life">
<meta name="author" content="Mike Kamminga">

<!-- Update sidebar header -->
<div class="sidebar-header">
  <h1>The Original Field Guide for Brutal Honesty</h1>
  <p class="author">by Mike Kamminga aka The Cult Leader</p>
</div>
```

#### CSS Considerations
```css
/* Ensure longer title fits on mobile */
.sidebar-header h1 {
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  line-height: 1.2;
  word-break: break-word;
}

.author {
  font-size: 0.9rem;
  opacity: 0.8;
  font-style: italic;
  margin-top: 0.5rem;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .sidebar-header h1 {
    font-size: 1.1rem;
  }
}
```

#### Content/Config Updates
```json
// book.json or metadata
{
  "title": "The Original Field Guide for Brutal Honesty",
  "subtitle": "A Comprehensive Guide to Implementing Honest Communication",
  "author": {
    "name": "Mike Kamminga",
    "alias": "The Cult Leader",
    "bio": "Author and communication expert..."
  },
  "version": "1.0.0",
  "description": "The Original Field Guide for Brutal Honesty by Mike Kamminga aka The Cult Leader"
}
```

### Design Options for Author Attribution

#### Option A: Subtitle in Header
```
The Original Field Guide for Brutal Honesty
by Mike Kamminga aka The Cult Leader
```

#### Option B: Separate Author Section
```
The Original Field Guide for Brutal Honesty
[search bar]
---
Author: Mike Kamminga aka The Cult Leader
```

#### Option C: Footer Attribution
```
[main content]
---
© 2024 Mike Kamminga aka The Cult Leader
```

## Responsive Design Considerations

### Mobile Layout
- Longer title may need to wrap on small screens
- Consider abbreviating to "Field Guide for Brutal Honesty" on very small screens
- Ensure author attribution doesn't clutter mobile interface

### Typography Hierarchy
- Main title should remain prominent
- Author attribution should be secondary but visible
- Maintain good contrast and readability

## Implementation Plan

### Phase 1: Core Updates (30 minutes)
1. Update HTML title and meta tags
2. Update sidebar header text
3. Test basic functionality

### Phase 2: Design Refinements (45 minutes)
1. Add author attribution styling
2. Adjust responsive design for new title length
3. Ensure visual hierarchy is maintained

### Phase 3: Content & Metadata (30 minutes)
1. Update book.json or content files
2. Update README and documentation
3. Update any configuration files

### Phase 4: Testing & Polish (15 minutes)
1. Test on various screen sizes
2. Check for text overflow issues
3. Verify all references are updated

## Testing Checklist

### Visual Testing
- [ ] Title displays correctly on desktop
- [ ] Title displays correctly on mobile
- [ ] Author attribution is visible and well-positioned
- [ ] No text overflow or layout breaking
- [ ] Typography hierarchy is maintained

### Functional Testing
- [ ] Page titles update correctly in browser tabs
- [ ] Meta tags are properly set for sharing
- [ ] Search functionality still works
- [ ] Navigation remains functional

### Content Testing
- [ ] All references to old title are updated
- [ ] Author information is consistent across the site
- [ ] No broken links or references

## Related Issues
- May affect deployment configuration (#001)
- Should be included in content versioning (#003)
- Part of overall UI improvements (#004)

## Notes
- Consider adding a favicon that reflects the new branding
- Think about future merchandising or promotional materials
- "The Cult Leader" alias adds personality but should be presented professionally
- Consider adding social media meta tags with new branding 