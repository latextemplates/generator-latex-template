#!/bin/bash
set -e

# script similar to end-new-cycle.sh

# Current branch of generator-latex-template needs to be "refine-ltg"

current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$current_branch" != "refine-ltg" ]]; then
    echo "Error: Current branch is '$current_branch'. Expected 'refine-ltg'."
    exit 1
fi

git push

cd ..

echo "scientific-thesis-template"
cd scientific-thesis-template
git pull --no-edit
echo "Updating generator-latex-template..."
cd generator-latex-template
git fetch --prune
git checkout --force refine-ltg
git reset --hard origin/refine-ltg
cd ..

echo "Adding generator-latex-template..."
git add generator-latex-template
git commit -m"Update LTG" || true
git push
cd ..
echo ""

for template in *-enhanced uni-stuttgart-dissertation-template; do
  echo "$template"
  cd $template

  # ensure update-ltg to be in line with origin/update-ltg
  echo "Force sync of update-ltg..."
  git fetch --prune
  git checkout --force origin/update-ltg
  git branch -D update-ltg || true
  git checkout update-ltg

  echo "Updating generator-latex-template..."
  cd generator-latex-template
  git fetch --prune
  git checkout --force refine-ltg
  git reset --hard origin/refine-ltg
  cd ..

  echo "Adding generator-latex-template..."
  git add generator-latex-template
  git commit -m"Update LTG" || true
  git push
  cd ..
  echo ""
done
