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
  for latexcompiler in latexcompilers:
    for bibtextool in bibtextools:
      if ((bibtextool == 'biblatex') and ((documentclass == 'acmart') or (documentclass == 'ieee') or (documentclass == 'lncs'))):
        continue
      for texlive in texlives:
        for example in examples:
          for papersize in papersizes:
            for ieee_variant in ieee_variants:
              if ((documentclass == 'ieee') and (latexcompiler == 'lualatex') and (texlive == 2021) and (example == 'true') and (ieee_variant != 'peerreview')):
                continue
              if ((documentclass != 'ieee') and ((papersize != 'a4') or (ieee_variant != 'conference'))):
                # we just go on for one IEEE specific element to enable this part being executed exactly ones for the "example" outer loop for non-IEEE
                continue
              if (documentclass == 'ieee'):
                dashedPart = "{}-{}-{}-{}-{}-{}-{}".format(documentclass, ieee_variant, papersize, latexcompiler, bibtextool, texlive, example);
              else:
                dashedPart = "{}-{}-{}-{}-{}".format(documentclass, latexcompiler, bibtextool, texlive, example);
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
        uses: actions/checkout@v2
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v1
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
        with:
          driver-opts: network=host
      - name: Cache Docker layers
        uses: actions/cache@v2
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx
      - uses: actions/setup-node@v1
        with:
          node-version: '14'
      - run: npm install
      - run: mkdir /tmp/out
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
                                variantName = "{}_{}_{}_{}_{}_{}_{}_{}_{}_{}_{}_{}_{}".format(documentclass, latexcompiler, bibtextool, texlive, language, font, listing, cleveref, enquote, tweak_outerquote, todo, example, howtotext)
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
                                if (documentclass == 'acmart'):
                                  yml.write("           --acm_format=%s\\\n" % acm_formats[0])
                                  yml.write("           --acm_review=%s\\\n" % acm_reviews[0])
                                yml.write("           --latexcompiler=%s\\\n" % latexcompiler)
                                yml.write("           --bibtextool=%s\\\n" % bibtextool)
                                yml.write("           --texlive=%s\\\n" % texlive)
                                yml.write("           --docker=reitzig\\\n")
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
                                yml.write('''      - name: Build docker image
        id: docker_build
        uses: docker/build-push-action@v2
        with:
          push: true
          tags: localhost:5000/name/app:latest
''')
                                yml.write("      - name: latexmk {}\n".format(variantName))
                                yml.write("        run: docker run -v $(pwd):/work/src -v /tmp/out:/work/out localhost:5000/name/app:latest latexkmk ")
                                if ((documentclass == 'lncs') or (documentclass == 'ieee')):
                                  yml.write("paper.tex\n")
                                  yml.write("        if: ${{ steps.lncsclspresent.outputs.lncsclspresent }}\n")
                                else:
                                  yml.write("main.tex\n")
                                yml.write("        working-directory: '${{{{ github.workspace }}}}/{}'\n".format(variantName))
              yml.write('''      - uses: actions/upload-artifact@v2
        with:
          name: pdfs
          path: /tmp/out
''')
              yml.close()
