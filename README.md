# 🔐 DevSecOps Integration — Task 2

> **CI/CD Pipeline with GitHub Actions, tfsec, Trivy & Sealed Secrets**

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Security Scan](https://img.shields.io/badge/Security-tfsec%20%7C%20Trivy-critical?logo=shield&logoColor=white)](https://github.com/aquasecurity/trivy)
[![Secrets](https://img.shields.io/badge/Secrets-Sealed%20Secrets-blueviolet?logo=kubernetes&logoColor=white)](https://github.com/bitnami-labs/sealed-secrets)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📌 Overview

This repository demonstrates the implementation of **DevSecOps** principles by integrating security directly into the CI/CD pipeline. The goal was to build a fully automated, secure, and production-ready deployment workflow by combining:

- **GitHub Actions** for CI/CD automation
- **tfsec** for static analysis of Terraform infrastructure code
- **Trivy** for Docker image vulnerability scanning
- **Sealed Secrets** for encrypted Kubernetes secret management

Security is treated as a first-class citizen — not an afterthought — by shifting security checks left into the development lifecycle.

---

## 🏗️ Architecture

```
Code Push
    │
    ▼
┌─────────────────────────────────────────────┐
│            GitHub Actions Workflow           │
│                                             │
│  ┌──────────┐  ┌────────┐  ┌────────────┐  │
│  │  tfsec   │  │ Trivy  │  │   Build    │  │
│  │ Terraform│  │ Docker │  │  & Deploy  │  │
│  │  Scan    │  │  Scan  │  │            │  │
│  └──────────┘  └────────┘  └────────────┘  │
│                                             │
│         ⬇ (on success)                      │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │     Kubernetes Cluster Deployment    │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │  Sealed Secrets (Encrypted)  │   │   │
│  │  └──────────────────────────────┘   │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 🚀 Features

| Feature | Tool | Purpose |
|---|---|---|
| CI/CD Automation | GitHub Actions | Trigger pipeline on every `git push` |
| Infrastructure Security Scan | tfsec | Detect misconfigurations in Terraform code |
| Container Vulnerability Scan | Trivy | Identify CVEs in Docker images |
| Secret Management | Sealed Secrets | Encrypt and safely deploy Kubernetes secrets |

---

## 🔧 Tech Stack

- **CI/CD**: GitHub Actions
- **IaC Security**: [tfsec](https://github.com/aquasecurity/tfsec)
- **Container Security**: [Trivy](https://github.com/aquasecurity/trivy)
- **Secret Management**: [Bitnami Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)
- **Container Orchestration**: Kubernetes
- **Infrastructure as Code**: Terraform

---

## 📁 Repository Structure
 
```
├── .github/
│   └── workflows/                   # GitHub Actions CI/CD pipeline definitions
├── k8s/                             # Kubernetes manifests (deployment, sealed secrets)
├── src/                             # Application source code (React/JSX)
├── .gitignore                       # Git ignore rules
├── Dockerfile                       # Docker image definition
├── README.md                        # Project documentation
├── eslint.config.js                 # ESLint configuration for code quality
├── index.html                       # Application entry HTML
├── nginx.conf                       # Nginx web server configuration
├── package-lock.json                # Locked dependency tree
├── package.json                     # Node.js project metadata and dependencies
└── vite.config.js                   # Vite bundler configuration
```
 
---

## ⚙️ CI/CD Pipeline Workflow

The pipeline triggers automatically on every `push` to the repository and runs the following stages in sequence:

### 1. 🔍 Terraform Security Scan — `tfsec`

Scans Terraform code for security misconfigurations before any infrastructure is provisioned.

```yaml
- name: Run tfsec
  uses: aquasecurity/tfsec-action@v1.0.0
  with:
    working_directory: ./terraform
```

Checks for issues such as:
- Exposed sensitive variables
- Publicly accessible resources
- Missing encryption settings
- Insecure network rules

### 2. 🐳 Docker Image Vulnerability Scan — `Trivy`

Scans the built Docker image for known CVEs across OS packages and application dependencies.

```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: your-image:latest
    format: table
    exit-code: '1'
    severity: CRITICAL,HIGH
```

### 3. 🔐 Sealed Secrets — Kubernetes Secret Encryption

Sensitive data (API keys, passwords, tokens) are encrypted using `kubeseal` before being committed to the repository. The Sealed Secrets controller in the cluster decrypts them at runtime.

```bash
# Encrypt a Kubernetes secret
kubectl create secret generic my-secret \
  --from-literal=password=supersecret \
  --dry-run=client -o yaml | \
  kubeseal --format=yaml > sealed-secret.yaml
```

The resulting `sealed-secret.yaml` is safe to commit — it can only be decrypted by the specific cluster's Sealed Secrets controller.

### 4. 🚢 Deploy to Kubernetes

After all security checks pass, the application is deployed to the Kubernetes cluster.

```yaml
- name: Deploy to Kubernetes
  run: |
    kubectl apply -f k8s/sealed-secret.yaml
    kubectl apply -f k8s/deployment.yaml
```

---

## 🛡️ Security Practices Applied

- **Shift-Left Security**: Security scans run at the very start of the pipeline, before build or deploy.
- **Zero-Trust Secrets**: No plaintext secrets are ever stored in the repository or environment variables.
- **Fail-Fast on Vulnerabilities**: Pipeline is configured to exit on `CRITICAL` or `HIGH` severity findings.
- **Encrypted Secret Storage**: All Kubernetes secrets are sealed and encrypted using asymmetric cryptography.
- **Automated Compliance**: Every code push goes through the full security gate — no manual steps required.

---

## 🏃 Getting Started

### Prerequisites

- Kubernetes cluster (local or cloud)
- `kubectl` configured
- `kubeseal` CLI installed
- Sealed Secrets controller deployed to the cluster
- Terraform installed (if using IaC)

### Install Sealed Secrets Controller

```bash
helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
helm install sealed-secrets sealed-secrets/sealed-secrets -n kube-system
```

### Clone the Repository

```bash
git clone https://github.com/Pratyush8448/Devops_Task-02.git
cd Devops_Task-02
```

### Run the Pipeline

Push any change to the repository to trigger the GitHub Actions workflow automatically:

```bash
git add .
git commit -m "feat: trigger devsecops pipeline"
git push origin main
```

---

## 📊 Pipeline Status

The GitHub Actions workflow provides real-time feedback on:

| Stage | Status Indicator |
|---|---|
| tfsec Scan | ✅ Pass / ❌ Fail |
| Trivy Image Scan | ✅ Pass / ❌ Fail |
| Kubernetes Deployment | ✅ Deployed / ⏳ Pending |

---

## 📚 References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [tfsec — Terraform Security Scanner](https://github.com/aquasecurity/tfsec)
- [Trivy — Container Vulnerability Scanner](https://github.com/aquasecurity/trivy)
- [Sealed Secrets by Bitnami](https://github.com/bitnami-labs/sealed-secrets)
- [Kubernetes Official Docs](https://kubernetes.io/docs/)

---

## 👤 Author

**Pratyush**
- GitHub: https://github.com/Pratyush8448
- Portfolio: https://pratyush-nishank-portfolio.vercel.app 

---

> *"Security is not a feature — it's a foundation."*
