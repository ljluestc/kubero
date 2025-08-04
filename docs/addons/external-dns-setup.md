# Setting up External DNS with Kubero

This guide explains how to set up and configure External DNS to work with Kubero for automatic DNS management.

## Prerequisites

- A Kubernetes cluster with Kubero installed
- Access to one of the supported DNS providers:
  - AWS Route53
  - Google Cloud DNS
  - Azure DNS
  - Cloudflare
  - And [many others](https://github.com/kubernetes-sigs/external-dns#status-of-providers)
- kubectl configured to access your cluster

## Installation Options

### Option 1: Using the Kubero DNS Add-on

If you're using the Kubero DNS add-on, it will handle the deployment and configuration of External DNS automatically.

1. Enable the DNS add-on in your Kubero configuration
2. Configure your DNS provider credentials
3. The add-on will deploy External DNS with the appropriate settings

### Option 2: Manual Installation with Helm
