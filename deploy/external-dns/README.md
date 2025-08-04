# External DNS for Kubero

This directory contains Kubernetes manifests for deploying external-dns as an add-on for Kubero.

## Overview

External DNS synchronizes exposed Kubernetes Services and Ingresses with DNS providers such as:
- AWS Route53
- Google Cloud DNS
- Azure DNS
- Cloudflare
- And many others

## Installation

1. Edit the deployment.yaml file:
   - Set your DNS provider (`--provider`)
   - Set your domain filter (`--domain-filter`)
   - Configure any provider-specific settings

2. Edit the secret.yaml file:
   - Add your DNS provider credentials
   - Ensure credentials are base64 encoded

3. Apply the manifests:
   ```bash
   kubectl apply -f rbac.yaml
   kubectl apply -f secret.yaml
   kubectl apply -f deployment.yaml
   ```

## Usage with Kubero

Once external-dns is deployed, you can use it with Kubero by adding annotations to your Services or Ingresses:
