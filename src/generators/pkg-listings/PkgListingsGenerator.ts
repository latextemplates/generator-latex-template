import chalk from "chalk";
import Dedent = require("dedent");
import { Generator, IComponentProvider, Question } from "extended-yo-generator";
import Path = require("path");
import YoSay = require("yosay");
import { IPkgListingsSettings } from "./IPkgListingsSettings";
import { LicenseType } from "./LicenseType";
import { PkgListingsSetting } from "./PkgListingsSetting";

/**
 * Provides the functionality to generate a generator written in TypeScript.
 */
export class PkgListingsGenerator extends Generator<IPkgListingsSettings>
{
    /**
     * Initializes a new instance of the `PkgListingsGenerator` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: {})
    {
        super(args, options);
    }

    protected get TemplateRoot(): string
    {
        return "pkg-listings";
    }

    protected get Questions(): Array<Question<IPkgListingsSettings>>
    {
        return [
            {
                type: "input",
                name: PkgListingsSetting.Destination,
                message: "Where do you want to save your project to?",
                default: "./",
                filter: async input =>
                {
                    let destination = Path.isAbsolute(input) ? input : Path.resolve(process.cwd(), input);
                    this.destinationRoot(destination);
                    return destination;
                }
            },
            {
                type: "input",
                name: PkgListingsSetting.Name,
                message: "What's the name of your project?",
                default: (answers: IPkgListingsSettings) => Path.basename(answers[PkgListingsSetting.Destination])
            },
            {
                type: "input",
                name: PkgListingsSetting.Description,
                message: "Please enter a description."
            }
        ];
    }

    protected get ProvidedComponents(): IComponentProvider<IPkgListingsSettings>
    {
        return {
            Question: "What do you want to include in your workspace?",
            Categories: [
                {
                    DisplayName: "General",
                    Components: [
                        {
                            ID: "readme",
                            DisplayName: "README.md-File",
                            Default: true,
                            FileMappings: [
                                {
                                    Source: "README.md.ejs",
                                    Context: (settings) =>
                                    {
                                        return {
                                            Name: settings[PkgListingsSetting.Name],
                                            Description: settings[PkgListingsSetting.Description]
                                        };
                                    },
                                    Destination: "README.md"
                                }
                            ]
                        },
                        {
                            ID: "license",
                            DisplayName: "License-File",
                            Questions: [
                                {
                                    name: PkgListingsSetting.LicenseType,
                                    type: "list",
                                    message: "What license do you want to use?",
                                    choices: [
                                        {
                                            value: LicenseType.Apache,
                                            name: "Apache-2.0 License"
                                        },
                                        {
                                            value: LicenseType.GPL,
                                            name: "GNU GPL License"
                                        }
                                    ],
                                    default: LicenseType.GPL
                                }
                            ],
                            FileMappings: [
                                {
                                    Source: (settings) =>
                                    {
                                        switch (settings[PkgListingsSetting.LicenseType])
                                        {
                                            case LicenseType.Apache:
                                                return "Apache.txt";
                                            case LicenseType.GPL:
                                            default:
                                                return "GPL.txt";
                                        }
                                    },
                                    Destination: "LICENSE"
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
        this.log(YoSay(`Welcome to the ${chalk.whiteBright("pkg-listings")} generator!`));
        return super.prompting();
    }

    public async writing()
    {
        return super.writing();
    }

    public async end()
    {
        this.log(Dedent(`
            Your project is ready!

            It lives in "${this.Settings[PkgListingsSetting.Destination]}"`));
    }
}