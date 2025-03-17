const Imap = require('imap');
const { simpleParser } = require('mailparser');
const util = require('util');

const { boxName } = require('../config/config');

class ImapService {
    constructor(config) {
        this.imap = new Imap(config);

        this.imap.once('ready', () => {
            console.log('Connected with IMAP.')

            this.imap.getBoxes((err, boxes) => {
                if (err) {
                    console.log('Error downloading folders:', err);
                    this.imap.end();
                    return;
                }

                if (boxes[boxName]) return console.log(`Folder ${boxName} already exist!`);

                this.imap.addBox(boxName, false, (err) => console.log('Error creating folder:', err));
                console.log(`Folder ${boxName} has been created!`);

            });
        });
        this.imap.once('error', err => console.error('IMAP Error:', err));
        this.imap.once('end', () => console.log('Connection with IMAP ended.'));
    }

    connect() {
        return new Promise((resolve) => {
            if (this.imap.state === 'authenticated') return resolve;

            this.imap.once('ready', resolve);
            this.imap.connect();

        });
    }

    openInbox() {
        return util.promisify(this.imap.openBox).call(this.imap, 'INBOX', false);
    }

    async searchEmailsWithAttachments(subject) {
        try {
            const emailIds = await this.searchEmails(subject);
            if (!emailIds.length) return [];

            const emailsWithAttachments = await this.filterEmailsWithAttachments(emailIds);
            return emailsWithAttachments;
        } catch (err) {
            console.error('Error while searching for emails:', err);
            return [];
        }
    }

    searchEmails(subject) {
        return new Promise((resolve, reject) => {
            this.imap.search(['UNSEEN', ['SUBJECT', subject]], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async filterEmailsWithAttachments(emailIds) {
        const emails = await Promise.all(emailIds.map(id => this.fetchEmail(id)));
        return emails.filter(email => email.attachments && email.attachments.length > 0).map(email => email.id);
    }

    fetchEmail(msgId) {
        return new Promise((resolve, reject) => {
            const fetch = this.imap.fetch(msgId, { bodies: '', struct: true });
            fetch.on('message', msg => {
                msg.on('body', stream => {
                    simpleParser(stream)
                        .then(parsed => resolve({ id: msgId, ...parsed }))
                        .catch(reject);
                });
            });
            fetch.once('error', reject);
        });
    }

    moveEmail(msgId, folder) {
        return util.promisify(this.imap.move).call(this.imap, msgId, folder);
    }
}

module.exports = ImapService;
