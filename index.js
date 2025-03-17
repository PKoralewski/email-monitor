const { imapConfig } = require('./src/config/config');
const ImapService = require('./src/services/imapService');
const EmailService = require('./src/services/emailService');
const AttachmentService = require('./src/services/attachmentService');

const imapService = new ImapService(imapConfig);
const attachmentService = new AttachmentService();
const emailService = new EmailService(5000, imapService, attachmentService);

emailService.start();

