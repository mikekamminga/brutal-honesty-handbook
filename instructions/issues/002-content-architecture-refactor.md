# Issue #002: Evaluate and Refactor Content Architecture

## Priority: High
## Estimated Time: 4-6 hours
## Labels: `architecture`, `content-management`, `developer-experience`

## Description
Evaluate the current architecture that uses a JSON file for content storage and replace it with a more maintainable, editor-friendly solution.

## Current State
- Content is stored in `book.json` with escaped HTML
- Content editing requires manual HTML escaping and JSON formatting
- No version control for content changes
- Difficult to collaborate on content with non-technical contributors
- Content and presentation are tightly coupled

## Problems with Current Approach
1. **Poor Editor Experience**: Writing in escaped HTML within JSON is cumbersome
2. **No Syntax Highlighting**: No markdown support for content creation
3. **Error Prone**: Manual escaping leads to formatting errors
4. **Hard to Review**: Diffs are unreadable due to escaped content
5. **No Content Validation**: No schema or validation for content structure
6. **Collaboration Issues**: Non-technical contributors can't easily edit content

## Proposed Solutions

### Option A: Markdown Files + Build Process
```
book/
├── chapters/
│   ├── 01-what-is-brutal-honesty.md
│   ├── 02-why-people-avoid-it.md
│   └── ...
├── metadata.yaml
└── build.js
```

**Pros**: 
- Easy to edit and review
- Great syntax highlighting
- Git-friendly diffs
- Industry standard

**Cons**: 
- Requires build step
- Need to handle frontmatter

### Option B: Headless CMS (Contentful/Strapi)
**Pros**: 
- Non-technical editor friendly
- Built-in validation
- API-driven
- Versioning support

**Cons**: 
- External dependency
- More complex setup
- Potential costs

### Option C: MDX Files
**Pros**: 
- Markdown + React components
- Very flexible
- Great developer experience

**Cons**: 
- More complex than plain markdown
- Requires React knowledge for advanced features

## Acceptance Criteria

### ✅ Content Storage
- [ ] Choose and implement new content architecture
- [ ] Migrate existing content from JSON to new format
- [ ] Ensure all formatting is preserved during migration
- [ ] Add content validation/schema

### ✅ Build Process
- [ ] Create build script to generate JSON from source format
- [ ] Integrate build process with deployment
- [ ] Add watch mode for development
- [ ] Ensure hot reloading works

### ✅ Developer Experience
- [ ] Add syntax highlighting for content files
- [ ] Create content editing guidelines
- [ ] Add linting for content files
- [ ] Create templates for new chapters

### ✅ Content Management
- [ ] Add frontmatter for chapter metadata
- [ ] Support for chapter ordering
- [ ] Handle special formatting (blockquotes, lists, etc.)
- [ ] Add support for content drafts/publishing states

## Technical Implementation

### Recommended: Markdown + Frontmatter
```markdown
---
title: "What is Brutal Honesty?"
chapter: 1
slug: "what-is-brutal-honesty"
readingTime: 5
status: "published"
lastModified: "2024-01-15"
---

# What is Brutal Honesty?

The phrase "brutal honesty" makes people flinch...
```

### Build Script Features
- Parse markdown files
- Extract frontmatter
- Convert to JSON format
- Validate content structure
- Generate table of contents
- Calculate reading times

### File Structure
```
content/
├── chapters/
│   ├── 00-introduction.md
│   ├── 01-what-is-brutal-honesty.md
│   └── ...
├── config.yaml
└── scripts/
    ├── build-content.js
    ├── validate-content.js
    └── dev-watch.js
```

## Migration Plan
1. **Phase 1**: Set up new content structure
2. **Phase 2**: Create migration script from JSON
3. **Phase 3**: Update application to use new build output
4. **Phase 4**: Remove old JSON files
5. **Phase 5**: Update documentation and workflows

## Testing Checklist
- [ ] All existing content displays correctly
- [ ] Chapter navigation works
- [ ] Reading time calculations are accurate
- [ ] Search functionality works with new content
- [ ] Build process is reliable and fast
- [ ] Content validation catches errors

## Related Issues
- Blocks content versioning (#003)
- Enables better content collaboration
- Improves content review process

## Notes
- Consider using existing tools like `gray-matter` for frontmatter parsing
- Ensure the solution works well with the deployment setup (#001)
- Plan for future content types (images, videos, interactive elements) 