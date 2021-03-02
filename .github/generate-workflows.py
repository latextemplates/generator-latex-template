documentclasses = ['lncs', 'scientific-thesis']
latexcompilers = ['pdflatex', 'lualatex']
bibtextools = ['bibtex', 'biblatex']

yml = open("workflows/check-build.yml", "w+")

yml.write('''name: Check Build
on: [push]
jobs:
''')


for documentclass in documentclasses:
  for latexcompiler in latexcompilers:
    for bibtextool in bibtextools:
      if (documentclass == 'lncs') and (bibtextool == 'biblatex'):
        continue
      yml.write("  %s-%s-%s:\n" % (documentclass, latexcompiler, bibtextool))
      yml.write('''    runs-on: ubuntu-latest
    strategy:
      matrix:
        language: [en, de]
        # "arial" not available on linux
        font: [default, times]
        listings: [listings, minted]
        cleveref: [true, false]
        enquotes: [csquotes, plainlatex]
        tweak_outerquote: [babel, outerquote]
        todo: [pdfcomment, none]
        examples: [true, false]
    steps:
      - name: Set up Git repository
        uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: '10.x'
      - run: npm install
''')
      if (documentclass == 'lncs'):
        yml.write('''      - run: |
           mkdir tmp
           [[ $LLNCS_CLS ]] && echo "$LLNCS_CLS" > tmp/llncs.cls
        shell: bash
        env:
          LLNCS_CLS: ${{secrets.LLNCS_CLS}}
''')
      yml.write('''      - name: Generate template
        run: |
          mkdir tmp && cd tmp
          npx yo $GITHUB_WORKSPACE\\
''')
      yml.write("           --documentclass=%s\\\n" % documentclass)
      yml.write("           --latexcompiler=%s\\\n" % latexcompiler)
      yml.write("           --bibtextool=%s\\\n" % bibtextool)
      yml.write('''           --texlive=tl2019\\
           --language==${{ matrix.language }}\\
           --font=${{ matrix.font }}\\
           --listings==${{ matrix.listings }}\\
           --cleveref=${{ matrix.cleveref }}\\
           --enquotes=${{ matrix.enquotes }}\\
           --tweak_outerquote=${{ matrix.tweak_outerquote }}\\
           --todo=${{ matrix.todo }}\\
           --examples=${{ matrix.examples }}
          pwd
          ls -la
        env:
          yeoman_test: true
      - name: latexmk
        uses: dante-ev/latex-action@master
        with:
          root_file: main.tex
          # ${{ github.workspace }} holds wrong directory (only valid for "run" tasks, not for container-based tasks)
          working_directory: '/github/workspace/tmp'
''')


yml.close()
