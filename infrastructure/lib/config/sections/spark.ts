import { getString } from "../utils";

export interface SparkConfig
{
    readonly Version: string;
}

export function getConfig(object: { [name: string]: any }): SparkConfig
{
    return {
        Version: getString(object, 'Version')
    };
}