const express = require('express')
const data = require('../transform')

const router = express.Router()

// const detailedData = data.map(matkul => {
//     const isMandatory = !matkul.nama.includes('*') //Courses with "*" are non-mandatory
//     const semester = matkul.kode.charAt(4) //Semester is included in 4th digit of Courses code
//     delete matkul.wajib
//     return {
//         ...matkul,
//         sks: parseInt(matkul.sks),    
//         isMandatory,
//         semester: parseInt(semester)
//     }
// })

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
// router.get('/', [getCourses])

router.get('/', [getAllCourses, getCourseByQuery])

module.exports = router