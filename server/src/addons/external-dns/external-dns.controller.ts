import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { DnsService } from '../../dns/dns.service';

interface DNSAddonConfigDto {
  enabled: boolean;
  provider: string;
  domainFilter: string;
  policy: string;
  txtOwnerId: string;
  credentials: Record<string, string>;
}

@Controller('api/addons/external-dns')
export class ExternalDnsController {
  private readonly logger = new Logger(ExternalDnsController.name);

  constructor(private readonly dnsService: DnsService) {}

  @Get('config')
  async getConfig() {
    return this.dnsService.getAddonConfig();
  }

  @Post('config')
  async updateConfig(@Body() config: DNSAddonConfigDto) {
    this.logger.log(`Updating External-DNS config: ${config.provider}, enabled: ${config.enabled}`);
    const success = await this.dnsService.updateAddonConfig(config);
    
    if (!success) {
      return { success: false, message: 'Failed to update External-DNS configuration' };
    }
    
    return { success: true, message: 'External-DNS configuration updated successfully' };
  }

  @Get('status')
  async getStatus() {
    return this.dnsService.getDnsSyncStatus();
  }

  @Post('sync')
  async syncDnsEntries() {
    const success = await this.dnsService.syncDnsEntries();
    return { success };
  }

  @Get('entries')
  async countEntries() {
    const count = await this.dnsService.countDnsEntries();
    return { count };
  }
}
