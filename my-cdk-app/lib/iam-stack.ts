// lib/iam-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class IamStack extends cdk.Stack {
  public readonly ciUser: iam.User;
  public readonly cdkDeployPolicy: iam.ManagedPolicy;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a Managed Policy for CDK deployment
    this.cdkDeployPolicy = new iam.ManagedPolicy(this, 'CdkDeployPolicy', {
      description: 'Least privilege policy for CI/CD deployment of ECR, ECS, ALB stacks',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            // CloudFormation & CDK
            'cloudformation:*',
            // ECS & ECR
            'ecs:*',
            'ecr:*',
            // EC2 describe actions for ECS & ALB
            'ec2:Describe*',
            // ALB/NLB
            'elasticloadbalancing:*',
            // S3 if used for CDK assets
            's3:*',
            // Logs
            'logs:*',
            // SSM for CDK bootstrap
            'ssm:GetParameter',
            'ssm:GetParameters',
            'ssm:PutParameter',
            // IAM roles for ECS tasks
            'iam:PassRole',
            // Identity check
            'sts:GetCallerIdentity',
          ],
          resources: ['*'],
        }),
      ],
    });

    // Create a CI/CD user
    this.ciUser = new iam.User(this, 'CICDUser', {
      userName: 'ci-cd-user',
    });

    // Attach the managed policy
    this.ciUser.addManagedPolicy(this.cdkDeployPolicy);

    // Output the username for GitHub Actions or reference
    new cdk.CfnOutput(this, 'CIUserName', { value: this.ciUser.userName });
  }
}
