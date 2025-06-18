# Issue #003: Implement Content Versioning and Changelog

## Priority: Medium
## Estimated Time: 3-4 hours
## Labels: `content-management`, `versioning`, `user-experience`

## Description
Implement a versioning system for the book content with an easy-to-read changelog, allowing readers to track updates and see what's changed since their last read.

## Current State
- Book content is in draft/progress state
- No versioning system exists
- No way for readers to track content changes
- No changelog or update notifications

## User Stories
- **As a reader** who has already read the book, I want to see what has changed so I can catch up on new content
- **As a returning reader**, I want to know which chapters have been updated since my last visit
- **As a content creator**, I want to track and communicate content changes effectively
- **As a collaborator**, I want to understand the evolution of the content

## Acceptance Criteria

### ✅ Versioning System
- [ ] Implement semantic versioning for book content (e.g., v1.2.3)
- [ ] Track version at chapter level and book level
- [ ] Store version history with timestamps
- [ ] Add version metadata to content files

### ✅ Changelog Generation
- [ ] Create human-readable changelog
- [ ] Categorize changes (Added, Changed, Fixed, Removed)
- [ ] Link changelog entries to specific chapters
- [ ] Show date and version for each change

### ✅ Reader Experience
- [ ] Display current book version in UI
- [ ] Show "What's New" section for returning readers
- [ ] Highlight updated chapters in navigation
- [ ] Provide "since last visit" functionality

### ✅ Content Management
- [ ] Add change tracking to content workflow
- [ ] Create templates for changelog entries
- [ ] Integrate with content build process
- [ ] Validate changelog format

## Technical Implementation

### Version Schema
```yaml
# book-config.yaml
version: "1.2.0"
lastUpdated: "2024-01-15"
status: "draft" # draft, beta, stable
changelog:
  - version: "1.2.0"
    date: "2024-01-15"
    changes:
      added:
        - "New chapter: Building an Honest Life"
        - "Interactive exercises in Chapter 3"
      changed:
        - "Improved examples in Chapter 5"
        - "Restructured Chapter 2 for better flow"
      fixed:
        - "Typos in Chapter 1"
```

### Chapter-Level Versioning
```markdown
---
title: "What is Brutal Honesty?"
chapter: 1
version: "1.1.0"
lastModified: "2024-01-10"
changelog:
  - version: "1.1.0"
    date: "2024-01-10"
    summary: "Added new examples and improved clarity"
  - version: "1.0.0"
    date: "2024-01-01"
    summary: "Initial version"
---
```

### UI Components
1. **Version Badge**: Display current version in header
2. **What's New Modal**: Show recent changes to returning users
3. **Chapter Update Indicators**: Visual markers for updated content
4. **Changelog Page**: Dedicated page for full change history
5. **Version Comparison**: Show differences between versions

### File Structure
```
content/
├── changelog.md
├── versions/
│   ├── v1.0.0.json
│   ├── v1.1.0.json
│   └── current.json
└── chapters/
    └── [chapter-files-with-version-metadata]
```

## Changelog Format

### Public Changelog (for readers)
```markdown
# Changelog

## [1.2.0] - 2024-01-15

### Added
- **New Chapter**: "Building an Honest Life" - A comprehensive guide to implementing brutal honesty in daily life
- **Interactive Exercises**: Added practical exercises to Chapter 3: "Starting with Yourself"

### Changed  
- **Chapter 5**: Improved real-world examples in "The Polite Lie Trap"
- **Chapter 2**: Restructured content flow for better readability

### Fixed
- Corrected typos and grammar issues throughout Chapter 1
- Fixed formatting issues in blockquotes

## [1.1.0] - 2024-01-10
...
```

### Technical Changelog (for developers)
```markdown
# Technical Changelog

## [1.2.0] - 2024-01-15

### Content Changes
- `chapters/11-building-an-honest-life.md`: New chapter added
- `chapters/03-starting-with-yourself.md`: Added exercise sections
- `chapters/05-the-polite-lie-trap.md`: Updated examples section

### Metadata Changes
- Updated reading time estimates
- Added new tags: "exercises", "practical-guide"
```

## User Experience Features

### Returning Reader Experience
1. **Last Visit Tracking**: Store timestamp of user's last visit
2. **Update Notifications**: Show badge/indicator for new content
3. **Smart Highlighting**: Highlight chapters updated since last visit
4. **Quick Catch-up**: "Show me what's new" feature

### Reading Progress Integration
- Track which version user read each chapter in
- Show if user needs to re-read updated chapters
- Preserve reading progress across versions

## Implementation Plan

### Phase 1: Version Infrastructure
- Set up version schema and metadata
- Create version tracking utilities
- Implement changelog parsing

### Phase 2: Content Integration
- Add version metadata to existing content
- Create initial changelog
- Integrate with build process

### Phase 3: UI Implementation
- Add version display to interface
- Create changelog page
- Implement update indicators

### Phase 4: Reader Experience
- Add "What's New" functionality
- Implement last visit tracking
- Create update notifications

## Testing Checklist
- [ ] Version numbers increment correctly
- [ ] Changelog generates properly from metadata
- [ ] Update indicators show for modified content
- [ ] Last visit tracking works across sessions
- [ ] Version comparison shows accurate differences
- [ ] Mobile experience for changelog is optimal

## Related Issues
- Depends on content architecture refactor (#002)
- Enhances user experience improvements (#004)
- Supports collaborative content development

## Notes
- Consider using conventional commits for automatic changelog generation
- Ensure version tracking doesn't impact performance
- Plan for major version changes (breaking changes in content structure)
- Consider RSS feed for changelog updates 