import express from "express"
import { v4 as uuid } from 'uuid'
import { chain, isEmpty, isArray } from 'lodash-es'
import { db, hasQuery, requestBodyIsEmpty } from '../util.js'

const router = express.Router()
db.chain = chain(db.data)

const getAllCourses = ({ query }, res, next) => {
    // If query is present, get courses based on query, otherwise return all
    // TODO I may need to implement a pagination here
    if (hasQuery(query)) {
        next() 
        return
    }
    res.json({
        ok: true,
        data: db.data.courses
    })
}

const getCourseByQuery = ({ query }, res) => {
    let { courses } = db.data
    for (var param in query) {
        courses = courses.filter(course => course[param] === query[param])
    }
    res.json({
        ok: true,
        data: courses
    })
}

const getCourseByCode = ({ params: {kode} }, res) => {
    let { courses } = db.data
    courses = courses.filter(course => course.kode === kode)

    if (courses.length < 1) {
        res.status(404).json({
            ok: false,
            error: "Course with such code not found"
        })
    }

    res.json({
        ok: true,
        data: courses
    })
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
        ok: true,
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
        ok: false,
        addedData: addedCourse
    })
}

// Endpoints
router.get('/', [getAllCourses, getCourseByQuery])
router.get('/:kode', getCourseByCode)

router.post('/', [requestBodyIsEmpty, postCourseObject, postCourseArray])

export { router }