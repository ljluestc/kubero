import { Module } from '@nestjs/common';
import { DnsService } from './dns.service';
import { KubernetesModule } from '../kubernetes/kubernetes.module';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [
    KubernetesModule,
    MetricsModule,
  ],
  providers: [DnsService],
  exports: [DnsService],
})
export class DnsModule {}
