import { LatexPackage } from "./LatexPackage";
import { AppSetting } from "../../AppSetting";

export class Microtype extends LatexPackage {
    question: {
        name: AppSetting.Microtype,
        type: "confirm",
        message: "Would you like to enable microtype?",
        default: true
    }
}