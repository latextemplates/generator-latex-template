documentclasses = ['acmart', 'ieee', 'lncs', 'scientific-thesis']
latexcompilers = ['pdflatex', 'lualatex']

bibtextools = ['bibtex', 'biblatex']

texlives = [2023]

languages = ['en', 'de']

# "arial" not available on linux
fonts = ['default', 'times']

listings = ['listings', 'minted']
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
ieeevariants = ['conference', 'journal', 'peerreview']

for documentclass in documentclasses:
  for latexcompiler in latexcompilers:
    for bibtextool in bibtextools:
      if ((bibtextool == 'biblatex') and ((documentclass == 'acmart') or (documentclass == 'ieee') or (documentclass == 'lncs'))):
        continue
      if ((bibtextool == 'bibtex') and (documentclass == 'scientific-thesis')):
        continue
      for texlive in texlives:
        for example in examples:
          for papersize in papersizes:
            for ieeevariant in ieeevariants:
              if ((documentclass != 'ieee') and ((papersize != 'a4') or (ieeevariant != 'conference'))):
                # we just go on for one IEEE specific element to enable this part being executed exactly ones for the "example" outer loop for non-IEEE
                # we check for a4 only, not for letter
                continue
              if (documentclass == 'ieee'):
                dashedPart = "{}-{}-{}-{}-{}-{}-{}".format(documentclass, ieeevariant, papersize, latexcompiler, bibtextool, texlive, example);
              else:
                dashedPart = "{}-{}-{}-{}-{}-{}".format(documentclass, papersize, latexcompiler, bibtextool, texlive, example);
              yml = open("workflows/check-{}.yml".format(dashedPart), "w+")
              yml.write("name: Check {}\n".format(dashedPart))
              yml.write("on: [push]\n")
              yml.write("concurrency:\n")
              yml.write("  group: {}\n".format(dashedPart))
              yml.write("  cancel-in-progress: true\n")
              yml.write("jobs:\n")
              yml.write("  check:\n")
              yml.write('''    runs-on: ubuntu-latest
    services:
      registry:
        image: registry:2
        ports:
          - 5000:5000
    steps:
      - name: Set up Git repository
        uses: actions/checkout@v3
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
        with:
          driver-opts: network=host
      - name: Cache Docker layers
        uses: actions/cache@v2
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx
      - uses: actions/setup-node@v3
        with:
          node-version: '14'
      - name: Update npm
        run: npm i -g npm@latest
      - run: npm i npm@latest
      - run: npm install
      - run: mkdir /tmp/out
''')
              for howtotext in howtotexts:
                for language in languages:
                  for font in fonts:
                    if ((documentclass == 'acmart') or (documentclass == 'ieee')) and (font != 'default'):
                      continue
                    for listing in listings:
                      for enquote in enquotes:
                        for tweak_outerquote in tweak_outerquotes:
                          for todo in todos:
                              variantName = "{}_{}_{}_{}_{}_{}_{}_{}_{}_{}_{}_{}".format(documentclass, latexcompiler, bibtextool, texlive, language, font, listing, enquote, tweak_outerquote, todo, example, howtotext)
                              yml.write("      - run: mkdir {}\n".format(variantName))
                              yml.write("      - name: Create {}\n".format(variantName))
                              yml.write('''        run: |
          npx yo $GITHUB_WORKSPACE\\
''')
                              yml.write("           --documentclass=%s\\\n" % documentclass)
                              if (documentclass == 'ieee'):
                                yml.write("           --ieeevariant=%s\\\n" % ieeevariant)
                              if (documentclass == 'acmart'):
                                yml.write("           --acm_format=%s\\\n" % acm_formats[0])
                                yml.write("           --acm_review=%s\\\n" % acm_reviews[0])
                              yml.write("           --papersize=%s\\\n" % papersize)
                              yml.write("           --latexcompiler=%s\\\n" % latexcompiler)
                              yml.write("           --bibtextool=%s\\\n" % bibtextool)
                              yml.write("           --overleaf=false\\\n")
                              yml.write("           --texlive=%s\\\n" % texlive)
                              yml.write("           --docker=iot\\\n")
                              yml.write("           --lang=%s\\\n" % language)
                              yml.write("           --font=%s\\\n" % font)
                              yml.write("           --listings=%s\\\n" % listing)
                              yml.write("           --enquotes=%s\\\n" % enquote)
                              yml.write("           --tweak_outerquote=%s\\\n" % tweak_outerquote)
                              yml.write("           --todo=%s\\\n" % todo)
                              yml.write("           --examples=%s\\\n" % example)
                              yml.write("           --howtotext=%s\n" % howtotext)
                              yml.write('''          pwd
          ls -la
        env:
          yeoman_test: true
''')
                              yml.write("        working-directory: '${{{{ github.workspace }}}}/{}'\n".format(variantName))
                              yml.write('''      - name: Build docker image
        uses: docker/build-push-action@v3
        with:
          push: true
''')
                              yml.write("          tags: localhost:5000/name/app:{}\n".format(variantName))
                              yml.write("          context: '${{{{ github.workspace }}}}/{}'\n".format(variantName))
                              yml.write("      - name: latexmk {}\n".format(variantName))
                              yml.write("        run: docker run -v $(pwd):/work/src -v /tmp/out:/work/out localhost:5000/name/app:{} work \"latexmk ".format(variantName))
                              if ((documentclass == 'acmart') or (documentclass == 'lncs') or (documentclass == 'ieee')):
                                yml.write("paper.tex\"\n")
                              else:
                                yml.write("main.tex\"\n")
                              yml.write("        working-directory: '${{{{ github.workspace }}}}/{}'\n".format(variantName))
              yml.write('''      - uses: actions/upload-artifact@v2
        with:
          name: pdfs
          path: /tmp/out
''')
              yml.close()
