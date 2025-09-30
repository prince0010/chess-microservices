import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

Handlebars.registerHelper('formatPrice', (value: number | string) => {
  if (!value) return '0';
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(+value);
});

@Injectable()
export class EmailTemplateService {
  templatesDir = path.join('/usr/src/app/seed', '');

  compileTemplate(templateName: string, data: any): string {
    try {
      // Construct full path to the template file
      const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);

      // Read and compile the Handlebars template
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      const template = Handlebars.compile(templateContent);

      return template(data);
    } catch (error) {
      throw new Error(`Failed to compile template: ${error.message}`);
    }
  }
}
