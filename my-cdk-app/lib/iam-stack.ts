import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class IamStack extends cdk.Stack {
  ecsTaskRole: any;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Example: IAM role for ECS tasks
    const ecsTaskRole = new iam.Role(this, 'EcsTaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      description: 'Role for ECS task to access AWS resources',
    });

    ecsTaskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly')
    );

    // Example: IAM user for CI/CD (least privilege)
    const ciUser = new iam.User(this, 'CiCdUser', {
      userName: 'ci-cd-user',
    });

    ciUser.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryPowerUser')
    );

    new cdk.CfnOutput(this, 'CiCdUserName', { value: ciUser.userName });
  }
}
