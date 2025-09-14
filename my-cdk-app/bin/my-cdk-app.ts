import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr';
import { EcsClusterStack } from '../lib/ecs-cluster';
import { EcsServiceStack } from '../lib/ecs-service';
import { AlbStack } from '../lib/alb';
import { ItAdminIamStack } from '../lib/iam';

const app = new cdk.App();

// Configure IAM for itadmin
new ItAdminIamStack(app, 'ItAdminIamStack', {
  itAdminUserName: 'itadmin',
});

// Other stacks
const ecrStack = new EcrStack(app, 'EcrStack');
const clusterStack = new EcsClusterStack(app, 'EcsClusterStack');
const ecsServiceStack = new EcsServiceStack(app, 'EcsServiceStack', {
  cluster: clusterStack.cluster,
  repository: ecrStack.repository,
});

new AlbStack(app, 'AlbStack', {
  vpc: clusterStack.cluster.vpc,
  service: ecsServiceStack.service,
});
