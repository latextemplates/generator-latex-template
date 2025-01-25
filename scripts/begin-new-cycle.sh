#!/bin/bash
set -e

git checkout -b refine-ltg
git push
cd ..

for template in *-enhanced; do
  cd "$template"
  git checkout -b update-ltg
  cd generator-latex-template
  git pull
  git checkout refine-ltg
  cd ..
  git add generator-latex-template
  git commit -m"Begin refinement"
  git push
done
