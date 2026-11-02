#!/bin/sh
# Collects the OpenFastTrace coverage tags from the templates into build/oft-tags.js.
# The tags are EJS comments (<%# [impl->req~name~1] -%>), which the generator strips, so no tag reaches a
# template. OpenFastTrace reads tags by file extension and knows no .tex, so this file bridges the gap;
# each line keeps the source location. Run from the repository root.
set -eu
mkdir -p build
grep -rno --include='*.tex' --include='*.yml' --include='*.md' --include='*.bst' -E '\[impl(~[a-z0-9.-]+)?(~[0-9]+)?->req~[a-z0-9.-]+~[0-9]+\]' generators/app/templates \
  | sed 's|^\(.*\):\([0-9]*\):\(.*\)$|// \3 (\1:\2)|' > build/oft-tags.js
echo "$(wc -l < build/oft-tags.js) tags in build/oft-tags.js"
