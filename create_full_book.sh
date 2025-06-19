#!/bin/bash

# This script compiles the chapters listed in book/index.md into a single markdown file.

set -e

BOOK_DIR="book"
INDEX_FILE="$BOOK_DIR/index.md"
OUTPUT_FILE="$BOOK_DIR/fullbook.md"

# Ensure the book directory exists
if [ ! -d "$BOOK_DIR" ]; then
  echo "Error: Directory '$BOOK_DIR' not found."
  exit 1
fi

# Ensure the index file exists
if [ ! -f "$INDEX_FILE" ]; then
  echo "Error: Index file '$INDEX_FILE' not found."
  exit 1
fi

# Create or clear the output file
> "$OUTPUT_FILE"

echo "Creating $OUTPUT_FILE..."

# Extract filenames from the index.md file and process them
# This looks for lines like: * [Title](filename.md)
FILES=$(grep -o '\[.*\](.*\.md)' "$INDEX_FILE" | sed 's/\[.*\](\(.*\))/\1/')

for FILE in $FILES; do
  CHAPTER_PATH="$BOOK_DIR/$FILE"
  if [ -f "$CHAPTER_PATH" ]; then
    echo "Appending $FILE..."
    cat "$CHAPTER_PATH" >> "$OUTPUT_FILE"
    # Add a separator and newlines for better readability between chapters
    echo -e "\n\n---\n\n" >> "$OUTPUT_FILE"
  else
    echo "Warning: Chapter file not found: $CHAPTER_PATH"
  fi
done

echo "Successfully generated $OUTPUT_FILE." 