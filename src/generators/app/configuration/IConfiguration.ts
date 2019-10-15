import { IGeneratorSettings } from "extended-yo-generator";
import { Question } from "yeoman-generator";
import { IAppSettings } from "../IAppSettings";

export interface IConfiguration {
  question: Question<IGeneratorSettings>;
}
