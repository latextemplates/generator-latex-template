documentclasses = ['acmart', 'ieee', 'lncs', 'scientific-thesis']
latexcompilers = ['pdflatex', 'lualatex']

# bibtextools = ['bibtex', 'biblatex']
bibtextools = ['bibtex']

texlives = [2019, 2020, 2021]

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

# ACM only
acm_formats = ['manuscript', 'acmsmall', 'acmlarge', 'acmtog', 'sigconf', 'sigplan']
acm_reviews = ['true', 'false']

# IEEE only
papersizes = ['a4', 'letter']
ieee_variants = ['conference', 'journal', 'peerreview']

for documentclass in documentclasses:
  for texlive in texlives:
    yml = open("workflows/check-{}-{}.yml".format(documentclass, texlive), "w+")
    yml.write("name: Check {} on TeXLive {}\n".format(documentclass, texlive))
    yml.write('''on: [push]
jobs:
  check:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        latexcompiler: [pdflatex]
        bibtextool: [bibtex]
        examples: [true]
        howtotext: [true]
        acm_format: [manuscript]
        acm_review: [true]
        papersize: [a4]
        ieee_variant: [conference]
        include:
''')
    for latexcompiler in latexcompilers:
      for bibtextool in bibtextools:
        for example in examples:
          if ((bibtextool == 'biblatex') and ((documentclass == 'acmart') or (documentclass == 'ieee') or (documentclass == 'lncs'))):
            continue
          for howtotext in howtotexts:
            for acm_format in acm_formats:
              for acm_review in acm_reviews:
                for papersize in papersizes:
                  for ieee_variant in ieee_variants:
                    if (((documentclass != 'ieee') and ((papersize != 'a4') or (ieee_variant != 'conference'))) and
                        ((documentclass != 'acmart') and ((acm_format != 'manuscript') or (acm_reviews != 'true')))):
                      # we just go on for one IEEE/ACM specific element to enable this part being executed exactly ones for the "example" outer loop for non-IEEE/ACM
                      continue
                    yml.write("          - latexcompiler: %s\n" % latexcompiler)
                    yml.write("            bibtextool: %s\n" % bibtextool)
                    yml.write("            examples: %s\n" % example)
                    yml.write("            howtotext: %s\n" % howtotext)
                    yml.write("            acm_format: %s\n" % acm_format)
                    yml.write("            acm_review: %s\n" % acm_review)
                    yml.write("            papersize: %s\n" % papersize)
                    yml.write("            ieee_variant: %s\n" % ieee_variant)
#    yml.write("        - name: Check ${{ matrix.latexcompiler }} ${{ matrix.bibtextool }} ${{ matrix.examples }} ${{ matrix.acm_format }} ${{ matrix.acm_review }} ${{ matrix.papersize }} ${{ matrix.ieee_variant }}\n")
    yml.write('''    steps:
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
''')
    if (documentclass == 'lncs'):
      yml.write('''      - id: lncsclspresent
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
    for language in languages:
      if (documentclass == 'ieee') and (language != 'en'):
        continue
      for font in fonts:
        if (documentclass == 'ieee') and (font != 'default'):
          continue
        for listing in listings:
          for cleveref in cleverefs:
            for enquote in enquotes:
              for tweak_outerquote in tweak_outerquotes:
                for todo in todos:
                    variantName = "{}_{{{{ $matrix.latexcompiler }}}}_{{{{ $matrix.bibtextool }}}}_{}_{}_{}_{}_{}_{}_{}_{}_{{{{ $matrix.examples }}}}_{}_{{{{ $matrix.acm_format }}}}_{{{{ $matrix.acm_review }}}}_{{{{ $matrix.papersize }}}}_{{{{ $matrix.ieee_variant }}}}".format(documentclass, texlive, language, font, listing, cleveref, enquote, tweak_outerquote, todo, howtotext)
                    yml.write("      - run: mkdir {}\n".format(variantName))
                    yml.write("      - name: Create {}\n".format(variantName))
                    yml.write("        run: |\n")
                    if (documentclass == 'lncs'):
                      yml.write("          echo \"$LLNCS_CLS\" > llncs.cls\n")
                    yml.write("          npx yo $GITHUB_WORKSPACE\\\n")
                    yml.write("           --documentclass=%s\\\n" % documentclass)
                    yml.write("           --latexcompiler={{ $matrix.latexcompiler }}\\\n")
                    yml.write("           --bibtextool={{ $matrix.bibtextool }}\\\n")
                    yml.write("           --texlive=%s\\\n" % texlive)
                    yml.write("           --papersize={{ $matrix.papersize }}\\\n")
                    yml.write("           --ieee_variant={{ $matrix.ieee_variant }}\\\n")
                    yml.write("           --acm_format={{ $matrix.acm_format }}\\\n")
                    yml.write("           --acm_review={{ $matrix.acm_review }}\\\n")
                    yml.write("           --language=%s\\\n" % language)
                    yml.write("           --font=%s\\\n" % font)
                    yml.write("           --listings=%s\\\n" % listing)
                    yml.write("           --cleveref=%s\\\n" % cleveref)
                    yml.write("           --enquotes=%s\\\n" % enquote)
                    yml.write("           --tweak_outerquote=%s\\\n" % tweak_outerquote)
                    yml.write("           --todo=%s\\\n" % todo)
                    yml.write("           --examples={{ $matrix.examples }}\\\n")
                    yml.write("           --howtotext=%s\n" % howtotext)
                    yml.write('''          pwd
          ls -la
        env:
          yeoman_test: true
''')
                    if (documentclass == 'lncs'):
                      yml.write("          LLNCS_CLS: ${{secrets.LLNCS_CLS}}\n")
                      yml.write("        if: ${{ steps.lncsclspresent.outputs.lncsclspresent }}\n")
                    yml.write("        working-directory: '${{{{ github.workspace }}}}/{}'\n".format(variantName))
                    yml.write("      - name: latexmk {}\n".format(variantName))
                    if (texlive == 2019):
                      yml.write("        uses: dante-ev/latex-action@2019-A\n")
                    elif (texlive == 2020):
                      yml.write("        uses: dante-ev/latex-action@2020-A\n")
                    else:
                      yml.write("        uses: dante-ev/latex-action@edge\n")
                    yml.write('''        with:
          # ${{ github.workspace }} holds wrong directory (only valid for "run" tasks, not for container-based tasks)
          # See https://github.community/t/how-can-i-access-the-current-repo-context-and-files-from-a-docker-container-action/17711/2?u=koppor for details
''')
                    yml.write("          working_directory: '/github/workspace/{}'\n".format(variantName))
                    if ((documentclass == 'acmart') or (documentclass == 'lncs') or (documentclass == 'ieee')):
                      yml.write("          root_file: paper.tex\n")
                      if (documentclass == 'lncs'):
                        yml.write("        if: ${{ steps.lncsclspresent.outputs.lncsclspresent }}\n")
                    else:
                      yml.write("          root_file: main.tex\n")
    yml.write('''      - uses: actions/upload-artifact@v2
        with:
          name: pdfs
          path: |
            **/main.pdf
            **/paper.pdf
''')
    yml.close()
