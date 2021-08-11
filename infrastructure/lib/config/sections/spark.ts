import { getString } from "../utils";

export interface SparkConfig
{
    readonly AwsSdkBundleVersion: string;
    readonly HadoopVersion: string;
    readonly Version: string;
}

export function getConfig(object: { [name: string]: any }): SparkConfig
{
    return {
        AwsSdkBundleVersion: getString(object, 'AwsSdkBundleVersion'),
        HadoopVersion: getString(object, 'HadoopVersion'),
        Version: getString(object, 'Version')
    };
}