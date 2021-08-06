#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { Config, getConfig } from '../lib/config/config'
import { K8sClusterStack } from '../lib/stacks/k8s-cluster/k8s-cluster-stack';

const app = new cdk.App();
let environmentName = app.node.tryGetContext('config');

const config: Config = getConfig(environmentName, './config/');
const env  = { account: config.Deployment.AWSAccountID, region: config.Deployment.AWSRegion };

const prefix = config.Deployment.Prefix

new K8sClusterStack(app, `${prefix}-k8s-cluster`, config.Deployment, config.EksCluster, { env: env });