import { getString } from "../utils";

export interface SparkConfig
{
    readonly AwsSdkVersion: string;
    readonly HadoopVersion: string;
    readonly Version: string;
    
    
}

export function getConfig(object: { [name: string]: any }): SparkConfig
{
    return {
        AwsSdkVersion: getString(object, 'AwsSdkVersion'),
        HadoopVersion: getString(object, 'HadoopVersion'),
        Version: getString(object, 'Version')
    };
}