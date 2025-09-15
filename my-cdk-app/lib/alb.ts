import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

interface AlbStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  service: ecs.Ec2Service;
}

export class AlbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AlbStackProps) {
    super(scope, id, props);

    const { vpc, service } = props;

    // ALB Security Group
    const albSG = new ec2.SecurityGroup(this, 'AlbSG', {
      vpc,
      description: 'Allow HTTP inbound',
      allowAllOutbound: true,
    });

    albSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP from anywhere');

    //  Public Application Load Balancer
    const alb = new elbv2.ApplicationLoadBalancer(this, 'MyAlb', {
      vpc,
      internetFacing: true,
      securityGroup: albSG,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    // Listener
    const listener = alb.addListener('HttpListener', {
      port: 80,
      open: true,
    });

    // Target Group → Added ECS service as target
    listener.addTargets('EcsTargetGroup', {
      port: 8000,
      targets: [service],
      healthCheck: {
        path: '/',
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 5,
      },
    });

    // Output the public ALB DNS
    new cdk.CfnOutput(this, 'AlbDns', {
      value: alb.loadBalancerDnsName,
      description: 'Public DNS for accessing ECS service',
    });
  }
}