import { IGeneratorSettings } from "extended-yo-generator";
import { AppSetting } from "./AppSetting";
import { Language } from "./configuration/Language";
import { LatexCompiler } from "./configuration/LatexCompiler";

export interface IAppSettings extends IGeneratorSettings
{
    [AppSetting.Language]: string;
    [AppSetting.LatexCompiler]: string;
}