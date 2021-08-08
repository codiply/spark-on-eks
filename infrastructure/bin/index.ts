#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { Config, getConfig } from '../lib/config/config'
import { MainStack } from '../lib/stacks/main-stack';

const app = new cdk.App();
let environmentName = app.node.tryGetContext('config');

const config: Config = getConfig(environmentName, './config/');
const env  = { account: config.Deployment.AWSAccountID, region: config.Deployment.AWSRegion };

const prefix = config.Deployment.Prefix

new MainStack(app, `${prefix}-k8s-cluster`, { 
  env: env,
  config: config
});