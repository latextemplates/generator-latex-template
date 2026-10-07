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

# The description of each template's "Update LTG" pull request links the generator's
# refine-ltg pull request (if it is open already; otherwise spread-updates.sh adds the link).
generator_pr_url=$(gh pr list --head refine-ltg --state open --json url --jq '.[0].url // empty')
if [ -z "$generator_pr_url" ]; then
  echo "Note: generator-latex-template has no open pull request for refine-ltg yet; scripts/spread-updates.sh links it in the template PRs once it exists." >&2
  pr_body=""
else
  pr_body="Based on $generator_pr_url (generator-latex-template, branch refine-ltg)."
fi

cd ..

for template in *-enhanced scientific-thesis-template uni-stuttgart-dissertation-template markdown-latex-quickstart; do
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
  git push --set-upstream origin update-ltg
  cd ..
done

# After successful completion of preparation, create draft PRs

for template in *-enhanced scientific-thesis-template uni-stuttgart-dissertation-template markdown-latex-quickstart; do
  echo "$template"
  cd "$template"
  echo "Creating draft pull request..."
  gh pr create --draft --title "Update LTG" --body "$pr_body"
  cd ..
  echo ""
done
