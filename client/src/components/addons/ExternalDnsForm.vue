<template>
  <div class="external-dns-form">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-switch
        v-model="config.enabled"
        label="Enable External-DNS"
        hint="Automatically manage DNS records for Kubero apps"
        persistent-hint
        color="primary"
      ></v-switch>

      <v-card v-if="config.enabled" class="mt-4 pa-4">
        <v-select
          v-model="config.provider"
          :items="dnsProviders"
          label="DNS Provider"
          :rules="[v => !!v || 'Provider is required']"
          required
        ></v-select>

        <v-text-field
          v-model="config.domainFilter"
          label="Domain Filter"
          hint="Only manage DNS records for this domain (e.g., example.com)"
          persistent-hint
          :rules="[v => !!v || 'Domain filter is required']"
          required
        ></v-text-field>

        <v-select
          v-model="config.policy"
          :items="syncPolicies"
          label="Sync Policy"
          hint="How External-DNS should sync records"
          persistent-hint
        ></v-select>

        <v-text-field
          v-model="config.txtOwnerId"
          label="TXT Owner ID"
          hint="Used to identify which records are managed by this External-DNS instance"
          persistent-hint
        ></v-text-field>

        <h3 class="text-h6 my-4">Provider Credentials</h3>
        <p class="text-body-2 mb-4">These credentials will be stored as a Kubernetes Secret</p>

        <div v-if="config.provider === 'aws'">
          <v-text-field
            v-model="credentials.AWS_ACCESS_KEY_ID"
            label="AWS Access Key ID"
            :rules="[v => !!v || 'AWS Access Key ID is required']"
            required
          ></v-text-field>
          <v-text-field
            v-model="credentials.AWS_SECRET_ACCESS_KEY"
            label="AWS Secret Access Key"
            type="password"
            :rules="[v => !!v || 'AWS Secret Access Key is required']"
            required
          ></v-text-field>
          <v-text-field
            v-model="credentials.AWS_REGION"
            label="AWS Region"
            :rules="[v => !!v || 'AWS Region is required']"
            required
          ></v-text-field>
        </div>

        <div v-else-if="config.provider === 'cloudflare'">
          <v-text-field
            v-model="credentials.CF_API_TOKEN"
            label="Cloudflare API Token"
            :rules="[v => !!v || 'Cloudflare API Token is required']"
            required
          ></v-text-field>
          <v-text-field
            v-model="credentials.CF_ZONE_ID"
            label="Cloudflare Zone ID (optional)"
          ></v-text-field>
        </div>

        <div v-else-if="config.provider === 'google'">
          <v-textarea
            v-model="credentials.GOOGLE_APPLICATION_CREDENTIALS_JSON"
            label="Google Service Account JSON Key"
            :rules="[v => !!v || 'Service Account JSON is required']"
            required
            rows="5"
          ></v-textarea>
          <v-text-field
            v-model="credentials.GOOGLE_PROJECT"
            label="Google Project ID"
            :rules="[v => !!v || 'Project ID is required']"
            required
          ></v-text-field>
        </div>

        <div v-else-if="config.provider === 'azuredns'">
          <v-text-field
            v-model="credentials.AZURE_SUBSCRIPTION_ID"
            label="Azure Subscription ID"
            :rules="[v => !!v || 'Subscription ID is required']"
            required
          ></v-text-field>
          <v-text-field
            v-model="credentials.AZURE_TENANT_ID"
            label="Azure Tenant ID"
            :rules="[v => !!v || 'Tenant ID is required']"
            required
          ></v-text-field>
          <v-text-field
            v-model="credentials.AZURE_CLIENT_ID"
            label="Azure Client ID"
            :rules="[v => !!v || 'Client ID is required']"
            required
          ></v-text-field>
          <v-text-field
            v-model="credentials.AZURE_CLIENT_SECRET"
            label="Azure Client Secret"
            type="password"
            :rules="[v => !!v || 'Client Secret is required']"
            required
          ></v-text-field>
          <v-text-field
            v-model="credentials.AZURE_RESOURCE_GROUP"
            label="Azure Resource Group"
            :rules="[v => !!v || 'Resource Group is required']"
            required
          ></v-text-field>
        </div>

        <div v-else-if="config.provider === 'digitalocean'">
          <v-text-field
            v-model="credentials.DO_TOKEN"
            label="DigitalOcean API Token"
            type="password"
            :rules="[v => !!v || 'DigitalOcean Token is required']"
            required
          ></v-text-field>
        </div>

        <div v-else>
          <v-alert type="info" class="mt-2">
            Please select a DNS provider to see the required credentials.
          </v-alert>
        </div>
      </v-card>

      <v-btn
        color="primary"
        class="mt-4"
        :disabled="!valid"
        @click="saveConfig"
      >
        Save Configuration
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'ExternalDnsForm',
  setup() {
    const valid = ref(false);
    const form = ref(null);
    const loading = ref(false);
    const errorMessage = ref('');

    const config = reactive({
      enabled: false,
      provider: 'cloudflare',
      domainFilter: '',
      policy: 'upsert-only',
      txtOwnerId: 'kubero',
    });

    const credentials = reactive({});

    const dnsProviders = [
      { title: 'AWS Route53', value: 'aws' },
      { title: 'Cloudflare', value: 'cloudflare' },
      { title: 'Google Cloud DNS', value: 'google' },
      { title: 'Azure DNS', value: 'azuredns' },
      { title: 'DigitalOcean', value: 'digitalocean' },
    ];

    const syncPolicies = [
      { title: 'Sync (create, update and delete records)', value: 'sync' },
      { title: 'Upsert Only (only create and update records)', value: 'upsert-only' },
    ];

    // Load existing configuration on component mount
    onMounted(async () => {
      try {
        loading.value = true;
        const response = await axios.get('/api/addons/external-dns/config');
        if (response.data) {
          // Update config
          Object.assign(config, response.data);

          // Update credentials if present
          if (response.data.credentials) {
            Object.assign(credentials, response.data.credentials);
          }
        }
      } catch (error) {
        console.error('Failed to load External-DNS configuration:', error);
        errorMessage.value = 'Failed to load configuration';
      } finally {
        loading.value = false;
      }
    });

    const saveConfig = async () => {
      if (!form.value.validate()) {
        return;
      }

      try {
        loading.value = true;

        // Prepare the payload
        const payload = {
          ...config,
          credentials: { ...credentials }
        };

        await axios.post('/api/addons/external-dns/config', payload);

        // Show success message
        alert('External-DNS configuration saved successfully');
      } catch (error) {
        console.error('Failed to save External-DNS configuration:', error);
        errorMessage.value = error.response?.data?.message || 'Failed to save configuration';
      } finally {
        loading.value = false;
      }
    };

    return {
      valid,
      form,
      config,
      credentials,
      dnsProviders,
      syncPolicies,
      loading,
      errorMessage,
      saveConfig,
    };
  }
};
</script>

<style scoped>
.external-dns-form {
  max-width: 800px;
  margin: 0 auto;
}
</style>
