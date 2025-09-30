import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as nodemailer from 'nodemailer';

import { envs } from 'src/config';

import { AuthTeacherRequest } from 'src/modules/auth/entities/auth-teacher-request.entity';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class NodemailerService {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  // Welcome email to coach
  async sendWelcomeCoachEmail(request: AuthTeacherRequest): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider
      auth: {
        user: envs.weChessEmailUsername,
        pass: envs.weChessEmailPassword,
      },
    });

    // Compile the email template with request data
    const emailHtml = this.emailTemplateService.compileTemplate(
      'welcome-coach',
      {
        coachName: `${request.name} ${request.lastName}`,
        // put here more dynamic variables used on hbs template file
      },
    );

    const logoPath = path.join('/usr/src/app/seed', 'we-chess-logo.png');

    // Email options
    const mailOptions = {
      from: '"We Chess" <onier0217@gmail.com>', // changeMe! in production
      to: request.email,
      subject: 'We Chess become a coach - welcome email confirmation',
      html: emailHtml,
      attachments: [
        {
          filename: 'we-chess-logo.png',
          path: logoPath, // Path to the static logo image
          cid: 'logo', // Same CID as in the template
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  }
}
