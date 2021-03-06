import fs from 'fs';
import sqlite3 from 'sqlite3';
import path from 'path';
import keytar from 'keytar';
import crypto from 'crypto';

export default class SessionExtractor {
  constructor(browser) {
    this.browser = browser;
  }

  extract() {
    return new Promise((resolve, reject) => {
      this._connect();
      this.db.serialize(() => {
        Promise.resolve()
          .then(() => {
            return this.getEncryptedUserSession();
          })
          .then((value) => {
            this.db.close();
            resolve(this.decryptUserSession(value));
          })
          .catch((err) => {
            this.db.close();
            reject(err);
          });
      });
    });
  }

  getEncryptedUserSession() {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM cookies WHERE host_key = '.nicovideo.jp' AND name = 'user_session'", (err, row) => {
        if (err || !row) {
          reject(err);
          return;
        }

        resolve(row.encrypted_value);
      });
    });
  }

  decryptUserSession(encryptedValue) {
    return new Promise((resolve, reject) => {
      const password = keytar.getPassword('Chrome Safe Storage', 'Chrome');

      crypto.pbkdf2(password, 'saltysalt', 1003, 16, 'sha1', (err, key) => {
        if (err) {
          reject(err);
          return;
        }

        const iv = new Array(17).join(' ');
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        resolve(decipher.update(encryptedValue.slice(3)) + decipher.final());
      });
    });
  }

  _connect() {
    const dbPathBase = path.resolve(path.join(process.env.HOME, "Library/Application Support/Google/Chrome"));
    let dbPath = path.join(dbPathBase, 'Default');
    try {
      fs.statSync(dbPathBase);
      if (!fs.statSync(dbPath).isDirectory) dbPath = `${dbPathBase}/Profile 1`;
      fs.statSync(dbPath);
    } catch(err) {
      throw err;
    }
    this.db = new sqlite3.Database(`${dbPath}/Cookies`);
  }
}
