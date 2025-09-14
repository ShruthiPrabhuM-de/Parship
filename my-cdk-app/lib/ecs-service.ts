// ecs-service-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';

interface EcsServiceStackProps extends cdk.StackProps {
  cluster: ecs.Cluster;
  repository: ecr.IRepository;
  taskRole?: iam.IRole;
}

export class EcsServiceStack extends cdk.Stack {
  public readonly service: ecs.Ec2Service;
  constructor(scope: Construct, id: string, props: EcsServiceStackProps) {
    super(scope, id, props);

    // 1. Task Definition
    const taskDef = new ecs.Ec2TaskDefinition(this, 'MyTaskDef');

    const container = taskDef.addContainer('AppContainer', {
      image: ecs.ContainerImage.fromEcrRepository(props.repository, 'latest'),
      memoryLimitMiB: 512,
      cpu: 256,
      logging: ecs.LogDriver.awsLogs({ streamPrefix: 'MyApp' }),
    });

    container.addPortMappings({
      containerPort: 8000, // 👈 expose port 8000 from the container
    });

    // 2. ECS Service
      const service = new ecs.Ec2Service(this, 'MyEc2Service', {
      cluster: props.cluster,
      taskDefinition: taskDef,
      desiredCount: 2,
    });

    this.service = service;

  }
}