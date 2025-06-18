#!/bin/bash

# A dependency-free script to create book.json from markdown files.
# This script will now also wrap the "Instead of/Try" examples in 
# Chapter 5 with special divs for interactivity.

set -e

BOOK_DIR="book"
PROTOTYPE_DIR="prototype"
OUTPUT_JSON="$PROTOTYPE_DIR/book.json"

# Start JSON array
echo "[" > "$OUTPUT_JSON"

CHAPTER_FILES=$(find "$BOOK_DIR" -name '[0-9][0-9]_*.md' | sort)
FIRST=true

for file in $CHAPTER_FILES; do
    if [ "$FIRST" = false ]; then
        echo "," >> "$OUTPUT_JSON"
    fi
    FIRST=false

    ID=$(basename "$file" .md)
    TITLE_MARKDOWN=$(head -n 1 "$file")
    TITLE=$(echo "$TITLE_MARKDOWN" | sed 's/^# //' | sed 's/"/\\"/g')

    # This is a multi-stage pipeline to convert Markdown to a single-line, JSON-escaped HTML string.
    # 1. Basic Markdown to HTML conversion (sed for headlines, strong, code; awk for lists).
    # 2. If it's chapter 5, the awk script for interactive divs is run on the HTML.
    # 3. The final HTML is escaped for JSON and newlines are removed.
    HTML_CONTENT=$(cat "$file" | \
        sed -e 's~^# \(.*\)~<h2>\1</h2>~' \
            -e 's~^## \(.*\)~<h3>\1</h3>~' \
            -e 's~^\> \(.*\)~<blockquote><p>\1</p></blockquote>~' \
            -e 's~\*\*\(.*\)\*\*~<strong>\1</strong>~g' \
            -e 's~`\(.*\)`~<code>\1</code>~g' | \
        awk '
            function close_ul() { if (in_ul) { print "</ul>"; in_ul = 0 } }
            /^- / { 
                if (!in_ul) { print "<ul>"; in_ul = 1 }
                sub(/^- /, "<li>");
                print $0 "</li>";
                next
            }
            {
                close_ul()
                if (length($0) > 0) { print "<p>" $0 "</p>" }
            }
            END { close_ul() }
        ')

    # If this is chapter 5, apply special interactive formatting
    if [[ "$file" == *05_the_polite_lie_trap.md ]]; then
        HTML_CONTENT=$(echo "$HTML_CONTENT" | awk '
            BEGIN { lie_buffer = "" }
            /<p><strong>Instead of:/ {
                lie_buffer = $0;
                next;
            }
            /<p><strong>Try:/ {
                if (lie_buffer != "") {
                    sub(/<p>/, "", lie_buffer);
                    sub(/<\/p>/, "", lie_buffer);
                    sub(/<p>/, "", $0);
                    sub(/<\/p>/, "", $0);
                    print "<div class=\"interactive-lie\"><div class=\"lie\">" lie_buffer "</div><div class=\"truth\">" $0 "</div></div>";
                    lie_buffer = "";
                } else { print $0; }
                next;
            }
            { if (lie_buffer != "") { print lie_buffer; lie_buffer=""; } print $0; }
        ')
    fi
    
    # Escape for JSON and remove newlines
    JSON_ESCAPED_CONTENT=$(echo "$HTML_CONTENT" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\//\\\//g' | tr -d '\n')

    # Write object to file
    cat <<EOF >> "$OUTPUT_JSON"
{
  "id": "$ID",
  "title": "$TITLE",
  "content": "$JSON_ESCAPED_CONTENT"
}
EOF

done

# Close JSON array
echo "]" >> "$OUTPUT_JSON"

echo "✅ Successfully created $OUTPUT_JSON" 