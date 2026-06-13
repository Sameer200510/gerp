import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { AdmissionsService } from './admissions.service';
import { Prisma } from '@college-erp/database';

@Controller('api/admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Post()
  async createLead(@Body() data: Prisma.AdmissionLeadCreateInput) {
    return this.admissionsService.createLead(data);
  }

  @Get()
  async getLeads() {
    return this.admissionsService.getLeads();
  }

  @Get(':id')
  async getLeadById(@Param('id') id: string) {
    return this.admissionsService.getLeadById(id);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.admissionsService.updateLeadStatus(id, status);
  }

  @Post(':id/approve')
  async approveAdmission(@Param('id') id: string) {
    return this.admissionsService.approveAdmission(id);
  }
}
