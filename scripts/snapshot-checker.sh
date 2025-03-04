#!/bin/bash

# Directories
source_dir="packages/elements-react/.stub-responses"  # Directory containing JSON files
reference_dir="packages/elements-react/stories"  # Directory containing reference files

# Find all JSON files in source directory and its subdirectories
json_files=$(find "$source_dir" -type f -name "*.json")


# Initialize an array to store unreferenced files
unreferenced_files=()

# Check each JSON file
for json_file in $json_files; do
    id=${json_file#"$source_dir"/}
    
    # Check if the filename is referenced in any file in the reference directory and its subdirectories
    if ! grep -r -q "$id" "$reference_dir"; then
        unreferenced_files+=("$json_file")
    fi
done

# Print unreferenced files
if [ ${#unreferenced_files[@]} -eq 0 ]; then
    echo "All snapshot files are referenced."
else
    echo "Unreferenced snapshot files:"
    printf "%s\n" "${unreferenced_files[@]}"
fi
