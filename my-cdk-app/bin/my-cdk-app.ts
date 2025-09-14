// bin/app.ts
import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr';
import { EcsClusterStack } from '../lib/ecs-cluster';
import { EcsServiceStack } from '../lib/ecs-service';
import { AlbStack } from '../lib/alb';


const app = new cdk.App();


const ecrStack = new EcrStack(app, 'EcrStack');
const clusterStack = new EcsClusterStack(app, 'EcsClusterStack');
const ecsServiceStack = new EcsServiceStack(app, 'EcsServiceStack', {
  cluster: clusterStack.cluster,
  repository: ecrStack.repository, 
});

// NEW: Add AlbStack
new AlbStack(app, 'AlbStack', {
  vpc: clusterStack.cluster.vpc,
  service: ecsServiceStack.service,
});