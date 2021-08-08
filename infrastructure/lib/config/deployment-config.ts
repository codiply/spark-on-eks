import { getString, getStringList } from "./utils";

export interface DeploymentConfig
{
    readonly AWSAccountID : string;
    readonly AWSRegion : string;
    readonly Prefix: string;
    readonly AdminUserArns: string[];
    readonly AllowedIpRanges: string[];
}

export function getDeploymentConfig(object: { [name: string]: any }): DeploymentConfig 
{
    return {
        AWSAccountID: getString(object, 'AWSAccountID'),
        AWSRegion: getString(object, 'AWSRegion'),
        Prefix: getString(object, 'Prefix'),
        AdminUserArns: getStringList(object, 'AdminUserArns'),
        AllowedIpRanges: getStringList(object, 'AllowedIpRanges')
    };
}