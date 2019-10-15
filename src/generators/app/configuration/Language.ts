import { AppSetting } from "../AppSetting";
import { IConfiguration } from "./IConfiguration";

/**
 * Language of the template
 */
export class Language implements IConfiguration {
    question: {
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
