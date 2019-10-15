import { IGeneratorSettings } from "extended-yo-generator";
import { Question } from "yeoman-generator";
import { IConfiguration } from "../IConfiguration";

export abstract class LatexPackage implements IConfiguration {
    public requiresShellEscape: boolean = false;
    public question: Question<IGeneratorSettings>;
}
