import { Module } from '@nestjs/common';

import { EmailTemplateService } from './services/email-template.service';
import { NodemailerService } from './services/nodemailer.service';

@Module({
  providers: [EmailTemplateService, NodemailerService],
  imports: [],
  exports: [NodemailerService],
})
export class SharedModule {}
