import express from "express"
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { LowSync, JSONFileSync } from 'lowdb'

const router = express.Router()

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbFile = join(__dirname, '../storage/db.json')
const dbAdapter = new JSONFileSync(dbFile)
const db = new LowSync(dbAdapter)

db.read()
db.data ||= { courses: [] }  

const hasQuery = (obj) => {
    const hasQuery = (Object.keys(obj).length >= 1) ? true : false;
    return hasQuery;
}

const getAllCourses = (req, res, next) => {
    if (hasQuery(req.query)) {
        next()
        return
    }
    res.json(db.data.courses)
}

const getCourseByQuery = (req, res, next) => {
    const { query } = req

    let filteredData = db.data.courses
    for (var param in query) {
        filteredData = filteredData.filter(c => c[param] === query[param])
    }

    res.json(filteredData)
}

//Endpoints
router.get('/', [getAllCourses, getCourseByQuery])
router.post('/', (req, res) => {
    db.data.courses.push(req.body)
    db.write()
    res.json(req.body)
})

export { router }