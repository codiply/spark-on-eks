import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import { DeploymentConfig } from '../config/deployment-config';
import { EksConfig } from '../config/sections/eks';

export interface EksClusterProps {
  readonly deployment: DeploymentConfig;
  readonly config: EksConfig;
  readonly vpc: ec2.Vpc;
}
  
export class EksCluster extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: EksClusterProps) {
    super(scope, id);

    const cluster = new eks.FargateCluster(this, 'eks-cluster', {
      vpc: props.vpc,
      version: eks.KubernetesVersion.V1_21,
      clusterName: `${props.deployment.Prefix}-cluster`,
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE.onlyFrom(...props.deployment.AllowedIpRanges)
    });

    props.deployment.AdminUserArns.forEach(userArn => {
      const user = iam.User.fromUserArn(this, userArn, userArn);

      cluster.awsAuth.addUserMapping(user, { groups: [ 'system:masters' ]});
    });

    cluster.addHelmChart('spark-operator', {
      chart: 'spark-operator',
      release: 'my-spark-operator-release',
      repository: 'https://googlecloudplatform.github.io/spark-on-k8s-operator',
      version: '1.1.6',
      namespace: 'spark-operator',
      createNamespace: true
    });
  }
}