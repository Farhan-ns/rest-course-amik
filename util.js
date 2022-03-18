import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { LowSync, JSONFileSync } from 'lowdb'

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbFile = join(__dirname, './storage/db.json') 
const dbAdapter = new JSONFileSync(dbFile)
const db = new LowSync(dbAdapter)

const readDB = () => {
    try {
        db.read()
    } catch (e) {
        db.data ||= { courses: [] }
        db.write()
    }
}

export { readDB, db }
