// ecs-cluster-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';

export class EcsClusterStack extends cdk.Stack {
  public readonly cluster: ecs.Cluster;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });

    this.cluster = new ecs.Cluster(this, 'MyCluster', {
      vpc,
      clusterName: 'MyEc2EcsCluster',
    });

    this.cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
      instanceType: new ec2.InstanceType('t3.small'),
      desiredCapacity: 2,
      minCapacity: 1,
      maxCapacity: 3,
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });
  }
}