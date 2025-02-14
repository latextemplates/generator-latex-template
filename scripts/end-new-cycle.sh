#!/bin/bash
set -e

# script similar to spread-updates.sh

# Current branch of generator-latex-template needs to be "main" and point to the latest release
# Each template needs to be on the branch "update-ltg"

current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$current_branch" != "main" ]]; then
    echo "Error: Current branch is '$current_branch'. Expected 'main'."
    exit 1
fi

cd ..

for template in *-enhanced uni-stuttgart-dissertation-template; do
  echo "$template"
  cd $template

  # ensure update-ltg to be in line with origin/update-ltg
  echo "Force sync of update-ltg..."
  git fetch
  git checkout --force origin/update-ltg
  git branch -D update-ltg || true
  git checkout update-ltg

  echo "Updating generator-latex-template..."
  cd generator-latex-template
  git checkout --force main
  git fetch
  git reset --hard origin/main
  cd ..

  echo "Adding generator-latex-template..."
  git add generator-latex-template
  git commit -m"Update LTG" || true
  git push
  cd ..
  echo ""
done
