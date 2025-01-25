#!/bin/bash
set -e

# Current branch of generator-latex-template needs to be "refine-ltg"

cd ..

for template in *-enhanced; do
  echo "$template"
  cd $template
  git pull
  echo "Updating generator-latex-template..."
  cd generator-latex-template
  git pull
  cd ..
  echo "Adding generator-latex-template..."
  git add generator-latex-template
  git commit -m"Update LTG"
  git pull --rebase
  git push
  cd ..
  echo ""
done
