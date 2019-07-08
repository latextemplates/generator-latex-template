# Welcome to your TypeScript Generator
This workspace allows you to easilly create yeoman generators written in TypeScript.

## What's in the folder?

  - `.vscode`  
    This folder contains settings and build-task configurations for VSCode.
  - `src`  
    This is where you program your module in TypeScript.  
    The TypeScript-Compiler is configured to use this folder as the root of your source-code.
    - `src/generators`
      This folder holds the generators written in TypeScript.
  - `lib`  
    The `lib`-folder is the one where your compiled `.js`-files are written to.
  - `tsconfig.json`  
    This is the file where the compiler-options are configured.  
    [Learn more...][TypeScriptConfig]
  - `tslint.json`
    This file mostly holds rules for your coding-style.  
    [Learn more...][TSLintConfig]

## Working with the Library
### Creating a Generator
You can create the main generator by creating a directory called `app` or a sub-generator by creating a directory called `{ sub-generator-name }` inside the `src/generators`-directory.  
Create a generator by creating an `index.ts`-file inside said directory and let it derive from the `Generator` class located in the `src/Generator.ts` file.

Use the IntelliSense of your TypeScript-editor for getting more information about the different useful class members.

  - The `TemplateRoot`-member allows you to specify a path to the templates relative to the `templates/`-directory
  - The `ProvidedComponents`-member allows you to specify components users can optionally choose to install
  - The `Questions`-member contains questions users are prompted to answer during the execution of `Generator.prompting()`

### Testing the Generator
#### Using Visual Studio Code
You can test the generator in Visual Studio Code by running the `Launch Yeoman`-Debug configuration.  
This project also supports Unit-Tests using `mocha`. You can run them using the `Launch Tests`-configuration.

#### Using the Command Prompt
First you need to create a symbolic link of your project in the global `node_modules`-directory.  
You can do this by invoking following command:
```bash
npm link
```
This can be undone using its counterpart:
```bash
npm unlink
```

Before you can use your generator you must transpile the TypeScript-code to JavaScript.  
Doing this is as simple as:
```bash
npm run build
```
Or - if you want to clean the output-directory before transpiling the code:
```bash
npm run rebuild
```

You can then run your generator by invoking either one of these commands:
```bash
yo latex-template
yo latex-template:pkg-listings
```

<!--- References -->
[TypeScriptConfig]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
[TSLintConfig]: https://palantir.github.io/tslint/usage/configuration/