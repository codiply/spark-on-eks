
import * as fs from 'fs'
import * as path from 'path';
import { K8sClusterConfig, getConfig as getEksClusterConfig } from '../stacks/k8s-cluster/k8s-cluster-config';
const yaml = require('js-yaml');

export interface Config {
    readonly Deployment: DeploymentConfig;
    readonly EksCluster: K8sClusterConfig;
}

export interface DeploymentConfig
{
    readonly AWSAccountID : string;
    readonly AWSRegion : string;
    readonly Prefix: string;
    readonly AllowedIps: string;
}

export function getString(object: { [name: string]: any }, propertyName: string): string
{
    if(!object[propertyName] || object[propertyName].trim().length === 0)
        throw new Error('Property '+propertyName +' does not exist or is empty');

    return object[propertyName];
}
export function getStringList(object: { [name: string]: any }, propertyName: string): string[]
{
    if(!object[propertyName])
        throw new Error('Property '+propertyName +' does not exist');

    return object[propertyName];
}

export function getBoolean(object: { [name: string]: any }, propertyName: string): boolean
{
    return getString(object, propertyName).toLowerCase() == 'true';
}

export function getNumber(object: { [name: string]: any }, propertyName: string): number
{
    if(!object[propertyName])
        throw new Error('Property '+propertyName +' does not exist');

    return object[propertyName];
}

export function getSection(object: { [name: string]: any }, sectionName: string): { [name: string]: any }
{
    if(!object[sectionName])
        throw new Error('Section '+sectionName +' does not exist');

    return object[sectionName];
}

export function getConfig(environmentName: string, configPath: string): Config
{
    let env: string = environmentName ?? 'default';

    let deploymentYaml = yaml.load(fs.readFileSync(path.resolve(configPath+env+'.deployment.yaml'), 'utf8'));
    let configYaml = yaml.load(fs.readFileSync(path.resolve(configPath+env+'.yaml'), 'utf8'));

    let config: Config = {
        Deployment: getDeploymentConfig(deploymentYaml),
        EksCluster: getEksClusterConfig(getSection(configYaml, 'K8sCluster'))
    };

    return config;
}

function getDeploymentConfig(object: { [name: string]: any }): DeploymentConfig 
{
    return {
        AWSAccountID: getString(object, 'AWSAccountID'),
        AWSRegion: getString(object, 'AWSRegion'),
        Prefix: getString(object, 'Prefix'),
        AllowedIps: getString(object, 'AllowedIPs')
    };
}