import {Configuration} from "./Configuration";
import {AppSetting} from "../AppSetting";
import {Question} from "yeoman-generator";
import {IGeneratorSettings} from "extended-yo-generator";
import {IAppSettings} from "../IAppSettings";

export class LatexCompiler extends Configuration {

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
