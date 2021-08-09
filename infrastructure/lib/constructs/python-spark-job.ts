import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import { DeploymentConfig } from '../config/deployment-config';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import { SparkConfig } from '../config/sections/spark';

export interface PySparkJobProps {
  readonly deployment: DeploymentConfig;
  readonly sparkConfig: SparkConfig;
  readonly jobName: string;
  readonly cluster: eks.Cluster;
  readonly serviceAccount: eks.ServiceAccount;
  readonly environment?: { [key: string]: string };
}
  
export class PySparkJob extends cdk.Construct {
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props: PySparkJobProps) {
    super(scope, id);

    const image = new DockerImageAsset(this, `docker-image-asset-${props.jobName}`, {
      directory: `./assets/docker-images/${props.jobName}`,
      buildArgs: {
        AWS_SDK_VERSION: props.sparkConfig.AwsSdkVersion,
        HADOOP_VERSION: props.sparkConfig.HadoopVersion,
        SPARK_VERSION: props.sparkConfig.Version
      }
    });

    // let specEnvironment = props.environment ? 
    //   Object.entries(props.environment).map(([key, value]) =>{
    //     return {
    //       name: key,
    //       value: value
    //     }
    //   }) :
    //   [];

    props.cluster.addManifest(`spark-job-${props.jobName}`, {
      apiVersion: 'sparkoperator.k8s.io/v1beta2',
      kind: 'SparkApplication',
      metadata: {
        name: props.jobName,
        namespace: 'default'
      },
      spec: {
        sparkVersion: props.sparkConfig.Version,
        type: 'Python',
        pythonVersion: '3',
        mode: 'cluster',
        image: image.imageUri,
        mainApplicationFile: 'local:///opt/spark-job/application.py',
        sparkConf: { },
        hadoopConf: {
          'fs.s3a.impl': 'org.apache.hadoop.fs.s3a.S3AFileSystem'
        },
        driver: {
          envVars: props.environment ?? {},
          cores: 1,
          coreLimit: "1200m",
          memory: "512m",
          labels: {
            version: props.sparkConfig.Version
          },
          serviceAccount: props.serviceAccount.serviceAccountName
        },
        executor: {
          envVars: props.environment ?? {},
          cores: 1,
          instances: 1,
          memory: "512m",
          labels: {
            version: props.sparkConfig.Version
          }
        }
      }
    });
  }
}