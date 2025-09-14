
# 🚀 FastAPI on AWS with CDK & GitHub Actions

## Overview

This project demonstrates a production-grade approach** to deploying a small application with a focus on reliability, security, and maintainability.

It uses:

* **FastAPI** → lightweight Python web framework for the application
* **AWS CDK (TypeScript)** → Infrastructure as Code to provision AWS resources
* **GitHub Actions** → CI/CD pipeline with testing, linting, and security checks
* **Docker & ECR** → containerization and secure image storage
* **ECS (EC2)** + **ALB** → scalable and reliable application hosting


## 🛠️ Prerequisites

Before running or deploying this project, ensure you have the following installed and configured:

### Local Setup

* **Python 3.9+** (tested with 3.11)
* **pip** package manager
* **Node.js v18+** (required for AWS CDK)
* **npm** (bundled with Node.js)
* **Docker** (to build and test images locally)
* **Git** (for cloning and version control)

### AWS Setup

* **AWS Account** with permissions for:

  * ECR (Elastic Container Registry)
  * ECS (Elastic Container Service)
  * EC2 + VPC + Security Groups
  * IAM (to create roles for ECS tasks)
  * ALB (Application Load Balancer)
* **AWS CLI** installed and configured with `aws configure`
* **AWS CDK CLI** installed globally:


  npm install -g aws-cdk
 
* **CDK Bootstrap** (run once per account/region):

  
  cdk bootstrap aws://<ACCOUNT_ID>/<REGION>


### GitHub Actions Secrets

* `AWS_ACCESS_KEY_ID` → IAM access key
* `AWS_SECRET_ACCESS_KEY` → IAM secret key



## 🏗️ Architecture


## 📂 Repository Structure

```
.
├── .github/workflows/ci.yaml     # GitHub Actions pipeline
├── my-cdk-app/
│   ├── bin/my-cdk-app.ts         # CDK app entrypoint
│   ├── lib/                      # Modular CDK stacks
│   │   ├── ecr.ts                # ECR repository
│   │   ├── ecs-cluster.ts        # ECS cluster + VPC
│   │   ├── ecs-service.ts        # ECS service + task definition
│   │   └── alb.ts                # Application Load Balancer
│   └── package.json              # CDK dependencies
└── app/                          # FastAPI application
    ├── main.py                   # Unit tests (pytest)
    ├── requirements.txt          # Python dependencies
    └── Dockerfile                # Container build


## ⚙️ Infrastructure as Code (IaC)

* Written in **AWS CDK (TypeScript)**
* **Stacks are modular**:

  * `EcrStack`: ECR repository with image scanning enabled
  * `EcsClusterStack`: VPC + ECS Cluster + EC2 capacity
  * `EcsServiceStack`: ECS task/service, CloudWatch logs, container definition
  * `AlbStack`: Public ALB with listener & health checks

 Following **principle of least privilege**, each stack does only one job.

## 🔄 CI/CD Pipeline

The GitHub Actions workflow (`ci.yaml`) runs on pushes to `main`:

1. **Build** → Compile CDK code (`npm run build`)
2. **Security checks** →

   * [Trivy](https://aquasecurity.github.io/trivy/) → file system / Docker image scans
   * [Gitleaks](https://github.com/zricethezav/gitleaks) → secret scanning
3. **Python app checks** →

   * `ruff` → linting
   * `pytest` → unit tests for FastAPI
4. **Deploy ECR stack** → Creates repo & outputs URI
5. **Build & push Docker image** → Pushes FastAPI app image to ECR
6. **Deploy remaining stacks** → ECS Cluster + Service + ALB

✅ If linting, tests, or scans fail → deployment stops.


## 🧪 Application (FastAPI)


Unit test with `pytest` (`app/main.py`):

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hello World"}


## ▶️ Running Locally

### FastAPI without Docker

cd app
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000


### With Docker

cd app
docker build -t fastapi-app:local .
docker run -p 8000:8000 fastapi-app:local


### Run Tests

pytest -v
ruff check .


## ☁️ Deploying to AWS (CDK)

cd my-cdk-app
npm ci
npm run build

# Deploy ECR first
cdk deploy EcrStack --require-approval never

# Deploy everything
cdk deploy --all --require-approval never

# Destroy resources
cdk destroy --all --force


## 🔒 Security Considerations

* **Image scanning** enabled in ECR
* **Trivy + Gitleaks** run in CI
* **Least privilege** stacks (split by concern)
* **Recommendations for production**:

  * Use **GitHub OIDC** instead of long-lived AWS keys
  * Restrict ALB security group (not `0.0.0.0/0`)
  * Add HTTPS via ACM (TLS)
  * Use Secrets Manager for DB/API keys
  * Add CloudWatch alarms + monitoring




