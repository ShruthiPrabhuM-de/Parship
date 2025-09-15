// ecr-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class EcrStack extends cdk.Stack {
  public readonly repository: ecr.Repository;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Created the ECR repository
    this.repository = new ecr.Repository(this, 'MyRepository', {
      repositoryName: 'my-app-repo',
      imageScanOnPush: true,
    });

    // Added a CloudFormation output to expose the URI
    new cdk.CfnOutput(this, 'ECRRepoURI', {
      value: this.repository.repositoryUri,
      exportName: 'ECRRepoURI', // can be used for cross-stack references
    });
  }
}
