import * as crypto from 'crypto';
import fs from 'fs';


function getFileHash(hashType: string, filePath: string) {
	const hash = crypto.createHash(hashType);
	const stream = fs.createReadStream(filePath);

	stream
		.on('error', err => {
			throw err;
		})
		.on('data', chunk => hash.update(chunk))
		.on('end', () => {
			console.log(hash.digest('hex'));
		});
}