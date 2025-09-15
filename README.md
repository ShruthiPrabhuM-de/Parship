🚀 FastAPI on AWS with CDK & GitHub Actions

This project demonstrates a production-ready approach to deploying a FastAPI application on AWS using infrastructure as code (IaC). The goal is to make the deployment reliable, secure, and easy to maintain.

After following this guide, your application will show a “Hello World” message when accessed through the load balancer.

🛠️ Tools Used

Python 3.9+ → FastAPI application

FastAPI → Lightweight Python web framework

Docker → Containerization of the app

AWS CDK (TypeScript) → Provision AWS resources using code

AWS ECS (EC2) → Host and scale containerized apps

Amazon ECR → Store Docker images securely

Application Load Balancer (ALB) → Expose application publicly

GitHub Actions → CI/CD pipeline for building, testing, and deploying

Trivy → Vulnerability scanning for container images

Gitleaks → Secret scanning in code repositories

Ruff → Python linter

Pytest → Unit testing framework

📂 Repository Structure
├── .github/workflows/ci.yaml     # GitHub Actions CI/CD pipeline
├── my-cdk-app/
│   ├── bin/my-cdk-app.ts         # CDK entrypoint
│   ├── lib/                      # Modular CDK stacks
│   │   ├── iam-stack.ts          # IAM stack (CI/CD user, roles, policies)
│   │   ├── ecr.ts                # ECR repository stack
│   │   ├── ecs-cluster.ts        # ECS cluster + VPC stack
│   │   ├── ecs-service.ts        # ECS service + task definition stack
│   │   └── alb.ts                # ALB stack
│   └── package.json              # CDK dependencies
└── app/                          # FastAPI application
    ├── main.py                   # Application code
    ├── requirements.txt          # Python dependencies
    ├── Dockerfile                # Container image build
    └── test_main.py              # Unit tests for FastAPI app

⚙️ Infrastructure as Code (IaC)

Written in AWS CDK (TypeScript)

Modular Stacks:

IamStack → IAM roles and policies for CI/CD

EcrStack → Creates ECR repository for images

EcsClusterStack → VPC + ECS Cluster + EC2 capacity

EcsServiceStack → ECS service, task definition, CloudWatch logs

AlbStack → Public ALB with listener and health checks

Each stack is responsible for one main resource

Principle of least privilege followed for IAM roles

🔄 CI/CD Pipeline

Defined in .github/workflows/cicd.yaml, triggered on pushes to main.

Pipeline steps:

Build CDK code (npm run build)

Security scans

Trivy → Scan Docker images for vulnerabilities

Gitleaks → Scan repository for secrets

Python app checks

Ruff → Linting

Pytest → Unit tests

Deploy ECR stack → Creates repository & outputs URI

Build & push Docker image → Push FastAPI image to ECR

Deploy remaining stacks → ECS Cluster, Service, and ALB

If any step fails (linting, testing, scanning), deployment stops automatically.

🔑 Managing Secrets
GitHub Actions Secrets

For CI/CD to deploy, you need to securely store credentials in GitHub:

AWS_ACCESS_KEY_ID → IAM access key

AWS_SECRET_ACCESS_KEY → IAM secret key

Steps:

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add your AWS credentials as repository secrets

Reference them in your GitHub Actions workflow (ci.yaml)

Example snippet in workflow:

env:
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

🧪 Local Testing
FastAPI without Docker
cd app
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000


Access → http://localhost:8000 → Hello World

With Docker
cd app
docker build -t fastapi-app:local .
docker run -p 8000:8000 fastapi-app:local


Access → http://localhost:8000 → Hello World

Run Tests
pytest -v
ruff check .

☁️ Deploying to AWS (CDK)
1. Bootstrap CDK Environment
cdk bootstrap aws://<ACCOUNT_ID>/<REGION>

2. Install & Build CDK
cd my-cdk-app
npm ci
npm run build

3. CDK Workflow

Synthesize CloudFormation:

cdk synth


List stacks:

cdk list


Deploy ECR:

cdk deploy EcrStack --require-approval never


Build & push Docker image:

cd app
docker build -t my-app:latest .
docker tag my-app:latest <ECR_REPOSITORY_URI>:latest
docker push <ECR_REPOSITORY_URI>:latest


Deploy remaining stacks:

cdk deploy --all --require-approval never


✅ Once deployed, your ALB URL will serve the FastAPI “Hello World” application.

4. Destroy Stacks (Gracefully)

Destroy stacks in reverse dependency order:

cdk destroy AlbStack
cdk destroy EcsServiceStack
cdk destroy EcsClusterStack
cdk destroy EcrStack
cdk destroy IamStack


Or all at once:

cdk destroy --all --force

🔒 Security Considerations

Image scanning enabled in ECR

Trivy + Gitleaks in CI/CD

Least privilege IAM roles

Secrets stored securely (GitHub secrets + AWS Secrets Manager)

📌 Trade-offs

ECS EC2 vs Fargate → EC2 is cost-effective and flexible, Fargate is simpler to manage

TLS → Not implemented in this sample, should be added for production

Scaling → ECS Service runs 2 tasks; auto-scaling can be added

Architecture match → Ensure container images are built for the same CPU architecture as ECS instances (e.g., linux/x86_64)