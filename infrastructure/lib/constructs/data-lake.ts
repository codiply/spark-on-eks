import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import { DeploymentConfig } from '../config/deployment-config';

export interface DataLakeProps {
  readonly deployment: DeploymentConfig;
}
  
export class DataLake extends cdk.Construct {
  public readonly bucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string, props: DataLakeProps) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 's3-bucket', {
      bucketName: `${props.deployment.Prefix}-data-lake-${props.deployment.AWSAccountID}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    new s3deploy.BucketDeployment(this, 'weather-data', {
      sources: [s3deploy.Source.asset('../data/weather/')],
      destinationBucket: bucket,
      destinationKeyPrefix: 'weather',
      retainOnDelete: false,
      memoryLimit: 1024
    });

    this.bucket = bucket;
  }
}