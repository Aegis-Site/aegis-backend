import sqlite3 from 'sqlite3'

function DBinit() {
    const db = new sqlite3.Database('./DB/main.db')
    db.run(`
        CREATE TABLE IF NOT EXISTS fileUpload(
        hash TEXT PRIMARY KEY,
        orignalname TEXT,
        mimetype TEXT,
        encoding TEXT,
        destination TEXT,
        filename TEXT,
        path TEXT,
        size INTEGER
        )
    `)
}

function uploadFileData(hash, data) {
    const db = new sqlite3.Database('./DB/main.db')
    const stmt = db.prepare("INSERT INTO fileUpload VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    stmt.run(hash, data.originalname, data.mimetype, data.encoding, data.destination, data.filename, data.path, data.size)
    stmt.finalize()
}

function deleteFileData(hash) {
    const db = new sqlite3.Database('./DB/main.db')
    const stmt = db.prepare("DELETE FROM fileUpload WHERE hash = ?")
    stmt.run(hash)
    stmt.finalize()
}

function getFilePath(hash) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./DB/main.db')
        db.get("SELECT path FROM fileUpload WHERE hash = ?", [hash], (err, row) => {
            if (err) reject(err)
            else {
            resolve(row ? row.path : null)}
        })
    })
}

export { DBinit, uploadFileData, deleteFileData, getFilePath }