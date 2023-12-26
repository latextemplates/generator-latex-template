#!/usr/bin/python3

documentclasses = ['acmart', 'ieee', 'lncs', 'scientific-thesis']
latexcompilers = ['pdflatex', 'lualatex']

bibtextools = ['bibtex', 'biblatex']

texlives = [2022, 2023]

languages = ['en', 'de']

# "arial" not available on linux
fonts = ['default', 'times']

listings = ['listings', 'minted']
enquotes = ['csquotes', 'plainlatex']
tweakouterquotes = ['babel', 'outerquote']
todos = ['pdfcomment', 'none']
examples = ['true', 'false']
howtotexts = ['true', 'false']

# ACM only
acmformats = ['manuscript', 'acmsmall', 'acmlarge', 'acmtog', 'sigconf', 'sigplan']
acmreviews = ['true', 'false']

# IEEE only
papersizes = ['a4', 'letter']
ieeevariants = ['conference', 'journal', 'peerreview']

docker = "iot"

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
                dashedPartMiktex = "{}-{}-{}-{}-{}-{}".format(documentclass, ieeevariant, papersize, latexcompiler, bibtextool, example);
              else:
                dashedPart = "{}-{}-{}-{}-{}-{}".format(documentclass, papersize, latexcompiler, bibtextool, texlive, example);
                dashedPartMiktex = "{}-{}-{}-{}-{}".format(documentclass, papersize, latexcompiler, bibtextool, example);
              yml = open("workflows/check-{}.yml".format(dashedPart), "w+")
              yml.write("name: Check {}\n".format(dashedPart))
              yml.write("""on:
  push:
    paths-ignore:
      - '.editorconfig'
      - '.eslintignore'
      - '.gitpod.dockerfile'
      - '.gitpod.yml'
      - '.gitattributes'
      - '.gitignore'
      - '.markdownlint.yml'
      - 'CHANGELOG.md'
      - 'CONTRIBUTING.md'
      - 'generate-texlivefile.sh'
      - 'LICENSE'
      - 'README.md'
      - 'setup-do.sh'
      - 'user-data.sh'
      - 'docs/**'
      - '.vscode/**'
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
jobs:
  check:
    runs-on: ubuntu-latest
    services:
      registry:
        image: registry:2
        ports:
          - 5000:5000
    steps:
      - name: Set up Git repository
        uses: actions/checkout@v4
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
        with:
          driver-opts: network=host
      - name: Cache Docker layers
        uses: actions/cache@v3
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Update npm
        run: |
          npm i -g npm@latest
          npm i npm@latest
      - run: npm install
      - run: mkdir /tmp/out
""")
              ymlmiktex = open("workflows/miktex-check-{}.yml".format(dashedPartMiktex), "w+")
              ymlmiktex.write("name: MiKTeX {}\n".format(dashedPartMiktex))
              ymlmiktex.write("on: [push]\n")
              ymlmiktex.write("concurrency:\n")
              ymlmiktex.write("  group: miktex-${{ github.workflow }}-${{ github.ref }}\n")
              ymlmiktex.write("  cancel-in-progress: true\n")
              ymlmiktex.write("jobs:\n")
              ymlmiktex.write("  miktex:\n")
              ymlmiktex.write('''    runs-on: ubuntu-22.04
    steps:
      - name: Install MikTeX
        run: |
          set -e
          sudo gpg --homedir /tmp --no-default-keyring --keyring /usr/share/keyrings/miktex.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys D6BC243565B2087BC3F897C9277A7293F59E4889
          echo "deb [arch=amd64 signed-by=/usr/share/keyrings/miktex.gpg] http://miktex.org/download/ubuntu jammy universe" | sudo tee /etc/apt/sources.list.d/miktex.list
          sudo apt-get update -y
          sudo apt-get install -y --no-install-recommends miktex
          sudo miktexsetup finish
          sudo initexmf --admin --set-config-value=[MPM]AutoInstall=1
          sudo mpm --admin --update-db
          sudo mpm --admin --update
      - name: Checkout repository
        uses: actions/checkout@v4
''')
              table = "documentclass | latexcompiler | bibtextool | texlive | lang | font    | listing  | enquote    | tweakouterquote | todo       | example | howtotext\n"
              for howtotext in howtotexts:
                for language in languages:
                  for font in fonts:
                    if ((documentclass == 'acmart') or (documentclass == 'ieee')) and (font != 'default'):
                      continue
                    for listing in listings:
                      for enquote in enquotes:
                        for tweakouterquote in tweakouterquotes:
                          for todo in todos:
                              variantName = "{}_{}_{}_{}_{}_{}_{}_{}_{}_{}_{}_{}".format(documentclass, latexcompiler, bibtextool, texlive, language, font, listing, enquote, tweakouterquote, todo, example, howtotext)
                              table += "{:<13} | {:<13} | {:<10} | {:<7} | {:<4} | {:<7} | {:<8} | {:10} | {:<15} | {:<10} | {:<7} | {:<8}\n".format(documentclass, latexcompiler, bibtextool, texlive, language, font, listing, enquote, tweakouterquote, todo, example, howtotext)
                              yml_content = "      - run: mkdir {}\n".format(variantName)
                              yml_content += "      - name: Create {}\n".format(variantName)
                              yml_content += '''        run: |
          npx yo $GITHUB_WORKSPACE\\
'''
                              yml_content += "           --documentclass=%s\\\n" % documentclass
                              if documentclass == 'ieee':
                                  yml_content += "           --ieeevariant=%s\\\n" % ieeevariant
                              if documentclass == 'acmart':
                                  yml_content += "           --acmformat=%s\\\n" % acmformats[0]
                                  yml_content += "           --acmreview=%s\\\n" % acmreviews[0]
                              yml_content += "           --papersize=%s\\\n" % papersize
                              yml_content += "           --latexcompiler=%s\\\n" % latexcompiler
                              yml_content += "           --bibtextool=%s\\\n" % bibtextool
                              yml_content += "           --overleaf=false\\\n"
                              yml_content += "           --texlive=%s\\\n" % texlive
                              yml_content += "           --docker=iot\\\n"
                              yml_content += "           --lang=%s\\\n" % language
                              yml_content += "           --font=%s\\\n" % font
                              yml_content += "           --listings=%s\\\n" % listing
                              yml_content += "           --enquotes=%s\\\n" % enquote
                              yml_content += "           --tweakouterquote=%s\\\n" % tweakouterquote
                              yml_content += "           --todo=%s\\\n" % todo
                              yml_content += "           --examples=%s\\\n" % example
                              yml_content += "           --howtotext=%s\n" % howtotext
                              yml_content += '''        env:
          yeoman_test: true
'''
                              yml_content += "        working-directory: '${{{{ github.workspace }}}}/{}'\n".format(variantName)
                              yml.write(yml_content)
                              ymlmiktex.write(yml_content)
                              yml.write('''      - name: Build docker image
        uses: docker/build-push-action@v4
        with:
          push: true
          provenance: false
''')
                              yml.write("          tags: localhost:5000/name/app:{}\n".format(variantName))
                              yml.write("          context: '${{{{ github.workspace }}}}/{}'\n".format(variantName))
                              yml.write("      - name: State\n")
                              yml.write("        run: echo -e " + repr(table) + "\n")
                              yml.write("      - name: latexmk {}\n".format(variantName))
                              ymlmiktex.write("      - name: latexmk {}\n".format(variantName))
                              filename = "paper.tex" if ((documentclass == 'acmart') or (documentclass == 'lncs') or (documentclass == 'ieee')) else "main.tex"
                              command = "latexmk {}".format(filename) if (docker != 'reitzig') else "work latexmk {}".format(filename)
                              yml.write("        run: docker run -v $(pwd):/workdir -v /tmp/out:/work/out localhost:5000/name/app:{} {}\n".format(variantName, command))
                              ymlmiktex.write("        run: {}\n".format(command))
                              yml.write("        working-directory: '${{{{ github.workspace }}}}/{}'\n".format(variantName))
                              ymlmiktex.write("        working-directory: '${{{{ github.workspace }}}}/{}'\n".format(variantName))
              yml.write('''      - uses: actions/upload-artifact@v2
        with:
          name: pdfs
          path: /tmp/out
''')
              yml.close()
              ymlmiktex.close()
