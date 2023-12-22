import { ipcRenderer } from 'electron'
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
window.ipcRenderer = ipcRenderer;

const db = new sqlite3.Database('products.db');
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS seeds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      season TEXT NOT NULL,
      sort TEXT NOT NULL,
      image_url TEXT
    )
  `);
});

window.ipcRenderer.on('fetch-seeds', () => {
    const db = new sqlite3.Database('products.db');
    const query = 'SELECT * FROM seeds';
    db.all(query, [], (error, rows) => {
        if (error) {
            window.ipcRenderer.emit('seed-fetch-error', error);
        } else {
            window.ipcRenderer.emit('fetch-seeds-response', rows);
        }
    });
});

const addSeed = ({ title, price, season, sort, image }) => {
    const db = new sqlite3.Database('products.db');
    const query = 'INSERT INTO seeds (title, price, season, sort) VALUES (?, ?, ?, ?)';
    const params = [title, price, season, sort];

    db.run(query, params, function (err) {
        if (err) {
            window.ipcRenderer.emit('seed-error-add', { success: false, error: err.message });
            db.close();
        } else {
            const lastID = this.lastID;

            const imageName = `seed_image_${lastID}.svg`;
            const imagePath = path.join(__static, 'uploads', imageName);

            fs.promises.readFile(image.path)
                .then(fileContent => fs.promises.writeFile(imagePath, fileContent))
                .then(() => {
                    const updateQuery = 'UPDATE seeds SET image_url = ? WHERE id = ?';
                    const updateParams = [`uploads/${imageName}`, lastID];
                    db.run(updateQuery, updateParams, function (updateErr) {
                        if (updateErr) {
                            window.ipcRenderer.emit('seed-error-add', { success: false, error: updateErr.message });
                        } else {
                            window.ipcRenderer.emit('seeds-updated', { success: true });
                        }
                        db.close();
                    });
                })
                .catch(error => {
                    console.error(error);
                    window.ipcRenderer.emit('seed-error-add', { success: false, error: error.message });
                    db.close();
                });
        }
    });
};

const removeSeed = (id) => {
    const db = new sqlite3.Database('products.db');
    const query = 'SELECT * FROM seeds WHERE id = ?';
    const params = [id];

    db.get(query, params, (selectErr, row) => {
        if (selectErr) {
            window.ipcRenderer.emit('seed-error-remove', { success: false, error: selectErr.message });
            db.close();
        } else {
            const deleteQuery = 'DELETE FROM seeds WHERE id = ?';
            db.run(deleteQuery, params, function (deleteErr) {
                if (deleteErr) {
                    window.ipcRenderer.emit('seed-error-remove', { success: false, error: deleteErr.message });
                    db.close();
                } else {
                    if (row && row.image_url) {
                        fs.promises.unlink(path.join(__static, row.image_url))
                            .then(() => {
                                window.ipcRenderer.emit('seeds-updated', { success: true });
                                db.close();
                            })
                            .catch(unlinkErr => {
                                window.ipcRenderer.emit('seed-error-remove', { success: false, error: unlinkErr.message });
                                db.close();
                            });
                    } else {
                        window.ipcRenderer.emit('seeds-updated', { success: true });
                        db.close();
                    }
                }
            });
        }
    });
};


window.ipcRenderer.on('remove-seed', removeSeed);
window.ipcRenderer.on('add-seed', addSeed);
