#!/bin/bash
set -e

# Current branch of generator-latex-template needs to be "main" and point to the latest release
# Each template needs to be on the branch "update-ltg"

cd ..

for template in *-enhanced uni-stuttgart-dissertation-template; do
  echo "$template"
  cd $template
  git pull
  echo "Updating generator-latex-template..."
  cd generator-latex-template
  git checkout --force main
  git pull
  cd ..
  echo "Adding generator-latex-template..."
  git add generator-latex-template
  git commit -m"Update LTG" || true
  git pull --rebase
  git push
  cd ..
  echo ""
done
