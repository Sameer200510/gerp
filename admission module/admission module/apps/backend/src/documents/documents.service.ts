import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentType, DocStatus } from '@college-erp/database';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async uploadDocument(leadId: string, type: string, file: Express.Multer.File) {
    const lead = await this.prisma.admissionLead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Admission Lead not found');

    const fileUrl = `/uploads/${file.filename}`;
    
    return this.prisma.document.create({
      data: {
        leadId,
        type: type as DocumentType,
        fileUrl,
        status: DocStatus.PENDING,
      },
    });
  }

  async verifyDocument(documentId: string, status: 'VERIFIED' | 'REJECTED') {
    return this.prisma.document.update({
      where: { id: documentId },
      data: { status },
    });
  }

  async getDocumentsByLead(leadId: string) {
    return this.prisma.document.findMany({
      where: { leadId },
    });
  }
}
