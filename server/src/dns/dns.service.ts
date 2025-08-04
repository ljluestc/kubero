import { Injectable, Logger } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { KubernetesService } from '../kubernetes/kubernetes.service';

@Injectable()
export class DnsService {
  private readonly logger = new Logger(DnsService.name);
  private lastSyncTime: Date = new Date();
  private syncErrorCount = 0;

  constructor(
    private readonly kubernetesService: KubernetesService,
    @InjectMetric('kubero_dns_sync_errors') private dnsSyncErrors: Counter<string>,
  ) {}

  async countDnsEntries(): Promise<number> {
    try {
      // Get DNS entries from Kubernetes resources with external-dns annotations
      const services = await this.kubernetesService.listServicesWithDnsAnnotations();
      const ingresses = await this.kubernetesService.listIngressesWithDnsAnnotations();
      
      return services.length + ingresses.length;
    } catch (error) {
      this.logger.error(`Error counting DNS entries: ${error.message}`);
      return 0;
    }
  }

  async syncDnsEntries(): Promise<boolean> {
    try {
      // This would trigger external-dns to sync by ensuring all resources
      // have the correct annotations
      const apps = await this.kubernetesService.listApps();
      
      for (const app of apps) {
        await this.ensureDnsAnnotations(app);
      }
      
      this.lastSyncTime = new Date();
      return true;
    } catch (error) {
      this.syncErrorCount++;
      this.dnsSyncErrors.inc({});
      this.logger.error(`Error syncing DNS entries: ${error.message}`);
      return false;
    }
  }
  
  async getDnsSyncStatus(): Promise<{ success: boolean; lastSync: Date; errorCount: number }> {
    return {
      success: this.syncErrorCount === 0,
      lastSync: this.lastSyncTime,
      errorCount: this.syncErrorCount,
    };
  }
  
  private async ensureDnsAnnotations(app: any): Promise<void> {
    // Implementation would add the external-dns annotations to services and ingresses
    // associated with the app if they don't already have them
    
    // Example implementation (pseudocode):
    // const hostname = `${app.name}.${app.domain}`;
    // const annotations = {
    //   'external-dns.alpha.kubernetes.io/hostname': hostname,
    // };
    
    // await this.kubernetesService.updateServiceAnnotations(app.name, app.namespace, annotations);
    // await this.kubernetesService.updateIngressAnnotations(app.name, app.namespace, annotations);
  }
}
