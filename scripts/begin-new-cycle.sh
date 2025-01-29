#!/bin/bash
set -e

# Current branch of generator-latex-template needs to be "refine-ltg"

cd ..

for template in *-enhanced uni-stuttgart-dissertation-template; do
  echo "$template"
  cd "$template"
  git stash
  git checkout --force main
  git pull
  git branch -D update-ltg || true
  git checkout update-ltg || git checkout -b update-ltg
  echo "Preparing generator-latex-template..."
  cd generator-latex-template
  git stash
  git checkout --force main
  git branch -D refine-ltg || true
  git pull
  git checkout refine-ltg
  cd ..
  echo "Adding generator-latex-template..."
  git add generator-latex-template
  git commit -m"Begin refinement"
  git push -u
  gh pr create --draft --title "Update LTG" --body ""
  cd ..
  echo ""
done
