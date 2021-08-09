import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { Networking } from '../constructs/networking';
import { Config } from '../config/config';
import { EksCluster } from '../constructs/eks';
import { PySparkJob } from '../constructs/python-spark-job';
import { SparkOperator } from '../constructs/spark-operator';
import { DataLake } from '../constructs/data-lake';

export interface CoreStackProps extends cdk.StackProps {
  readonly config: Config;
}

export class CoreStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: CoreStackProps) {
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

    if (props.config.DeployJobs.SparkPi) {
      const sparkPi = new PySparkJob(this, 'ecr-image-python-spark-pi', {
        deployment: props.config.Deployment,
        sparkConfig: props.config.Spark,
        jobName: 'python-spark-pi',
        cluster: eksCluster.cluster,
        serviceAccount: sparkOperator.sparkServiceAccount
      });
      sparkPi.node.addDependency(sparkOperator);
    }

    if (props.config.DeployJobs.WeatherData) {
      const weatherDataJob = new PySparkJob(this, 'ecr-image-weather-data', {
        deployment: props.config.Deployment,
        sparkConfig: props.config.Spark,
        jobName: 'weather-data',
        cluster: eksCluster.cluster,
        serviceAccount: sparkOperator.sparkServiceAccount,
        environment: {
          S3_BUCKET: dataLake.bucket.bucketName
        }
      });
      weatherDataJob.node.addDependency(sparkOperator);
    }
  }
}
