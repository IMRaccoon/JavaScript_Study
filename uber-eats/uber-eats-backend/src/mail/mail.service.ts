import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import got from 'got';
import { MailModuleOptions, MailVars } from './mail.interface';
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private async sendEmail(
    subject: string,
    to: string,
    template: string,
    mailVars: MailVars,
  ) {
    const form = new FormData();
    form.append(
      'from',
      `IMRaccoon From Uber Eats <mailgun@${this.options.domain}>`,
    );
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template);
    Object.keys(mailVars).forEach((key) =>
      !!key ? form.append(`v:${key}`, mailVars[key]) : null,
    );
    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        method: 'POST',
        body: form,
      });
    } catch (error) {
      console.error('?', error);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail(
      'Verify Your Email',
      'whdies816@gmail.com',
      'uber-eats-account-verification',
      {
        username: email,
        code,
      },
    );
  }
}
