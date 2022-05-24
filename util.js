import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { isEmpty } from 'lodash-es'
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

const hasQuery = (url) => (Object.keys(url).length >= 1) ? true : false

const requestBodyIsEmpty = ({ body }, res, next) => {
    if (isEmpty(body)) {
        res.status(400).json({
            ok: false,
            message: 'Request body cannot be empty'
        })
    } else next()
}

export { readDB, hasQuery, requestBodyIsEmpty, db }