import * as cdk from '@aws-cdk/core';
import { Networking } from '../constructs/networking';
import { Config } from '../config/config';
import { EksCluster } from '../constructs/eks';
import { PySparkJob } from '../constructs/python-spark-job';
import { SparkOperator } from '../constructs/spark-operator';

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

    const sparkOperator = new SparkOperator(this, 'spark-operator', {
      cluster: eksCluster.cluster
    });

    new PySparkJob(this, 'ecr-image-python-spark-pi', {
      deployment: props.config.Deployment,
      jobName: 'python-spark-pi',
      cluster: eksCluster.cluster
    });
  }
}
