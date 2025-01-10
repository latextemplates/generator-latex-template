#!/usr/bin/python3

import hashlib

globalsingleworkflow = True

documentclasses = ['acmart', 'ieee', 'lncs', 'scientific-thesis', 'ustutt']
latexcompilers = ['pdflatex', 'both']

bibtextools = ['bibtex', 'biblatex']

texlives = [2024]

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

# Idea: Have the same value in the workflow between generations so that the git diff is as small as possible
def stable_hash(value):
  return str(hashlib.md5(value.encode('utf-8')).hexdigest())[:5]

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
              yml = open("workflows/check-{}.yml".format(dashedPart), "w+", encoding="utf-8")
              yml.write("name: Check {}\n".format(dashedPart))
              yml.write("""on:
  push:
    branches:
      - main
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
  pull_request:
    branches:
      - main
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
  merge_group:
concurrency:
""")
              if globalsingleworkflow:
                 yml.write("  group: ${{ github.workflow }}\n")
              else:
                 yml.write("  group: \"${{ github.workflow }}-${{ github.head_ref || github.ref }}\"\n")
              yml.write("""  cancel-in-progress: true
jobs:
  check:
""")
              yml.write("    name: Check {}\n".format(dashedPart))
              yml.write("""    runs-on: ubuntu-24.04
    steps:
      - name: Set up Git repository
        uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: mkdir /tmp/out
""")
              ymlmiktex = open("workflows/miktex-check-{}.yml".format(dashedPartMiktex), "w+", encoding="utf-8")
              ymlmiktex.write("name: MiKTeX {}\n".format(dashedPartMiktex))
              ymlmiktex.write("on: [push]\n")
              ymlmiktex.write("concurrency:\n")
              if globalsingleworkflow:
                ymlmiktex.write("  group: miktex-${{ github.workflow }}\n")
              else:
                ymlmiktex.write("  group: miktex-${{ github.workflow }}-${{ github.ref }}\n")
              ymlmiktex.write("  cancel-in-progress: true\n")
              ymlmiktex.write("jobs:\n")
              ymlmiktex.write("  miktex:\n")
              ymlmiktex.write("    name: MiKTeX {}\n".format(dashedPartMiktex))
              ymlmiktex.write('''    runs-on: ubuntu-24.04
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
              table = "| documentclass | latexcompiler | bibtextool | texlive | lang | font    | listing  | enquote    | tweakouterquote | todo       | example | howtotext | link |"
              yml.write("      - name: Summary table heading\n");
              yml.write("        run: |\n");
              yml.write("          TABLE='{}'\n".format(table));
              table = "| -- | -- | -- | -- | -- | --| -- | -- | -- | -- | -- | -- | -- |"
              yml.write("          echo \"TABLE=${{TABLE}}\\n{}\" >> $GITHUB_ENV\n".format(table));
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
                              variantShort = "var_" + stable_hash(variantName)
                              table = "| {:<13} | {:<13} | {:<10} | {:<7} | {:<4} | {:<7} | {:<8} | {:10} | {:<15} | {:<10} | {:<7} | {:<8} |".format(documentclass, latexcompiler, bibtextool, texlive, language, font, listing, enquote, tweakouterquote, todo, example, howtotext)
                              yml_content = "      - run: mkdir {}\n".format(variantShort)
                              yml_content += "      - run: echo CURRENT_VARIANT='{}' >> $GITHUB_ENV\n".format(variantName);
                              yml_content += "      - run: echo CURRENT_VARIANT_SHORT='{}' >> $GITHUB_ENV\n".format(variantShort);
                              yml_content += "      - run: echo CURRENT_VARIANT_TABLE_ROW='{}' >> $GITHUB_ENV\n".format(table);
                              yml_content += "      - name: Create {}\n".format(variantShort)
                              yml_content += "        run: npx yo $GITHUB_WORKSPACE/generators/app/index.js"
                              yml_content += " --documentclass=%s" % documentclass
                              if documentclass == 'ieee':
                                  yml_content += " --ieeevariant=%s" % ieeevariant
                              if documentclass == 'acmart':
                                  yml_content += " --acmformat=%s" % acmformats[0]
                                  yml_content += " --acmreview=%s" % acmreviews[0]
                              yml_content += " --papersize=%s" % papersize
                              yml_content += " --latexcompiler=%s" % latexcompiler
                              yml_content += " --bibtextool=%s" % bibtextool
                              yml_content += " --texlive=%s" % texlive
                              yml_content += " --docker=no"
                              yml_content += " --lang=%s" % language
                              yml_content += " --font=%s" % font
                              yml_content += " --listings=%s" % listing
                              yml_content += " --enquotes=%s" % enquote
                              yml_content += " --tweakouterquote=%s" % tweakouterquote
                              yml_content += " --todo=%s" % todo
                              yml_content += " --examples=%s" % example
                              yml_content += " --howtotext=%s\n" % howtotext
                              yml_content += "        working-directory: '${{{{ github.workspace }}}}/{}'\n".format(variantShort)
                              yml.write(yml_content)
                              ymlmiktex.write(yml_content)
                              yml.write('''      - name: Install TeX Live
        uses: zauguin/install-texlive@v3
        with:
''')
                              yml.write("          package_file: '${{{{ github.workspace }}}}/{}/Texlivefile'\n".format(variantShort))
                              yml.write("      - name: latexmk {}\n".format(variantShort))
                              ymlmiktex.write("      - name: latexmk {}\n".format(variantShort))
                              filename = "paper.tex" if documentclass in ['acmart', 'lncs', 'ieee'] else "thesis-example.tex" if documentclass == 'ustutt' else "main.tex"
                              command = "latexmk {}".format(filename) if (docker != 'reitzig') else "work latexmk {}".format(filename)
                              yml.write("        run: {}\n".format(command))
                              yml.write("        working-directory: '${{{{ github.workspace }}}}/{}'\n".format(variantShort))
                              ymlmiktex.write("        run: {}\n".format(command))
                              ymlmiktex.write("        working-directory: '${{{{ github.workspace }}}}/{}'\n".format(variantShort))
                              yml.write("      - id: {}_u\n".format(variantShort))
                              yml.write('''        uses: actions/upload-artifact@v4
        with:
          name: ${{ env.CURRENT_VARIANT }}
          path: ${{ env.CURRENT_VARIANT_SHORT }}
''')
                              yml.write("      - run: echo \"TABLE=${{TABLE}}\\n{} [link](${{{{ steps.{}_u.outputs.artifact-url }}}}) |\" >> $GITHUB_ENV\n".format(table, variantShort));
              yml.write('''      - name: texlogsieve
        if: always()
        run: |
          echo "## $CURRENT_VARIANT" >> $GITHUB_STEP_SUMMARY
          echo '```' >> $GITHUB_STEP_SUMMARY
          texlogsieve < $CURRENT_VARIANT_SHORT/*.log >> $GITHUB_STEP_SUMMARY || false
          echo '```' >> $GITHUB_STEP_SUMMARY
      - id: failing_u
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: ${{ env.CURRENT_VARIANT }}
          path: ${{ env.CURRENT_VARIANT_SHORT }}
      - run: echo "TABLE=${TABLE}}\\n${CURRENT_VARIANT_TABLE_ROW} [link](${{ steps.failing_u.outputs.artifact-url }}) ❌ |" >> $GITHUB_ENV
        if: failure()
''')
              yml.write("        working-directory: ${{ env.CURRENT_VARIANT_SHORT }}\n");
              yml.write("      - name: Finish summary table\n");
              yml.write("        if: always()\n");
              yml.write("        run: echo -e ${TABLE} >> $GITHUB_STEP_SUMMARY\n");
              yml.close()
              ymlmiktex.close()
