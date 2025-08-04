import { reactive } from 'vue';

export interface AddonFormField {
  name: string;
  type: 'text' | 'select' | 'keyvalue' | 'boolean';
  label: string;
  options?: string[];
  default?: string | boolean;
}

export interface Addon {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  global: boolean;
  formFields: AddonFormField[];
}

export const addons = reactive<Addon[]>([
  {
    name: 'external-dns',
    displayName: 'DNS Management (External-DNS)',
    description: 'Automatically manage DNS records for app domains using External-DNS.',
    icon: '/img/addons/external-dns.svg',
    global: true,
    formFields: [
      {
        name: 'enabled',
        type: 'boolean',
        label: 'Enable External-DNS',
        default: false
      },
      {
        name: 'provider',
        type: 'select',
        options: ['aws', 'google', 'cloudflare', 'azuredns', 'digitalocean'],
        label: 'DNS Provider'
      },
      {
        name: 'domainFilter',
        type: 'text',
        label: 'Domain Filter (e.g., example.com)'
      },
      {
        name: 'policy',
        type: 'select',
        options: ['sync', 'upsert-only'],
        label: 'Sync Policy',
        default: 'upsert-only'
      },
      {
        name: 'txtOwnerId',
        type: 'text',
        label: 'TXT Record Owner ID (e.g., kubero-cluster)',
        default: 'kubero'
      },
      {
        name: 'credentials',
        type: 'keyvalue',
        label: 'Provider Credentials (e.g., API keys)'
      },
    ],
  }
]);

export default addons;
