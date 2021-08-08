import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import { DeploymentConfig } from '../config/deployment-config';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';

export interface PySparkJobProps {
  readonly deployment: DeploymentConfig;
  readonly jobName: string;
  readonly cluster: eks.Cluster;
  readonly sparkVersion: string;
}
  
export class PySparkJob extends cdk.Construct {
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props: PySparkJobProps) {
    super(scope, id);

    const image = new DockerImageAsset(this, `docker-image-asset-${props.jobName}`, {
      directory: `./assets/docker-images/${props.jobName}`,
      buildArgs: {
        SPARK_VERSION: props.sparkVersion
      }
    });

    props.cluster.addManifest(`spark-job-${props.jobName}`, {
      apiVersion: 'sparkoperator.k8s.io/v1beta2',
      kind: 'SparkApplication',
      metadata: {
        name: props.jobName,
        namespace: 'default'
      },
      spec: {
        sparkVersion: props.sparkVersion,
        type: 'Python',
        pythonVersion: "3",
        mode: 'cluster',
        image: image.imageUri,
        mainApplicationFile: 'local:///opt/spark/application.py',
        driver: {
          cores: 1,
          coreLimit: "1200m",
          memory: "512m",
          labels: {
            version: props.sparkVersion
          },
          serviceAccount: 'spark'
        },
        executor: {
          cores: 1,
          instances: 1,
          memory: "512m",
          labels: {
            version: props.sparkVersion
          }
        }
      }
    });
  }
}