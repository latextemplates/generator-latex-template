documentclasses = ['ieee', 'lncs', 'scientific-thesis']
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
howtotexts = ['true', 'false']
papersizes = ['a4', 'letter']
ieee_variants = ['conference', 'journal', 'peerreview']

for documentclass in documentclasses:
  for latexcompiler in latexcompilers:
    for bibtextool in bibtextools:
      for example in examples:
        if (documentclass == 'lncs') and (bibtextool == 'biblatex'):
          continue
        if (documentclass == 'ieee') and (bibtextool == 'biblatex'):
          continue
        for papersize in papersizes:
          for ieee_variant in ieee_variants:
            if ((documentclass != 'ieee') and ((papersize != 'a4') or (ieee_variant != 'conference'))):
              # we just go on for one IEEE specific element to enable this part being executed exactly ones for the "example" outer loop for non-IEEE
              continue
            if (documentclass == 'ieee'):
              dashedPart = "{}-{}-{}-{}-{}-{}".format(documentclass, ieee_variant, papersize, latexcompiler, bibtextool, example);
            else:
              dashedPart = "{}-{}-{}-{}".format(documentclass, latexcompiler, bibtextool, example);
            yml = open("workflows/check-{}.yml".format(dashedPart), "w+")
            yml.write("name: Check {}\n".format(dashedPart))
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
      - name: Set up Python 3.x
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
      - id: lncsclspresent
        shell: bash
        run: |
           if [ "$LLNCS_CLS" == "" ]; then
             echo ::set-output name=lncsclspresent::false
           else
             echo ::set-output name=lncsclspresent::true
           fi
        env:
          LLNCS_CLS: ${{secrets.LLNCS_CLS}}
''')
            for howtotext in howtotexts:
              for language in languages:
                for font in fonts:
                  if (documentclass == 'IEEE') and (font == 'default'):
                    continue
                  for listing in listings:
                    for cleveref in cleverefs:
                      for enquote in enquotes:
                        for tweak_outerquote in tweak_outerquotes:
                          for todo in todos:
                              variantName = "{}_{}_{}_{}_{}_{}_{}_{}_{}_{}_{}_{}".format(documentclass, latexcompiler, bibtextool, language, font, listing, cleveref, enquote, tweak_outerquote, todo, example, howtotext)
                              yml.write("      - run: mkdir {}\n".format(variantName))
                              yml.write("      - name: Create {}\n".format(variantName))
                              yml.write('''        run: |
          echo "$LLNCS_CLS" > llncs.cls
          npx yo $GITHUB_WORKSPACE\\
''')
                              yml.write("           --documentclass=%s\\\n" % documentclass)
                              if (documentclass == 'ieee'):
                                yml.write("           --papersize=%s\\\n" % papersize)
                                yml.write("           --ieee_variant=%s\\\n" % ieee_variant)
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
                              yml.write("           --examples=%s\\\n" % example)
                              yml.write("           --howtotext=%s\n" % howtotext)
                              yml.write('''          pwd
          ls -la
        env:
          yeoman_test: true
          LLNCS_CLS: ${{secrets.LLNCS_CLS}}
''')
                              if (documentclass == 'lncs'):
                                yml.write("        if: ${{ steps.lncsclspresent.outputs.lncsclspresent }}\n")
                              yml.write("        working-directory: '${{{{ github.workspace }}}}/{}'\n".format(variantName))
                              yml.write("      - name: latexmk {}\n".format(variantName))
                              yml.write('''        uses: dante-ev/latex-action@edge
        with:
          # ${{ github.workspace }} holds wrong directory (only valid for "run" tasks, not for container-based tasks)
          # See https://github.community/t/how-can-i-access-the-current-repo-context-and-files-from-a-docker-container-action/17711/2?u=koppor for details
''')
                              yml.write("          working_directory: '/github/workspace/{}'\n".format(variantName))
                              if (documentclass == 'lncs'):
                                yml.write("          root_file: paper.tex\n")
                                yml.write("        if: ${{ steps.lncsclspresent.outputs.lncsclspresent }}\n")
                              else:
                                yml.write("          root_file: main.tex\n")
        yml.close()
