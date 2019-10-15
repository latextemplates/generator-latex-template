import chalk from "chalk";
import Dedent = require("dedent");
import { Generator, IComponentProvider, Question } from "extended-yo-generator";
import Path = require("path");
import YoSay = require("yosay");
import { AppSetting } from "./AppSetting";
import { IAppSettings } from "./IAppSettings";
import { Language } from "./configuration/Language";
import { LatexCompiler } from "./configuration/LatexCompiler";
import { Microtype } from "./configuration/packages/Microtype";

/**
 * Generates a LaTeX template
 */
export class AppGenerator extends Generator<IAppSettings>
{
    private needsShellEscape: boolean = false;

    public constructor(args: string | string[], options: {})
    {
        super(args, options);
    }

    protected get TemplateRoot(): string
    {
        return "app";
    }

    protected get Questions(): Array<Question<IAppSettings>>
    {
        return [
            LatexCompiler.question,
            Language.question,
            Microtype.question
        ];
    }

    protected get ProvidedComponents(): IComponentProvider<IAppSettings>
    {
        return {
            Question: "What do you want to include in your workspace?",
            Categories: [
                {
                    DisplayName: "General",
                    Components: [
                        {
                            ID: "main",
                            DisplayName: "Main LaTeX File",
                            Default: true,
                            FileMappings: [
                                {
                                    Source: (settings) =>
                                    {
                                        switch (settings[AppSetting.Language])
                                        {
                                            case Language.german:
                                                return "main.tex.de.ejs";
                                            default:
                                                return "main.tex.en.ejs";
                                        }
                                    },
                                    Destination: "main.tex"
                                }
                            ]
                        },
                        {
                            ID: "readme",
                            DisplayName: "README.md-File",
                            Default: true,
                            FileMappings: [
                                {
                                    Source: (settings) =>
                                    {
                                        if (settings[AppSetting.Language] === Language.german) {
                                            return "README.md.de.ejs";
                                        } else {
                                            return "README.md.en.ejs";
                                        }
                                    },
                                    Context: (settings) =>
                                    {
                                        var res = {};
                                        for (var setting in AppSetting) {
                                            if (typeof AppSetting[setting] === 'number') {
                                                keyName = AppSetting[setting];
                                                res[keyName] = settings[keyName];
                                            }
                                        }
                                        console.log(res);
                                        this.log(res);
                                        return res;
                                    },
                                    Destination: "README.md"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }

    public async prompting()
    {
        this.log(YoSay(`Welcome to the ${chalk.whiteBright("LaTeX template")} generator!`));
        return super.prompting();
    }

    public async writing()
    {
        return super.writing();
    }

    public async end()
    {
        this.log(Dedent(`
            Your LaTeX project is ready!
        `));
    }
}
