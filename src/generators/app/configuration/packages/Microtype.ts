import {LatexPackage} from "./LatexPackage";
import {AppSetting} from "../../AppSetting";
import {IAppSettings} from "../../IAppSettings";
import {Question} from "yeoman-generator";

export class Microtype extends LatexPackage {
    question: Question<IAppSettings> = {
        name: AppSetting.Microtype,
        type: "confirm",
        message: "Would you like to enable microtype?",
        default: true
    }
}