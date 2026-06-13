const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'farwellcse2026@gmail.com',
    pass: process.env.GMAIL_PASS || 'tmbjcxqgsbbxijnb',
  },
});

class LeadService {
  async createLead(data) {
    return await prisma.admissionLead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        courseId: data.courseId,
        payment: {
          create: { amount: 1500, status: 'PENDING' }
        }
      },
      include: { payment: true }
    });
  }

  async getLeadById(id) {
    return await prisma.admissionLead.findUnique({
      where: { id },
      include: { documents: true, payment: true }
    });
  }

  async getLeads() {
    return await prisma.admissionLead.findMany({
      include: { payment: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updatePaymentStatus(leadId, status, adminId, ipAddress) {
    const payment = await prisma.payment.findUnique({ where: { admissionLeadId: leadId } });
    if (!payment) throw new Error('Payment not found');
    const oldStatus = payment.status;
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'UPDATE_PAYMENT_STATUS',
        entityType: 'Payment',
        entityId: payment.id,
        oldValue: oldStatus,
        newValue: status,
        ipAddress: ipAddress || null
      }
    });

    return updatedPayment;
  }

  async approveLead(leadId, adminId, ipAddress) {
    const lead = await this.getLeadById(leadId);
    if (!lead) throw new Error('Lead not found');

    const updatedLead = await prisma.admissionLead.update({
      where: { id: leadId },
      data: { status: 'APPROVED' }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'APPROVE_ADMISSION_LEAD',
        entityType: 'AdmissionLead',
        entityId: lead.id,
        oldValue: 'PENDING',
        newValue: 'APPROVED',
        ipAddress: ipAddress || null
      }
    });

    // Simulate ERP Account Generation
    const erpId = `${new Date().getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`;
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    try {
      const user = await prisma.user.create({
        data: {
          email: lead.email,
          loginId: erpId,
          passwordHash: hashedPassword,
          role: 'STUDENT',
        },
      });

      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          firstName: lead.firstName,
          lastName: lead.lastName,
          phone: lead.phone,
          course: lead.courseId || ''
        },
      });

      await transporter.sendMail({
        from: process.env.GMAIL_USER ? `Admissions <${process.env.GMAIL_USER}>` : 'Admissions',
        to: lead.email,
        subject: 'Admission Approved - Your Login Credentials',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #1e3a8a;">Hello ${lead.firstName},</h2>
            <p>Your application has been approved and your payment has been processed!</p>
            <p>You can now log in to the Graphic Era ERP student portal.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Your ERP Login ID:</strong> ${erpId}</p>
              <p style="margin: 5px 0;"><strong>Your Password:</strong> ${tempPassword}</p>
            </div>
            <p>Welcome to Graphic Era University!</p>
            <p>Office of Admissions</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("Account generation or email failed:", err);
    }

    return updatedLead;
  }
}

module.exports = new LeadService();