import { IGeneratorSettings } from "extended-yo-generator";
import { LicenseType } from "./LicenseType";
import { PkgListingsSetting } from "./PkgListingsSetting";

/**
 * Provides settings for the `PkgListingsGenerator`.
 */
export interface IPkgListingsSettings extends IGeneratorSettings
{
    /**
     * Gets or sets the name.
     */
    [PkgListingsSetting.Name]: string;

    /**
     * Gets or sets the description.
     */
    [PkgListingsSetting.Description]: string;

    /**
     * Gets or sets the type of the license.
     */
    [PkgListingsSetting.LicenseType]: LicenseType;
}