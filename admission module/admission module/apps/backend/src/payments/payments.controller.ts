import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':leadId')
  async makePayment(
    @Param('leadId') leadId: string,
    @Body('amount') amount: number,
    @Body('reference') reference: string,
  ) {
    return this.paymentsService.processPayment(leadId, amount, reference);
  }

  @Get(':leadId')
  async getPayments(@Param('leadId') leadId: string) {
    return this.paymentsService.getPaymentsByLead(leadId);
  }
}
