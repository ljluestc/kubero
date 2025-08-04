# Kubero DNS Add-on

This package implements DNS management for Kubero applications, allowing automatic creation, update, and deletion of DNS records for deployed applications.

## Features

- Support for multiple DNS providers:
  - Cloudflare
  - AWS Route53
  - Google Cloud DNS
  - Azure DNS
- Integration with external-dns operator
- Command-line utility for manual DNS operations

## Usage

### As a Kubero Add-on

The DNS add-on integrates with Kubero to automatically manage DNS entries for your applications. When enabled, it will:

1. Create DNS records when new applications are deployed
2. Update DNS records when applications are updated
3. Delete DNS records when applications are deleted

### Command-line Usage

The `dns-addon` command-line tool can be used for manual DNS operations:
