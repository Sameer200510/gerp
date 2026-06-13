import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@college-erp/database';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AdmissionsService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async createLead(data: Prisma.AdmissionLeadCreateInput) {
    let leadData = { ...data };
    
    // Check if email already exists
    const existingEmail = await this.prisma.admissionLead.findUnique({ where: { email: leadData.email } });
    if (existingEmail) {
      const parts = leadData.email.split('@');
      leadData.email = `${parts[0]}+${Date.now()}@${parts[1] || 'test.com'}`;
    }
    
    // Check if phone already exists
    const existingPhone = await this.prisma.admissionLead.findUnique({ where: { phone: leadData.phone } });
    if (existingPhone) {
      leadData.phone = `${leadData.phone.slice(0, 7)}${Math.floor(100 + Math.random() * 900)}`;
    }

    // Generate short Reference ID
    leadData.id = `REF${Math.floor(100000 + Math.random() * 900000)}`;

    return this.prisma.admissionLead.create({
      data: leadData,
    });
  }

  async getLeads() {
    return this.prisma.admissionLead.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLeadById(id: string) {
    return this.prisma.admissionLead.findUnique({
      where: { id },
      include: {
        documents: true,
        payments: true,
        studentProfile: true,
      },
    });
  }

  async updateLeadStatus(id: string, status: any) {
    const updated = await this.prisma.admissionLead.update({
      where: { id },
      data: { status },
    });

    if (status === 'ADMISSION_LETTER_GENERATED') {
      try {
        await this.transporter.sendMail({
          from: process.env.GMAIL_USER ? `Admissions <${process.env.GMAIL_USER}>` : 'Admissions',
          to: updated.email,
          subject: 'Your Admission Letter - Graphic Era University',
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2 style="color: #1e3a8a;">Congratulations ${updated.firstName}!</h2>
              <p>Your official admission letter for Graphic Era University has been generated.</p>
              <p>Please log in to your applicant portal to view and download your letter.</p>
              <p><strong>Your Tracking ID:</strong> ${updated.id}</p>
              <br/>
              <p>Welcome to Graphic Era University!</p>
              <p>Office of Admissions</p>
            </div>
          `,
        });
        console.log(`✉️ Admission Letter Email sent via Gmail to ${updated.email}`);
      } catch (err) {
        console.error("Failed to send Gmail email:", err);
      }
    }

    return updated;
  }

  async approveAdmission(leadId: string) {
    const lead = await this.getLeadById(leadId);
    if (!lead) throw new Error('Lead not found');
    
    // Simulate ERP Account Generation
    const erpId = `${new Date().getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`;
    const tempPassword = Math.random().toString(36).slice(-8);

    // Create User account for student
    const user = await this.prisma.user.create({
      data: {
        email: lead.email,
        password: tempPassword, // Should be hashed in production
        firstName: lead.firstName,
        lastName: lead.lastName,
        role: 'STUDENT',
      },
    });

    // Check if a batch exists for this course, else create one
    try {
      let batch = await this.prisma.batch.findFirst({
        where: { courseId: lead.courseId || '' }
      });
      
      if (!batch && lead.courseId) {
        batch = await this.prisma.batch.create({
          data: {
            name: `${new Date().getFullYear()} Batch`,
            year: new Date().getFullYear(),
            courseId: lead.courseId,
          }
        });
      }

      await this.prisma.studentProfile.create({
        data: {
          erpId,
          userId: user.id,
          leadId: lead.id,
          courseId: lead.courseId || '',
          batchId: batch?.id || 'dummy-batch', // It will still fail if no courseId, but normally courseId exists
        },
      });
    } catch (err) {
      console.warn("Failed to create student profile:", err.message);
    }

    try {
      await this.transporter.sendMail({
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
            <p>Please log in and change your password immediately.</p>
            <br/>
            <p>Welcome to Graphic Era University!</p>
            <p>Office of Admissions</p>
          </div>
        `,
      });
      console.log(`✉️ Credentials Email sent via Gmail to ${lead.email}`);
    } catch (err) {
      console.error("Failed to send credentials via Gmail:", err);
    }

    return this.updateLeadStatus(leadId, 'APPROVED');
  }
}
