#!/bin/bash

# Check if there are changes to commit
if [[ -z $(git status -s) ]]; then
  echo "No changes to commit."
  exit 0
fi

# Add all changes
git add .

# Prompt for commit message
read -p "Enter commit message: " commit_message

# Commit changes
git commit -m "$commit_message"

# Push changes
git push

echo "Changes synced successfully!"
