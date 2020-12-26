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

  async sendEmail(
    subject: string,
    to: string,
    template: string,
    mailVars: MailVars,
  ): Promise<boolean> {
    const form = new FormData();
    form.append(
      'from',
      `IMRaccoon From Uber Eats <mailgun@${this.options.domain}>`,
    );
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template);
    Object.keys(mailVars).forEach((key) =>
      form.append(`v:${key}`, mailVars[key]),
    );
    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (error) {
      return false;
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
