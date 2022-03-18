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

const getAllCourses = ({ query }, res, next) => {
    if (hasQuery(query)) {
        next()
        return
    }
    res.json(db.data.courses)
}

const getCourseByQuery = ({ query }, res, next) => {
    let { courses } = db.data
    for (var param in query) {
        courses = courses.filter(c => c[param] === query[param])
    }
    res.json(courses)
}

//Endpoints
router.get('/', [getAllCourses, getCourseByQuery])

router.post('/', ({ body }, res) => {
    if (isEmpty(body)) {
        res.status(400).json({
            status: 'fail',
            message: 'Request body cannot be empty'
        })  
        return
    }

    const addedCourse = body.map((course) => ({
        uuid: uuid(),
        ...course
    }))

    addedCourse.forEach((course) => {
        db.data.courses.push(course)
    });
    db.write()

    res.json({
        status: 'success',
        addedData: addedCourse
    })
})

export { router }