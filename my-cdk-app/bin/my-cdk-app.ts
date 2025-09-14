// bin/app.ts
import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr';
import { EcsClusterStack } from '../lib/ecs-cluster';
import { EcsServiceStack } from '../lib/ecs-service';
import { AlbStack } from '../lib/alb';
import { IamStack } from '../lib/iam-stack';

const app = new cdk.App();

// 1️⃣ Create IAM stack first (so roles/users are available for other stacks)
const iamStack = new IamStack(app, 'IamStack');

const ecrStack = new EcrStack(app, 'EcrStack');
const clusterStack = new EcsClusterStack(app, 'EcsClusterStack');
const ecsServiceStack = new EcsServiceStack(app, 'EcsServiceStack', {
  cluster: clusterStack.cluster,
  repository: ecrStack.repository, 
  taskRole: iamStack.ecsTaskRole,  // <- assign the least-privilege task role
});

// NEW: Add AlbStack
new AlbStack(app, 'AlbStack', {
  vpc: clusterStack.cluster.vpc,
  service: ecsServiceStack.service,
});