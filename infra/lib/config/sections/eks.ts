import { getString } from "../utils";

export interface EksConfig
{
    readonly SparkOperatorVersion: string;
}

export function getConfig(object: { [name: string]: any }): EksConfig
{
    return {
        SparkOperatorVersion: getString(object, 'SparkOperatorVersion')
    };
}