#!/bin/bash
set -e

# Current branch of generator-latex-template needs to be "refine-ltg"

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
