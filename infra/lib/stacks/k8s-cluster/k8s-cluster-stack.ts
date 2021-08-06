import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import { DeploymentConfig } from '../../config/config';
import { K8sClusterConfig } from './k8s-cluster-config';

export class K8sClusterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, deployment: DeploymentConfig, config: K8sClusterConfig, props?: cdk.StackProps) {
    super(scope, id, props);

    const natGatewayProvider = config.UseNatInstances ? 
      ec2.NatInstanceProvider.instance({instanceType: new ec2.InstanceType('t3.micro')}) :
      ec2.NatProvider.gateway()
      
    const vpc = new ec2.Vpc(this, `${deployment.Prefix}-vpc`, {
      cidr: config.VpcCidrRange,
      maxAzs: config.MaxAZs,
      natGateways: config.NatGateways,
      natGatewayProvider: natGatewayProvider,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC
        },
        {
          cidrMask: 22,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE
        },
      ]
    });
    cdk.Tags.of(vpc).add('Name', `${deployment.Prefix}-vpc`);

    const cluster = new eks.FargateCluster(this, 'eks-cluster', {
      vpc: vpc,
      version: eks.KubernetesVersion.V1_21,
      clusterName: `${deployment.Prefix}-cluster`,
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE.onlyFrom(deployment.AllowedIps)
    });
  }
}
