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

# The description of each template's "Update LTG" pull request links the generator's
# refine-ltg pull request, so that reviewers find the changes of the cycle.
generator_pr_url=$(gh pr list --head refine-ltg --state open --json url --jq '.[0].url // empty')
if [ -z "$generator_pr_url" ]; then
  echo "Warning: generator-latex-template has no open pull request for refine-ltg; the template PRs will not link it. Re-run this script after opening it." >&2
fi

# Add the link to the generator PR to the description of the current template's open
# "Update LTG" pull request, unless the description contains it already.
link_generator_pr() {
  local number body
  number=$(gh pr list --head update-ltg --state open --json number --jq '.[0].number // empty')
  if [ -z "$number" ]; then
    echo "Warning: no open pull request for update-ltg; cannot link $generator_pr_url" >&2
    return 0
  fi
  body=$(gh pr view "$number" --json body --jq '.body')
  case "$body" in
    *"$generator_pr_url"*) return 0 ;;
  esac
  if [ -n "$body" ]; then
    body="$body"$'\n\n'
  fi
  gh pr edit "$number" --body "${body}Based on $generator_pr_url (generator-latex-template, branch refine-ltg)."
  echo "Linked $generator_pr_url in pull request #$number"
}

cd ..

for template in *-enhanced scientific-thesis-template uni-stuttgart-dissertation-template markdown-latex-quickstart; do
  echo "$template"
  cd $template

  # Abort loudly if the template has a dirty working tree (incl. a dirty submodule
  # pointer) rather than failing silently via `set -e`.
  if [ -n "$(git status --porcelain)" ]; then
    echo "Error: '$template' has a dirty working tree; clean it and re-run." >&2
    git status --short >&2
    exit 1
  fi

  # The submodule must be initialized, otherwise the `cd generator-latex-template`
  # below would operate on the parent repo.
  if [ ! -e generator-latex-template/.git ]; then
    echo "Error: '$template/generator-latex-template' submodule not initialized. Run: git -C '$template' submodule update --init" >&2
    exit 1
  fi

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
  if [ -n "$generator_pr_url" ]; then
    link_generator_pr
  fi
  cd ..
  echo ""
done
