documentclasses = ['lncs', 'scientific-thesis']
latexcompilers = ['pdflatex', 'lualatex']

# bibtextools = ['bibtex', 'biblatex']
bibtextools = ['bibtex']

languages = ['en', 'de']

# "arial" not available on linux
fonts = ['default', 'times']

listings = ['listings', 'minted']
cleverefs = ['true', 'false']
enquotes = ['csquotes', 'plainlatex']
tweak_outerquotes = ['babel', 'outerquote']
todos = ['pdfcomment', 'none']
examples = ['true', 'false']

for documentclass in documentclasses:
  for latexcompiler in latexcompilers:
    for bibtextool in bibtextools:
      if (documentclass == 'lncs') and (bibtextool == 'biblatex'):
        continue
      yml = open("workflows/check-{}-{}-{}.yml".format(documentclass, latexcompiler, bibtextool), "w+")
      yml.write("name: Check {}-{}-{}\n".format(documentclass, latexcompiler, bibtextool))
      yml.write("on: [push]\n")
      yml.write("jobs:\n")
      yml.write("  check:\n")
      yml.write('''    runs-on: ubuntu-latest
    steps:
      - name: Cancel Previous Runs
        uses: styfle/cancel-workflow-action@0.8.0
        with:
          access_token: ${{ github.token }}
      - name: Set up Git repository
        uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: '14'
      - run: npm install
''')
      if (documentclass == 'lncs'):
        yml.write('''      - name: Create llncs.cls
        id: createllncs
        shell: bash
        run: |
           mkdir tmp
           if [ "$LLNCS_CLS" == "" ]; then
             echo ::set-output name=lncsclspresent::false
           else
             echo ::set-output name=lncsclspresent::true
             echo "$LLNCS_CLS" > tmp/llncs.cls
           fi
        env:
          LLNCS_CLS: ${{secrets.LLNCS_CLS}}
''')
      yml.write('''      - name: Set up Python 3.x
        uses: actions/setup-python@v2
        with:
          # Semantic version range syntax or exact version of a Python version
          python-version: '3.x'
          # Optional - x64 or x86 architecture, defaults to x64
          architecture: 'x64'
      - name: Install pygments
        run: |
          python -m pip install --upgrade pip
          pip install pygments
''')
      for language in languages:
        for font in fonts:
          for listing in listings:
            for cleveref in cleverefs:
              for enquote in enquotes:
                for tweak_outerquote in tweak_outerquotes:
                  for todo in todos:
                    for example in examples:
                      variantName = "{}_{}_{}_{}_{}_{}_{}_{}_{}_{}\n".format(documentclass, latexcompiler, bibtextool, language, listing, cleveref, enquote, tweak_outerquote, todo, example)
                      yml.write("      - name: Create {}".format(variantName))
                      yml.write('''        run: |
          mkdir -p tmp
          cd tmp
          npx yo $GITHUB_WORKSPACE\\
''')
                      yml.write("           --documentclass=%s\\\n" % documentclass)
                      yml.write("           --latexcompiler=%s\\\n" % latexcompiler)
                      yml.write("           --bibtextool=%s\\\n" % bibtextool)
                      yml.write("           --texlive=2021\\\n")
                      yml.write("           --language=%s\\\n" % language)
                      yml.write("           --font=%s\\\n" % font)
                      yml.write("           --listings=%s\\\n" % listing)
                      yml.write("           --cleveref=%s\\\n" % cleveref)
                      yml.write("           --enquotes=%s\\\n" % enquote)
                      yml.write("           --tweak_outerquote=%s\\\n" % tweak_outerquote)
                      yml.write("           --todo=%s\\\n" % todo)
                      yml.write("           --examples=%s\n" % example)
                      yml.write('''        env:
          yeoman_test: true
''')
                      if (documentclass == 'lncs'):
                        yml.write("        if: ${{ steps.createllncs.outputs.lncsclspresent }}\n")
                      yml.write("      - name: latexmk {}".format(variantName))
                      yml.write('''        uses: dante-ev/latex-action@edge
        with:
          # ${{ github.workspace }} holds wrong directory (only valid for "run" tasks, not for container-based tasks)
          # See https://github.community/t/how-can-i-access-the-current-repo-context-and-files-from-a-docker-container-action/17711/8 for details
          working_directory: '/github/workspace/tmp'
''')
                      if (documentclass == 'lncs'):
                        yml.write("          root_file: paper.tex\n")
                        yml.write("        if: ${{ steps.createllncs.outputs.lncsclspresent }}\n")
                      else:
                        yml.write("          root_file: main.tex\n")
      yml.close()
