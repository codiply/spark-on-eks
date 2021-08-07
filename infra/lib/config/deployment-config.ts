import { getString } from "./utils";

export interface DeploymentConfig
{
    readonly AWSAccountID : string;
    readonly AWSRegion : string;
    readonly Prefix: string;
    readonly AllowedIps: string;
}

export function getDeploymentConfig(object: { [name: string]: any }): DeploymentConfig 
{
    return {
        AWSAccountID: getString(object, 'AWSAccountID'),
        AWSRegion: getString(object, 'AWSRegion'),
        Prefix: getString(object, 'Prefix'),
        AllowedIps: getString(object, 'AllowedIPs')
    };
}