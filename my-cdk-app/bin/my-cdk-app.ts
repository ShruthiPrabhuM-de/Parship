import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr';
import { EcsClusterStack } from '../lib/ecs-cluster';
import { EcsServiceStack } from '../lib/ecs-service';
import { AlbStack } from '../lib/alb';
import { IamStack } from '../lib/iam-stack';

const app = new cdk.App();

// Created IAM stack first (creates CI/CD user and managed policy)
const iamStack = new IamStack(app, 'IamStack');

// Other stacks
const ecrStack = new EcrStack(app, 'EcrStack');
const clusterStack = new EcsClusterStack(app, 'EcsClusterStack');

// ECS Service Stack
const ecsServiceStack = new EcsServiceStack(app, 'EcsServiceStack', {
  cluster: clusterStack.cluster,
  repository: ecrStack.repository,
});

// ALB Stack
new AlbStack(app, 'AlbStack', {
  vpc: clusterStack.cluster.vpc,
  service: ecsServiceStack.service,
});
