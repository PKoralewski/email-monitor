const { subjectName, boxName } = require('../config/config');

class EmailService {
    constructor(interval, imapService, attachmentService) {
        this.interval = interval;
        this.imapService = imapService;
        this.attachmentService = attachmentService;
    }

    async start() {
        await this.imapService.connect();
        await this.imapService.openInbox();

        await this.fetchMessages();

        setInterval(async () => await this.fetchMessages(), this.interval);
    }

    async fetchMessages() {
        try {
            const messages = await this.imapService.searchEmailsWithAttachments(subjectName);
            console.log(messages);

            messages.map(uid => this.processSingleEmail(uid));

        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    async processSingleEmail(uid) {
        const parsedEmail = await this.imapService.fetchEmail(uid);

        console.log(`📩 Processing: ${parsedEmail.subject}`);

        await this.attachmentService.saveAttachments(parsedEmail.attachments);
        await this.imapService.moveEmail(uid, boxName);
    }
}

module.exports = EmailService;
