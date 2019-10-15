import {AppSetting} from "../AppSetting";
import {Configuration} from "./Configuration";
import {IAppSettings} from "../IAppSettings";
import {Question} from "yeoman-generator";

/**
 * Language of the template
 */
export class Language extends Configuration {
    question: Question<IAppSettings> = {
        name: AppSetting.Language,
        type: "list",
        message: "Which language should be used for the latex document?",
        choices: [
            {
                name: "English",
                value: "english"
            },
            {
                name: "German",
                value: "german"
            }
        ],
        default: "german"
    }
}
