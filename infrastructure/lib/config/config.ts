
import * as fs from 'fs'
import * as path from 'path';
import { DeploymentConfig, getDeploymentConfig } from './deployment-config';
import { EksConfig, getConfig as getEksConfig } from './sections/eks';
import { VpcConfig, getConfig as getVpcConfig } from './sections/networking';
import { SparkConfig, getConfig as getSparkConfing } from './sections/spark';
import { getSection } from './utils';
const yaml = require('js-yaml');

export interface Config {
    readonly Deployment: DeploymentConfig;
    readonly Vpc: VpcConfig;
    readonly Eks: EksConfig;
    readonly Spark: SparkConfig;
}
export function getConfig(environmentName: string, configPath: string): Config
{
    let env: string = environmentName ?? 'default';

    let deploymentYaml = yaml.load(fs.readFileSync(path.resolve(configPath+env+'.deployment.yaml'), 'utf8'));
    let configYaml = yaml.load(fs.readFileSync(path.resolve(configPath+env+'.yaml'), 'utf8'));

    let config: Config = {
        Deployment: getDeploymentConfig(deploymentYaml),
        Eks: getEksConfig(getSection(configYaml, 'Eks')),
        Spark: getSparkConfing(getSection(configYaml, 'Spark')),
        Vpc: getVpcConfig(getSection(configYaml, 'Vpc'))
    };

    return config;
}