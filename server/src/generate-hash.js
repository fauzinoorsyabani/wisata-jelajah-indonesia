
import bcrypt from 'bcrypt';
import fs from 'fs';

const password = 'admin';
const hash = await bcrypt.hash(password, 10);

fs.writeFileSync('hash.txt', hash);
console.log('Done');
