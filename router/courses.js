import express from "express"
import { data }  from '../transform.js'

const router = express.Router()

const hasQuery = (obj) => {
    const hasQuery = (Object.keys(obj).length >= 1) ? true : false;
    return hasQuery;
}

const getAllCourses = (req, res, next) => {
    if (hasQuery(req.query)) {
        next()
        return
    }
    res.json(data)
}

const getCourseByQuery = (req, res, next) => {
    const { query } = req

    let filteredData = data
    for (var param in query) {
        filteredData = filteredData.filter(c => c[param] === query[param])
    }

    res.json(filteredData)
}

//Endpoints

router.get('/', [getAllCourses, getCourseByQuery])

export { router }