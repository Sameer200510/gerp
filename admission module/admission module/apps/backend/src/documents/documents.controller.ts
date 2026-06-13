import { Controller, Post, Param, UploadedFile, UseInterceptors, UseGuards, Get, Body, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post(':leadId/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads';
        if (!require('fs').existsSync(uploadPath)) {
          require('fs').mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadDocument(
    @Param('leadId') leadId: string,
    @Body('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentsService.uploadDocument(leadId, type, file);
  }

  @Get(':leadId')
  async getDocuments(@Param('leadId') leadId: string) {
    return this.documentsService.getDocumentsByLead(leadId);
  }

  @Patch(':documentId/verify')
  async verifyDocument(
    @Param('documentId') documentId: string,
    @Body('status') status: 'VERIFIED' | 'REJECTED',
  ) {
    return this.documentsService.verifyDocument(documentId, status);
  }
}
