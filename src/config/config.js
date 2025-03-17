require('dotenv').config();

module.exports = {
    imapConfig: {
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASSWORD,
        host: process.env.IMAP_HOST,
        port: process.env.IMAP_PORT,
        tls: true,
        tlsOptions: {
            servername: process.env.IMAP_HOST,
        }
    },
    downloadDir: process.env.ATTACHMENTS_DIR || './attachments',
    subjectName: 'RED',
    boxName: 'OLD-RED'
};
