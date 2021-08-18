documentclasses = ['lncs', 'scientific-thesis']
latexcompilers = ['pdflatex', 'lualatex']
# bibtextools = ['bibtex', 'biblatex']
bibtextools = ['bibtex']

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
      yml.write('''      - name: Generate template
        run: |
          mkdir -p tmp
          cd tmp
          npx yo $GITHUB_WORKSPACE\\
''')
      yml.write("           --documentclass=%s\\\n" % documentclass)
      yml.write("           --latexcompiler=%s\\\n" % latexcompiler)
      yml.write("           --bibtextool=%s\\\n" % bibtextool)
      yml.write('''           --texlive=2021\\
           --language=${{ matrix.language }}\\
           --font=${{ matrix.font }}\\
           --listings=${{ matrix.listings }}\\
           --cleveref=${{ matrix.cleveref }}\\
           --enquotes=${{ matrix.enquotes }}\\
           --tweak_outerquote=${{ matrix.tweak_outerquote }}\\
           --todo=${{ matrix.todo }}\\
           --examples=${{ matrix.examples }}
        env:
          yeoman_test: true
''')
      if (documentclass == 'lncs'):
        yml.write("        if: ${{ steps.createllncs.outputs.lncsclspresent }}\n")
      yml.write('''      - name: Set up Python 3.x
        uses: actions/setup-python@v2
        with:
          # Semantic version range syntax or exact version of a Python version
          python-version: '3.x'
          # Optional - x64 or x86 architecture, defaults to x64
          architecture: 'x64'
        if: ${{ matrix.listings == 'minted' }}
      - name: Install pygments
        run: |
          python -m pip install --upgrade pip
          pip install pygments
        if: ${{ matrix.listings == 'minted' }}
      - name: latexmk
        uses: dante-ev/latex-action@edge
        with:
          # ${{ github.workspace }} holds wrong directory (only valid for "run" tasks, not for container-based tasks)
          working_directory: '/github/workspace/tmp'
''')
      if (documentclass == 'lncs'):
        yml.write("          root_file: paper.tex\n")
        yml.write("        if: ${{ steps.createllncs.outputs.lncsclspresent }}\n")
      else:
        yml.write("          root_file: main.tex\n")

yml.close()
