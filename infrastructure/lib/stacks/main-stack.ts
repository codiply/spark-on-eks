import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { Networking } from '../constructs/networking';
import { Config } from '../config/config';
import { EksCluster } from '../constructs/eks';
import { PySparkJob } from '../constructs/python-spark-job';
import { SparkOperator } from '../constructs/spark-operator';
import { DataLake } from '../constructs/data-lake';

export interface MainStackProps extends cdk.StackProps {
  readonly config: Config;
}

export class MainStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: MainStackProps) {
    super(scope, id, props);

    const networking = new Networking(this, 'networking', {
      deployment: props.config.Deployment,
      config: props.config.Vpc
    });

    const eksCluster = new EksCluster(this, 'eks-cluster', {
      deployment: props.config.Deployment,
      config: props.config.Eks,
      vpc: networking.vpc
    });
    eksCluster.node.addDependency(networking);

    const sparkOperator = new SparkOperator(this, 'spark-operator', {
      cluster: eksCluster.cluster,
      version: props.config.Eks.SparkOperatorVersion
    });
    sparkOperator.node.addDependency(eksCluster);

    const dataLake = new DataLake(this, 'data-lake', {
      deployment: props.config.Deployment,
    });

    sparkOperator.sparkServiceAccount.addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:*"],
      resources:[
        dataLake.bucket.bucketArn,
        dataLake.bucket.arnForObjects("*"),
      ]
    }));

    const sparkPi = new PySparkJob(this, 'ecr-image-python-spark-pi', {
      deployment: props.config.Deployment,
      jobName: 'python-spark-pi',
      cluster: eksCluster.cluster,
      sparkVersion: props.config.Spark.Version,
      serviceAccount: sparkOperator.sparkServiceAccount,
      bucket: dataLake.bucket
    });
    sparkPi.node.addDependency(sparkOperator);
  }
}
