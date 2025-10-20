#!/bin/bash
set -e

# Get the current branch name
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Check if the branch is "refine-ltg"
if [[ "$current_branch" != "refine-ltg" ]]; then
    echo "Error: Current branch is '$current_branch'. Expected 'refine-ltg'."
    exit 1
fi

echo "Current branch is 'refine-ltg'. Continuing..."

cd ..

for template in *-enhanced scientific-thesis-template uni-stuttgart-dissertation-template; do
  echo "$template"
  cd "$template"
  git stash
  git checkout --force main
  git pull --no-edit --prune

  echo "Preparing branch update-ltg..."
  git branch -D update-ltg || true
  git push origin :update-ltg || true
  git checkout -b update-ltg

  echo "Preparing generator-latex-template..."
  cd generator-latex-template
  git stash
  git checkout --force main
  git branch -D refine-ltg || true
  git pull --prune
  git checkout refine-ltg
  cd ..

  echo "Adding generator-latex-template..."
  git add generator-latex-template
  git commit -m"Begin refinement"
  git push -u
  cd ..
done

# After successful completion of preparation, create draft PRs

for template in *-enhanced scientific-thesis-template uni-stuttgart-dissertation-template; do
  echo "$template"
  cd "$template"
  echo "Creating draft pull request..."
  gh pr create --draft --title "Update LTG" --body ""
  cd ..
  echo ""
done
