import express from "express"
import { v4 as uuid } from 'uuid'
import { chain, isEmpty, isArray } from 'lodash-es'
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

const requestBodyIsEmpty = ({ body }, res, next) => {
    if (isEmpty(body)) {
        res.status(400).json({
            status: 'fail',
            message: 'Request body cannot be empty'
        })
    } else next()
}

const postCourseObject = ({ body }, res, next) => {
    if (isArray(body)) {
        next()
        return
    }

    const course = { uuid: uuid(), ...body }

    db.data.courses.push(course)
    db.write()

    res.json({
        status: 'success',
        addedData: course
    })
}

const postCourseArray = ({ body }, res) => {
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
}

// Endpoints
router.get('/', [getAllCourses, getCourseByQuery])

router.post('/', [requestBodyIsEmpty, postCourseObject, postCourseArray])

export { router }