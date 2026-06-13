const fs = require('fs');
const path = require('path');

const targetRepo = path.join(__dirname, 'uni_erp_clone');
const prismaSchemaFile = path.join(targetRepo, 'backend/prisma/schema.prisma');
const moduleDir = path.join(targetRepo, 'backend/src/modules/erp-leads');

// 1. Append Prisma Schema
let schema = fs.readFileSync(prismaSchemaFile, 'utf8');

const newModels = `
model AdmissionLead {
  id              String   @id @default(uuid())
  firstName       String
  lastName        String
  email           String   @unique
  phone           String
  courseId        String?
  status          String   @default("PENDING")
  documents       DocumentFile[]
  payment         Payment?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model DocumentFile {
  id              String         @id @default(uuid())
  fileUrl         String
  status          String         @default("PENDING")
  admissionLeadId String
  admissionLead   AdmissionLead  @relation(fields: [admissionLeadId], references: [id])
  createdAt       DateTime       @default(now())
}

model Payment {
  id              String         @id @default(uuid())
  amount          Float
  status          String         @default("PENDING")
  admissionLeadId String         @unique
  admissionLead   AdmissionLead  @relation(fields: [admissionLeadId], references: [id])
  createdAt       DateTime       @default(now())
}

model Course {
  id          String   @id @default(uuid())
  name        String
  code        String   @unique
  description String?
  fee         Float    @default(0)
}

model Batch {
  id          String   @id @default(uuid())
  name        String
  year        Int
  courseId    String
}
`;

if (!schema.includes("model AdmissionLead")) {
  fs.writeFileSync(prismaSchemaFile, schema + "\n" + newModels);
}

// 2. Create erp-leads module
fs.mkdirSync(path.join(moduleDir, 'controllers'), { recursive: true });
fs.mkdirSync(path.join(moduleDir, 'services'), { recursive: true });
fs.mkdirSync(path.join(moduleDir, 'routes'), { recursive: true });

// Controller
const controllerContent = `
const leadService = require('../services/lead.service');

class LeadController {
  async createLead(req, res) {
    try {
      const lead = await leadService.createLead(req.body);
      res.status(201).json({ success: true, lead });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getLead(req, res) {
    try {
      const lead = await leadService.getLeadById(req.params.id);
      if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
      res.status(200).json({ success: true, lead });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getLeads(req, res) {
    try {
      const leads = await leadService.getLeads();
      res.status(200).json({ success: true, leads });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async approveLead(req, res) {
    try {
      const result = await leadService.approveLead(req.params.id);
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updatePayment(req, res) {
    try {
      const payment = await leadService.updatePaymentStatus(req.params.id, req.body.status);
      res.status(200).json({ success: true, payment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new LeadController();
`;
fs.writeFileSync(path.join(moduleDir, 'controllers/lead.controller.js'), controllerContent.trim());

// Service
const serviceContent = `
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
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

  async updatePaymentStatus(leadId, status) {
    const payment = await prisma.payment.findUnique({ where: { admissionLeadId: leadId } });
    if (!payment) throw new Error('Payment not found');
    return await prisma.payment.update({
      where: { id: payment.id },
      data: { status }
    });
  }

  async approveLead(leadId) {
    const lead = await this.getLeadById(leadId);
    if (!lead) throw new Error('Lead not found');

    const updatedLead = await prisma.admissionLead.update({
      where: { id: leadId },
      data: { status: 'APPROVED' }
    });

    // Simulate ERP Account Generation
    const erpId = \`\${new Date().getFullYear()}\${Math.floor(10000 + Math.random() * 90000)}\`;
    const tempPassword = Math.random().toString(36).slice(-8);

    try {
      const user = await prisma.user.create({
        data: {
          email: lead.email,
          loginId: erpId,
          passwordHash: tempPassword, // Should hash with bcrypt
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
        from: process.env.GMAIL_USER ? \`Admissions <\${process.env.GMAIL_USER}>\` : 'Admissions',
        to: lead.email,
        subject: 'Admission Approved - Your Login Credentials',
        html: \`
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #1e3a8a;">Hello \${lead.firstName},</h2>
            <p>Your application has been approved and your payment has been processed!</p>
            <p>You can now log in to the Graphic Era ERP student portal.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Your ERP Login ID:</strong> \${erpId}</p>
              <p style="margin: 5px 0;"><strong>Your Password:</strong> \${tempPassword}</p>
            </div>
            <p>Welcome to Graphic Era University!</p>
            <p>Office of Admissions</p>
          </div>
        \`,
      });
    } catch (err) {
      console.error("Account generation or email failed:", err);
    }

    return updatedLead;
  }
}

module.exports = new LeadService();
`;
fs.writeFileSync(path.join(moduleDir, 'services/lead.service.js'), serviceContent.trim());

// Routes
const routeContent = `
const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');

// Public endpoints
router.post('/apply', leadController.createLead);
router.get('/:id', leadController.getLead);

// Admin endpoints (You would add authenticate middleware here)
router.get('/', leadController.getLeads);
router.post('/:id/approve', leadController.approveLead);
router.patch('/:id/payment', leadController.updatePayment);

module.exports = router;
`;
fs.writeFileSync(path.join(moduleDir, 'routes/lead.routes.js'), routeContent.trim());

console.log('Migration complete.');
