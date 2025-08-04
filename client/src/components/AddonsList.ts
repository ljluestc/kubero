// ...existing code...
export const addons = [
  // ...existing code...
  {
    name: 'external-dns',
    displayName: 'DNS Management (External-DNS)',
    description: 'Automatically manage DNS records for app domains using External-DNS.',
    icon: '/img/addons/external-dns.svg',
    global: true,
    formFields: [
      { name: 'provider', type: 'select', options: ['aws', 'google', 'cloudflare', 'azuredns', 'digitalocean'], label: 'DNS Provider' },
      { name: 'domainFilter', type: 'text', label: 'Domain Filter (e.g., example.com)' },
      { name: 'credentials', type: 'keyvalue', label: 'Provider Credentials (e.g., API keys)' },
      { name: 'policy', type: 'select', options: ['sync', 'upsert-only'], label: 'Sync Policy', default: 'sync' },
    ],
  }
  // ...existing code...
];

// ...existing code...

// Example handler for enabling the add-on
async function enableAddon(config) {
  await fetch('/api/addons/external-dns', { method: 'POST', body: JSON.stringify(config) });
}

// ...existing code...

