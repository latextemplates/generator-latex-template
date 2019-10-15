import {IConfiguration} from "./IConfiguration";

export class LatexCompiler implements IConfiguration {
    question = {
        name: AppSetting.LatexCompiler,
        type: "list",
        message: "Which LaTeX compiler to use?",
        choices: [
            {
                name: "PdfLaTeX",
                value: "pdflatex"
            },
            {
                name: "LuaLaTeX",
                value: "lualatex"
            }
        ],
        default: "pdflatex"
    }
}
