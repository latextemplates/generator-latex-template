import {IGeneratorSettings} from "extended-yo-generator";
import {Configuration} from "../Configuration";
import {IAppSettings} from "../../IAppSettings";

export abstract class LatexPackage extends Configuration {
    requiresShellEscape: boolean = false;
}
