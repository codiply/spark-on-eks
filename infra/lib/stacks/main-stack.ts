import * as cdk from '@aws-cdk/core';
import * as eks from '@aws-cdk/aws-eks';
import { DeploymentConfig } from '../config/deployment-config';
import { Networking } from '../constructs/networking';
import { Config } from '../config/config';
import { EksCluster } from '../constructs/eks';

export interface MainStackProps extends cdk.StackProps {
  readonly config: Config;
}

export class MainStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: MainStackProps) {
    super(scope, id, props);

    const networking = new Networking(this, 'networking', {
      deployment: props.config.Deployment,
      config: props.config.Vpc
    })

    const eksCluster = new EksCluster(this, 'eks-cluster', {
      deployment: props.config.Deployment,
      config: props.config.Eks,
      vpc: networking.vpc
    });
  }
}
