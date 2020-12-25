export interface MailModuleOptions {
  apiKey: string;
  domain: string;
  fromEmail: string;
}

export interface MailVars {
  [key: string]: string;
}
