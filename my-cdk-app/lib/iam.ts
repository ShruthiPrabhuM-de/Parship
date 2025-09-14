// lib/iam.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

interface ItAdminIamStackProps extends cdk.StackProps {
  itAdminUserName: string; // Pass the existing IAM username
}

export class ItAdminIamStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ItAdminIamStackProps) {
    super(scope, id, props);

    // Import existing IAM user
    const itAdminUser = iam.User.fromUserName(this, 'ItAdminUser', props.itAdminUserName);

    // Create a policy for CDK bootstrap + deployment of ECR, ECS Cluster/Service, ALB
    const cdkDeployPolicy = new iam.ManagedPolicy(this, 'ItAdminCDKDeployPolicy', {
      description: 'Least privilege policy for CDK deployment of ECR, ECS, ALB stacks',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            // CDK & CloudFormation
            'cloudformation:*',

            // ECS & ECR
            'ecs:*',
            'ecr:*',

            // EC2 describe actions needed for ECS & ALB
            'ec2:Describe*',

            // ALB/NLB
            'elasticloadbalancing:*',

            // S3 access if used for assets
            's3:*',

            // Logs
            'logs:*',

            // SSM parameters for CDK bootstrap
            'ssm:GetParameter',
            'ssm:GetParameters',
            'ssm:PutParameter',

            // IAM roles for ECS tasks
            'iam:PassRole',

            // Identity check for deployment
            'sts:GetCallerIdentity',
          ],
          resources: ['*'],
        }),
      ],
    });

    // Attach the managed policy to the existing user
    itAdminUser.addManagedPolicy(cdkDeployPolicy);
  }
}
