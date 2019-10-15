import { Question } from "yeoman-generator";
import { IAppSettings } from "../IAppSettings";

export abstract class Configuration {
  public abstract question : Question<IAppSettings>;
}
