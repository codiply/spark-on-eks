import { getBoolean, getNumber, getString } from '../../config/config'

export interface K8sClusterConfig
{
    readonly VpcCidrRange: string;
    readonly MaxAZs: number;
    readonly NatGateways: number;
    readonly UseNatInstances: boolean;
}

export function getConfig(object: { [name: string]: any }): K8sClusterConfig
{
    return {
        VpcCidrRange: getString(object, 'VpcCidrRange'),
        MaxAZs: getNumber(object, 'MaxAZs'),
        NatGateways: getNumber(object, 'NatGateways'),
        UseNatInstances: getBoolean(object, 'UseNatInstances')
    };
}