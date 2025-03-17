const { promises: fs } = require('fs');
const path = require('path');

const { downloadDir } = require('../config/config');

class AttachmentService {
    async ensureDirectoryExists() {
        await fs.mkdir(downloadDir, { recursive: true }).catch(err => {
            if (err.code !== 'EEXIST') throw err;
        });
    }

    async saveAttachments(attachments) {
        if (!attachments.length) return;

        await this.ensureDirectoryExists();

        return Promise.all(
            attachments.map(att => {
                const filePath = path.join(downloadDir, att.filename);
                return fs.writeFile(filePath, att.content)
                    .then(() => console.log(`📂 Downloaded attachment: ${att.filename}`))
                    .catch(err => console.error(`❌ Error save file: ${err}`));
            })
        );
    }
}

module.exports = AttachmentService;
