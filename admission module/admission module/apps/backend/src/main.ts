import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  const prismaService = app.get(PrismaService);
  app.useGlobalInterceptors(new AuditInterceptor(prismaService));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();