import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus, PaymentMode, LeadStatus } from '@college-erp/database';
import { AdmissionsService } from '../admissions/admissions.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private admissionsService: AdmissionsService
  ) {}

  async processPayment(leadId: string, amount: number, reference: string) {
    const lead = await this.prisma.admissionLead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Admission Lead not found');

    const payment = await this.prisma.payment.create({
      data: {
        leadId,
        amount,
        transactionId: reference,
        mode: PaymentMode.UPI,
        status: PaymentStatus.SUCCESS,
      },
    });

    // Trigger the actual admission logic which generates ID and emails
    await this.admissionsService.approveAdmission(leadId);

    return payment;
  }

  async getPaymentsByLead(leadId: string) {
    return this.prisma.payment.findMany({
      where: { leadId },
    });
  }
}
