import express from "express"
import { v4 as uuid } from 'uuid'
import { chain, isEmpty } from 'lodash-es'
import { db } from '../util.js'

const router = express.Router()
db.chain = chain(db.data)

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
    if (isEmpty(req.body)) {
        res.status(400).json({
            status: 'Fail',
            message: 'Request body cannot be empty'
        })  
        return
    }

    const addedCourse = req.body.map((course) => ({
        uuid: uuid(),
        ...course
    }))

    addedCourse.forEach((course) => {
        db.data.courses.push(course)
    });
    db.write()

    res.json({
        status: 'Success',
        addedData: addedCourse
    })
})

export { router }