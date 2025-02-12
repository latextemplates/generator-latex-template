#!/bin/bash
set -e

# Current branch of generator-latex-template needs to be "refine-ltg"

git push

cd ..

for template in scientific-thesis-template uni-stuttgart-dissertation-template *-enhanced ; do
  echo "$template"
  cd $template
  git pull --no-edit
  echo "Updating generator-latex-template..."
  cd generator-latex-template
  git pull
  cd ..
  echo "Adding generator-latex-template..."
  git add generator-latex-template
  git commit -m"Update LTG" && git push || true
  cd ..
  git push
  echo ""
done
