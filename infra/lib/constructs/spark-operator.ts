import * as cdk from '@aws-cdk/core';
import * as eks from '@aws-cdk/aws-eks';

export interface SparkOperatorProps {
  readonly cluster: eks.Cluster;
  readonly version: string;
}
  
export class SparkOperator extends cdk.Construct {
  public sparkServiceAccount: eks.ServiceAccount;

  constructor(scope: cdk.Construct, id: string, props: SparkOperatorProps) {
    super(scope, id);

    const sparkOperatorNamespace = 'spark-operator';
    const sparkApplicationNamespace = 'default';

    const fargateProfile = props.cluster.addFargateProfile('spark-operator-fargate-profile', {
      fargateProfileName: 'spark-operator',
      selectors: [ { namespace: sparkOperatorNamespace }]
    });

    const sparkOperatorRelease = 'spark-operator-release';

    const sparkOperatorChart = props.cluster.addHelmChart('spark-operator', {
      chart: 'spark-operator',
      release: sparkOperatorRelease,
      repository: 'https://googlecloudplatform.github.io/spark-on-k8s-operator',
      version: props.version,
      namespace: sparkOperatorNamespace,
      createNamespace: true
    });

    const sparkOperatorDeploymentPatch = new eks.KubernetesPatch(this, 'spark-operator-patch', {
      cluster: props.cluster,
      resourceName: `deployment/${sparkOperatorRelease}`,
      resourceNamespace: sparkOperatorNamespace,
      applyPatch: { spec: { template: { metadata: { annotations: { 'eks.amazonaws.com/compute-type': 'fargate' }} } } },
      restorePatch: { }
    });
    sparkOperatorDeploymentPatch.node.addDependency(sparkOperatorChart);

    const sparkServiceAccountName = 'spark'
    const sparkServiceAccount = props.cluster.addServiceAccount('spark-service-account', {
      name: sparkServiceAccountName,
      namespace: sparkApplicationNamespace
    });

    const sparkRoleName = 'spark-role';
    const sparkRole = props.cluster.addManifest('spark-role-manifest', {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'Role',
      metadata: {
        name: sparkRoleName,
        namespace: sparkApplicationNamespace
      },
      rules: [
        { 
          apiGroups: [""],
          resources: ["pods"],
          verbs: ["*"]
        },
        { 
          apiGroups: [""],
          resources: ["services"],
          verbs: ["*"]
        },
        { 
          apiGroups: [""],
          resources: ["configmaps"],
          verbs: ["*"]
        }
      ]
    });
    sparkRole.node.addDependency(sparkServiceAccount);

    const sparkRoleBinding = props.cluster.addManifest('spark-role-binding-manifest', {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'RoleBinding',
      metadata: {
        name: 'spark',
        namespace: sparkApplicationNamespace
      },
      subjects: [
        { 
          kind: 'ServiceAccount',
          name: sparkServiceAccountName,
          namespace: sparkApplicationNamespace
        }
      ],
      roleRef: {
        kind: 'Role',
        name: sparkRoleName,
        apiGroup: 'rbac.authorization.k8s.io'
      }
    });
    sparkRoleBinding.node.addDependency(sparkRole);

    this.sparkServiceAccount = sparkServiceAccount;
  }
}